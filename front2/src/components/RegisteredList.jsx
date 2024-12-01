import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NullAlert from '../pages/statusPage/NullAlert';
import { useMutation, useQueryClient } from 'react-query';
import { deleteBoard } from '../api/boards';
import { myShopList } from '../api/usersMongo'; // 수정된 부분
import { useNavigate } from 'react-router-dom';
import { categoryKor, formatDate } from '../utils/auth';
import StatusButtonSelect from './common/StatusButtonSelect';
import { getImageSrc } from '../utils/commonUtils';

function RegisteredList() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const queryClient = useQueryClient();

    // 상품 삭제
    const deleteBoardMutation = useMutation(deleteBoard, {
        onSuccess: async() => {
            queryClient.invalidateQueries("getMyBoard");
            const response = await myShopList(localStorage.getItem('uid'));
            setData(response || []);
        },
    });

    // 상품 삭제 핸들러
    const handleDelete = (event, boardId) => {
        event.stopPropagation();
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            deleteBoardMutation.mutate(boardId);
        }
    };

    // 상품 수정 핸들러
    const handleEdit = (event, item) => {
        event.stopPropagation();
        navigate(`/BoardUpdate/${item.id}`, { state: { ...item } });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await myShopList(localStorage.getItem('uid'));
                console.log("등록된 상품 데이터:", response);
                setData(response || []);
            } catch (error) {
                console.error("등록된 상품 데이터 로드 실패:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {data.length === 0 ? (
                <NullAlert alertMessage="등록된 상품이 없습니다." />
            ) : (
                <ListContainer>
                    {data.map((item, index) => (
                        <ItemBox
                            key={item.id}                           
                            isEven={index % 2 === 1} // 짝수 인덱스 체크
                        >
                            <ImgBox 
                             onClick={() => navigate(`/BoardDetail/${item.id}`)}
                            >
                                <img
                                    src={getImageSrc(item.image)}
                                    alt="상품 이미지"
                                />
                            </ImgBox>
                            <Info>
                                <h2>{item.title}</h2>
                                <p><b>카테고리:</b> {categoryKor(item.category)}</p>
                                <p><b>생산일:</b> {formatDate(item.production_date)}</p>
                                <p><b>판매 종료일:</b> {formatDate(item.sale_end_date)}</p>
                                <p><b>판매 상태:</b> <StatusButtonSelect status={item.status} /></p>
                            
                                <p><b>원가:</b> {Math.floor(Number(item.original_price)).toLocaleString()} 원</p>
                                <p><b>할인율:</b> {item.discount_rate}%</p>
                            </Info>
                            <ActionButtons>
                                 <EditButton onClick={(e) => handleEdit(e, item)}>수정</EditButton> 
                                <DeleteButton onClick={(e) => handleDelete(e, item.id)}>삭제</DeleteButton>
                            </ActionButtons>
                        </ItemBox>
                    ))}
                </ListContainer>
            )}
        </>
    );
}

export default RegisteredList;

// 스타일 정의
const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
`;

const ItemBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: ${({ isEven }) => (isEven ? '#fff' : '#f9f9f9')};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const ImgBox = styled.div`
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 10px;
    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Info = styled.div`
    flex: 1;
    margin-left: 20px;
    & h2 {
        margin: 0 0 10px;
        font-size: 18px;
        font-weight: bold;
    }
    & p {
        margin: 5px 0;
        font-size: 14px;
        color: #555;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const EditButton = styled.button`
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const DeleteButton = styled.button`
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #f44336;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #e53935;
    }
`;
