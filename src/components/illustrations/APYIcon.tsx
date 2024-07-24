import React from 'react';


interface IconProps {
  size?: number;
}


export const APYIcon = ({ size }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"       width={size ?? '32'}
    height={size ?? '32'} fill="none" viewBox="0 0 24 24">
    <path fill="#FFFFFF" fillOpacity="1" fillRule="evenodd" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Zm-3-8.75c0 .375-.375.75-.75.75H7.5v-1.5h-3V15h-.75c-.375 0-.75-.375-.75-.75v-4.5c0-.375.375-.75.75-.75h4.5c.375 0 .75.375.75.75v4.5ZM7.5 10.5V12h-3v-1.5h3Zm2.5-.75c0-.375.375-.75.75-.75h3c1.5 0 2.25 1.125 2.25 2.25s-.75 2.25-2.25 2.25H11.5V15h-.75c-.375 0-.75-.375-.75-.75v-4.5Zm1.5.75h2.25c.563 0 .75.474.75.75s-.188.75-.75.75H11.5v-1.5Zm4.724-.215a.75.75 0 0 1 1.06-1.06l1.724 1.723 1.723-1.724a.75.75 0 0 1 1.06 1.061l-2.041 2.042v1.923a.75.75 0 1 1-1.5 0v-1.94l-2.026-2.025Z" clipRule="evenodd"/>
</svg>
  );
};

