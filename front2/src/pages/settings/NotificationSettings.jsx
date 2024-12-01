import React, { useState } from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleToggle = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <Layout>
    <Wrapper>
      <Header>알림 설정</Header>
      <Description>
        원하는 알림 유형을 선택하여 설정하세요. 변경 사항은 자동으로 저장됩니다.
      </Description>
      <SettingsList>
        <SettingItem>
          <Label>이메일 알림</Label>
          <ToggleButton
            isActive={emailNotifications}
            onClick={() => handleToggle(setEmailNotifications)}
          >
            {emailNotifications ? "켜짐" : "꺼짐"}
          </ToggleButton>
        </SettingItem>
        <SettingItem>
          <Label>문자 알림</Label>
          <ToggleButton
            isActive={smsNotifications}
            onClick={() => handleToggle(setSmsNotifications)}
          >
            {smsNotifications ? "켜짐" : "꺼짐"}
          </ToggleButton>
        </SettingItem>
        <SettingItem>
          <Label>푸시 알림</Label>
          <ToggleButton
            isActive={pushNotifications}
            onClick={() => handleToggle(setPushNotifications)}
          >
            {pushNotifications ? "켜짐" : "꺼짐"}
          </ToggleButton>
        </SettingItem>
      </SettingsList>
    </Wrapper>
    </Layout>
  );
};

export default NotificationSettings;

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial, sans-serif";
`;

const Header = styled.h1`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
`;

const SettingsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SettingItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.span`
  font-size: 16px;
  color: #333;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: ${(props) => (props.isActive ? "#4caf50" : "#ccc")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#45a049" : "#bbb")};
  }
`;
