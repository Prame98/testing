import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Image, Layout, StatusButton } from '../components/element';
import { getAllUsers,  myShopList } from '../api/usersMongo'; // 수정된 부분
import NotFoundProduct from './statusPage/NotFoundProduct';
import { categoryKor, formatDate } from '../utils/auth';
import { useAlert } from '../components/common/AlertContext';
import StatusButtonSelect from '../components/common/StatusButtonSelect';
import { getImageSrc } from '../utils/commonUtils';
const {  naver } = window;

function LocationSetting() {
    const navigate = useNavigate();
    const [mapState, setMapState] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [shopInfo, setShopInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        const Container = document.getElementById('map');
        let userAddressX = localStorage.getItem('userAddressX');
        let userAddressY = localStorage.getItem('userAddressY');

        const options = {
            center: new naver.maps.LatLng(userAddressY, userAddressX),
            zoom: 10,
        };

    if (Container && naver.maps) {
        const map = new naver.maps.Map(Container, options);
        setMapState(map);

        // 커스텀 중심 마커 추가
        const centerMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(userAddressY, userAddressX),
            map: map,
        });

        setMarkers([centerMarker]); // 마커 상태에 저장 (필요 시 추가 작업 가능)

        
        const searchTerm="";
        // 사용자 데이터 기반 마커 생성
        getAllUsers(searchTerm)
            .then((users) => {
                console.log("가져온 사용자 데이터:", users);
                const newMarkers = users
                    .filter(user => user) // 유효한 좌표만
                    .map((user) => {
                        const address=JSON.parse(user.address);
                        //console.log("가게 데이터:", address.x, address.y);
                        let userAddressX = localStorage.getItem('userAddressX');
                        let userAddressY = localStorage.getItem('userAddressY');
                       
                        let markerIcon='🏬';
                        let bgColor='#FF5A5F';
                        if(userAddressX===address.x&&userAddressY===address.y){
                            //나의 상점
                            markerIcon='🏠';
                            bgColor='#4a9a63';
                        }
                        const markerOptions = {
                            position: new naver.maps.LatLng(address.y, address.x),
                            map: map,
                            icon: {
                                content: `
                                <div class="marker" style="text-align: center; position: relative;">
                                    <div style="
                                        width: 40px;
                                        height: 40px;
                                        background-color: ${bgColor};
                                        border: 3px solid #FFF;
                                        border-radius: 50%;
                                        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin: 0 auto;
                                    ">
                                        <span style="
                                            font-size: 20px;
                                            font-weight: bold;
                                            color: #FFF;
                                        ">${markerIcon}</span>
                                    </div>
                                    <div style="
                                        margin-top: 8px;
                                        font-size: 14px;
                                        font-weight: bold;
                                        color: #333;
                                        background: rgba(255, 255, 255, 0.9);
                                        padding: 6px 10px;
                                        border-radius: 5px;
                                        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
                                        max-width: 200px;
                                        word-wrap: break-word;
                                    ">
                                        <div style="margin-bottom: 4px;">${user.nick}</div>
                                        <div style="font-size: 12px; color: #666;">${address.fullAddress}</div>
                                    </div>
                                </div>
                            `,
                                anchor: new naver.maps.Point(12, 12),
                            },
                        };
                        const marker = new naver.maps.Marker(markerOptions);
                        marker.user = user; // 사용자 데이터를 마커에 저장

                        naver.maps.Event.addListener(marker, 'click', () => {
                            handleMarkerClick(user);
                            //getProductsByShop(user.nick).then(setProducts);
                        });
                      
                        return marker;


                    });
                setMarkers(newMarkers);
            })
            .catch((error) => console.error("가게 정보 로드 중 오류:", error));
    }
}, []);




