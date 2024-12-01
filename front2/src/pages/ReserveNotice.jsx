import React from "react";
import { styled } from 'styled-components';
import { IntroLayout, Layout } from '../components/element';

import { useAlert } from "../components/common/AlertContext";

const ReserveNotice = () => {
  const { showAlert } = useAlert();

  return (
    <Layout>
    <IntroLayout>
      <Title>안내사항</Title>
      <Paragraph>
        고객님께 제공되는 상품은 신선하고 안전하게 포장된{" "}
        <strong>당일 판매 상품</strong>입니다. 아래 내용을 꼭 확인하신 후 예약을
        진행해 주세요.
      </Paragraph>
      <SubTitle>1. 당일 포장 제공</SubTitle>
      <Paragraph>
        본 상품은 예약 당일 신선하게 포장되어, 최상의 품질을 유지합니다. 포장 후
        가능한 빠른 시간 내에 수령해 주시면 감사하겠습니다.
      </Paragraph>
      <SubTitle>2. 섭취 권장 기간</SubTitle>
      <Paragraph>
        상품의 특성상, 수령일로부터 <strong>2~3일 이내에 섭취</strong>하시는
        것을 권장드립니다. 유통기한이 임박한 상품이므로, 장기 보관 시 신선도나
        맛이 저하될 수 있습니다. 최상의 맛과 품질을 위해 가능한 빠르게 드시기를
        추천합니다.
      </Paragraph>
      <SubTitle>3. 보관 방법 안내</SubTitle>
      <Paragraph>
        각 상품에 적혀 있는 보관 방법(냉장/냉동)을 준수해 주세요. 적절한 보관
        방법을 따를 경우, 권장 기간 내에 더욱 신선하게 즐기실 수 있습니다.
      </Paragraph>
      <SubTitle>주의사항</SubTitle>
      <List>
        <ListItem>
          본 상품은 유통기한이 임박한 제품으로, 상품 특성상{" "}
          <strong>예약 후 취소 및 환불이 제한</strong>될 수 있습니다. 구매 전에
          신중히 검토해 주세요.
        </ListItem>
        <ListItem>
          예약 후 상품을 수령하지 않으시는 경우, 해당 상품은 폐기 처분될 수
          있으며, 이는 환경에 부정적인 영향을 미칩니다. 고객님의 적극적인 수령
          참여로 환경 보호에 함께해 주세요.
        </ListItem>
      </List>
      <ConfirmText>
        신선한 상품과 함께 즐거운 식사를 하실 수 있도록 최선을 다해
        준비하겠습니다.
      </ConfirmText>
      <ButtonContainer>
        <ConfirmButton onClick={()=> showAlert({ message: "공지사항을 확인 하였습니다." ,goPage: "/MyPageCustomer"}) }>확인</ConfirmButton>
      </ButtonContainer>

   

    </IntroLayout>
    </Layout>
  );
};

export default ReserveNotice;


const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const SubTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
`;

const ConfirmText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #333;
  border: none;
  cursor: pointer;
  border-radius: 4px;
`;
