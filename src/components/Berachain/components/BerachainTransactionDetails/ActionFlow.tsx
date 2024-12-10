'use client';

import React from 'react';
import { Link, Tooltip, Typography } from '@mui/material';
import { decodeActionsReturnType } from 'royco/market';
// import { decodeActionsReturnType } from "@/sdk/market";
// import { SlideUpWrapper } from "@/components/animations";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { AlertIndicator } from "@/components/common";
// import { cn } from "@/lib/utils";

export const ActionFlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  actions: decodeActionsReturnType['actions'];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showAlertIcon?: boolean;
}
>(({ className, size, actions, showAlertIcon = true, ...props }, ref) => {
  return (
    <div
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
            <div
              // className={cn(
              //   "flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-md border border-divider",
              //   size === "sm" && "h-5 w-5",
              //   size === "xs" && "h-5 w-5"
              // )}
            >
              <div
                // className={cn(
                //   "flex h-5",
                //   size === "sm" && "h-4",
                //   size === "xs" && "h-3"
                // )}
              >
                  <span
                    // className={cn(
                    //   "leading-5",
                    //   size === "sm" && "leading-5",
                    //   size === "xs" && "leading-3"
                    // )}
                  >
                    {actionIndex + 1}
                  </span>
              </div>
            </div>

          <div
            // className={cn(
            //   "ml-3 mt-[0.1rem] flex grow text-wrap font-light",
            //   size === "xs" && "ml-2"
            // )}
          >
                <span
                  // className={cn(
                  //   "break-all leading-5",
                  //   size === "sm" && "leading-5"
                  // )}
                >
                  Call to
                  <Tooltip
                    title={action.function_signature}
                    sx={{ cursor: 'help' }}
                    placement="top"
                    enterTouchDelay={0}
                    arrow
                  >
                    {action.function_name
                      ? action.function_name
                      : action.contract_function}
                  </Tooltip>
                  function on:{' '}
                  <Tooltip
                    title={action.contract_address.slice(0, 6) +
                      '...' +
                      action.contract_address.slice(-4)}
                    sx={{ cursor: 'help' }}
                    placement="top"
                    enterTouchDelay={0}
                    arrow>
                      <Link
                        href={action.explorer_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block text-left text-black underline decoration-secondary decoration-dotted underline-offset-[3px] transition-colors duration-200 ease-in-out hover:text-secondary hover:decoration-tertiary"
                      >
                        {action.contract_name
                          ? action.contract_name
                          : 'Unknown'}
                      </Link>
                  </Tooltip>
                </span>
          </div>;
        )
          ;
        })
      ) : (
        <Typography>
          No actions added
        </Typography>
      )}
    </div>
  );
});

export default ActionFlow;
