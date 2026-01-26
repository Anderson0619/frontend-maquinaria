import styled from "styled-components";

export const UploaderContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  cursor: pointer;
  margin-top: 10px;
`;

export const UploaderThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const UploaderThumb = styled.div`
  display: inline-flex;
  border-radius: 2px;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 100px;
  height: 100px;
  padding: 4px;
  box-sizing: border-box;
`;

export const UploaderLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-size: 1.2rem;

  @media only screen and (max-width: 991px) {
    padding: 30px 0;
  } ;
`;
