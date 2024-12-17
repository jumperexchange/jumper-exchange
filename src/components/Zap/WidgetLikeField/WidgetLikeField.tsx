import {
  Avatar as MuiAvatar,
  Box,
  FormHelperText,
  InputLabel,
  Typography,
  useTheme,
  Grid,
  Link,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';
import LoadingButton from '@mui/lab/LoadingButton';
import { useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEthersSigner } from './utils';
import { MaxButton } from './WidgetLikeField.style';
import { useContractWrite } from 'src/hooks/useWriteContractData';
import { parseUnits } from 'ethers';

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
  };
  balance?: string;
  projectData: {
    address: string;
    chain: string;
    project: string;
  };
}

function WidgetLikeField({
  contractCalls,
  label,
  image,
  placeholder,
  hasMaxButton = true,
  helperText,
  overrideStyle = {},
  balance,
  projectData,
}: WidgetLikeFieldProps) {
  const theme = useTheme();
  const config = useConfig();
  const { account } = useAccount();
  const [value, setValue] = useState<string>('');
  const { write, isLoading, error, data } = useContractWrite({
    address: projectData?.address as `0x${string}`,
    chainId: projectData?.chain === 'ethereum' ? 1 : 8453,
    functionName: 'redeem',
    abi: [
      {
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'redeem',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numbers and one decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      write([parseUnits(value, 18)]);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid xs={12} md={3} p={3} bgcolor={'#fff'} borderRadius={1}>
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
          <InputLabel htmlFor="component" sx={{ marginBottom: 1 }}>
            <Typography variant="titleSmall">{label}</Typography>
          </InputLabel>
          <FormControl
            error={false}
            variant="standard"
            aria-autocomplete="none"
          >
            <OutlinedInput
              autoComplete="off"
              id="component"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={isLoading}
              aria-describedby="component-text"
              sx={{ padding: '0.6rem 1rem', marginBottom: helperText ? 0 : 2 }}
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*[.]?[0-9]*',
              }}
              startAdornment={
                image && (
                  <WalletCardBadge
                    sx={{ marginRight: '10px' }}
                    overlap="circular"
                    className="badge"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      image.badge && (
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
                      )
                    }
                  >
                    <WalletAvatar>
                      <TokenImage
                        token={{
                          name: image.name,
                          logoURI: image.url,
                        }}
                      />
                    </WalletAvatar>
                  </WalletCardBadge>
                )
              }
              endAdornment={
                hasMaxButton && (
                  <MaxButton
                    sx={{ p: '5px 10px' }}
                    aria-label="menu"
                    mainColor={overrideStyle?.mainColor}
                    onClick={() => setValue(balance ?? '0')}
                  >
                    max
                  </MaxButton>
                )
              }
            />
            {helperText && (
              <FormHelperText
                id="component-text"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 1,
                }}
              >
                <Typography component="span">{helperText.left}</Typography>
                <Typography component="span">{helperText.right}</Typography>
              </FormHelperText>
            )}
            {error && (
              <FormHelperText
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 1,
                  color: 'red',
                }}
              >
                {error.message}
              </FormHelperText>
            )}
            {data && (
              <FormHelperText
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 1,
                  color: 'green',
                }}
              >
                <Link
                  href={
                    projectData?.chain === 'ethereum'
                      ? 'https://etherscan.io/tx/' + data
                      : 'https://basescan.org/tx/' + data
                  }
                  target="_blank"
                >
                  View on{' '}
                  {projectData?.chain === 'ethereum' ? 'Etherscan' : 'BaseScan'}
                </Link>
              </FormHelperText>
            )}
          </FormControl>
          <LoadingButton
            type="submit"
            loading={isLoading}
            disabled={balance === '0' || isLoading}
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
            <Typography variant="bodyMediumStrong">
              {contractCalls[0].label}
            </Typography>
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}

export default WidgetLikeField;
