import styled from "styled-components";

const ICXGramButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.lightTextColor};
  padding: 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #004fd4;
  }
`;

export default ICXGramButton;
