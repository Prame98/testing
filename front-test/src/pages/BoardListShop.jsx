import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Image, StatusButton } from '../components/element';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { getBoards } from '../api/boards';
import { getBoardsByShop } from '../api/boards';
import Loading from './statusPage/Loading';
import Error from './statusPage/Error';
import NotFound from './statusPage/NotFound';
import BoardListItem from '../components/BoardListItem';

function BoardListShop() {
  const [boardData, setBoardData] = useState([]);
  const [searchParams, setSearchParams]=useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("searchTerm");
 
  // 상점별 게시글 리스트 조회
  const { data, isLoading, isError } = useQuery(
    ['getBoardsByShop', searchTerm],
    () => getBoardsByShop({ page: 0, size: 100, sort: ["createdAt,DESC"], searchTerm }),
    {
      onSuccess: (response) => {
        setBoardData(response); // 응답 데이터 설정
      },
    }
  );

  if (isLoading) {
    return <Loading />
  }
  
  if (isError) {
      return <Error />
  }

  // 상세 페이지로 이동
  const setPageChange = (boardId) => {
    navigate(`/BoardDetail/${boardId}`);
  };

  

  return (
    <Layout>
     { boardData && boardData.length > 0  && <Title>{searchTerm}의 상품 목록</Title> }

     

      { (!boardData ||boardData.length === 0) && <NotFound searchTerm={searchTerm} /> }


      {/* 게시물 리스트 섹션 */}
      <ListSection>

      {boardData.map((board, index) => (
          <BoardListItem key={board.id} board={board} onClick={setPageChange} 
          isEven={index % 2 === 1}           
          />
        ))}
        
      </ListSection>
    </Layout>
  );
}

export default BoardListShop;

// 스타일 정의
const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const ListOneDiv = styled.div`
  padding: 15px 5px;
  display: flex;
  border-bottom: 1px solid lightgrey;
  cursor: pointer;
`;

const ListInfoDiv = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListTitleH1 = styled.h1`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

const ListPriceH2 = styled.h2`
  margin: 0;
  & span {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
`;

const ListDetailH3 = styled.h3`
  margin: 10px 0 7px 0;
  font-size: 15px;
  font-weight: 300;
  color: grey;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 8px;
  width: 90%;
  max-width: 500px; /* 검색 바와 카테고리 섹션의 너비를 같게 설정 */

  input {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    &:focus {
      border-color: #5ca771;
      box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.2);
    }
    &::placeholder {
      color: #aaa;
      font-size: 14px;
    }
  }
`;
