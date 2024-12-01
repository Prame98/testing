export function userTypeCheck() {
  const userType = localStorage.getItem("userType");

  // null 또는 undefined 체크
  if (userType === null || userType === undefined) {
    return null; // 또는 기본값을 반환할 수도 있습니다. 예: 'guest'
  }
  return userType;
}

export function getUId() {
  return localStorage.getItem("userId");
}


export function addressSido() {
  const fullAddress = localStorage.getItem("fullAddress");

  if (!fullAddress) {
    return null; // fullAddress가 없을 경우 null을 반환
  }

  // 주소를 띄어쓰기로 나누기
  const addressParts = fullAddress.split(" ");

  // 주소가 3개 이상이면 3개까지 출력
  if (addressParts.length >= 3) {
    return `${addressParts[0]} ${addressParts[1]} ${addressParts[2]}`;
  }
  // 주소가 2개일 경우 시까지만 출력
  else if (addressParts.length === 2) {
    return `${addressParts[0]} ${addressParts[1]}`;
  }
  // 주소가 1개일 경우 시까지만 출력
  else {
    return `${addressParts[0]} 시`;
  }
}

export function addressSi() {
  const fullAddress = localStorage.getItem("fullAddress");

  if (!fullAddress) {
    return null; // fullAddress가 없을 경우 null을 반환
  }

  // 주소를 띄어쓰기로 나누기
  const addressParts = fullAddress.split(" ");
  return `${addressParts[0]}`;
 
}



export function categoryKor(category){
  if(category === "bread") return "빵";
  if(category === "rice_cake") return "떡";
  if(category === "side_dish") return "반찬";
  if(category === "grocery") return "마트";
  if(category === "etc") return "기타";
}


// 날짜 형식 변환 함수
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


