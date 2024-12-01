import React from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const TermsOfService = () => {
  return (
    <Layout>
    <Wrapper>
      <Header>서비스 이용 약관</Header>
      <Content>
        <Section>
          <SectionTitle>제 1조 (목적)</SectionTitle>
          <SectionText>
            본 약관은 "소소하게"가 제공하는 모든 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
          </SectionText>
        </Section>
        <Section>
          <SectionTitle>제 2조 (정의)</SectionTitle>
          <SectionText>
            1. "소소하게"란 서비스를 제공하는 웹사이트 및 애플리케이션을 의미합니다.
            <br />
            2. "이용자"란 본 약관에 따라 서비스를 이용하는 고객을 말합니다.
          </SectionText>
        </Section>
        <Section>
          <SectionTitle>제 3조 (약관의 효력 및 변경)</SectionTitle>
          <SectionText>
            1. 본 약관은 "소소하게"에 게시함으로써 효력이 발생합니다.
            <br />
            2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
          </SectionText>
        </Section>
        <Section>
          <SectionTitle>제 4조 (서비스 제공 및 변경)</SectionTitle>
          <SectionText>
            회사는 이용자에게 아래와 같은 서비스를 제공합니다:
            <ul>
              <li>상품 정보 제공</li>
              <li>주문 및 결제 서비스</li>
              <li>고객 지원</li>
            </ul>
            단, 서비스 내용은 회사 사정에 따라 변경될 수 있습니다.
          </SectionText>
        </Section>
        <Section>
          <SectionTitle>제 5조 (이용자의 의무)</SectionTitle>
          <SectionText>
            이용자는 아래 행위를 해서는 안 됩니다:
            <ul>
              <li>타인의 정보를 도용하는 행위</li>
              <li>서비스 운영을 방해하는 행위</li>
              <li>법령에 위배되는 행위</li>
            </ul>
          </SectionText>
        </Section>
      </Content>
    </Wrapper>
    </Layout>
  );
};

export default TermsOfService;

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial, sans-serif";
  line-height: 1.6;
`;

const Header = styled.h1`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 14px;
  color: #555;
  overflow-y: auto;
  max-height: 80vh;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const SectionText = styled.p`
  font-size: 14px;
  color: #555;

  ul {
    padding-left: 20px;
    margin-top: 10px;
  }

  li {
    margin-bottom: 5px;
  }
`;
