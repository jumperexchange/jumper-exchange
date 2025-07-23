import { useBaseForm } from '../base/useBaseForm';
import { ConfigOverrideHook } from '../types';

export const useFormOverride: ConfigOverrideHook = (ctx) => useBaseForm(ctx);
