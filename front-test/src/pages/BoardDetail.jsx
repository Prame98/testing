import React, {  useState } from 'react';
import { styled } from 'styled-components';
import { Layout, Image, StatusButton } from '../components/element';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
// import userDefaultImg from '../assets/user_default_image.jpg';
import { useQuery, useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBoardDetail,  addToPurchaseHistory } from '../api/boards';
import {  toggleLikeStatus } from '../api/likes';
import AlertModal from '../components/element/AlertModal';
import { toggleReservationStatus } from '../api/reservations';
import { categoryKor, formatDate, userTypeCheck } from '../utils/auth';

function BoardDetail() {
  const currentBoardId = useLocation().pathname.slice(13);
  const [currentLike, setCurrentLike] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  
  const navigate = useNavigate();


  // * 게시글 상세 조회
  const { data, refetch } = useQuery(['getBoardDetail', currentBoardId], () => getBoardDetail(currentBoardId), {
    staleTime: Infinity,
    onSuccess: (data) => {
      setCurrentLike(data.likeStatus);
    },
  });


  // * 찜 상태 토글
  const toggleLikeMutation = useMutation(() => toggleLikeStatus(currentBoardId), {
    onSuccess: (response) => {

      setAlertMessage(response);
      setIsModalOpen(true);
      refetch(); // 상태 재조회
    },
  });

    
    // * 예약 상태 토글
  const togglReservationMutation = useMutation(() => toggleReservationStatus(currentBoardId), {
    onSuccess: (response) => {
      setAlertMessage(response);
      setIsModalOpen(true);
      refetch(); // 상태 재조회
      navigate('/ReserveNotice');  // 추가
    },
    onError: () => {  // 추가
      alert('예약 상태 변경에 실패했습니다. 다시 시도해주세요.');
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

  /*
  // * 예약하기 버튼 클릭 핸들러
  const onReserve = () => {
    addToPurchaseMutation.mutate(currentBoardId, {
      onSuccess: () => {
        alert('예약이 완료되었습니다.');
        queryClient.invalidateQueries('getReservations'); // 예약 내역 업데이트
        navigate('/ReserveNotice');
      },
      onError: () => {
        alert('예약에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };
  */





  // * 구매내역에 추가하는 useMutation
  const addToPurchaseMutation = useMutation(addToPurchaseHistory, {
    onSuccess: () => {
      alert('구매내역에 추가되었습니다.');
      navigate('/MyPageCustomer');
    }
  });


  return (
    <Layout>
      {data && (
        <ContentSection>
          <Image
            width={"440px"}
            height={"440px"}
            borderradius={"5px"}
            src={`${process.env.REACT_APP_SERVER_URL}${data.image}`}
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
            <DetailContent>{data.content.replace(/<br>/g, "\n")}</DetailContent>
          </DetailDiv>
          <DetailNav>
            {data.status &&
              (data.status === "판매중" ? (
                <StatusButton color="white" backgroundColor="green">
                  판매중
                </StatusButton>
              ) : (
                <StatusButton color="white">거래완료</StatusButton>
              ))}

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

            {data.reservationStatus ? (
              <ReserveCancelButton onClick={onReserve}>
                예약 취소하기
              </ReserveCancelButton>
            ) : (
              <ReserveButton onClick={onReserve}>예약하기</ReserveButton>
            )}
          </DetailNav>
        </ContentSection>
      )}

      {isModalOpen && (
        <AlertModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          message={alertMessage}
          goPage={`${window.location.pathname}`}
        />
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
    margin-left: auto;
  }
;`

const ReserveButton = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4caf50;
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