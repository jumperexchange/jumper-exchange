import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  JumperPassCardContainer,
  JumperPassProgressContainer,
  jumperPassCardSx,
} from './JumperPassCard.styles';

const PassSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alpha200.main,
}));

export const JumperPassCardSkeleton = () => {
  return (
    <JumperPassCardContainer>
      <SectionCard sx={jumperPassCardSx}>
        <PassSkeleton
          variant="rounded"
          animation="wave"
          sx={(theme) => ({
            height: theme.spacing(4),
            width: theme.spacing(18),
            borderRadius: `${theme.shape.radius8}px`,
          })}
        />
        <PassSkeleton
          variant="rounded"
          animation="wave"
          sx={(theme) => ({
            height: theme.spacing(2.25),
            width: theme.spacing(24),
            borderRadius: `${theme.shape.radius8}px`,
          })}
        />
        <PassSkeleton
          variant="rounded"
          animation="wave"
          sx={(theme) => ({
            height: theme.spacing(8),
            width: theme.spacing(20),
            borderRadius: `${theme.shape.radius12}px`,
          })}
        />
        <JumperPassProgressContainer>
          <PassSkeleton
            variant="rounded"
            animation="wave"
            sx={(theme) => ({
              height: theme.spacing(1),
              width: '100%',
              borderRadius: `${theme.shape.radius128}px`,
            })}
          />
        </JumperPassProgressContainer>
      </SectionCard>
    </JumperPassCardContainer>
  );
};
