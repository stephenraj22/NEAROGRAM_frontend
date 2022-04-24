import styled, { DefaultTheme } from "styled-components";
import SVG from "react-inlinesvg";

interface SVGProps {
  selected: boolean;
  theme: DefaultTheme;
}
const SVGIcon = styled(SVG)<SVGProps>`
  & path {
    fill: ${({ selected, theme }) =>
      selected ? theme.colors.primary : theme.colors.darkTextColor};
  }
`;

export default SVGIcon;
