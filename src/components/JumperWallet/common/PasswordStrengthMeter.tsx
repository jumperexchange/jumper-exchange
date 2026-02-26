'use client';

import {
  StrengthBar,
  StrengthBarTrack,
  StrengthLabel,
  StrengthMeterContainer,
} from './PasswordStrengthMeter.style';

interface PasswordStrengthMeterProps {
  /** Strength score from 0 (very weak) to 4 (strong), as returned by zxcvbn */
  score: number;
  /** Human-readable label, e.g. "Weak", "Fair", "Good", "Strong" */
  label: string;
}

export function PasswordStrengthMeter({
  score,
  label,
}: PasswordStrengthMeterProps) {
  return (
    <StrengthMeterContainer>
      <StrengthBarTrack>
        <StrengthBar score={score} />
      </StrengthBarTrack>
      <StrengthLabel>{label}</StrengthLabel>
    </StrengthMeterContainer>
  );
}
