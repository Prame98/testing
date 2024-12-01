import { instance } from './axios';

// 회원가입
export const userSignup = (userInfo, userType) => {
  // 주소 객체와 region4depthName 속성 확인

  if (!userInfo.address) {
    alert('주소 정보가 올바르지 않습니다.');
    //return Promise.reject(new Error('주소 정보가 올바르지 않습니다.'));
    return ;
  }

  
  return instance.post('/api/auth/signup', {
    ...userInfo,
    userType,
  })
  .then((response) => {
    //console.log("회원가입 성공시: ", response);
    alert('회원가입 성공');
    return "success";
  })
  .catch((error) => {
    console.error("회원가입 에러시: ", error);
    if (error.response && error.response.data) {
      alert(error.response.data.responseMessage);
    } else {
      alert('회원가입 중 에러가 발생했습니다.');
    }
    return null;
    //return Promise.reject(error);
  });
};

// 아이디 중복 조회
export const getIdChk = (userId) => {
  return instance.get(`/api/auth/checkId?id=${userId}`)
    .then((response) => {
      if (response.status === 200) {
        console.log('사용 가능한 아이디:', response.data);
        alert('사용할 수 있는 아이디입니다.');
      }
      return response;
    })
    .catch((error) => {
      if (error.response) {
        console.error('에러 :', error);
        if (error.response.status === 409) {
          alert('이미 가입한 아이디 입니다.');
        } else {
          alert('아이디 중복 확인 중 에러가 발생했습니다.');
        }
      } else {
        console.error('응답 없음:', error.message);
        alert('서버와 통신할 수 없습니다.');
      }
      return null; 
    });
};




// 주소 유효성 확인
export const getAddressChk = (region1depthName, region2depthName, region3depthName) => {
  return instance.post(`/api/map/address`, {
    region1depthName,
    region2depthName,
    region3depthName,
  })
  .then((response) => {
    if(response.status === 200){
      alert('유효한 주소입니다.');
    }
    return response;
  })
  .catch((error) => {
    if (error.response && error.response.status === 404) {
      alert('유효하지 않은 주소입니다.');
    } else {
      alert('주소 확인 중 에러가 발생했습니다.');
    }
    return null;
  });
};

// 로그인
export const userLogin = (userInfo) => {
  return instance.post('/api/auth/login', userInfo)
  .then((response) => {
    console.log(response);
    const { token } = response.data;

    // 서버에서 실제로 'token'을 제공하는지 확인
    localStorage.setItem("refresh_token", response.data.refreshToken);
    localStorage.setItem("access_token", token);
    //alert('로그인 성공');
    return response;
  })
  .catch((error) => {
    if (error.response && error.response.data) {
      alert(error.response.data.responseMessage);
    } else {
      alert('로그인 중 에러가 발생했습니다.');
    }
    return Promise.reject(error);
  });
};

// 로그아웃
export const userLogout = () => {
  const userId=localStorage.getItem("userId");
  
  if(!userId || userId===null){
    localStorage.clear();
    //alert('로그아웃 성공');
    return  null;
  }

  return instance.get(`/api/auth/logout?userId=${userId}`)
  .then((response) => {  
    localStorage.clear();    
    //alert('로그아웃 성공');
    return response;
  }).catch((error) => {
    
      localStorage.clear();    
    if (error.response && error.response.data) {
      alert(error.response.data.responseMessage);
    } else {
      alert('로그아웃 중 에러가 발생했습니다.');
    }
    return Promise.reject(error);
  });
};



//유저 정보 가져오기
export const getUserInfo = (userId) => {
  return instance.get(`/api/users/userInfo`)
    .then((response) => {
      if (response.status === 200) {
       console.log('유저 정보 가져오기:', response.data);
        
      }
      return response;
    })
    .catch((error) => {
      console.error('에러 :', error);
      return null; 
    });
};


export const updateMemberInfo = (userInfo) => {
  return instance.post(`/api/users/updateMemberInfo`,userInfo)
    .then((response) => {
      if (response.status === 200) {
       // console.log('유저 정보 가져오기:', response.data);
        
      }
      return response;
    })
    .catch((error) => {
      console.error('에러 :', error);
      return null; 
    });
};




