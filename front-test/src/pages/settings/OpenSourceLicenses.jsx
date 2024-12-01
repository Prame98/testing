import React from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const OpenSourceLicenses = () => {
  const licenses = [
    {
      name: "React",
      version: "18.2.0",
      license: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    {
      name: "Styled-Components",
      version: "5.3.11",
      license: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    {
      name: "Axios",
      version: "1.4.0",
      license: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    {
      name: "React Router",
      version: "6.15.0",
      license: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  ];

  return (
    <Layout>
    <Wrapper>
      <Header>오픈소스 라이선스</Header>
      <Description>소소하게 프로젝트에서 사용된 오픈소스 라이브러리 및 라이선스 정보입니다.</Description>
      <LicenseList>
        {licenses.map((license, index) => (
          <LicenseItem key={index}>
            <LibraryName>
              {license.name} <Version>v{license.version}</Version>
            </LibraryName>
            <LicenseType>
              라이선스:{" "}
              <LicenseLink href={license.url} target="_blank" rel="noopener noreferrer">
                {license.license}
              </LicenseLink>
            </LicenseType>
          </LicenseItem>
        ))}
      </LicenseList>
    </Wrapper>
    </Layout>
  );
};

export default OpenSourceLicenses;

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

const LicenseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LicenseItem = styled.li`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const LibraryName = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Version = styled.span`
  font-size: 14px;
  color: #888;
`;

const LicenseType = styled.p`
  font-size: 14px;
  color: #555;
`;

const LicenseLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
