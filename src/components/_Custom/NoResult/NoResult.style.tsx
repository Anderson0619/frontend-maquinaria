import styled from "styled-components";

export const NoResultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #161f6a;
    margin: 0 0 15px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    color: #707070;
    margin: 0;
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 70px;
`;

export const Button = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: #009e7f;
  height: 50px;
  border-radius: 3px;
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  text-transform: capitalize;
  padding: 0 30px;
  border: 0;
  transition: all 0.3s ease;
`;
