import React from "react";
import styled from "styled-components";

interface IStyledNote {
  yPosition: number;
}

const StyledNote = styled.div<IStyledNote>`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: black;
  position: absolute;
  top: ${({ yPosition }) => `${yPosition}px` || "0px"};
  left: 50%;
  transform: translateX(-50%);
  margin: 1px;
`;

interface IProps extends Partial<IStyledNote> {}

export const Note = (props: IProps) => {
  const { yPosition = 0 } = props;
  return <StyledNote yPosition={yPosition} />;
};
