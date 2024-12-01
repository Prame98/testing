import React, {   useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { SlArrowLeft } from "react-icons/sl";
import { Input, CommonButton, Flx, IntroLayout } from '../../components/element';
import { getIdChk, userSignup } from '../../api/users';
import { useAlert } from '../../components/common/AlertContext';



function SignUp() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    // Input state
    const [input, setInput] = useState({
        userId: '',
        password: '',
        pwConfirm: '',
        nickname: '',
        time: '',
        address: {
            postcode: '', // 우편번호
            fullAddress: '', // 전체 주소
            detailAddress: '', // 상세 주소
            x: '', // 경도
            y: '',  // 위도
        },
        userType: 'owner',
    });

    // Input change handler
    const onChangeInputHandler = (e) => {
        const { id, value } = e.target;
        setInput({
            ...input,
            [id]: value,
        });
    };



    const onChangeInputAdressHandler = (event) => {
        const { id, value } = event.target;
        const [parentKey, childKey] = id.split(".");
    
        setInput((prevInput) => ({
            ...prevInput,
            [parentKey]: {
                ...prevInput[parentKey],
                [childKey]: value,
            },
        }));
    };



    // Daum 주소 API 호출 핸들러
const openDaumPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
        showAlert({ message: "주소 검색 API를 로드하지 못했습니다. 페이지를 새로고침하거나 관리자에게 문의하세요." });
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
                    showAlert({ message: "주소 정보를 찾을 수 없습니다." });
                    return;
                }

                const { x, y } = result.documents[0];

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
                showAlert({ message: "주소 좌표를 가져오는 중 오류가 발생했습니다." });
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





    // ID 중복 확인 핸들러
    const onIdChkHandler = async(e) => {
        e.preventDefault();
        if(!input.userId){            
            showAlert({ message: "아이디를 입력하세요" });
            return;
        }
        const response=await getIdChk(input.userId);
        showAlert({ message: response });
    };

    // 회원가입 제출 핸들러
    const onSubmitJoinHandler = async (e) => {
        e.preventDefault();
        const userInfo = {
            userId: input.userId,
            password: input.password,
            nickname: input.nickname,
            address: input.address,
            time: input.time
        };

        const userType = 'owner'; // 유저 타입
        const result = await userSignup(userInfo, userType);       
        if (result === "success") {
            showAlert({ message: "회원가입을 축하합니다." , goPage: '/Login'});
            return;
        }
        showAlert({ message: result });
    };

    return (
        <IntroLayout>
            <Backbutton type='button' onClick={() => navigate(-1)}><SlArrowLeft /></Backbutton>
            <h1 style={{ marginTop: "40px", marginBottom: "0px" }}>회원가입</h1>
            <StForm onSubmit={(e) => onSubmitJoinHandler(e)}>
                <div>
                    <Flx>
                        <label htmlFor='nickname'>상점명</label>
                        <Input
                            type="text"
                            value={input.nickname}
                            id='nickname'
                            placeholder='3~10글자 사이 영문'
                            onChange={onChangeInputHandler}
                            required
                        />
                        {
                            /^[a-zA-Z]{3,10}$/.test(input.nickname) ? null :
                                <p className='alertText'>5~10글자 사이 영문을 사용하세요.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='userId'>아이디</label>
                        <StyledInput
                            type="text"
                            value={input.userId}
                            id='userId'
                            placeholder='5~10글자 사이 영문 소문자,숫자'
                            onChange={onChangeInputHandler}
                            required
                        />
                        <CommonButton size='small' onClick={(e) => onIdChkHandler(e)}>중복확인</CommonButton>
                        {
                            /^[a-z0-9]{8,15}$/.test(input.userId) ? null :
                                <p className='alertText'>8~15글자 사이 영문 소문자,숫자를 사용하세요.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='password'>패스워드</label>
                        <Input
                            type="password"
                            value={input.password}
                            id='password'
                            placeholder='8~15글자 사이 영문,숫자,특수문자'
                            onChange={onChangeInputHandler}
                            required
                        />
                        {
                            /^[a-zA-Z0-9!@#$%^&*()\-_=+{};:,.<>?[\]\\/]{8,15}$/.test(input.password) ? null :
                                <p className='alertText'>8~15글자 사이 영문,숫자,특수문자를 사용하세요.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='pwConfirm'>PW확인</label>
                        <Input
                            type="password"
                            value={input.pwConfirm}
                            id='pwConfirm'
                            placeholder='비밀번호 확인을 위해 한번 더 입력해주세요'
                            onChange={onChangeInputHandler}
                            required
                        />
                        {
                            input.password === input.pwConfirm ? null :
                                <p className='alertText'>비밀번호가 일치하지 않습니다.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='time'>영업시간</label>
                        <Input 
                            type="text" 
                            value={input.time} 
                            id="time" 
                            placeholder='ex) 매일 10:00 - 22:00' 
                            onChange={onChangeInputHandler}
                        />
                    </Flx>


                    <Flx>
                        <label htmlFor='address.postcode'>우편번호</label>
                        <Input
                            type="text"
                            value={input.address.postcode}
                            id='address.postcode'
                            readOnly
                            style={{ backgroundColor: 'lightgray' }}
                        />
                    </Flx>


                    <Flx>
                        <label htmlFor='address.fullAddress'>주소</label>
                        <Input
                            type="text"
                            value={input.address.fullAddress}
                            id='address.fullAddress'
                            placeholder='주소 검색'
                            readOnly
                            required
                        />
                        <CommonButton size='small' type="button" onClick={openDaumPostcode}>주소 검색</CommonButton>
                    </Flx>

                    <Flx>
                        <label htmlFor='address.detailAddress'>상세주소</label>
                        <Input
                            type="text"
                            value={input.address.detailAddress || ""}
                            id='address.detailAddress'
                            placeholder='상세 주소 입력'
                            onChange={onChangeInputAdressHandler}
                        />
                    </Flx>

        
                </div>
            
             
                <CommonButton size='large'>가입하기</CommonButton>
              
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
      
        </IntroLayout>
    );
}

export default SignUp;

const Backbutton = styled.button`
    position: relative;
    top: 20px;
    left: 0;
    border: none;
    background-color: transparent;
    font-size: 22px;
    color: #777;
`;

const StForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 190px);
    padding-top: 30px;
    box-sizing: border-box;
    &>div>div {
        position: relative;
    }

    & label {
        display: inline-block;
        width: 65px;
        line-height: 43px;
        font-weight: 500;
    }
    & .alertText {
        position: absolute;
        top: 45px;
        display: inline-block;
        color: #f00;
        margin: 3px 0 25px;
        transform: translateX(70px);
        font-size: 0.8rem;
    }
    & input {
        display: inline-block;
        width: calc(100% - 65px);
        margin-bottom: 50px;
    }
`;

const StyledInput = styled(Input)`
    display: inline-block;
    width: calc(100% - 168px) !important;
    margin-right: 8px;
`;


