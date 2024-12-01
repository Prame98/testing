import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { Layout, Image, CommonButton } from '../components/element';
import { BsCameraFill } from 'react-icons/bs';
import { AiFillMinusCircle } from 'react-icons/ai';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { submitBoard, setEditBoard, getBoardDetail } from '../api/boards';
import { useLocation, useNavigate } from 'react-router-dom';
import { addressSido, formatDate } from '../utils/auth';
import Loading from './statusPage/Loading';


function BoardUpdate() {
  const currentBoardId = useLocation().pathname.slice(13);

  const [title, setTitle] = useState("");
  const [original_price, setPrice] = useState("");
  const [discount_rate, setRate] = useState("");
  const [category, setCategory] = useState(""); // 카테고리 상태 추가
  const [productionDate, setProductionDate] = useState(""); // 식품 생산 날짜 상태 추가
  const [saleEndDate, setSaleEndDate] = useState(""); // 판매 마감 날짜 상태 추가
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
 const queryClient = useQueryClient();


  // * 게시글 상세 조회
  const { data, refetch, isLoading } = useQuery(
    ["boardUpdate", currentBoardId],
    () => getBoardDetail(currentBoardId),
    {
      enabled: !!currentBoardId, // currentBoardId가 존재할 때만 쿼리 실행
      staleTime: Infinity,
      onSuccess: (data) => {
        console.log(" 가져온 데이터:", data);

        setTitle(data.title);
        setPrice(data.original_price);
        setRate(data.discount_rate);
        setContent(data.content);
        setPreview(process.env.REACT_APP_SERVER_URL + data.image);
        setCategory(data.category);
        setProductionDate(formatDate(data.production_date));
        setSaleEndDate(formatDate(data.sale_end_date));
      },
    }
  );


  // * 게시글 수정으로 넘어왔을 경우
   const location = useLocation();
   const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setPrice(data.original_price);
      setRate(data.discount_rate);
      setContent(data.content);
      setPreview(process.env.REACT_APP_SERVER_URL + data.image);
      setCategory(data.category);
      setProductionDate(formatDate(data.production_date));
      setSaleEndDate(formatDate(data.sale_end_date));
    }
  }, [data]);



  

  // * 썸네일 업로드
  const onFileChange = (e) => {
    const newFile = e.target.files[0];
    if (!newFile) return;
    if (newFile.type !== "image/jpeg" && newFile.type !== "image/png") {
      alert("jpg, png 형식의 이미지 파일을 업로드해주세요.");
      return;
    } else {
      const previewURL = window.URL.createObjectURL(newFile);
      setPreview(previewURL);
      setFile(newFile);
    }
  };

  // * 썸네일 삭제
  const onFileDelete = () => {
    const deleteConfirm = window.confirm("업로드한 이미지를 삭제하시겠습니까?");
    if (deleteConfirm) setPreview("");
  };

  // * 제목 입력값 감지
  const onTitleChange = (e) => {
    if (e.target.value.length > 30) {
      alert("제목은 30자 이상 입력할 수 없습니다.");
      return;
    }
    setTitle(e.target.value);
  };

  // * 가격 입력값 감지
  const onPriceChange = (e) => {
    const newPrice = e.target.value.replace(/\D/g, "");
    if (newPrice === "") {
      setPrice("");
    } else {
      setPrice(Number(newPrice).toLocaleString());
    }
  };

  // * 할인율 입력값 감지
  const onRateChange = (e) => {
    const newRate = e.target.value.replace(/\D/g, "");
    if (newRate === "") {
      setRate("");
    } else {
      setRate(Number(newRate));
    }
  };

  // * 카테고리 입력값 감지
  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // * 식품 생산 날짜 입력값 감지
  const onProductionDateChange = (e) => {
    setProductionDate(e.target.value);
  };

  // * 판매 마감 날짜 입력값 감지
  const onSaleEndDateChange = (e) => {
    setSaleEndDate(e.target.value);
  };

  // * 내용 입력값 감지
  const onContentChange = (e) => {
    setContent(e.target.value);
  };

  // * 게시글 작성 버튼 클릭
  const onSubmitClick = (e) => {
    e.preventDefault();
    if (
      title === "" ||
      original_price === "" ||
      discount_rate === "" ||
      category === "" ||
      saleEndDate === "" ||
      content === "" ||
      file === ""
    ) {
      alert("모든 내용을 입력해주세요.");
      return;
    }

    // 데이터 입력 형식
    const boardFormData = new FormData();
    boardFormData.append("title", title);
    boardFormData.append("image", file);
    boardFormData.append("content", content.replaceAll(/\n/g, "<br>"));
    boardFormData.append("original_price", original_price.replaceAll(",", ""));
    boardFormData.append("discount_rate", discount_rate);
    boardFormData.append("category", category);
    boardFormData.append("production_date", productionDate); // 식품 생산 날짜
    boardFormData.append("sale_end_date", saleEndDate);

    // 여기서 FormData의 내용을 일단 확인
    for (var pair of boardFormData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    submitBoardMutaion.mutate(boardFormData);
  };

  // * 게시글 작성 useMutation
  const submitBoardMutaion = useMutation(submitBoard, {
    onSuccess: (response) => {
      console.log("게시글 작성이 완료", response);
      alert("게시글 작성이 완료되었습니다.");
      navigate(`/BoardDetail/${response.id}`);
    },
  });

  // * 게시글 수정 버튼 클릭
  const onEditClick = (e) => {
    e.preventDefault();
    if (
      title === "" ||
      original_price === "" ||
      discount_rate === "" ||
      category === "" ||
      productionDate === "" ||
      saleEndDate === "" ||
      content === ""
    ) {
      alert("모든 내용을 입력해주세요.");
      return;
    }

    // original_price를 문자열로 변환 후 replaceAll 호출
    const sanitizedPrice = original_price.toString().replaceAll(",", "");

    // *
    const boardEditData = {
      boardId: currentBoardId,
      title,
      content: content.replaceAll(/\n/g, "<br>"),
      original_price: sanitizedPrice,
      discount_rate: discount_rate,
      category, // 카테고리 추가
      production_date: productionDate,
      sale_end_date: saleEndDate,
    };

    console.log("게시글 수정1", boardEditData);
    editBoardMutation.mutate(boardEditData);
  };

  // * 게시글 수정 useMutation
  const editBoardMutation = useMutation(setEditBoard, {
    onSuccess: () => {
      // 쿼리 무효화
      queryClient.invalidateQueries(["getBoardDetail", currentBoardId]);
      alert("게시글 수정이 완료되었습니다.");
      navigate(`/BoardDetail/${currentBoardId}`);
    },
  });

  if (isLoading && !data) {
    return <Loading />;
  }

  return (
    <Layout>
      <ContentForm method="post" encType="multipart/form-data">
        <SetImgDiv>
          <label>
            <BsCameraFill />
            { (
              <input type="file" name="image" onChange={onFileChange} />
            )}
          </label>
          {preview !== "" && (
            <>
              <Image
                width={"110px"}
                height={"110px"}
                borderradius={"5px"}
                src={preview}
                alt={"썸네일 이미지"}
              />
              { <StyledMinusCircle onClick={onFileDelete} />}
            </>
          )}
        </SetImgDiv>
        <SetBoardDiv>
          <SetInfo>
            <BoardLabel htmlFor="title">제목</BoardLabel>
            <BoardInput
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onTitleChange}
            />
          </SetInfo>
          <SetInfo>
            <BoardLabel htmlFor="price">가격</BoardLabel>
            <BoardInput
              type="text"
              id="original_price"
              name="original_price"
              value={original_price}
              onChange={onPriceChange}
            />
          </SetInfo>
          <SetInfo>
            <BoardLabel htmlFor="discount_rate">할인율</BoardLabel>
            <BoardInput
              type="text"
              id="discount_rate"
              name="discount_rate"
              value={discount_rate}
              onChange={onRateChange}
            />
          </SetInfo>
          <SetInfo>
            <BoardLabel htmlFor="category">카테고리</BoardLabel>
            <CategorySelect
              id="category"
              name="category"
              value={category}
              onChange={onCategoryChange}
            >
              <option value="">선택하세요</option>
              <option value="bread">빵</option>
              <option value="rice_cake">떡</option>
              <option value="side_dish">반찬</option>
              <option value="grocery">마트</option>
              <option value="etc">기타</option>
            </CategorySelect>
          </SetInfo>
          <SetInfo>
            <BoardLabel htmlFor="title">식품 생산일</BoardLabel>
            <BoardInput
              type="date"
              id="productionDate"
              name="productionDate"
              value={productionDate}
              onChange={onProductionDateChange}
            />
          </SetInfo>
          <SetInfo>
            <BoardLabel htmlFor="title">판매 종료일</BoardLabel>
            <BoardInput
              type="date"
              id="saleEndDate"
              name="saleEndDate"
              value={saleEndDate}
              onChange={onSaleEndDateChange}
            />
          </SetInfo>
          <BoardLabel htmlFor="content" />
          <SetInfo>
            <SetContent
              id="content"
              name="content"
              value={content}
              onChange={onContentChange}
              placeholder={`"${addressSido()}" 에 올릴 게시글 내용을 작성해주세요.`}
            />
          </SetInfo>
        </SetBoardDiv>
        <CommonButton
          size={"large"}
          onClick={!location.state ? onSubmitClick : onEditClick}
        >
          {!location.state ? "글 작성하기" : "글 수정하기"}
        </CommonButton>
      </ContentForm>
    </Layout>
  );
}

export default BoardUpdate;

const ContentForm = styled.form`
  margin-top: 20px;
`

const SetImgDiv = styled.div`
  position: relative;
  padding-bottom: 20px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid lightgrey;
  & label {
    width: 50px;
    height: 50px;
    display: flex;
    padding: 30px;
    font-size: 50px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    cursor: pointer;
  }
  & input {
    display: none;
  }
`

const StyledMinusCircle = styled(AiFillMinusCircle)`
  position: absolute;
  top: -5px;
  left: 220px;
  color: #F74D1B;
  cursor: pointer;
`

const SetBoardDiv = styled.div`
  margin-bottom: 25px;
`

const SetInfo = styled.div`
  padding: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  border-bottom: 1px solid lightgrey;
`

const BoardLabel = styled.label`
  color: grey;
  min-width: 100px;
  text-align: left;
`

const BoardInput = styled.input`
  flex: 1;
  height: 30px;
  padding: 5px 5px;
  border: none;
  font-size: 16px;
  &:focus {
    outline: none;
  }
`

const SetContent = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 10px;
  font-size: 16px;
  border: none;
  resize: none;
  &:focus {
    outline: none;
  }
`

const CategorySelect = styled.select`
  width: 300px;
  height: 30px;
  font-size: 16px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`
