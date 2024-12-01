import React, { useState } from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("한국어");
  const languages = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "zh", label: "中文" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.label);
  };

  return (
    <Layout>
    <Wrapper>
      <Header>언어 설정</Header>
      <Description>사용할 언어를 선택하세요.</Description>
      <LanguageList>
        {languages.map((language) => (
          <LanguageItem
            key={language.code}
            isSelected={language.label === selectedLanguage}
            onClick={() => handleLanguageChange(language)}
          >
            {language.label}
          </LanguageItem>
        ))}
      </LanguageList>
      <SelectedLanguage>
        <strong>선택된 언어:</strong> {selectedLanguage}
      </SelectedLanguage>
    </Wrapper>
    </Layout>
  );
};

export default LanguageSettings;

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

const LanguageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const LanguageItem = styled.li`
  padding: 10px 20px;
  font-size: 16px;
  color: ${(props) => (props.isSelected ? "white" : "#333")};
  background-color: ${(props) => (props.isSelected ? "#007bff" : "#f0f0f0")};
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? "#0056b3" : "#e0e0e0"};
  }
`;

const SelectedLanguage = styled.p`
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-top: 30px;

  strong {
    font-weight: bold;
  }
`;
