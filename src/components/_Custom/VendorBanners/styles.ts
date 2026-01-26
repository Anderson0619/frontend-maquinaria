import { Input } from "rsuite";
import styled from "styled-components";

export const ChecksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const CheckItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 5% 0;
`;

export const UploadersContainer = styled.div`
  display: flex;
`;

export const BannersContainer = styled.div`
  font-family: Lato, sans-serif;
  padding: 0.5rem 8px;
  margin-bottom: 1rem;
`;

export const BannersLabel = styled.div`
  padding: 0.5rem 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: #666d92;

  @media only screen and (max-width: 991px) {
    padding: 30px 0;
  }
`;

export const BannersImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BannersSlideContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BannersSlide = styled.div`
  position: relative;
  width: 100%;

  &::before {
    content: "";
    display: ${(props: { islast: any }) => (props.islast ? "none" : "block")};
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgb(66, 66, 66);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(50, 50, 50, 0.7) 23%,
      rgba(255, 255, 255, 0) 97%
    );
    z-index: 10;
  }
`;

export const BannersInputsContainer = styled.div`
  position: absolute;
  top: 22%;
  width: 100%;
  z-index: 20;
  display: flex;
  flex-flow: column;
  padding: 2rem;
`;

export const BannersInput = styled(Input)`
  background: transparent;
  font-size: 1.3rem;
  margin: 1rem 0;
  color: white;
`;

export const SortableImage = styled.div`
  &:hover {
    cursor: grab;
  }

  img {
    width: 8rem;
    height: 8rem;
  }
`;
