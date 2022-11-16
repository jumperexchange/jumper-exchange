import React from 'react';

function GasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      fill="none"
      viewBox="0 0 25 24"
      {...props}
    >
      <path
        fill="#000"
        d="M20.27 7.23l.01-.01-3.72-3.72-1.06 1.06 2.11 2.11a2.492 2.492 0 00-.878 4.098 2.5 2.5 0 001.768.732c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v16h10v-7.5H16v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12.5 11v8h-6V5h6v6zm6-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-8-4l-4 7.5h2V18l4-7h-2V6z"
      ></path>
    </svg>
  );
}

export default GasIcon;
