import styled from "styled-components";

const ICXGramSecondaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.iconColor};
  color: ${({ theme }) => theme.colors.lightTextColor};
  padding: 5px 10px;
  border-radius: 40px;
  display: inline-flex;
  align-items: center;
  &:hover {
    background-color: #7a8fa6bf;
  }
`;

export default ICXGramSecondaryButton;
