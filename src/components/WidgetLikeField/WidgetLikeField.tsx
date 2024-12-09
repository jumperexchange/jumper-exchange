import { Avatar as MuiAvatar, Box, Button, FormHelperText, InputLabel, Typography, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { WalletAvatar, WalletCardBadge } from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';
import LoadingButton from '@mui/lab/LoadingButton';
import { useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEthersSigner } from '@/components/WidgetLikeField/utils';
import { MaxButton } from '@/components/WidgetLikeField/WidgetLikeField.style';

interface Image {
  url: string;
  name: string;
}

interface BaseContractCall {
  label: string;
  onVerify: <T>(args: T | unknown) => Promise<boolean>;
}

interface SignContractCall extends BaseContractCall {
  type: 'sign';
  message: string;
}

interface SendContractCall extends BaseContractCall {
  type: 'send';
  data: string;
}

type ContractCall = SignContractCall | SendContractCall;

interface WidgetLikeFieldProps {
  contractCalls: ContractCall[];
  label: string;
  placeholder?: string;
  image?: Image & { badge?: Image };
  hasMaxButton?: boolean;
  helperText?: {
    left?: string;
    right?: string;
  };
  overrideStyle?: {
    mainColor?: string;
  }
}

function WidgetLikeField({
  contractCalls,
  label,
  image,
  placeholder,
  hasMaxButton = true,
  helperText,
  overrideStyle = {},
}: WidgetLikeFieldProps) {
  const theme = useTheme();
  const config = useConfig();
  const { account } = useAccount();

  const [contractCallIndex, setContractCallIndex] = useState(0);

  const contractMutations = [];

  contractCalls.forEach((contractCall, index) => {
    contractMutations.push(useMutation({
      mutationKey: ['signMessage', account.address],
      mutationFn: async () => {
        let result;
        switch (contractCall.type) {
          case 'sign': {
            const signer = await getEthersSigner(config);
            const message = contractCall.message;
           result = await signer.signMessage(message);
           break;
          }
          case 'send': {
            // To be implemented
           result = contractCall.data;
            break;
          }
          default: {
            throw new Error('Case not implemented');
          }
        }

        return contractCall.onVerify(result);
      },
      onSuccess: () => {
        console.log('onSuccess triggered');
        setContractCallIndex(index + 1);
      },
    }));
  });
  console.log('index', contractCallIndex);

  if (contractCalls.length === contractCallIndex) {
    return (
      <Button
        disabled
        type="button"
        variant="contained"
        fullWidth
        sx={{
          '&.MuiButtonBase-root': {
            backgroundColor: overrideStyle?.mainColor ?? theme.palette.primary.main,
            color: theme.palette.text.primary,
          }
        }}
      >
        <Typography variant="bodyMediumStrong">Completed</Typography>
      </Button>
    );
  }

  const { mutate, isPending, isSuccess, isError } = contractMutations[contractCallIndex];

  console.log('sss', contractMutations);

  async function onSubmit(e) {
    try {
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
        <InputLabel htmlFor="component" sx={{ marginBottom: 1 }}><Typography
          variant="titleSmall">{label}</Typography></InputLabel>
        <FormControl error={isError} variant="standard" aria-autocomplete="none">
          <OutlinedInput
            autoComplete="off"
            id="component"
            defaultValue=""
            placeholder={placeholder}
            aria-describedby="component-text"
            sx={{ padding: '0.6rem 1rem' }}
            startAdornment={
              image && <WalletCardBadge
                sx={{ marginRight: '10px' }}
                overlap="circular"
                className="badge"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  image.badge &&
                  <MuiAvatar
                    alt={image.badge.name}
                    sx={(theme) => ({
                      width: '18px',
                      height: '18px',
                      border: `2px solid ${theme.palette.surface2.main}`,
                    })}
                  >
                    <TokenImage
                      token={{
                        name: image.badge.name,
                        logoURI: image.badge.url,
                      }}
                    />
                  </MuiAvatar>
                }
              >
                <WalletAvatar>
                  <TokenImage token={{
                    name: image.name,
                    logoURI: image.url,
                  }} />
                </WalletAvatar>
              </WalletCardBadge>}
            endAdornment={hasMaxButton && <MaxButton sx={{ p: '5px 10px' }} aria-label="menu" mainColor={overrideStyle?.mainColor}>
              max
            </MaxButton>}
          />
          {helperText && <FormHelperText id="component-text" sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 1,
          }}>
            <Typography component="span">{helperText.left}</Typography>
            <Typography component="span">{helperText.right}</Typography>
          </FormHelperText>}
        </FormControl>
        {contractCalls[contractCallIndex] &&
          <LoadingButton
            type="submit"
            loading={isPending}
            variant="contained"
            sx={{
              '&.MuiLoadingButton-loading': {
                border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
              },
              '.MuiLoadingButton-loadingIndicator': {
                color: overrideStyle?.mainColor ?? theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="bodyMediumStrong">{contractCalls[contractCallIndex].label}</Typography>
          </LoadingButton>
        }
      </Box>
  );
}

export default WidgetLikeField;
