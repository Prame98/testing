import React from "react";
import { styled } from "styled-components";
import { Layout } from "../../components/element";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Wrapper>
        <Header>개인정보 처리 방침</Header>
        <Content>
          <Section>
            <SectionTitle>제 1조 (개인정보의 수집 목적)</SectionTitle>
            <SectionText>
              "소소하게"는 다음과 같은 목적으로 개인정보를 수집합니다:
              <ul>
                <li>서비스 제공 및 운영</li>
                <li>사용자 문의 응대</li>
                <li>맞춤형 서비스 제공</li>
              </ul>
            </SectionText>
          </Section>
          <Section>
            <SectionTitle>제 2조 (수집하는 개인정보의 항목)</SectionTitle>
            <SectionText>
              수집되는 개인정보의 항목은 다음과 같습니다:
              <ul>
                <li>필수 정보: 이름, 이메일, 연락처</li>
                <li>선택 정보: 주소, 생년월일</li>
              </ul>
            </SectionText>
          </Section>
          <Section>
            <SectionTitle>제 3조 (개인정보의 보유 및 이용 기간)</SectionTitle>
            <SectionText>
              수집된 개인정보는 목적 달성 후 아래 기간 동안 보관됩니다:
              <ul>
                <li>회원 정보: 회원 탈퇴 후 1년</li>
                <li>법령에 따른 보존 의무: 관련 법령에 따라 보관</li>
              </ul>
            </SectionText>
          </Section>
          <Section>
            <SectionTitle>제 4조 (개인정보의 제3자 제공)</SectionTitle>
            <SectionText>
              "소소하게"는 이용자의 동의 없이 개인정보를 제3자에게 제공하지
              않습니다. 단, 아래의 경우 예외로 합니다:
              <ul>
                <li>법령에 의한 요청</li>
                <li>사용자의 동의를 받은 경우</li>
              </ul>
            </SectionText>
          </Section>
          <Section>
            <SectionTitle>제 5조 (개인정보 보호를 위한 조치)</SectionTitle>
            <SectionText>
              회사는 이용자의 개인정보를 안전하게 보호하기 위해 다음과 같은
              조치를 취합니다:
              <ul>
                <li>데이터 암호화</li>
                <li>접근 제한</li>
                <li>정기 보안 점검</li>
              </ul>
            </SectionText>
          </Section>
        </Content>
      </Wrapper>
    </Layout>
  );
};

export default PrivacyPolicy;

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
