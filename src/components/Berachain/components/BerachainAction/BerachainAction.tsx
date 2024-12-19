import { alpha, Skeleton, Typography, useTheme } from '@mui/material';
import { ProgressionBar } from '../../../ProfilePage/LevelBox/ProgressionBar';
import {
  BerachainActionBox,
  BerachainActionContent,
  BerachainActionExamplesBox,
  BerachainActionExamplesContent,
  BerachainActionExamplesIcons,
  BerachainActionLearnMoreCTA,
  BerachainActionSubtitle,
  BerachainActionTitle,
} from './BerachainAction.style';

export const BerachainAction = () => {
  const theme = useTheme();
  return (
    <BerachainActionBox>
      <BerachainActionContent>
        <BerachainActionTitle variant="urbanistTitleLarge">
          Pre-mine your tokens
        </BerachainActionTitle>
        <BerachainActionSubtitle variant="urbanistBodyXLarge">
          Pledge your tokens to Berachain and earn rewards post launch! You can
          pledge from five available tokens.
        </BerachainActionSubtitle>
        <BerachainActionSubtitle variant="urbanistBodyXLarge" marginTop={4}>
          Take a look now!
        </BerachainActionSubtitle>
        <BerachainActionLearnMoreCTA>Learn more</BerachainActionLearnMoreCTA>
        <BerachainActionExamplesBox>
          <Typography variant="urbanistBodyLarge">
            Tokens pledged by other Degens
          </Typography>
          <BerachainActionExamplesContent>
            <Typography variant="urbanistBody2XLarge">$2.75M</Typography>
            <BerachainActionExamplesIcons>
              {Array.from({ length: 4 }, (index) => index).map((_, index) => (
                <Skeleton
                  variant="circular"
                  sx={{ width: '28px', height: '28px' }}
                />
              ))}
            </BerachainActionExamplesIcons>
          </BerachainActionExamplesContent>
          <ProgressionBar
            hideLevelIndicator={true}
            ongoingValue={75}
            levelData={{ minPoints: 0, maxPoints: 100 }}
            chartBg={alpha(theme.palette.white.main, 0.2)}
            chartCol={'#F47226'}
          />
        </BerachainActionExamplesBox>
      </BerachainActionContent>
    </BerachainActionBox>
  );
};
