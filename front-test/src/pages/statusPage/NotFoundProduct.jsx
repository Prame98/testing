import React from 'react'
import loading from '../../assets/null_dangeun.png'
import { styled } from 'styled-components'

const NotFoundProduct = ({searchTerm}) => {
  return (

        <Wrapper >
            <Img src={loading} alt="데이터가 없습니다" style={{ width: '200px', height: 'auto' }}/>
            <h1>등록된 상품이 없습니다.</h1>
        </Wrapper>
   
  )
}

export default NotFoundProduct;

const Wrapper = styled.section`
    width:100%;
    height:150px
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;  
    text-align:center
`

const Img = styled.img`
    width:200px;
    height:200px;
`
