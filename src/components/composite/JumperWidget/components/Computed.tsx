import type { FC } from 'react';
import type { BaseFieldProps } from '../types';

/**
 * Placeholder component for computed fields. Renders nothing;
 * the computed value is stored in form state via sanitizeValue.
 */
export const Computed: FC<BaseFieldProps> = () => null;
