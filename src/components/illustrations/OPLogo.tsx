import { useColorScheme, useTheme } from '@mui/material';

export const OPLogo = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="25"
          fill={
            mode === 'light'
              ? 'white'
              : theme.palette.surface1.main
          }
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.591 31.867C16.275 32.0823 17.016 32.19 17.814 32.19C19.6507 32.19 21.1137 31.7657 22.203 30.917C23.2923 30.0557 24.0523 28.7573 24.483 27.022C24.6097 26.4773 24.73 25.9327 24.844 25.388C24.9707 24.8433 25.0783 24.2923 25.167 23.735C25.319 22.8737 25.2937 22.12 25.091 21.474C24.901 20.828 24.5653 20.2833 24.084 19.84C23.6153 19.3967 23.039 19.0673 22.355 18.852C21.6837 18.624 20.949 18.51 20.151 18.51C18.3017 18.51 16.8323 18.9533 15.743 19.84C14.6537 20.7267 13.9 22.025 13.482 23.735C13.3553 24.2923 13.2287 24.8433 13.102 25.388C12.988 25.9327 12.8803 26.4773 12.779 27.022C12.6397 27.8833 12.665 28.637 12.855 29.283C13.0577 29.929 13.3933 30.4673 13.862 30.898C14.3307 31.3287 14.907 31.6517 15.591 31.867ZM19.866 28.846C19.3467 29.2513 18.745 29.454 18.061 29.454C17.3643 29.454 16.864 29.2513 16.56 28.846C16.256 28.4407 16.18 27.7947 16.332 26.908C16.4333 26.3507 16.5347 25.825 16.636 25.331C16.75 24.837 16.8767 24.324 17.016 23.792C17.2313 22.9053 17.5923 22.2593 18.099 21.854C18.6183 21.4487 19.22 21.246 19.904 21.246C20.588 21.246 21.0883 21.4487 21.405 21.854C21.7217 22.2593 21.7977 22.9053 21.633 23.792C21.5443 24.324 21.443 24.837 21.329 25.331C21.2277 25.825 21.1073 26.3507 20.968 26.908C20.7527 27.7947 20.3853 28.4407 19.866 28.846ZM25.6404 31.867C25.7164 31.9557 25.8177 32 25.9444 32H28.5284C28.6677 32 28.788 31.9557 28.8894 31.867C29.0034 31.7783 29.073 31.6643 29.0984 31.525L29.9724 27.364H32.5374C34.1714 27.364 35.4697 27.0157 36.4324 26.319C37.4077 25.6223 38.0537 24.5457 38.3704 23.089C38.5224 22.3543 38.516 21.7147 38.3514 21.17C38.1867 20.6127 37.8954 20.1503 37.4774 19.783C37.0594 19.4157 36.5337 19.1433 35.9004 18.966C35.2797 18.7887 34.583 18.7 33.8104 18.7H28.7564C28.6297 18.7 28.5094 18.7443 28.3954 18.833C28.2814 18.9217 28.2117 19.0357 28.1864 19.175L25.5644 31.525C25.539 31.6643 25.5644 31.7783 25.6404 31.867ZM32.6514 24.742H30.4664L31.2074 21.341H33.4874C33.9434 21.341 34.279 21.417 34.4944 21.569C34.7224 21.721 34.8554 21.9237 34.8934 22.177C34.9314 22.4303 34.9187 22.7217 34.8554 23.051C34.7287 23.621 34.4564 24.0453 34.0384 24.324C33.633 24.6027 33.1707 24.742 32.6514 24.742Z"
          fill={mode === 'light' ? 'black' : 'white'}
        />
      </svg>
    </>
  );
};
