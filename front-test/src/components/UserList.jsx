import React from 'react';
import styled from 'styled-components';

function UserList({ title, users }) {
    return (
        <UserListContainer>
            <h4 style={{color:`${title==="찜 유저목록"? "#1b3dbd" :"#4a9a63"}`}}>{title}</h4>
            <ul>
                {users.map((user) => (
                    <li key={user.userId}>
                        <span>{user.userNick} : </span>
                        <small>({user.userAddress.postcode}) {user.userAddress.fullAddress}</small>
                    </li>
                ))}
            </ul>
        </UserListContainer>
    );
}

export default UserList;

// 스타일 정의
const UserListContainer = styled.div`
    margin-top: 10px;

    h4 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
        color: #444;
    }

    ul {
        margin: 5px 0 0;
        padding: 0;
        list-style: none;
    }

    li {
        display: flex;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #ddd;
        font-size: 14px;

        span {
            font-weight: bold;
            color: #333;
        }

        small {
            color: #555;
            font-size: 12px;
            margin-left: 15px
        }
    }
`;
