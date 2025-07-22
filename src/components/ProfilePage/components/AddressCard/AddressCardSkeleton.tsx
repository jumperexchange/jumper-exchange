import {
  AddressBoxContainer,
  AddressButtonGroup,
  AddressContentContainer,
  BaseSkeleton,
  BaseStyledSkeleton,
  ImageBackgroundPlaceholder,
} from './AddressCard.style';

export const AddressCardSkeleton = () => {
  return (
    <AddressBoxContainer>
      <AddressContentContainer>
        <ImageBackgroundPlaceholder />
        <BaseSkeleton
          variant="circular"
          animation="wave"
          sx={{
            width: 140,
            height: 140,
          }}
        />
        <AddressButtonGroup>
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 16,
              width: 128,
            }}
          />
          <BaseStyledSkeleton
            variant="circular"
            animation="wave"
            sx={{
              height: 32,
              width: 32,
            }}
          />
        </AddressButtonGroup>
      </AddressContentContainer>
    </AddressBoxContainer>
  );
};
