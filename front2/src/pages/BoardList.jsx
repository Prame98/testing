import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/element';
import { Link, useNavigate } from 'react-router-dom';
import { getBoards } from '../api/boards';

import bread from '../assets/bread.png';
import ricecake from '../assets/ricecake.png';
import sidedish from '../assets/sidedish2.png';
import martcart from '../assets/mart-cart.png';
import etc from '../assets/sidedish.png';
import { userTypeCheck } from '../utils/auth';
import BoardListItem from '../components/BoardListItem';

function BoardList() {
  const [boardData, setBoardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 1, name: '빵', image: bread },
    { id: 2, name: '떡', image: ricecake },
    { id: 3, name: '반찬', image: sidedish },
    { id: 4, name: '마트', image: martcart },
    { id: 5, name: '기타', image: etc },
  ];

  const fetchBoardList = async (categoryId = null) => {
    setLoading(true);
    setError(null);
    const setPage = {
      page: 0,
      size: 100,
      sort: ["createdAt,DESC"],
    };

    try {
      const response = await getBoards(setPage, categoryId);
      setBoardData(response);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardList(selectedCategory);
  }, [selectedCategory]);

  const setPageChange = (boardId) => {
    navigate(`/BoardDetail/${boardId}`);
  };

  return (
    <Layout>
      <SearchBar>
        <input
          type="text"
          placeholder="상점명 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/BoardListShop?searchTerm=${searchTerm}`)}
        />
      </SearchBar>

      <CategorySection>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            onClick={() => setSelectedCategory(prev => (prev === category.id ? null : category.id))}
            isSelected={selectedCategory === category.id}
          >
            <CategoryImage>
              <img src={category.image} alt={category.name} />
            </CategoryImage>
            <span>{category.name}</span>
          </CategoryItem>
        ))}
      </CategorySection>

      {loading && <LoadingSection><Spinner /><p>데이터 가져오는 중...</p></LoadingSection>}
      {error && <ListSection><p>{error}</p></ListSection>}

      <ListSection>
      {boardData.map((board, index) => (
          <BoardListItem key={board.id} board={board} onClick={setPageChange} 
          isEven={index % 2 === 1}           
          />
        ))}
      </ListSection>

      {userTypeCheck() === "owner" && (
        <WriteButton>
          <Link to="/BoardWrite">+</Link>
        </WriteButton>
      )}
    </Layout>
  );
}


export default BoardList;


// 스타일 정의
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

const CategorySection = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: 10px 0;
  margin-bottom: 20px;
  justify-content: space-around;
  width: 90%;
  max-width: 500px; /* 검색 바와 동일한 너비로 설정 */
  margin: 0 auto;
`;

const CategoryItem = styled.div`
  flex: 1;
  max-width: 70px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin: 0 5px;
  background-color: ${({ isSelected }) => (isSelected ? '#14AD6D' : '#fff')}; /* 선택 시 색상 변경 */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }

  span {
    margin-top: 4px;
    font-size: 12px;
    color: #333;
  }
`;



const CategoryImage = styled.div`
  width: 45px;
  height: 45px;
  
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 80%;
    height: auto;
    object-fit: cover;
  }
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;


const WriteButton = styled.button`
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 75px;
  right: 50%;
  transform: translateX(370%);
  border: none;
  border-radius: 50%;
  background-color: #14AD6D;
  color: white;
  font-size: 30px;
  transition: all 0.03s ease-out;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #029B5D;
  }
  @media (max-width: 820px) {
    right: 25px;
    transform: initial;
  }
`;

const LoadingSection=styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
    height:300px
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;


  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-items: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
