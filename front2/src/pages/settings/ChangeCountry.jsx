import React, { useState } from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const ChangeCountry = () => {
  const [selectedCountry, setSelectedCountry] = useState("대한민국");
  const countries = ["대한민국", "미국", "일본", "중국", "영국", "독일", "프랑스"];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  return (
    <Layout>
    <Wrapper>
      <Header>국가 변경</Header>
      <Description>사용할 국가를 선택하세요.</Description>
      <CountryList>
        {countries.map((country) => (
          <CountryItem
            key={country}
            isSelected={country === selectedCountry}
            onClick={() => handleCountryChange(country)}
          >
            {country}
          </CountryItem>
        ))}
      </CountryList>
      <SelectedCountry>
        <strong>선택된 국가:</strong> {selectedCountry}
      </SelectedCountry>
    </Wrapper>
    </Layout>
  );
};

export default ChangeCountry;

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

const CountryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const CountryItem = styled.li`
  padding: 10px 20px;
  font-size: 16px;
  color: ${(props) => (props.isSelected ? "white" : "#333")};
  background-color: ${(props) => (props.isSelected ? "#4caf50" : "#f0f0f0")};
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#45a049" : "#e0e0e0")};
  }
`;

const SelectedCountry = styled.p`
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-top: 30px;

  strong {
    font-weight: bold;
  }
`;
