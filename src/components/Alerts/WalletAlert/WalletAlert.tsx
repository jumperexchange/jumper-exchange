import { InfoAlert } from '../InfoAlert';

export const WalletAlert = () => {
  const title = 'Metamask update is required ⚠️';
  const subtitle =
    'Please update MetaMask to the latest version. This update solves a bug present in older versions.';

  return (
    <>
      <InfoAlert active={true} title={title} subtitle={subtitle} />
    </>
  );
};
