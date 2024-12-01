import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NullAlert from '../pages/statusPage/NullAlert';
import { ownerProductLikeList } from '../api/likes';
import { ownerProductReservationList } from '../api/reservations';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import { categoryKor } from '../utils/auth';

function LikeList({ listType }) {
    const navigate =useNavigate();
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = listType === 'like'
                    ? await ownerProductLikeList() // 찜된 상품 API 호출
                    : await ownerProductReservationList(); // 예약된 상품 API 호출
                console.log(`${listType} 데이터:`, response);
                setData(response || []);
            } catch (error) {
                console.error(`${listType} 데이터 로드 실패:`, error);
            }
        };
        fetchData();
    }, [listType]);

    return (
        <>
            {data.length === 0 ? (
                <NullAlert alertMessage={
                    listType === 'like'
                        ? "찜된 상품이 없습니다."
                        : "예약된 상품이 없습니다."
                } />
            ) : (
                data.map((item, index) => (
                    <ItemBox key={item.postId} isEven={index % 2 === 1}
                        
                    >
                        <ItemArea>
                            <ImgBox
                            onClick={() => navigate(`/BoardDetail/${item.postId}`)}
                            >
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${item.image}`}
                                    alt="상품 이미지"
                                />
                            </ImgBox>
                            <Info>
                                <h4 style={{margin:"0px"}}>상품명: <span style={{color:"#999"}}>{item.title}</span></h4>
                                <h4 style={{margin:"0px"}}>카테고리: <span style={{color:"#999"}}>{categoryKor(item.category)}</span> </h4>
                                <h4 style={{margin:"0px", fontSize:"16px"}}>가격: <span style={{color:"#999"}}>{Math.floor(Number(item.price)).toLocaleString()} 원</span></h4>
                                {/* 찜 유저 목록 */}
                                {item.likes && <UserList title="찜 유저목록" users={item.likes} />}
                                {/* 예약 유저 목록 */}
                                {item.reservations && <UserList title="예약 유저목록" users={item.reservations} />}
                            </Info>
                        </ItemArea>
                    </ItemBox>
                ))
            )}
        </>
    );
}

export default LikeList;

// 스타일 정의
const ItemBox = styled.div`
    border-bottom: 1px solid #ccc;
    padding: 15px;
    background-color: ${({ isEven }) => (isEven ? '#f9f9f9' : 'white')};
    transition: background-color 0.3s ease;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0; /* 마우스 오버 시 배경색 */
    }
        
`;

const ItemArea = styled.div`
    display: flex;
    align-items: center;
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
