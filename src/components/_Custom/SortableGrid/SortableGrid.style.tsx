import styled from "styled-components";

export const SortableGridContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 0 !important;
  .sortableHelper {
    z-index: 10;

    &:focus {
      cursor: grabbing;
    }
    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;

export const SortableContainerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Element = styled.div`
  margin-top: 0.5rem;
  position: relative;

  &:hover {
    cursor: grab;
  }
  &:focus-within {
    cursor: grabbing;
  }
`;

export const Handle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
`;

export const DeleteItemContainer = styled.div`
  height: 2rem;
  width: 2rem;
  position: absolute;
  top: 4.2rem;
  left: 4.2rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;

  &:hover {
    cursor: pointer;

    i {
      transition: 0.5seg;
      transform: scale(1.2);
    }
  }
`;
