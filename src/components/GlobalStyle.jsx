import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: "Noto Sans TC";
  }

   a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
