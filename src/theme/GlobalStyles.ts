import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.lightTextColor};
    font-family: ${({ theme }) => theme.font}
}
button {
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    &:focus {
        outline: none;
    }
}
`;
