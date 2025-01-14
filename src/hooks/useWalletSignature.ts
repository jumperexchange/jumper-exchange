import { useState } from 'react';
import { generateNonce, SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

// export const useWalletSignature = () => {
//   const { address, isConnected, chainId } = useAccount();
//   const { signMessageAsync } = useSignMessage();
//   const [evmSignature, setEvmSignature] = useState('');
//   const [evmMessage, setEvmMessage] = useState('');
//   const [solanaSignature, setSolanaSignature] = useState('');
//   const [solanaPublicKey, setSolanaPublicKey] = useState('');

//   const signEVM = async () => {
//     if (!isConnected) {
//       alert('Please connect your EVM wallet first!');
//       return;
//     }
//     try {
//       const nonce = generateNonce();
//       const message = new SiweMessage({
//         domain: window.location.host,
//         address: address,
//         statement: 'Sign in with EVM to the Jumperapp.',
//         uri: window.location.origin,
//         version: '1',
//         chainId,
//         nonce: nonce,
//       });
//       const messageToSign = message.prepareMessage();
//       const signature = await signMessageAsync({ message: messageToSign });
//       setEvmSignature(signature);
//       setEvmMessage(messageToSign);
//       // handleNext();
//     } catch (error) {
//       console.error('Error signing message with EVM wallet:', error);
//     }
//   };

//   const signSolana = async () => {
//     if (!(window as any).solana) {
//       alert('Please install Phantom wallet!');
//       return;
//     }
//     try {
//       const resp = await (window as any).solana.connect();
//       const solanaAddress = resp.publicKey.toString();
//       setSolanaPublicKey(solanaAddress);
//       const message = 'Sign in with Solana to the Jumper app.';
//       const encodedMessage = new TextEncoder().encode(message);
//       const signedMessage = await (window as any).solana.signMessage(
//         encodedMessage,
//         'utf8',
//       );
//       setSolanaSignature(signedMessage.signature);
//       // handleNext();
//     } catch (error) {
//       console.error('Error signing message with Solana wallet:', error);
//     }
//   };

//   return {
//     signEVM,
//     evmSignature,
//     evmMessage,
//     signSolana,
//     solanaSignature,
//     solanaPublicKey,
//   };
// };

export const useSignEVM = () => {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [evmSignature, setEvmSignature] = useState('');
  const [evmMessage, setEvmMessage] = useState('');

  const signEVM = async () => {
    if (!isConnected) {
      alert('Please connect your EVM wallet first!');
      return;
    }
    try {
      const nonce = generateNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with EVM to the Jumperapp.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: nonce,
      });
      const messageToSign = message.prepareMessage();
      const signature = await signMessageAsync({ message: messageToSign });
      setEvmSignature(signature);
      setEvmMessage(messageToSign);
      // handleNext();
    } catch (error) {
      console.error('Error signing message with EVM wallet:', error);
    }
  };

  return {
    signEVM,
    evmSignature,
    evmMessage,
  };
};

export const useSignSolana = () => {
  const [solanaSignature, setSolanaSignature] = useState('');
  const [solanaPublicKey, setSolanaPublicKey] = useState('');

  const signSolana = async () => {
    if (!(window as any).solana) {
      alert('Please install Phantom wallet!');
      return;
    }
    try {
      const resp = await (window as any).solana.connect();
      const solanaAddress = resp.publicKey.toString();
      setSolanaPublicKey(solanaAddress);
      const message = 'Sign in with Solana to the Jumper app.';
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await (window as any).solana.signMessage(
        encodedMessage,
        'utf8',
      );
      setSolanaSignature(signedMessage.signature);
      // handleNext();
    } catch (error) {
      console.error('Error signing message with Solana wallet:', error);
    }
  };

  return {
    signSolana,
    solanaSignature,
    solanaPublicKey,
  };
};
