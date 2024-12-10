'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import { Typography } from '@mui/material';

const BridgeExplanationSection = () => {
  return (
    <BridgePageContainer>
      <Typography variant="h3" marginY={2} sx={{ fontSize: '32px !important' }}>
        What is a Blockchain / Crypto Bridge?
      </Typography>
      <Typography>
        Blockchain bridges function similarly to physical bridges, but instead
        of connecting locations, they link different blockchain networks. This
        connection is crucial because, without a bridge, blockchain networks
        operate in isolation, unable to communicate or transfer assets between
        each other. Each blockchain has its own governance rules and native
        assets, which makes interoperability a challenge. By establishing a
        bridge, assets and data can be transferred between blockchains,
        facilitating crucial interoperability in the crypto ecosystem.
      </Typography>

      <Typography>
        Consider Alice, who holds ETH on the Ethereum Mainnet but wants to use
        it on Avalanche. Since these two networks operate independently with
        their own rules and consensus mechanisms, direct communication isn't
        possible. To use her ETH on Avalanche, Alice can utilize a blockchain
        bridge to convert her ETH into wETH (wrapped ETH) that can function on
        Avalanche. This process allows her to access the features of both
        blockchains without needing to acquire additional assets.
      </Typography>

      <Typography
        variant="h4"
        marginY={2}
        sx={{
          fontSize: '24px !important',
        }}
      >
        Here's why bridges are essential for enhancing blockchain
        interoperability:
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px! important',
          marginTop: '4px',
          marginBottom: '2px',
        }}
      >
        1. Isolation of Blockchains
      </Typography>
      <Typography>
        Blockchains operate independently, much like countries with their own
        governments, languages, and regulations. Each blockchain has its unique
        set of rules and functionalities, making it impossible for them to
        communicate with one another directly. For example, Bitcoin has a capped
        supply of 21 million coins, while Ethereum utilizes smart contracts
        written in Solidity. This inherent isolation creates challenges for
        transferring data and assets across different chains.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px !important',
          marginTop: '4px',
          marginBottom: '2px',
        }}
      >
        2. Incompatibility of Systems
      </Typography>
      <Typography>
        Similar to how countries cannot use each other's currencies without a
        means of conversion, blockchains cannot natively transfer tokens or
        information due to their distinct systems. Attempting to send Ethereum
        (ETH) to a Bitcoin (BTC) address is futile, as the protocols of each
        blockchain do not recognize each other’s formats. This incompatibility
        limits the potential for collaboration and innovation across the
        blockchain space.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px !important',
          marginTop: '4px',
          marginBottom: '2px',
        }}
      >
        3. Facilitating Interoperability
      </Typography>
      <Typography>
        {' '}
        Bridges act as intermediaries that allow different blockchains to
        communicate and interact. By connecting disparate networks, bridges
        enable the transfer of tokens and information seamlessly. Just as
        physical bridges in the real world connect locations, blockchain bridges
        provide the necessary infrastructure for digital currencies and data to
        flow between chains.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px !important',
          marginTop: '4px',
          marginBottom: '2px',
        }}
      >
        4. Unlocking New Opportunities
      </Typography>
      <Typography>
        The creation of bridges opens up new avenues for developers and users
        alike. With bridges, projects can leverage the unique features of
        various blockchains, enhancing functionality and user experience. This
        interoperability fosters a more vibrant and collaborative ecosystem,
        driving innovation and expanding the reach of blockchain technology.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px !important',
          marginTop: '4px',
          marginBottom: '2px',
        }}
      >
        5. Enhancing User Experience
      </Typography>
      <Typography>
        For end-users, bridges simplify interactions across different blockchain
        platforms. They can easily transfer assets or access decentralized
        applications on various chains without navigating complex processes.
        This convenience not only improves user satisfaction but also encourages
        broader adoption of blockchain technology.
      </Typography>
    </BridgePageContainer>
  );
};

export default BridgeExplanationSection;
