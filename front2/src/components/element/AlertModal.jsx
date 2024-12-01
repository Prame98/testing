import React from "react";
import { styled } from "styled-components";

const AlertModal = ({ isModalOpen, setIsModalOpen, message, goPage }) => {


  const closeModal = () => {
    setIsModalOpen(false);
    if (goPage) {      
      window.location.href = goPage;
    }
  };

  if (isModalOpen) {
    return (
      <ModalOverlay>
        <ModalContent>
          <p>{message}</p>
          <button onClick={closeModal}>확인</button>
        </ModalContent>
      </ModalOverlay>
    );
  } else {
    return null;
  }
};

export default AlertModal;

// 모달 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  p {
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    background-color: #5ca771;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;
