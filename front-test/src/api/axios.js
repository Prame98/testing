import axios from "axios";

// 요청을 보낼 서버를 지정
export const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:8001',
    withCredentials: true, 
    headers: {
      'Content-Type': 'application/json',
      // 필요 시 인증 토큰이나 다른 헤더를 추가할 수 있습니다.
      // 'Authorization': `Bearer ${token}`
    },
});

// request interceptor
instance.interceptors.request.use(
    function (config) {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (accessToken && refreshToken) {
        config.headers['Access_token'] = `${accessToken}`;
        config.headers['Refresh_token'] = `${refreshToken}`;
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
);


// 응답 인터셉터 추가
instance.interceptors.response.use(
  function (response) {
    // 응답 데이터 처리
    return response;
  },
  function (error) {
    // 응답 에러 처리 (ex: 401 에러 처리)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirect to login');
      // 로그아웃 처리 또는 로그인 페이지로 리다이렉트 등
    }
    return Promise.reject(error);
  }


);



// 응답 인터셉터: 토큰이 만료되면 갱신하고 재시도
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지 설정

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.error("갱신 토큰값을 찾을 수 없습니다.");
        return Promise.reject(error);
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshToken }), // refresh_token 본문에 포함
          }
        );

        console.log(" 받아온 response  :",response);

        if (response.ok) {
          const data = await response.json();
          


          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("access_token", data.access_token);

          return instance(originalRequest); // 원래 요청 재시도
        } else {
          console.error("Failed to refresh token");
          localStorage.clear();
          window.location.href = "/Intro";

          return Promise.reject(error);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);





