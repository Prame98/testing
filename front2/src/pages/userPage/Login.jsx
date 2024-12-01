import React, { useState } from 'react'
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SlArrowLeft } from "react-icons/sl";
import { CommonButton, Flx, Input, IntroLayout } from '../../components/element';
import { userLogin } from '../../api/users';
import { useMutation } from 'react-query';
import { useAlert } from '../../components/common/AlertContext';

function Login() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [input, setInput] = useState({
        userId: '',
        password: ''
    });

    // 입력 값 변경 핸들러
    const onChangeInputHandler = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value });
    };

    // 로그인 mutation
    const mutation = useMutation(userLogin, {
        onSuccess: (response) => {

            //console.log('로그인 성공', response.data);
            //console.log('로그인 성공 userId :', response.data.userId);

            // 로그인 성공 시, 로컬 스토리지 및 세션 스토리지에 토큰 및 사용자 정보 저장
            localStorage.setItem("refresh_token",  response.data.refresh_token);
            localStorage.setItem("access_token",  response.data.access_token);
            localStorage.setItem("uid",  response.data.id);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("usernickname", response.data.nickname);
            localStorage.setItem("address", response.data.address);
            localStorage.setItem("fullAddress", response.data.address.fullAddress);
            localStorage.setItem("postcode", response.data.address.postcode);
            localStorage.setItem("detailAddress", response.data.address.detailAddress);
            // localStorage.setItem("userTime", response.data.time);
            localStorage.setItem("userAddressX", response.data.address.x);
            localStorage.setItem("userAddressY", response.data.address.y);            
            localStorage.setItem("userType", response.data.userType); 
             navigate("/BoardList");
        },
        onError: (error) => {
            console.error('로그인 실패', error);
            showAlert({message: error});
            
        }
    });

    // 로그인 버튼 클릭 이벤트 핸들러
    const onSubmitLoginHandler = (e) => {
        e.preventDefault();
        const userInfo = {
            userId: input.userId,
            password: input.password
        };
        mutation.mutate(userInfo); // 로그인 요청
        setInput({ userId: '', password: '' }); // 입력 필드 초기화
    };

    return (
        <IntroLayout>
            <Backbutton type='button' onClick={() => navigate(-1)}><SlArrowLeft /></Backbutton>
            <h1 style={{ marginTop: "40px", marginBottom: "0px" }}>로그인</h1>
            <StForm onSubmit={onSubmitLoginHandler}>
                <div>
                    <Flx>
                        <label htmlFor='userId'>아이디</label>
                        <Input type="text" value={input.userId} id='userId' onChange={onChangeInputHandler}  required />
                    </Flx>

                    <Flx>
                        <label htmlFor='password'>패스워드</label>
                        <Input type="password" value={input.password} id='password' onChange={onChangeInputHandler} required />
                    </Flx>
                </div>

                <CommonButton type='submit' size='large'>로그인</CommonButton>
            </StForm>
        </IntroLayout>
    )
}

export default Login;

const Backbutton = styled.button`
    position:relative;
    top:20px;
    left:0;
    border:none;
    background-color:transparent;
    font-size:22px;
    color:#777;
`
const StForm = styled.form`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:calc(100vh - 220px);
    padding-top:30px;

    & label{
        display:inline-block;
        width:65px;
        line-height:43px;
        font-weight:500;
    }
    & input{
        display:inline-block;
        width:calc(100% - 65px);
        margin-bottom:15px;
    }
`
