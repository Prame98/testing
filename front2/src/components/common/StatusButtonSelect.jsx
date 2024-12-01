import React from 'react'
import { StatusButton } from '../element'

const StatusButtonSelect = ({status}) => {


let content=null;
 if(status){
    if(status==="판매중"){
        content =<StatusButton color="white" backgroundColor="green">판매중</StatusButton> 

    }else if(status==="예약중"){

        content = <StatusButton color="white" backgroundColor="#dc1414">예약중</StatusButton>
    }else if(status==="거래완료"){

        content =  <StatusButton color="white">거래완료</StatusButton>
    }
 }

 return content;

 
}

export default StatusButtonSelect