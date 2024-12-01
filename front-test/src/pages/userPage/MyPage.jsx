import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { CommonButton, Layout } from '../../components/element';
import { SlSettings } from "react-icons/sl";
import { userLogout } from '../../api/users';
import RegisteredList from '../../components/RegisteredList';
import LikeList from '../../components/LikeList';



function MyPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0); // 0: 찜된 상품, 1: 예약된 상품, 2: 등록된 상품

    // 탭 메뉴 클릭 핸들러
    const handleTabClick = (index) => setActiveTab(index);

    // 로그아웃
    const Logout = () => {
        userLogout();
        navigate('/Intro');
    };

    return (
      <Layout>
        <Setbutton type="button" onClick={() => navigate("/Settings")}>
          <SlSettings />
        </Setbutton>
        <h1>{localStorage.getItem("usernickname")}님의 정보</h1>
        <CommonButton size="small" onClick={Logout}>
          로그아웃
        </CommonButton>
        <CommonButton size="small" onClick={() => navigate("/BoardWrite")}>
          상품등록
        </CommonButton>

        <TabContainer>
          {/* 탭 메뉴 */}
          <TabMenuArea>
            <TabMenu
              className={activeTab === 0 ? "checked" : ""}
              onClick={() => handleTabClick(0)}
            >
              찜된 상품
            </TabMenu>
            <TabMenu
              className={activeTab === 1 ? "checked" : ""}
              onClick={() => handleTabClick(1)}
            >
              예약된 상품
            </TabMenu>
            <TabMenu
              className={activeTab === 2 ? "checked" : ""}
              onClick={() => handleTabClick(2)}
            >
              등록된 상품
            </TabMenu>
            <TabNav style={{ transform: `translateX(${activeTab * 100}%)` }} />
          </TabMenuArea>

          {/* 탭 콘텐츠 */}
          <TabContentsArea>
            {activeTab === 0 && <LikeList listType="like" />}
            {activeTab === 1 && <LikeList listType="reservation" />}
            {activeTab === 2 && <RegisteredList />}
          </TabContentsArea>
        </TabContainer>
      </Layout>
    );
}

export default MyPage;

// 스타일 정의
const Setbutton = styled.button`
    position: relative;
    top: 20px;
    left: 0;
    border: none;
    background-color: transparent;
    font-size: 22px;
    color: #777;
`;

const TabContainer = styled.article`
    width: 100%;
    margin-top: 30px;
`;

const TabMenuArea = styled.div`
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    border-bottom: 1px solid #bdbdbd;
`;

const TabMenu = styled.button`
    width: 33.3%;
    background-color: transparent;
    border: none;
    font-size: 18px;
    font-weight: 700;
    color: #bdbdbd;
    &.checked {
        color: #222;
    }
`;

const TabNav = styled.div`
    position: absolute;
    bottom: 0;
    width: 33.3%;
    height: 2px;
    background-color: #333;
    transition: 0.3s;
`;

const TabContentsArea = styled.div`
    width: 100%;
    padding: 20px 0;
`;
