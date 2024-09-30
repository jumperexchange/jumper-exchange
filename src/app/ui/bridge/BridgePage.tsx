'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import { Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Widget } from '@/components/Widgets/Widget';
import Link from 'next/link';
import generateKey from '@/app/lib/generateKey';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { getChainById, getTokenByName } from '@/utils/tokenAndChain';
import HalfSizeBlock from '@/app/ui/bridge/HalfSizeBlock';
import { getChainInfoData, getTokenInfoData } from '@/app/ui/bridge/utils';

interface BridgePageProps {
  sourceChain: ExtendedChain;
  sourceToken: Token;
  destinationChain: ExtendedChain;
  destinationToken: Token;
  chains: ExtendedChain[];
  tokens: TokensResponse['tokens'];
}

const BridgePage = ({
  sourceChain,
  sourceToken,
  destinationChain,
  destinationToken,
  chains,
  tokens,
}: BridgePageProps) => {
  return (
    <Container>
      <Stack display="flex" alignItems="center" direction="column">
        <Typography
          variant="h1"
          color="text.primary"
          marginY={2}
          textAlign="center"
          sx={{ fontSize: '40px!important' }}
        >
          How to bridge from {sourceToken.symbol} on {sourceChain.name} to{' '}
          {destinationToken.symbol} on {destinationChain.name}
        </Typography>
        <Widget
          isWelcomeScreenClosed={true}
          starterVariant="default"
          fromChain={sourceChain?.id}
          toChain={destinationChain?.id}
          fromToken={sourceToken?.address}
          toToken={destinationToken?.address}
        />
        <BridgePageContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
          <Typography
            variant="h1"
            color="text.primary"
            marginY={2}
            sx={{ fontSize: '48px!important' }}
          >
            How to bridge from {sourceToken.symbol} on {sourceChain.name} to{' '}
            {destinationToken.symbol} on {destinationChain.name}
          </Typography>
          <Typography>
            To bridge from {sourceToken?.name} on {sourceChain?.name} to{' '}
            {destinationToken?.name} on {destinationChain?.name}, you will need
            to follow these steps. This guide will walk you through the process
            of transferring your assets from {sourceToken?.name} on{' '}
            {sourceChain?.name} to {destinationToken?.name} on{' '}
            {destinationChain?.name}.
          </Typography>
          <Typography variant="h2" marginY={2}>
            Step 1: Prepare Your Assets
          </Typography>
          <Typography>
            Before you can bridge your assets, you need to ensure you have the
            necessary funds and assets on the {sourceChain?.name} network. Make
            sure you have the correct {sourceChain?.name} wallet address and
            that your {sourceToken?.name} account is funded.
          </Typography>
          <Typography variant="h2" marginY={2}>
            Step 2: Choose a Bridge
          </Typography>
          <Typography>
            There are several bridges available to transfer your assets from{' '}
            {sourceToken?.name} on {sourceChain?.name} to{' '}
            {destinationToken?.name} on {destinationChain?.name}. Some popular
            options include:
          </Typography>
          <ul>
            <li>Stargate</li>
            <li>Across</li>
            <li>Circle CCTP</li>
            <li>Allbridge</li>
            <li> Connext</li>
            <li>Symbiosis</li>
            <li>Celer</li>
          </ul>
          <Typography variant="h2" marginY={2}>
            Step 3: Choose a Bridge
          </Typography>
          <Typography>To choose your bridge, follow these steps:</Typography>
          <ul>
            <li>Visualise the different quotes</li>
            <li>
              Check the details for each quote (i.e: amount of tokens received,
              price impact, slippage, number of steps, gas cost, bridging time)
            </li>
          </ul>
          <Typography variant="h2" marginY={2}>
            Step 4: Bridge Your Assets
          </Typography>
          <Typography>
            Once you have find a quote you like, you can bridge your assets from{' '}
            {sourceToken.symbol} on {sourceChain.name} to{' '}
            {destinationToken.symbol} on {destinationChain.name}. Follow these
            steps:
          </Typography>
          <ul>
            <li>Click on the quote you prefer</li>
            <li>
              Verify the details of the quote (i.e: amount of tokens received,
              price impact, slippage, number of steps, gas cost, bridging time)
            </li>
            <li>Click on "Start" execution</li>
            <li>
              "Approve" your tokens inside your wallet and wait for the approval
              transaction to go through
            </li>
            <li>
              "Bridge" your tokens inside your wallet and wait for the approval
              transaction to go through
            </li>
          </ul>
          <Typography variant="h2" marginY={2}>
            Step 5: Verify Your Bridge
          </Typography>
          <Typography>
            After bridging your assets, verify that they have been successfully
            transferred to the {destinationChain.name} network. You can do this
            by either:
          </Typography>
          <ul>
            <li>
              Clicking on the buttons to see each intermediate transaction
            </li>
            <li>
              Go to your{' '}
              <MuiLink
                color="text.primary"
                component={Link}
                href="https://jumper.exchange/scan"
              >
                https://jumper.exchange/scan
              </MuiLink>{' '}
              profile to visualize your recent transaction
            </li>
          </ul>
        </BridgePageContainer>
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
        >
          {[sourceChain, destinationChain].map((chain) => (
            <HalfSizeBlock
              type="Blockchain"
              key={chain.id}
              info={{
                logoURI: chain?.logoURI,
                name: chain.name,
              }}
              data={getChainInfoData(chain)}
            />
          ))}
          {[sourceToken, destinationToken].map((token) => (
            <HalfSizeBlock
              type="Token"
              key={token.address}
              info={{
                logoURI: token?.logoURI,
                name: `${token.name} (${token.symbol})`,
              }}
              data={getTokenInfoData(chains, token)}
            />
          ))}
        </Stack>
        <BridgePageContainer>
          <Typography variant="h3" marginY={2}>
            What is a Blockchain / Crypto Bridge?
          </Typography>
          <Typography>
            Blockchain bridges function similarly to physical bridges, but
            instead of connecting locations, they link different blockchain
            networks. This connection is crucial because, without a bridge,
            blockchain networks operate in isolation, unable to communicate or
            transfer assets between each other. Each blockchain has its own
            governance rules and native assets, which makes interoperability a
            challenge. By establishing a bridge, assets and data can be
            transferred between blockchains, facilitating crucial
            interoperability in the crypto ecosystem.
          </Typography>

          <Typography>
            Consider Alice, who holds ETH on the Ethereum Mainnet but wants to
            use it on Avalanche. Since these two networks operate independently
            with their own rules and consensus mechanisms, direct communication
            isn't possible. To use her ETH on Avalanche, Alice can utilize a
            blockchain bridge to convert her ETH into wETH (wrapped ETH) that
            can function on Avalanche. This process allows her to access the
            features of both blockchains without needing to acquire additional
            assets.
          </Typography>

          <Typography variant="h4" marginY={2}>
            Here's why bridges are essential for enhancing blockchain
            interoperability:
          </Typography>
          <Typography fontWeight="700">1. Isolation of Blockchains</Typography>
          <Typography>
            Blockchains operate independently, much like countries with their
            own governments, languages, and regulations. Each blockchain has its
            unique set of rules and functionalities, making it impossible for
            them to communicate with one another directly. For example, Bitcoin
            has a capped supply of 21 million coins, while Ethereum utilizes
            smart contracts written in Solidity. This inherent isolation creates
            challenges for transferring data and assets across different chains.
          </Typography>
          <Typography marginTop={2} fontWeight="700">
            2. Incompatibility of Systems
          </Typography>
          <Typography>
            Similar to how countries cannot use each other's currencies without
            a means of conversion, blockchains cannot natively transfer tokens
            or information due to their distinct systems. Attempting to send
            Ethereum (ETH) to a Bitcoin (BTC) address is futile, as the
            protocols of each blockchain do not recognize each other’s formats.
            This incompatibility limits the potential for collaboration and
            innovation across the blockchain space.
          </Typography>

          <Typography marginTop={2} fontWeight="700">
            3. Facilitating Interoperability
          </Typography>
          <Typography>
            {' '}
            Bridges act as intermediaries that allow different blockchains to
            communicate and interact. By connecting disparate networks, bridges
            enable the transfer of tokens and information seamlessly. Just as
            physical bridges in the real world connect locations, blockchain
            bridges provide the necessary infrastructure for digital currencies
            and data to flow between chains.
          </Typography>
          <Typography marginTop={2} fontWeight="700">
            4. Unlocking New Opportunities
          </Typography>
          <Typography>
            The creation of bridges opens up new avenues for developers and
            users alike. With bridges, projects can leverage the unique features
            of various blockchains, enhancing functionality and user experience.
            This interoperability fosters a more vibrant and collaborative
            ecosystem, driving innovation and expanding the reach of blockchain
            technology.
          </Typography>

          <Typography marginTop={2} fontWeight="700">
            5. Enhancing User Experience
          </Typography>
          <Typography>
            For end-users, bridges simplify interactions across different
            blockchain platforms. They can easily transfer assets or access
            decentralized applications on various chains without navigating
            complex processes. This convenience not only improves user
            satisfaction but also encourages broader adoption of blockchain
            technology.
          </Typography>
        </BridgePageContainer>
        <BridgePageContainer width="100%">
          <Typography variant="h3" marginY={2}>
            Popular bridges
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            {getTokenByName(tokens, destinationToken?.name ?? '')
              .filter((token) => {
                return token.chainId !== destinationChain.id;
              })
              .map((token) => (
                <MuiLink
                  width="50%"
                  color="text.primary"
                  key={generateKey(token.address)}
                  component={Link}
                  href={`/bridge/${getChainById(chains, token.chainId)?.name}-${sourceToken.symbol}-to-${destinationChain?.name}-${destinationToken?.symbol}`.toLowerCase()}
                >
                  Bridge from {sourceToken.symbol} on{' '}
                  {getChainById(chains, token.chainId)?.name} to{' '}
                  {destinationToken?.symbol} on {destinationChain?.name}
                </MuiLink>
              ))}
          </Stack>
        </BridgePageContainer>
      </Stack>
    </Container>
  );
};

export default BridgePage;
