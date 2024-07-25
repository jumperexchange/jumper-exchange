import { Button } from 'src/components/Button';
import { NFTCardBotomBox, NFTCardMainBox } from './NFTCard.style';
import Image from 'next/image';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';
import { ChainId } from '@lifi/sdk';
import type { NFTInfo } from 'src/hooks/useCheckFestNFTAvailability';
import { GalxeNFTABI } from 'src/const/abi/galxeNftABI';
import { SoraTypography } from '../../Superfest.style';

interface NFTCardProps {
  image: string;
  chain: string;
  bgColor: string;
  typoColor: string;
  claimInfo: NFTInfo;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export const NFTCard = ({
  image,
  chain,
  bgColor,
  typoColor,
  claimInfo,
  isLoading,
  isSuccess,
}: NFTCardProps) => {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function handleClick() {
    try {
      const { id } = await switchChainAsync({
        chainId: ChainId.OPT,
      });

      console.log('clicking');

      if (
        id === ChainId.OPT &&
        address &&
        claimInfo?.NFTAddress &&
        claimInfo.verifyIds &&
        claimInfo.isClaimable &&
        claimInfo.signature
      ) {
        try {
          console.log('--------');
          console.log(claimInfo);
          writeContract({
            address: claimInfo.claimingAddress as `0x${string}`,
            abi: GalxeNFTABI,
            functionName: 'claim',
            args: [
              claimInfo.numberId,
              claimInfo.NFTAddress,
              claimInfo.verifyIds,
              claimInfo.numberId,
              address,
              claimInfo.signature,
            ],
          });
          // function claim(
          //   uint256 _cid,      // Campaign number id
          //   address _starNFT,  // NFT contract address
          //   uint256 _dummyId,  // Unique id
          //   uint256 _powah,    // Reserved field, currently is campaign number id
          //   address _mintTo,   // NFT owner
          //   bytes calldata _signature // Claim signature
          // )
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (claimInfo?.isClaimed || isConfirmed) {
    return (
      <NFTCardMainBox
        sx={{
          cursor: 'not-allowed',
        }}
      >
        <Image
          style={{
            borderTopRightRadius: '8px',
            borderTopLeftRadius: '8px',
            marginBottom: '0px',
          }}
          src={image}
          alt={chain}
          width="288"
          height="288"
        />
        <NFTCardBotomBox>
          {hash ? (
            <a
              href={`https://optimistic.etherscan.io/tx/${hash}`}
              target="_blank"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                marginLeft: '32px',
              }}
              rel="noreferrer"
            >
              <Button
                size="medium"
                styles={{
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  border: '2px dotted',
                  padding: '16px',
                  color: '#000000',
                  width: '75%',
                  '&:hover': {
                    backgroundColor: bgColor,
                    color: typoColor,
                  },
                }}
              >
                <SoraTypography
                  fontSize="16px"
                  lineHeight="18px"
                  fontWeight={600}
                >
                  SEE TX
                </SoraTypography>
              </Button>
            </a>
          ) : (
            <Button
              size="medium"
              disabled={true}
              styles={{
                // backgroundColor: 'transparent',
                border: '2px dotted',
                borderColor: '#000000',
                width: '75%',
                backgroundColor: bgColor,
                color: typoColor,
                '&:hover': {
                  backgroundColor: bgColor,
                  color: typoColor,
                },
              }}
            >
              <SoraTypography
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                MINTED
              </SoraTypography>
            </Button>
          )}
        </NFTCardBotomBox>
      </NFTCardMainBox>
    );
  }

  if (claimInfo?.isClaimable) {
    return (
      <NFTCardMainBox>
        <Image
          style={{
            borderTopRightRadius: '8px',
            borderTopLeftRadius: '8px',
            marginBottom: '0px',
          }}
          src={image}
          alt={chain}
          width="288"
          height="288"
        />
        <NFTCardBotomBox>
          <Button
            disabled={isConfirming}
            size="medium"
            styles={{
              backgroundColor: 'transparent',
              border: '2px dotted',
              borderColor: '#000000',
              color: '#000000',
              width: '75%',
              '&:hover': {
                backgroundColor: bgColor,
                color: typoColor,
              },
            }}
            onClick={() => handleClick()}
          >
            <SoraTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
              {isConfirming ? 'MINTING...' : 'MINT'}
            </SoraTypography>
          </Button>
        </NFTCardBotomBox>
      </NFTCardMainBox>
    );
  }
  return (
    <NFTCardMainBox
      sx={{
        cursor: 'not-allowed',
      }}
    >
      <Image
        style={{
          borderTopRightRadius: '8px',
          borderTopLeftRadius: '8px',
          marginBottom: '0px',
        }}
        src={image}
        alt={chain}
        width="288"
        height="288"
      />
      <NFTCardBotomBox>
        <Button
          size="medium"
          disabled={true}
          styles={{
            backgroundColor: 'transparent',
            border: '2px dotted',
            borderColor: '#C5B99C',
            width: '75%',
            '&:hover': {
              backgroundColor: bgColor,
              color: typoColor,
            },
          }}
        >
          <SoraTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
            UNAVAILABLE
          </SoraTypography>
        </Button>
      </NFTCardBotomBox>
    </NFTCardMainBox>
  );
};
