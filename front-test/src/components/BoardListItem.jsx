import React from 'react';
import styled from 'styled-components';
import { Image, StatusButton } from '../components/element';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/auth';

const BoardListItem = ({ board, onClick , isEven }) => {
  return (
    <ListOneDiv onClick={() => onClick(board.id)} key={board.id}  isEven={isEven}>
      <Image
        width="130px"
        height="130px"
        borderradius="10px"
        src={`${process.env.REACT_APP_SERVER_URL}${board.image}`} // 백엔드에서 읽어오는 이미지 경로
        alt="상품 이미지"
      />
      <ListInfoDiv>
        <ListTitleH1>{board.title}</ListTitleH1>
        <ListDetailH3>
          <span>{board.nickname}</span> {/* 상점명(사장님의 닉네임) */}
          &nbsp;|&nbsp;
          <span>{board.address.fullAddress}</span>
        </ListDetailH3>

        <ListDetailH3>
          <span>생산일 : {formatDate(board.production_date)}</span>        
        </ListDetailH3>
        <ListPriceH2>
          {board.status && (
            board.status === "판매중" ? (
              <StatusButton color="white" backgroundColor="green">판매중</StatusButton>
            ) : (
              <StatusButton color="white">거래완료</StatusButton>
            )
          )}
          {Math.floor(Number(board.price)).toLocaleString()}원 <small style={{fontSize:"12px"}}>(⬇️{board.discount_rate}% )</small>
        </ListPriceH2>
      </ListInfoDiv>
    </ListOneDiv>
  );
};

BoardListItem.propTypes = {
  board: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BoardListItem;

// 스타일 정의
const ListOneDiv = styled.div`
  padding: 15px 5px;
  display: flex;
  border-bottom: 1px solid lightgrey;
  cursor: pointer;
  background-color: ${({ isEven }) => (isEven ? '#f2f2f2' : 'white')};
  &:hover {
    background-color: ${({ isEven }) => (isEven ? '#e0e0e0' : '#f5f5f5')};
  }
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
