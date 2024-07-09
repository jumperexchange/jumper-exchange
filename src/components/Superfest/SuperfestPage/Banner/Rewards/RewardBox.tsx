import Image from 'next/image';
import { RewardBottomBox, SupportedChainsBox } from '../Banner.style';
import { SoraTypography } from 'src/components/Superfest/Superfest.style';
import { RewardTopBox, RewardSubtitleBox } from './RewardBox.style';

interface RewardBoxProps {
  title: string;
  logos: string[];
  value: string;
}

export const RewardBox = ({ title, logos, value }: RewardBoxProps) => {
  return (
    <RewardTopBox>
      <RewardSubtitleBox>
        <SoraTypography fontSize={'12px'} fontWeight={700} color={'#525252'}>
          {title}
        </SoraTypography>
      </RewardSubtitleBox>
      <RewardBottomBox>
        {logos.length > 1 ? (
          <SupportedChainsBox>
            {logos.map((logo: string, i: number) => {
              return (
                <Image
                  key={`chain-logos-${i}`}
                  src={logo}
                  style={{
                    marginLeft: i === 0 ? '' : '-8px',
                    zIndex: 100 - i,
                    borderRadius: '100%',
                  }}
                  alt={'logo name'}
                  width="32"
                  height="32"
                />
              );
            })}
          </SupportedChainsBox>
        ) : (
          <>
            <Image
              src={logos[0]}
              style={{ borderRadius: '100%' }}
              alt="logos-reward"
              width="40"
              height="40"
            />
            <SoraTypography
              fontSize={'18px'}
              fontWeight={800}
              marginLeft={'12px'}
            >
              {value}
            </SoraTypography>
          </>
        )}
      </RewardBottomBox>
    </RewardTopBox>
  );
};
