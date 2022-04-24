import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      primary: string;
      lightDark: string;
      iconColor: string;
      lightTextColor: string;
      darkTextColor: string;
    };
    font: string;
  }
}
