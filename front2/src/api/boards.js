import { instance } from "./axios";

// * 게시글 작성
export const submitBoard = (boardFormData) => {
  return instance
    .post(`/api/board/write`, boardFormData, {
      headers: {
        "Content-Type": "multipart/form-data", // FormData를 전송할 때 필요한 Content-Type
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error.response.data);
      alert(error.response.data.responseMessage);
      throw error;
    });
};

// * 게시글 리스트 조회
export const getBoards = (setPage, categoryId = null, searchTerm = "") => {
  const categoryParam = categoryId ? `&categoryId=${categoryId}` : "";
  const searchParam = searchTerm
    ? `&searchTerm=${encodeURIComponent(searchTerm)}`
    : "";
  const url = `/api/board?page=${setPage.page}&size=${setPage.size}&sort=${setPage.sort[0]}${categoryParam}${searchParam}`;

  console.log("게시글 리스트 조회 url : ", url);
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken || accessToken === null) {
    window.location.href = "/";
    return;
  }

  return instance
    .get(url)
    .then((response) => {
      return response.data.data.responseDtos;
    })
    .catch((error) => {
      console.error(error.response.data);
    });
};

// * 게시글 상세 조회
export const getBoardDetail = (currentBoardId) => {
  return instance
    .get(`/api/board/detail/${currentBoardId}`)
    .then((response) => {
      console.log("Board detail data : ", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.error(error.response.data);
    });
};

// * 게시글 수정
export const setEditBoard = async (boardEditData) => {
  const { boardId, ...editData } = boardEditData;
  console.log("게시글 수정77777 :", boardId, editData);
  
  return instance.put(`/api/board/modify/${boardId}`, editData, {
    headers: {
      "Content-Type": "multipart/form-data", // FormData를 전송할 때 필요한 Content-Type
    },
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.error(error.response.data);
    alert(error.response.data.responseMessage);
    throw error;
  });



};

// * 게시글 삭제
export const setDeleteBoard = (currentBoardId) => {
  return (
    instance
      .delete(`/api/board/delete/${currentBoardId}`)
      // TODO 실패 시 http status 코드에 따라 다른 alert msg 띄우기
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error.response.data);
      })
  );
};

// * 게시글 찜하기
export const setLikeStatus = (currentBoardId) => {
  console.log(" 게시글 찜하기");
  return instance
    .post(`/api/like/${currentBoardId}`)
    .then((response) => {
      console.log("* 게시글 찜하기 :", response);
      return response.data.responseMessage;
    })
    .catch((error) => {
      console.error(error.response.data);
    });
};

// * 내 게시글 조회,,   http://localhost:3000/MyPage부분.
export const getMyBoard = () => {
  return instance
    .get("/api/mypage/myBoard")
    .then((response) => {
      // console.log(response)
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      // return error;
    });
};

// 마이페이지 : 찜목록 조회
export const getMylikeBoard = () => {
  return instance
    .get("/api/likes/mine")
    .then((response) => {
      console.log("마이페이지 : 찜목록 조회", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

//예약목록 가져오기
export const getMyReservationsBoard = () => {
  return instance
    .get("/api/reservations/mine")
    .then((response) => {
      console.log("예약목록 가져오기  :", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 마이페이지 : 예약 완료
export const putBoardReservation = (boardId) => {
  return instance
    .put(`/api/board/sell/${boardId}`)
    .then((response) => {
      console.log("예약완료 요청 실행");
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 마이페이지 : 게시글 삭제
export const deleteBoard = (boardId) => {
  return instance
    .delete(`/api/board/${boardId}`)
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};



// * 구매내역에 추가
export const addToPurchaseHistory = (boardId) => {
  return instance
    .post(`/api/purchase/${boardId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error.response.data);
    });
};



// * 상점별 게시물 조회
export const getBoardsByShop = (params) => {
  console.log("상점별 게시물 조회  :searchTerm  :", params);
  // JSON 객체를 URL 쿼리 문자열로 변환
  const queryString = new URLSearchParams(params).toString();
  console.log("상점별 게시물 조회 : searchTerm :", params.searchTerm);

  return instance
    .get(`/api/board/shop?${queryString}`)
    .then((response) => {
      console.log(" response :", response.data.data);
      return response.data.data; // 데이터 구조에 따라 수정 필요
    })
    .catch((error) => {
      console.error("상점별 게시글 조회 에러:", error.response.data);
      throw error;
    });
};
