import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { Main, Login, SignUp, MyPage, Intro, BoardList, BoardListShop, Search, BoardDetail, BoardWrite, 
        LocationSetting, SignUpChoice, SignUpCustomer, Settings, MyPageCustomer, ReserveNotice, InquiryPage, ReservationList } from './pages/index';

import NotificationSettings from './pages/settings/NotificationSettings';
import ChangeCountry from './pages/settings/ChangeCountry';
import LanguageSettings from './pages/settings/LanguageSettings';
import OpenSourceLicenses from './pages/settings/OpenSourceLicenses';
import TermsOfService from './pages/settings/TermsOfService';
import PrivacyPolicy from './pages/settings/PrivacyPolicy';
import MemberManagement from './pages/settings/MemberManagement';
import BoardUpdate from './pages/BoardUpdate';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToBoardList />} />
          <Route path="/Intro" element={<Intro />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyPageCustomer" element={<MyPageCustomer />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignUpChoice" element={<SignUpChoice />} />
          <Route path="/SignUpCustomer" element={<SignUpCustomer />} />
          <Route path="/InquiryPage" element={<InquiryPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/BoardList" element={<BoardList />} />
          <Route path="/BoardListShop" element={<BoardListShop />} />
          <Route path="/LocationSetting" element={<LocationSetting />} />
          <Route path="/BoardDetail/:id" element={<BoardDetail />} />
          <Route path="/BoardWrite" element={<BoardWrite />} />
          <Route path="/BoardUpdate/:id" element={<BoardUpdate />} />
          <Route path="/ReserveNotice" element={<ReserveNotice />} />

          <Route path="/MemberManagement" element={<MemberManagement />} />
          <Route path="/ReservationList" element={<ReservationList />} />
          <Route
            path="/NotificationSettings"
            element={<NotificationSettings />}
          />
          <Route path="/ChangeCountry" element={<ChangeCountry />} />
          <Route path="/LanguageSettings" element={<LanguageSettings />} />
          <Route path="/OpenSourceLicenses" element={<OpenSourceLicenses />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function RedirectToBoardList() {
  const accessToken = localStorage.getItem('access_token');

  console.log(" accessToken 값 존재 여부 :", accessToken);

  // accessToken이 없으면 <Intro /> 컴포넌트를 렌더링하고, 있으면 리디렉션
  if (!accessToken ||accessToken === null) {
    return <Intro />; // accessToken이 없으면 Intro 컴포넌트를 렌더링
  } else {   
    return <BoardList />; // 리디렉션 후 아무 것도 렌더링하지 않음
  }
}



export default App