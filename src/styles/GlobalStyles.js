import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #f1f5f9;
    color: #222;
  }
  button, input, textarea {
    font-family: inherit;
    font-size: 1rem;
    margin: 8px 0;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
  button {
    background: #f59e42;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background .2s;
  }
  button:hover {
    background: #d97706;
  }
`;

export default GlobalStyles;
