import { ConfigOverrideHook } from './types';

const overrideHookRegistry = new Map<string, ConfigOverrideHook>();

export function registerOverrideHook(name: string, hook: ConfigOverrideHook) {
  overrideHookRegistry.set(name, hook);
}

export function getRegisteredOverrideHooks(
  names: string[],
): ConfigOverrideHook[] {
  return names.map((name) => {
    const hook = overrideHookRegistry.get(name);
    if (!hook) {
      console.warn(`Override hook "${name}" not registered`);
      return () => ({});
    }
    return hook;
  });
}
