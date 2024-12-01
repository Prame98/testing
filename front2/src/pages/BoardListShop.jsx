import React, { useState } from "react";
import styled from "styled-components";
import { Layout } from "../components/element";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getBoardsByShop } from "../api/boards";
import Loading from "./statusPage/Loading";
import Error from "./statusPage/Error";
import NotFound from "./statusPage/NotFound";
import BoardListItem from "../components/BoardListItem";

function BoardListShop() {
  const [boardData, setBoardData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("searchTerm");

  // 상점별 게시글 리스트 조회
  const {isLoading, isError } = useQuery(
    ["getBoardsByShop", searchTerm],() =>getBoardsByShop({page: 0,size: 100,sort: ["createdAt,DESC"],searchTerm,}),
    {
      onSuccess: (response) => {
        setBoardData(response); // 응답 데이터 설정
      },
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  // 상세 페이지로 이동
  const setPageChange = (boardId) => {
    navigate(`/BoardDetail/${boardId}`);
  };

  return (
    <Layout>
      {boardData && boardData.length > 0 && (
        <Title>{searchTerm}의 상품 목록</Title>
      )}

      {(!boardData || boardData.length === 0) && (
        <NotFound searchTerm={searchTerm} />
      )}

      {/* 게시물 리스트 섹션 */}
      <ListSection>
        {boardData.map((board, index) => (
          <BoardListItem
            key={board.id}
            board={board}
            onClick={setPageChange}
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
