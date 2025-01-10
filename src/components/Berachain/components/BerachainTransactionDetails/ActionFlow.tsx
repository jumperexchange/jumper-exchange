'use client';

import React from 'react';
import { darken, Link, Tooltip, Typography } from '@mui/material';
import type { decodeActionsReturnType } from 'royco/market';
import { Box } from '@mui/material';
// import { decodeActionsReturnType } from "@/sdk/market";
// import { SlideUpWrapper } from "@/components/animations";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { AlertIndicator } from "@/components/common";
// import { cn } from "@/lib/utils";

const ActionFlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actions: decodeActionsReturnType['actions'];
    size?: 'xs' | 'sm' | 'md' | 'lg';
    showAlertIcon?: boolean;
  }
>(({ className, size, actions, showAlertIcon = true, ...props }, ref) => {
  return (
    <Box
      sx={{
        display: 'flex', // Matches `flex`
        width: '100%', // Matches `w-full`
        flexDirection: 'column', // Matches `flex-col`
        gap: 1, // Matches `gap-3`
        // fontFamily: 'GT', // Matches `font-gt` (adjust for actual font family)
        fontSize:
          size === 'sm' ? '0.875rem' : size === 'xs' ? '0.75rem' : '1rem', // Conditional font size
        fontWeight: 300, // Matches `font-light`
        color: 'black', // Matches `text-black`
      }}
      // className={className} // Include additional custom classes
      ref={ref}
      // className={cn(
      //   "flex w-full flex-col gap-3 font-gt text-base font-light text-black",
      //   size === "sm" && "text-sm",
      //   size === "xs" && "text-xs",
      //   className
      // )}
      {...props}
    >
      {actions !== null && actions.length !== 0 ? (
        actions.map((action, actionIndex) => {
          const BASE_KEY = `action-flow:${action.id}:${actionIndex}`;

          return (
            <Box
              key={BASE_KEY}
              sx={{
                display: 'flex', // Matches `flex`
                flexDirection: 'row', // Matches `flex-row`
                border: '1px solid', // Matches `border`
                borderColor: (theme) => theme.palette.text.primary, // Matches `border-divider` (uses MUI's theme for the divider color)
                borderRadius: '4px', // Matches `rounded-md` (Material-UI's default rounded border radius)
                padding: '4px', // Matches `p-1` (4px in the spacing scale)
              }}
            >
              {/*// Below box is the number*/}
              <Box
                sx={{
                  display: 'flex', // Matches `flex`
                  height: size === 'sm' || size === 'xs' ? 20 : 24, // Conditional height (5 = 20px, 6 = 24px)
                  width: size === 'sm' || size === 'xs' ? 20 : 24, // Conditional width
                  flexShrink: 0, // Matches `shrink-0`
                  flexDirection: 'column', // Matches `flex-col`
                  justifyContent: 'center', // Matches `place-content-center`
                  alignItems: 'center', // Matches `items-center`
                  borderRadius: '4px', // Matches `rounded-md`
                  border: (theme) => `1px solid ${theme.palette.text.primary}`, // Matches `border border-divider`
                }}
                // className={cn(
                //   "flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-md border border-divider",
                //   size === "sm" && "h-5 w-5",
                //   size === "xs" && "h-5 w-5"
                // )}
              >
                <Box
                  sx={{
                    display: 'flex', // Matches `flex`
                    height: size === 'sm' ? 16 : size === 'xs' ? 12 : 20, // Dynamic height (h-4 = 16px, h-3 = 12px, h-5 = 20px)
                  }}
                  // className={cn(
                  //   "flex h-5",
                  //   size === "sm" && "h-4",
                  //   size === "xs" && "h-3"
                  // )}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                    sx={{
                      lineHeight: size === 'xs' ? '12px' : '20px', // Dynamic line height: leading-3 = 12px, leading-5 = 20px
                    }}
                  >
                    {actionIndex + 1}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  marginLeft: size === 'xs' ? '8px' : '12px', // Dynamic margin-left: `ml-2` = 8px, `ml-3` = 12px
                  marginTop: '0.1rem', // Matches `mt-[0.1rem]`
                  display: 'flex', // Matches `flex`
                  flexGrow: 1, // Matches `grow`
                  whiteSpace: 'pre-wrap', // Matches `text-wrap`
                  fontWeight: 300, // Matches `font-light`
                }}
                // className={cn(
                //   "ml-3 mt-[0.1rem] flex grow text-wrap font-light",
                //   size === "xs" && "ml-2"
                // )}
              >
                <Box
                  sx={{
                    wordBreak: 'break-all', // Matches `break-all`
                    lineHeight: size === 'sm' ? '20px' : '20px', // `leading-5` translates to `20px` in both cases
                  }}
                  // className={cn(
                  //   "break-all leading-5",
                  //   size === "sm" && "leading-5"
                  // )}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                  >
                    Call to
                  </Typography>
                  <Tooltip
                    title={action.function_signature}
                    placement="top"
                    enterTouchDelay={0}
                    arrow
                  >
                    <Typography
                      variant="body2"
                      color="primary.main"
                      component="span"
                      sx={{ cursor: 'help', marginX: 0.5 }}
                    >
                      {action.function_name
                        ? action.function_name
                        : action.contract_function}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant="body2"
                    component="span"
                    color="textSecondary"
                  >
                    function on:
                  </Typography>
                  <Tooltip
                    title={
                      action.contract_address.slice(0, 6) +
                      '...' +
                      action.contract_address.slice(-4)
                    }
                    sx={{ cursor: 'help' }}
                    placement="top"
                    enterTouchDelay={0}
                    arrow
                  >
                    <Link
                      sx={(theme) => ({
                        marginLeft: 0.5,
                        display: 'inline-block', // Matches `inline-block`
                        textAlign: 'left', // Matches `text-left`
                        textDecoration: 'underline', // Matches `underline`
                        textDecorationColor: 'secondary.main', // Matches `decoration-secondary`
                        textDecorationStyle: 'dotted', // Matches `decoration-dotted`
                        textDecorationThickness: '2px', // Matches the visual appearance of decoration thickness
                        textUnderlineOffset: '3px', // Matches `underline-offset-[3px]`
                        transition: 'color 200ms ease-in-out', // Matches `transition-colors duration-200 ease-in-out`
                        '&:hover': {
                          textDecorationColor: 'tertiary.main', // Matches `hover:decoration-tertiary`
                          color: darken(theme.palette.primary.main, 0.16),
                        },
                      })}
                      href={action.explorer_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      // className="inline-block text-left text-black underline decoration-secondary decoration-dotted underline-offset-[3px] transition-colors duration-200 ease-in-out hover:text-secondary hover:decoration-tertiary"
                    >
                      {action.contract_name ? action.contract_name : 'Unknown'}
                    </Link>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography variant="body2" color="textSecondary">
          No actions added
        </Typography>
      )}
    </Box>
  );
});

export default ActionFlow;
