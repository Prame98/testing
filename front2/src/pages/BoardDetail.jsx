import React from 'react';
import { styled } from 'styled-components';
import { Layout, Image, StatusButton } from '../components/element';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import { useQuery, useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { getBoardDetail } from '../api/boards';
import {  toggleLikeStatus } from '../api/likes';
import { toggleReservationStatus } from '../api/reservations';
import { categoryKor, formatDate } from '../utils/auth';
import { useAlert } from '../components/common/AlertContext';
import StatusButtonSelect from '../components/common/StatusButtonSelect';
import { getImageSrc } from '../utils/commonUtils';

function BoardDetail() {
  const currentBoardId = useLocation().pathname.slice(13);
  const { showAlert } = useAlert();

 // const navigate = useNavigate();


  // * 게시글 상세 조회
  const { data, refetch } = useQuery(['getBoardDetail', currentBoardId], () => getBoardDetail(currentBoardId), {
    staleTime: Infinity,
    onSuccess: (data) => {
     // setCurrentLike(data.likeStatus);
    },
  });


  // * 찜 상태 토글
  const toggleLikeMutation = useMutation(() => toggleLikeStatus(currentBoardId), {
    onSuccess: (response) => {
      showAlert({ message: response });
      refetch(); // 상태 재조회
    },
  });

    
    // * 예약 상태 토글
  const togglReservationMutation = useMutation(() => toggleReservationStatus(currentBoardId), {
    onSuccess: (response) => {
      showAlert({ message: response });
      refetch(); // 상태 재조회
    },
  });
  

  // * 찜 버튼 클릭 핸들러
  const onBoardClickLike = () => {    
    toggleLikeMutation.mutate();
  };

  // * 예약하기 버튼 클릭 핸들러
  const onReserve = () => {
    togglReservationMutation.mutate();      
  };



  // * 구매내역에 추가하는 useMutation
  // const addToPurchaseMutation = useMutation(addToPurchaseHistory, {
  //   onSuccess: () => {
  //     alert('구매내역에 추가되었습니다.');
  //     navigate('/MyPageCustomer');
  //   }
  // });


  let reserveButtonContent='';
  if(data&& data.status){
    if(data.status==="판매중"){
      reserveButtonContent= <ReserveButton onClick={onReserve}>예약하기</ReserveButton>

    }else if(data.status==="예약중" && parseInt(data.reservationUserId)===parseInt(localStorage.getItem('uid'))){
       //예약자  동일한 아이디 인지 확인
       reserveButtonContent= <ReserveCancelButton onClick={onReserve}> 예약 취소하기</ReserveCancelButton>
    }
  }



  return (
    <Layout>
      {data && (
        <ContentSection>
          <Image
            width={"440px"}
            height={"440px"}
            borderradius={"5px"}
            src={getImageSrc(data.image)}
            alt={"상품 이미지"}
          />

          {/* {userTypeCheck() === "owner" &&
            <div style={{ display: "flex", justifyContent: "end" }}>
              <EditButton onClick={() => navigate(`/BoardUpdate/${data.id}`)}>
                수정하기
              </EditButton>
            </div>
          } */}

          <UserDiv>
            <UserInfoDiv>
              {/* <Image
                width={'40px'}
                height={'40px'}
                borderradius={'50%'}
                src={userDefaultImg}
                alt={'유저 프로필 이미지'}
              /> */}
              <div>
                <DetailH2>{data.nickName}</DetailH2>
                {/* 기본 주소와 상세 주소를 함께 표시 */}
                <DetailH3>
                  <b>• 카테고리: </b>
                  {categoryKor(data.category)}
                </DetailH3>
                <DetailH3>
                  <b>• 생산일 : </b>
                  {formatDate(data.production_date)}
                </DetailH3>
                <DetailH3>
                  <b>• 판매 종료일:</b> {formatDate(data.sale_end_date)}
                </DetailH3>

                <DetailH3>
                  <b> • 주소 : </b>({data.address.postcode}) &nbsp;
                  {data.address.fullAddress} &nbsp; {data.address.detailAddress}
                </DetailH3>
              </div>
            </UserInfoDiv>
          </UserDiv>
          <DetailDiv>
            <DetailH1>{data.title}</DetailH1>
        
            <DetailContent dangerouslySetInnerHTML={{ __html: data.content }} />

          </DetailDiv>
          <DetailNav>
      
            <StatusButtonSelect status={data.status} />


            <DetailHPrice>
              {Math.floor(Number(data.price)).toLocaleString()}원
              <br />
              <small style={{ fontSize: "14px" }}>
                (할인 {data.discount_rate}% )
              </small>
            </DetailHPrice>
            <div>
              {data.likeStatus ? (
                <AiFillHeart onClick={onBoardClickLike} />
              ) : (
                <AiOutlineHeart onClick={onBoardClickLike} />
              )}
            </div>

            {/* {data.reservationStatus ? (
              <ReserveCancelButton onClick={onReserve}>
                예약 취소하기
              </ReserveCancelButton>
            ) : (
              <ReserveButton onClick={onReserve}>예약하기</ReserveButton>
            )} */}
          {reserveButtonContent}
             

          </DetailNav>
        </ContentSection>
      )}

      

    </Layout>
  );
}

export default BoardDetail;


const ContentSection = styled.section`
  margin-top: 20px;
;
`
const UserDiv = styled.div`
  padding: 15px 5px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
;`

const UserInfoDiv = styled.div`
  display: flex;
  align-items: center;
  & img {
    margin-right: 10px;
  }
;`

const DetailDiv = styled.div`
  margin-top: 15px;
  margin-left: 5px;
;
`
const DetailH1 = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
;`
;

const DetailHPrice = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0 10px;
`;


const DetailH2 = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
;`

const DetailH3 = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 300;
  color: grey;
;`

const DetailContent = styled.p`
  margin: 25px 0 90px 0;
;`

const DetailNav = styled.nav`
  height: 100px;
  width: 440px;
  display: flex;
  position: fixed;
  align-items: center;
  bottom: 60px;
  background-color: #FFFFFF;
  border-top: 1px solid lightgrey;
  & div {
    width: 40px;
    height: 40px;
    padding-right: 5px;
    padding-left: 15px;
    font-size: 30px;
    font-weight: bold;
    color: #ED8C26;
    border-left: 2px solid lightgrey;
    cursor: pointer;
  }
  & div:last-child {
    
  }
;`

const ReserveButton = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  `

  const ReserveCancelButton = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4B5158;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  `
