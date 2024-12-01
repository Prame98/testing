import React from 'react'
import loading from '../../assets/null_dangeun.png'
import { styled } from 'styled-components'

const NotFound = ({searchTerm}) => {
  return (

        <Wrapper>
            <Img src={loading} alt="데이터가 없습니다" style={{ width: '200px', height: 'auto' }}/>
            <h1>{searchTerm} 상점이 없습니다.</h1>
        </Wrapper>
   
  )
}

export default NotFound;

const Wrapper = styled.section`
    width:100%;
    height:calc(100vh - 117px);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;   
`

const Img = styled.img`
    width:200px;
    height:200px;
`
