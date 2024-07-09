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
import { MerklDistribABI } from 'src/const/abi/merklABI';
import type { NFTInfo } from 'src/hooks/useCheckFestNFTAvailability';

const NOT_LIVE = true;

interface NFTCardProps {
  image: string;
  chain: string;
  bgColor: string;
  typoColor: string;
  claimInfo: NFTInfo;
  isLoading: boolean;
  isSuccess: boolean;
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
      if (
        !isLoading &&
        isSuccess &&
        id === ChainId.OPT &&
        address &&
        claimInfo.isClaimable &&
        claimInfo.signature
      ) {
        writeContract({
          address: claimInfo.claimingAddress as `0x${string}`,
          abi: MerklDistribABI,
          functionName: 'claimCapped',
          args: [
            claimInfo.cid,
            claimInfo.NFTAddress,
            claimInfo.verifyIds,
            claimInfo.cid,
            claimInfo.cap,
            address,
            claimInfo.signature,
          ], // function claimCapped(uint256 _cid, address _starNFT, uint256 _dummyId, uint256 _powah, uint256 _cap, address _mintTo, bytes calldata _signature)
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (NOT_LIVE) {
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
          width="256"
          height="256"
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
            COMING SOON
          </Button>
        </NFTCardBotomBox>
      </NFTCardMainBox>
    );
  }
  if (claimInfo.isClaimed || isConfirmed) {
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
          width="256"
          height="256"
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
            Claimed
          </Button>
        </NFTCardBotomBox>
      </NFTCardMainBox>
    );
  }
  if (isLoading || !isSuccess) {
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
          width="256"
          height="256"
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
            Loading...
          </Button>
        </NFTCardBotomBox>
      </NFTCardMainBox>
    );
  }
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
        width="256"
        height="256"
      />
      <NFTCardBotomBox>
        <Button
          disabled={isConfirming}
          size="medium"
          styles={{
            backgroundColor: 'transparent',
            border: '2px dotted',
            borderColor: '#000000',
            width: '75%',
            '&:hover': {
              backgroundColor: bgColor,
              color: typoColor,
            },
          }}
          onClick={() => handleClick()}
        >
          {isConfirming ? 'Minting...' : 'Mint'}
        </Button>
      </NFTCardBotomBox>
    </NFTCardMainBox>
  );
};
