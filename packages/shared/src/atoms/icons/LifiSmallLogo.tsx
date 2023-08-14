type Color = string;
type Style = React.CSSProperties;

interface LifiSmallLogoProps {
  color?: Color;
  style?: Style;
}

export function LifiSmallLogo({ color, style }: LifiSmallLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      style={{ ...style }}
      viewBox="0 0 24 24"
    >
      <path
        fill={color || '#000'}
        fillRule="evenodd"
        d="M8.86 8.616 7.35 5.522c-.14-.3 0-.616.334-.686L18.37 2.269c.333-.088.596.14.596.475v3.973a.506.506 0 0 1-.368.475l-8.51 2.04c-.455.105-.841.58-.841 1.054l-.018 3.411c0 .352-.28.721-.631.791L6 15.086c-.544.123-1-.228-1-.791v-3.323c0-.352.28-.703.632-.791l2.79-.65c.438-.089.63-.51.438-.915Zm-3.474 8.176 5.772-1.337c.509-.123.737-.597.509-1.072l-1.334-2.76c-.21-.44 0-.897.474-1.003l7.597-1.81c.333-.088.596.14.596.474v3.675c0 .387-.316.773-.684.861l-5.263 1.266c-.51.106-.737.598-.51 1.073L14 19.165c.14.3 0 .616-.333.686l-8.053 1.864c-.333.07-.597-.141-.597-.475v-3.974c0-.21.158-.421.369-.474Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
