import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { categoryKor, formatDate } from '../utils/auth';
import StatusButtonSelect from './common/StatusButtonSelect';
import { getImageSrc } from '../utils/commonUtils';

const ListItem = ({ item, isEven, onClick }) => {
  return (
    <ItemBox isEven={isEven} >
      <ItemArea>
        <ImgBox
        onClick={(event) => onClick(item.id, event)}
        >
          <img src={getImageSrc(item.image)} alt={item.title} />
        </ImgBox>
        

        <Info>
            <h2>상품명 : {item.title}</h2>
            <p><b>카테고리:</b> {categoryKor(item.category)}</p>
             {/* <p><b>생산일:</b> {formatDate(item.production_date)}</p> */}
             <p><b>판매상태:</b>  <StatusButtonSelect status={item.status} /></p>
            <p><b>판매 종료일:</b> {formatDate(item.sale_end_date)}</p>
            <p><b>원가:</b> {Math.floor(Number(item.original_price)).toLocaleString()} 원</p>
            <p><b>할인율:</b> {item.discount_rate}%</p>
        </Info>
      </ItemArea>
    </ItemBox>
  );
};

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  isEven: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ListItem;

// 스타일 정의
const ItemBox = styled.div`
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  background-color: ${({ isEven }) => (isEven ? '#f2f2f2' : 'white')};
  &:hover {
    background-color: ${({ isEven }) => (isEven ? '#e0e0e0' : '#f5f5f5')};
  }
`;

const ItemArea = styled.div`
  padding: 20px 0;
  display: flex;
  align-items: center;
  width: 100%;
`;

const ImgBox = styled.div`
  width: 110px;
  height: 110px;
  overflow: hidden;
  border-radius: 10px;
  & img {
    width: 100%;
    height: 100%;
  }
`;

const Info = styled.div`
  width: calc(100% - 130px);
  padding-left: 20px;
  & h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }
  & p {
    margin: 0;
    color: #777;
  }
`;
