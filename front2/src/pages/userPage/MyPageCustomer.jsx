import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMyReservationsBoard, getMylikeBoard } from '../../api/boards';
import { userLogout } from '../../api/users';
import { CommonButton, Layout } from '../../components/element';
import Loading from '../statusPage/Loading';
import Error from '../statusPage/Error';
import NullAlert from '../statusPage/NullAlert';
import { SlSettings } from "react-icons/sl";
import ListItem from '../../components/ListItem';


function MyPageCustomer() {
  const navigate = useNavigate();
  const mileage = localStorage.getItem('mileage') || 0;
  const [activeTab, setActiveTab] = useState('reservation'); // 탭 상태 관리

  const { isLoading: isLoadingReservations, isError: isErrorReservations, data: dataReservations } = useQuery(
    'getMyReservationsBoard',
    getMyReservationsBoard
  );

  const { isLoading: isLoadingLikes, isError: isErrorLikes, data: dataLikes } = useQuery(
    'getMylikeBoard',
    getMylikeBoard
  );

  if (isLoadingReservations || isLoadingLikes) return <Loading />;
  if (isErrorReservations || isErrorLikes) return <Error />;

  const goDetail = (boardId, event) => {
    navigate(`/BoardDetail/${boardId}`);
    event.stopPropagation();
  };

  const Logout = () => {
    userLogout();
    navigate('/Intro');
  };

  return (
    <Layout>
      <Setbutton type="button" onClick={() => navigate('/Settings')}>
        <SlSettings />
      </Setbutton>
      <h1>{localStorage.getItem('usernickname')}님의 정보</h1>
      <ButtonContainer>
        <CommonButton size="small" onClick={Logout}>로그아웃</CommonButton>
        <MileageDisplay>마일리지: {mileage}</MileageDisplay>
      </ButtonContainer>
      <TabContainer>
        <TabMenuArea>
          <TabMenu
            className={activeTab === 'reservation' ? 'checked' : ''}
            onClick={() => setActiveTab('reservation')}
          >
            예약내역
          </TabMenu>
          <TabMenu
            className={activeTab === 'like' ? 'checked' : ''}
            onClick={() => setActiveTab('like')}
          >
            관심목록
          </TabMenu>
          <TabNav activeTab={activeTab} />
        </TabMenuArea>
        <TabContentsArea>
          <TabSlideArea activeTab={activeTab}>
            <Contents>
              {dataReservations && dataReservations.length > 0 ? (
                dataReservations.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    isEven={index % 2 === 1}
                    onClick={goDetail}
                  />
                ))
              ) : (
                <NullAlert alertMessage="구매한 상품이 없어요" />
              )}
            </Contents>
            <Contents>
              {dataLikes && dataLikes.length > 0 ? (
                dataLikes.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    isEven={index % 2 === 1}
                    onClick={goDetail}
                  />
                ))
              ) : (
                <NullAlert alertMessage="찜한 상품이 없어요" />
              )}
            </Contents>
          </TabSlideArea>
        </TabContentsArea>
      </TabContainer>
    </Layout>
  );
}

export default MyPageCustomer;

// 기존 스타일은 동일


const Setbutton = styled.button`
  position:relative;
  top:20px;
  left:0;
  border:none;
  background-color:transparent;
  font-size:22px;
  color:#777;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-right: 15px;
`;

const MileageDisplay = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const TabContainer = styled.article`
  width:100%;
  margin-top:30px;
`;

const TabMenuArea = styled.div`
  position:relative;
  width:100%;
  height:50px;
  display:flex;
  border-bottom:1px solid #bdbdbd;
`;

const TabMenu = styled.button`
  width:50%;
  background-color:transparent;
  border:none;
  font-size:18px;
  font-weight:700;
  color:#bdbdbd;
  &.checked{
    color:#222;
  }
`;

const TabNav = styled.div`
  position:absolute;
  bottom:0;
  width:50%;
  left: ${({ activeTab }) => (activeTab === 'reservation' ? '0%' : '50%')};
  height:2px;
  background-color:#333;
  transition:.3s;
`;

const TabContentsArea = styled.div`
  width:100%;
  overflow:hidden;
`;

const TabSlideArea = styled.div`
  width: 200%;
  display:flex;
   transform: translateX(${({ activeTab }) => (activeTab === 'reservation' ? '0' : '-50%')});
  transition:.3s;
`;

const Contents = styled.div`
  width:100%;
`;
