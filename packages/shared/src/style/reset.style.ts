import { normalize } from 'polished';

export const resetStyle = `
  ${normalize()};
  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    border-collapse: collapse;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
  }
  :focus {
    outline: none;
  }
  a {
    text-decoration: none;
  }
  p {
    margin: 0;
  }
`;
