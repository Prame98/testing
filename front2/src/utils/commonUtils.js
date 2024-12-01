

export const formatContentForTextarea = (content) => {
    return content.replace(/<br\s*\/?>/gi, "\n");
 };
  

 // utils/commonUtils.js
export const getImageSrc = (imagePath) => {
    // 이미지 경로가 http로 시작하면 그대로 반환, 그렇지 않으면 서버 URL과 합침
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${process.env.REACT_APP_SERVER_URL}${imagePath}`;
  };
  