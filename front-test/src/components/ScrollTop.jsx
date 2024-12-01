// React와 필요한 훅들을 임포트합니다.
import React, { useCallback, useEffect, useState } from "react";
// 스크롤 폴리필 라이브러리를 임포트합니다.
import { elementScrollIntoView } from "seamless-scroll-polyfill";

// ScrollTop 컴포넌트를 정의합니다.
const ScrollTop = () => {
  // showButton 상태를 정의하고 초기값을 false로 설정합니다.
  const [showButton, setShowButton] = useState(false);
  // scrollToTop 함수를 정의합니다. 이 함수는 페이지 최상단으로 스크롤하는 역할을 합니다.
  const scrollToTop = useCallback(() => {
    elementScrollIntoView(document.getElementById("root"), {
      behavior: "smooth",
    });
  }, []);

  // useEffect 훅을 사용하여 스크롤 이벤트 리스너를 추가합니다.
  useEffect(() => {
    const handleShowButton = () => {
      // 스크롤 위치가 500보다 크면 버튼을 보이게 하고, 그렇지 않으면 숨깁니다.
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    // 스크롤 이벤트 리스너를 추가합니다.
    window.addEventListener("scroll", handleShowButton);

    // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  });

  // showButton 상태에 따라 버튼을 렌더링합니다.
  return (
    showButton && (
      <>
        {/* 버튼을 클릭하면 scrollToTop 함수가 실행됩니다. */}
        <button type="button" id="topBtn" onClick={scrollToTop}>
          TOP
        </button>
      </>
    )
  );
};

// ScrollTop 컴포넌트를 export 합니다.
export default ScrollTop;