const handleMarkerClick= async(user)=>{
    console.log("등록된 상점 목록 가져오기 :",user);
    await myShopList(user.id).then((board) => {
        console.log("board  :",board);
        setShopInfo(user);
        setProducts(board);
    });
}





    // handleSearch 함수 수정
    const handleSearch = () => {
        
        // 검색어에 해당하는 마커를 찾음
        const foundMarker = markers.find((marker) => {
            const markerNick = marker.user?.nick; // 마커에 저장된 사용자 정보에서 닉네임 가져오기
            console.log("검색 중: ", searchTerm, markerNick);
            return markerNick && markerNick.includes(searchTerm); // 검색어 포함 여부 확인
        });
    
        if (foundMarker) {
            // 지도 중심을 해당 마커의 위치로 이동
            const position = foundMarker.getPosition();
            mapState.setCenter(position);
    
            // 지도 확대 수준을 설정 (기본 값보다 더 확대)
            mapState.setZoom(15); // 15단계로 확대 (변경 가능)
    
            // 클릭 이벤트 트리거
            naver.maps.Event.trigger(foundMarker, 'click');
    
            console.log("지도 중심 이동 및 확대 완료:", position);
        } else {
        
            showAlert({ message: "해당 상점을 찾을 수 없습니다." });
        }
    };
    


    // handleCurrentLocation 함수 추가
    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLat = position.coords.latitude; // 위도
                    const currentLng = position.coords.longitude; // 경도
    
                    console.log("현재 위치 :", currentLat, currentLng);
    
                    if (!mapState) {
                        console.error("지도 상태가 초기화되지 않았습니다.");
                        return;
                    }
    
                    // 새로운 중심 좌표 생성
                    const newCenter = new naver.maps.LatLng(currentLat, currentLng);
    
                    // 지도 중심 좌표 설정
                    mapState.setCenter(newCenter);
                    console.log("지도 중심 이동 완료:", newCenter);
    
                    // 현재 위치 마커 추가
                    const currentLocationMarker = new naver.maps.Marker({
                        position: newCenter,
                        map: mapState,
                        icon: {
                            content: `
                                <div class="marker" style="text-align: center; position: relative;">
                                    <div style="
                                        width: 40px;
                                        height: 40px;
                                        background-color: #4285F4;
                                        border: 3px solid #FFF;
                                        border-radius: 50%;
                                        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin: 0 auto;
                                    ">
                                        <span style="
                                            font-size: 20px;
                                            font-weight: bold;
                                            color: #FFF;
                                        ">📍</span>
                                    </div>
                                    <div style="
                                        margin-top: 8px;
                                        font-size: 14px;
                                        font-weight: bold;
                                        color: #333;
                                        background: rgba(255, 255, 255, 0.9);
                                        padding: 6px 10px;
                                        border-radius: 5px;
                                        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
                                        max-width: 200px;
                                        word-wrap: break-word;
                                    ">
                                        <div style="margin-bottom: 4px;">현재 위치</div>                                  
                                    </div>
                                </div>
                            `,
                            anchor: new naver.maps.Point(20, 20),
                        },
                    });
    
                    // 마커 상태 업데이트
                    setMarkers((prevMarkers) => [...prevMarkers, currentLocationMarker]);
                },
                (error) => {
                    console.error("현재 위치를 가져오는 중 오류 발생:", error);
                    showAlert({ message: "현재 위치를 가져오는 데 실패했습니다." });
                }
            );
        } else {
           showAlert({ message: "현재 위치 정보를 사용할 수 없습니다." });
        }
    };
    

    const handleZoomIn = () => {
        if (mapState) {
            const currentZoom = mapState.getZoom();
            mapState.setZoom(currentZoom + 1); // 확대
        }
    };

    const handleZoomOut = () => {
        if (mapState) {
            const currentZoom = mapState.getZoom();
            mapState.setZoom(currentZoom - 1); // 축소
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(); // Enter 키가 눌리면 검색 함수 호출
        }
    };

    return (
        <Layout>
            <SearchBar>
                <input
                    type="search"
                    placeholder="상점명 입력"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyDown} 
                />
                <button type='button' onClick={handleSearch}>검색</button>
                <button type='button'   onClick={handleCurrentLocation}>현재 위치</button>
            </SearchBar>
            <h1 style={{ fontSize: "25px" }}>동네 지도</h1>
            <MapArea>
                 <ZoomControls>
                    <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
                    <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
                </ZoomControls>
                <div id='map' style={{ width: "100%", height: "500px" }}></div>
            </MapArea>

            {shopInfo && (
                <ShopInfo>
                    <h2>상점 정보</h2>
                    <p><strong>상점명:</strong> {shopInfo.nick}</p>
                    <p><strong>영업 시간:</strong> {shopInfo.time}</p>
                    <h3 style={{ paddingTop: "20px",  borderTop: "3px solid #ccc",textAlign:"center"}}>상품 목록</h3>
                    {products.length === 0 && (
                          <NotFoundProduct />
                    )}
                    <ul>
                        {products.map((product, index) => (
                            <li key={product.id} 
                            style={{
                                cursor: "pointer",
                                backgroundColor: index % 2 === 1 ? "#f0f0f0" : "transparent", // 짝수 인덱스인 경우 회색 배경
                                padding: "10px", // 여백 추가
                                borderRadius: "10px", // 둥근 모서리
                                transition: "background-color 0.3s", // 부드러운 전환 효과
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#d9d9d9"; // 마우스 오버 시 진한 회색
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = index % 2 === 1 ? "#f0f0f0" : "transparent"; // 원래 배경색으로 복구
                              }}
                                onClick={()=>navigate("/BoardDetail/" + product.id)}
                            >
                                  <Image
                                    width="130px"
                                    height="130px"
                                    borderradius="10px"
                                    src={getImageSrc(product.image)} // 백엔드에서 읽어오는 이미지 경로
                                    alt="상품 이미지"
                                />
                                <p><strong>상품명: </strong> {product.title}</p>
                                <p><strong>가격: </strong> {Math.floor(Number(product.price)).toLocaleString()}원 
                                    <small style={{fontSize:"12px"}}>(⬇️{product.discount_rate}% )</small>
                                </p>

                                <p><strong>카테고리:</strong> {categoryKor(product.category)}</p>
                                <p><strong>판매자: </strong> {shopInfo.nick}</p>
                                <p><strong>생산일: </strong> {formatDate(product.production_date)}</p>
                                <p><strong>판매 종료일: </strong> {formatDate(product.sale_end_date)}</p>
                                
                                <p><strong>판매상태: </strong>  
                                
                                {product.status &&<StatusButtonSelect status={product.status}  />} 


                                </p>
                            </li>
                        ))}
                    </ul>
                </ShopInfo>
            )}
        </Layout>
    );
}
export default LocationSetting;


// 스타일 정의
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 8px;
  width: 100%;
  max-width: 500px;

  input {
    width: 60%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    &:focus {
      border-color: #5ca771;
      box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.2);
    }
    &::placeholder {
      color: #aaa;
      font-size: 14px;
    }
  }

  button {
    padding: 10px 15px;
    margin-left: 10px;
    border: none;
    background-color: #5ca771;
    color: #fff;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #4a9a63;
    }
  }
`;

const MapArea = styled.section`
    width: 100%;
    height: 500px;
    margin-top: 20px;
`;

const ShopInfo = styled.div`
    margin: 20px auto;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    h2, h3 {
        margin-top: 0;
    }

    ul {
        list-style-type: none;
        padding-left: 0;
    }

    li {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 164px;
  right: 10px;
  display: inline;
  text-align: center;
  z-index: 10;

  
`;

const ZoomButton = styled.button`
 background-color: rgba(100, 100, 100, 0.9);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #4a9a63;
  }
 margin:0 5px;
`;

