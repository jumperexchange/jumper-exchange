import { useState } from 'react';
import { generateNonce, SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

const VERIFY_WALLET_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-wallet`;

export const useWalletSignature = () => {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  // const [activeStep, setActiveStep] = useState(0);
  const [evmSignature, setEvmSignature] = useState('');
  const [evmMessage, setEvmMessage] = useState('');
  const [solanaSignature, setSolanaSignature] = useState('');
  const [solanaPublicKey, setSolanaPublicKey] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [loading, setLoading] = useState(false);

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

  const verifySignatures = async () => {
    setLoading(true);
    try {
      const response = await fetch(VERIFY_WALLET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evm: {
            message: evmMessage,
            signature: evmSignature,
          },
          solana: {
            message: 'Sign in with Solana to the app.',
            signature: solanaSignature,
            publicKey: solanaPublicKey,
          },
        }),
      });
      const data = await response.json();
      setVerificationResult(
        data.isValid
          ? 'Both signatures verified successfully!'
          : 'Signature verification failed.',
      );
      return data;
    } catch (error) {
      console.error('Error verifying signatures:', error);
      setVerificationResult('Error occurred during verification.');
    }
    setLoading(false);
    // handleNext();
  };

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setEvmSignature('');
  //   setSolanaSignature('');
  //   setVerificationResult('');
  // };

  return {
    // activeStep,
    signEVM,
    signSolana,
    verifySignatures,
    evmSignature,
    solanaSignature,
    // handleNext,
    // handleBack,
    // handleReset,
    verificationResult,
    loading,
  };
};

// export const VerifyPage = () => {

//   const steps = [
//     {
//       label: 'Sign with EVM',
//       description: 'Connect your EVM wallet and sign the message.',
//       action: signEVM,
//     },
//     {
//       label: 'Sign with Solana',
//       description: 'Connect your Solana wallet and sign the message.',
//       action: signSolana,
//     },
//     {
//       label: 'Verify Signatures',
//       description: 'Verify both EVM and Solana signatures.',
//       action: verifySignatures,
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         maxWidth: 400,
//         margin: '30px auto',
//         padding: '30px',
//         background: '#fff',
//         borderRadius: '10px',
//       }}
//     >
//       <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
//         Signature Verification
//       </Typography>
//       <Stepper activeStep={activeStep} orientation="vertical">
//         {steps.map((step, index) => (
//           <Step key={step.label}>
//             <StepLabel>{step.label}</StepLabel>
//             <StepContent>
//               <Typography>{step.description}</Typography>
//               <Box sx={{ mb: 2 }}>
//                 <div>
//                   <Button
//                     variant="contained"
//                     onClick={step.action}
//                     size="medium"
//                     sx={{ mt: 1, mr: 1 }}
//                   >
//                     {index === steps.length - 1 ? 'Finish' : 'Continue'}
//                   </Button>
//                   <Button
//                     disabled={index === 0}
//                     onClick={handleBack}
//                     size="medium"
//                     sx={{ mt: 1, mr: 1 }}
//                   >
//                     Back
//                   </Button>
//                 </div>
//               </Box>
//             </StepContent>
//           </Step>
//         ))}
//       </Stepper>
//       {activeStep === steps.length && (
//         <Paper square elevation={0}>
//           <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
//             {verificationResult}
//           </Alert>
//           <Button
//             variant="contained"
//             size="medium"
//             onClick={handleReset}
//             sx={{ mt: 1, mr: 1 }}
//           >
//             Try again
//           </Button>
//         </Paper>
//       )}
//       {loading && <CircularProgress sx={{ mt: 2 }} />}
//     </Box>
//   );
// };
