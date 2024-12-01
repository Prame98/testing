import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Layout } from "../../components/element";
import { getUId, userTypeCheck } from "../../utils/auth";
import { useQuery } from "react-query";
import { getUserInfo, updateMemberInfo } from "../../api/users";
import AlertModal from "../../components/element/AlertModal";

const MemberInfoManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  

  // userData가 존재하지 않을 때 초기값 설정
  const [input, setInput] = useState({
      nickname:  "", 
      userId: "",
      password: "",
      pwConfirm: "",
      time: "",
      address: {
        postcode: "",
        fullAddress: "",
        detailAddress: "",
      },
  });
  

  ///api/users/userInfo
  const { data, refetch } = useQuery(['getUserInfo', getUId()], () => getUserInfo(), {
    staleTime: Infinity,
    onSuccess: (response) => {
      // console.log("가져온 데이터 : " ,response.data );
        setInput({
            nickname:  response.data.nickname, 
            userId: response.data.userId,
            password: "",
            pwConfirm: "",
            time: response.data.time,
            address: {
              postcode: response.data.address.postcode,
              fullAddress: response.data.address.fullAddress,
              detailAddress: response.data.address.detailAddress,
            },
      })      
    },
  });

  useEffect(() => {
    if(data){
      refetch(); // refetch data when data is stale
    }
  }, []);


  const onChangeInputHandler = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  const onChangeInputAddressHandler = (e) => {
    const { id, value } = e.target;
    setInput({
      ...input,
      address: { ...input.address, [id.split(".")[1]]: value },
    });
  };





  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // API 호출로 수정된 정보 저장 로직 추가
    const userInfo = {
      userId: input.userId,
      password: input.password,
      nickname: input.nickname,
      address: {
        ...input.address, // fullAddress, detailAddress, postcode 포함
        x: input.address.x,
        y: input.address.y,
      },
      time: input.time,
    };
  
    try {
      console.log("전송 데이터:", userInfo);
      const result = await updateMemberInfo(userInfo);
      console.log("API 응답:", result);
  
      const updatedAddress = result.data?.user?.address || {};
      console.log("업데이트된 주소:", updatedAddress);
  
      // 로컬스토리지에 값 저장
      localStorage.setItem("address", JSON.stringify(updatedAddress));
      localStorage.setItem("fullAddress", updatedAddress.fullAddress);
      localStorage.setItem("postcode", updatedAddress.postcode);
      localStorage.setItem("detailAddress", updatedAddress.detailAddress);
      localStorage.setItem("userAddressX", updatedAddress.x);
      localStorage.setItem("userAddressY", updatedAddress.y);
      setAlertMessage("회원 정보가 성공적으로 업데이트되었습니다!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("회원 정보 수정 중 오류:", error);
      setAlertMessage("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  

  
    // Daum 주소 API 호출 핸들러
const openDaumPostcode = () => {
  if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 API를 로드하지 못했습니다. 페이지를 새로고침하거나 관리자에게 문의하세요.");
      return;
  }

  const layer = document.getElementById('daumPostcodeLayer'); // 레이어 요소 가져오기
  const closeBtn = document.getElementById('closePostcodeLayer'); // 닫기 버튼 가져오기

  layer.style.display = 'block'; // 레이어 보이기

  new window.daum.Postcode({
      oncomplete: async function (data) {
          const fullAddress = data.address;
          const postcode = data.zonecode;


          try {
              const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(fullAddress)}`, {
                  headers: {
                      Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
                  },
              });

              if (!response.ok) {
                  throw new Error("카카오 API 요청 실패");
              }

              const result = await response.json();
              if (result.documents.length === 0) {
                  alert("주소 정보를 찾을 수 없습니다.");
                  return;
              }

              const { x, y } = result.documents[0];

              console.log("카카오 API 요청 실패:",  x, y);
              setInput((prev) => ({
                  ...prev,
                  address: {
                      ...prev.address,
                      postcode,
                      fullAddress,
                      x: x,
                      y: y,
                  },
              }));
          } catch (error) {
              console.error("카카오 API 요청 실패:", error);
              alert("주소 좌표를 가져오는 중 오류가 발생했습니다.");
          }

          layer.style.display = 'none'; // 레이어 숨기기
      },
      width: '100%',
      height: '100%',
  }).embed(layer); // iframe에 레이어 삽입

  // 닫기 버튼 클릭 시 레이어 숨기기
  closeBtn.onclick = () => {
      layer.style.display = 'none';
  };
};


   if(!data){
      return (
        <Layout>
        <Wrapper>
          <Header>회원정보 관리</Header>

          </Wrapper>
        </Layout>
      );
  }


  return (
    <Layout>
    <Wrapper>
      <Header>회원정보 관리</Header>

      

      <StForm onSubmit={onSubmitHandler}>
        <Flx>
          {userTypeCheck()==="guest" ? <label htmlFor="nickname">닉네임</label>
            :  <label htmlFor="nickname">상점명</label>
           }          
          <Input
            type="text"
            id="nickname"
            value={input.nickname}
            onChange={onChangeInputHandler}
            readOnly 
            required
            style={{ backgroundColor: "lightgray" }}
          />
        </Flx>

        <Flx>
          <label htmlFor="userId">아이디</label>
          <Input type="text" id="userId" value={input.userId} readOnly  required  style={{ backgroundColor: "lightgray" }}  />
        </Flx>

        <Flx>
          <label htmlFor="password">새 비밀번호</label>
          <Input
            type="password"
            id="password"
            placeholder="새 비밀번호 입력"
            value={input.password}
            onChange={onChangeInputHandler}
            required
          />
        </Flx>

        <Flx>
          <label htmlFor="pwConfirm">비밀번호 확인</label>
          <Input
            type="password"
            id="pwConfirm"
            placeholder="비밀번호 확인"
            value={input.pwConfirm}
            onChange={onChangeInputHandler}
            required
          />
          {input.password !== "" && input.password !== input.pwConfirm && (
            <p className="alertText">비밀번호가 일치하지 않습니다.</p>
          )}
        </Flx>

        {userTypeCheck()==="owner" &&
            <Flx>
              <label htmlFor="time">영업시간</label>
              <Input
                type="text"
                id="time"
                value={input.time}
                onChange={onChangeInputHandler}
              />
            </Flx>
        }

        <Flx>
          <label htmlFor="address.postcode">우편번호</label>
          <Input
            type="text"
            id="address.postcode"
            value={input.address.postcode}
            readOnly
            required
            style={{ backgroundColor: "lightgray" }}
          />
        </Flx>

        <Flx>
          <label htmlFor="address.fullAddress">주소</label>
          <div style={{ display: "flex" }}>
            <Input
              type="text"
              id="address.fullAddress"
              value={input.address.fullAddress}
              readOnly
              required
              style={{ backgroundColor: "lightgray" ,width:"68%",display: "inline" , marginRight:"10px"}}
            />

            <AddressButton size='small' type="button" onClick={openDaumPostcode}>주소 검색</AddressButton>
          </div>
        </Flx>

        <Flx>
          <label htmlFor="address.detailAddress">상세주소</label>
          <Input
            type="text"
            id="address.detailAddress"
            value={input.address.detailAddress}
            onChange={onChangeInputAddressHandler}
          />

 
        </Flx>

        <CommonButton type="submit">저장하기</CommonButton>
      </StForm>



      <div id="daumPostcodeLayer" style={{
                        display: 'none',
                        position: 'fixed',
                        zIndex: '100',
                        width: '450px',
                        height: '400px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border:'5px solid black'
                        ,
                    }}>
                        <button
                            id="closePostcodeLayer"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                border: 'none',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            닫기
                        </button>
            </div>


            {isModalOpen && 
        ( <AlertModal isModalOpen={isModalOpen}  setIsModalOpen={setIsModalOpen}   message={alertMessage}   />  )}

    </Wrapper>



    </Layout>
  );
};

export default MemberInfoManagement;

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const StForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Flx = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .alertText {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CommonButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;


const AddressButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width:25%;
  display:flex;
  &:hover {
    background-color: #45a049;
  }
`;

