'use client';

import React, { Fragment } from 'react';

/**
 * @description Imports for styling
 */
// import { cn } from "@/lib/utils";
import { Box } from '@mui/material';

/**
 * @description Info Card Container
 */
const InfoCardContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex', // Matches `flex`
        flexDirection: 'column', // Matches `flex-col`
        height: 'fit-content', // Matches `h-fit`
        width: '100%', // Matches `w-full`
        gap: 3, // Matches `gap-3` (spacing scale, 3 is equivalent to 24px)
        borderRadius: '12px', // Matches `rounded-xl` (extra-large rounding)
        border: '1px solid', // Matches `border`
        borderColor: (theme) => theme.palette.divider, // Matches `border-divider`
        backgroundColor: 'white', // Matches `bg-white`
        padding: '20px', // Matches `p-5` (20px in the spacing scale)
      }}
      // className={cn(
      /*"flex h-fit w-full flex-col gap-3 rounded-xl border border-divider bg-white p-5",*/
      // className
      // )}
    >
      {props.children}
    </Box>
  );
});
InfoCardContainer.displayName = 'InfoCardContainer';

const InfoCardRowKey = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      color: (theme) => theme.palette.text.secondary,
    }}
    // className={cn("text-secondary", className)}
    {...props}
  />
));

const InfoCardRowValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    sx={{
      display: 'flex', // Matches `flex`
      flexDirection: 'row', // Matches `flex-row`
      alignItems: 'center', // Matches `items-center`
      gap: '6px', // Matches `gap-[0.375rem]`, equivalent to 6px (0.375rem * 16px)
      color: 'black', // Matches `text-black`
    }}
    ref={ref}
    // className={cn(
    /*"flex flex-row items-center gap-[0.375rem] text-black",*/
    // className
    // )}
    {...props}
  />
));

type InfoCardRowComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Key: typeof InfoCardRowKey;
  Value: typeof InfoCardRowValue;
};

/**
 * @description Info Card Row
 */
const InfoCardRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    sx={{
      display: 'flex', // Matches `flex`
      flexDirection: 'row', // Matches `flex-row`
      alignItems: 'center', // Matches `items-center`
      justifyContent: 'space-between', // Matches `justify-between`
      fontSize: '16px', // Matches `text-base`, which corresponds to 16px by default
      fontWeight: 300, // Matches `font-light` (300 is the typical light weight)
    }}
    ref={ref}
    // className={cn(
    /*"flex flex-row items-center justify-between font-gt text-base font-light",*/
    // className
    // )}
    {...props}
  />
)) as InfoCardRowComponent;
InfoCardRow.displayName = 'InfoCardRow';

/**
 * @description Info Card Row Component API
 */
InfoCardRow.Key = InfoCardRowKey;
InfoCardRow.Value = InfoCardRowValue;

/**
 * @description Info Card Type
 */
type InfoCardComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Container: typeof InfoCardContainer;
  Row: typeof InfoCardRow;
};

/**
 * @description Info Card
 */
const InfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // className={cn('', className)}
    {...props}
  />
)) as InfoCardComponent;
InfoCard.displayName = 'InfoCard';

/**
 * @description Info Card Component API
 */
InfoCard.Container = InfoCardContainer;
InfoCard.Row = InfoCardRow;

export { InfoCard };
export type { InfoCardComponent };
