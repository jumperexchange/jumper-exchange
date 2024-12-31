import {
  Avatar as MuiAvatar,
  Avatar,
  Box,
  FormHelperText,
  IconButton,
  InputLabel,
  Skeleton,
  Typography,
  Button,
  alpha,
} from '@mui/material';
import { useConfig } from 'wagmi';
import type { ContractCall } from '@lifi/sdk';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import TokenImage from '@/components/Portfolio/TokenImage';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import { getEthersSigner } from '@/components/WidgetLikeField/utils';

function WidgetLikeWIP({ contractCalls }: { contractCalls: ContractCall[] }) {
  const config = useConfig();
  const { account } = useAccount();

  const [st, setSt] = useState(0);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['signMessage', account.address],
    mutationFn: async () => {
      const signer = await getEthersSigner(config);
      const message = 'toto';

      const s = await signer.signMessage(message);
      await new Promise((resolve) => setTimeout(resolve, 4000));

      return true;
    },
    onSuccess: () => {
      // TODO: to remove
      // eslint-disable-next-line no-console
      console.log('onSuccess triggered');
      setSt(1);
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      // TODO: to remove
      // eslint-disable-next-line no-console
      console.log('submitted', e);
      e.preventDefault();
      mutate();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <InputLabel htmlFor="component-error">Name</InputLabel>
      <FormControl error={isError} variant="standard" aria-autocomplete="none">
        <OutlinedInput
          autoComplete="off"
          id="component-error"
          defaultValue=""
          aria-describedby="component-error-text"
          sx={{ padding: '0.6rem 1rem' }}
          startAdornment={
            <WalletCardBadge
              sx={{ marginRight: '10px' }}
              overlap="circular"
              className="badge"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <MuiAvatar
                  alt={'chain-name'}
                  sx={(theme) => ({
                    width: '18px',
                    height: '18px',
                    border: `2px solid ${theme.palette.surface2.main}`,
                  })}
                >
                  <TokenImage
                    token={{
                      name: '',
                      logoURI:
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
                    }}
                  />
                </MuiAvatar>
              }
            >
              <WalletAvatar>
                <TokenImage
                  token={{
                    name: 'Ethereum',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
                  }}
                />
              </WalletAvatar>
            </WalletCardBadge>
          }
          // startAdornment={<Avatar
          //   src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" />}
          endAdornment={<div>max</div>}
        />
        <FormHelperText
          id="component-error-text"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography>left one</Typography>
          <Typography>/1000</Typography>
        </FormHelperText>
      </FormControl>
      Bye
      {st === 0 && (
        <LoadingButton
          type="submit"
          loading={isPending}
          variant="contained"
          sx={{
            '&.MuiLoadingButton-loading': {
              border: '1px solid red',
            },
            '.MuiLoadingButton-loadingIndicator': {
              color: 'red',
            },
          }}
        >
          <Typography variant="bodyMediumStrong">Approve</Typography>
        </LoadingButton>
      )}
      {st === 1 && (
        <LoadingButton type="submit" variant="contained">
          <Typography variant="bodyMediumStrong">Withdraw</Typography>
        </LoadingButton>
      )}
    </Box>
  );
}

export default WidgetLikeWIP;
