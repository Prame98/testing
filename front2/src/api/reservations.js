import { instance } from "./axios";

// 예약 내역 조회
export const getReservationStatus = async (postId, userId) => {
  const response = await instance.get(`/api/reservations/${postId}`);
  return response.data.reservationStatus; // true 또는 false 반환
};



//예약 내역 토글
export const toggleReservationStatus = async (postId, userId) => {
  const response = await instance.post(`/api/reservations/${postId}`);
  return response.data;
};



// 예약 내역 조회
export const getReservations = async () => {
  return instance
    .get("/api/reservations")
    .then((response) => {
      return response.data.data.map((reservation) => ({
        id: reservation.id,
        boardId: reservation.boardId,
        productName: reservation.productName,
        customerName: reservation.customerName,
        price: reservation.price,
        image: reservation.image,
        status: reservation.status,
      }));
    })
    .catch((error) => {
      console.error("예약 내역 조회 실패:", error.response.data);
      throw error;
    });
};



//사장님 상품 예약한 내역 전체 가져오기
export const ownerProductReservationList = (params) => {
  console.log("사장님 상품 예약한 내역 전체 가져오기", params);
  return instance
    .get("/api/reservations/owner/posts")
    .then((response) => {
      console.log("사장님 상품 예약한 내역 전체 가져오기", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
