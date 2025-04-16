'use client';

import { Box, darken, Link, Tooltip, Typography } from '@mui/material';
import React from 'react';
import type { decodeActionsReturnType } from 'royco/market';
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
      sx={[{
        // Matches `flex`
        display: 'flex',
        // Matches `w-full`
        width: '100%',
        // Matches `flex-col`
        flexDirection: 'column',
        // Matches `gap-3`
        gap: 1,
        // Matches `font-light`
        fontWeight: 300,
        // Matches `text-black`
        color: 'black'
      }, size === 'sm' ? {
        fontSize: '0.875rem'
      } : {
        fontSize: size === 'xs' ? '0.75rem' : '1rem'
      }]}
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
              sx={theme => ({
                // Matches `flex`
                display: 'flex',
                // Matches `flex-row`
                flexDirection: 'row',
                // Matches `border`
                border: '1px solid',
                // Matches `border-divider` (uses MUI's theme for the divider color)
                borderColor: theme.palette.text.primary,
                // Matches `rounded-md` (Material-UI's default rounded border radius)
                borderRadius: '4px',
                // Matches `p-1` (4px in the spacing scale)
                padding: '4px'
              })}
            >
              {/*// Below box is the number*/}
              <Box
                sx={theme => ({
                  // Matches `flex`
                  display: 'flex',
                  // Conditional height (5 = 20px, 6 = 24px)
                  height: size === 'sm' || size === 'xs' ? 20 : 24,
                  // Conditional width
                  width: size === 'sm' || size === 'xs' ? 20 : 24,
                  // Matches `shrink-0`
                  flexShrink: 0,
                  // Matches `flex-col`
                  flexDirection: 'column',
                  // Matches `place-content-center`
                  justifyContent: 'center',
                  // Matches `items-center`
                  alignItems: 'center',
                  // Matches `rounded-md`
                  borderRadius: '4px',
                  // Matches `border border-divider`
                  border: `1px solid ${theme.palette.text.primary}`
                })}
                // className={cn(
                //   "flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-md border border-divider",
                //   size === "sm" && "h-5 w-5",
                //   size === "xs" && "h-5 w-5"
                // )}
              >
                <Box
                  sx={[{
                    // Matches `flex`
                    display: 'flex'
                  }, size === 'sm' ? {
                    height: 16
                  } : {
                    height: size === 'xs' ? 12 : 20
                  }]}
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
                    sx={[size === 'xs' ? {
                      lineHeight: '12px'
                    } : {
                      lineHeight: '20px'
                    }]}
                  >
                    {actionIndex + 1}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={[{
                  // Matches `mt-[0.1rem]`
                  marginTop: '0.1rem',
                  // Matches `flex`
                  display: 'flex',
                  // Matches `grow`
                  flexGrow: 1,
                  // Matches `text-wrap`
                  whiteSpace: 'pre-wrap',
                  // Matches `font-light`
                  fontWeight: 300
                }, size === 'xs' ? {
                  marginLeft: '8px'
                } : {
                  marginLeft: '12px'
                }]}
                // className={cn(
                //   "ml-3 mt-[0.1rem] flex grow text-wrap font-light",
                //   size === "xs" && "ml-2"
                // )}
              >
                <Box
                  sx={[{
                    // Matches `break-all`
                    wordBreak: 'break-all'
                  }, size === 'sm' ? {
                    lineHeight: '20px'
                  } : {
                    lineHeight: '20px'
                  }]}
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
                      component="span"
                      sx={(theme) => ({
                        color: theme.palette.primary.main,
                        cursor: 'help',
                        marginX: 0.5,
                      })}
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
