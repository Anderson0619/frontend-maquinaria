import styled from "styled-components";

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AvatarImage = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
  background-size: cover;
  background-position: center center;
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

export const UserInfo = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;
