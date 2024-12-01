import React from 'react';
import styled from 'styled-components';

// 스타일 정의 시 $를 붙여 props 이름을 설정
const ButtonStyle = styled.button`
  width: 80px;
  height: 30px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  font-weight: bold;
  background-color: ${(props) => props.$backgroundColor || '#4B5158'}; // 기본값 설정
  color: ${(props) => props.$color || 'white'}; // 기본값 설정
`;

function StatusButton({ color, backgroundColor, children }) {
  return (
    <ButtonStyle $color={color} $backgroundColor={backgroundColor}>
      {children}
    </ButtonStyle>
  );
}

export default StatusButton;
