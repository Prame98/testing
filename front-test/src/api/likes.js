
import { instance } from './axios';


  
//라이크 가져오기
export const getLikeStatus = async (postId, userId) => {
    const response = await instance.get(`/api/likes/${postId}`);
    return response.data.likeStatus; // true 또는 false 반환
};


//찜하기 토글
export const toggleLikeStatus = async (postId, userId) => {
const response = await instance.post(`/api/likes/${postId}`);
return response.data;
};






//사장님 상품 찜한 내역 전체 가져오기
export const ownerProductLikeList = (params) => {
    return instance.get('/api/likes/owner/posts')
    .then((response) => {
         //console.log("장님 상품 찜한 내역 전체 가져오기" ,response.data.data);
        return response.data.data;
    })
    .catch((error) => {
        console.log(error);
    })
};
  