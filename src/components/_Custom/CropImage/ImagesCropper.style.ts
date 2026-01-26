import styled from "styled-components";

export const CropperWrapper = styled.div`
  .cropper {
    width: 100%;
    position: relative;
  }

  .cropper:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  #uploader-slider {
    position: absolute;
    bottom: 1rem;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 80%;
  }
`;
