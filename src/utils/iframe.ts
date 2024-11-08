export const isIframeEnvironment = () => {
  // in iframe env, window.parent is not equal to window
  const anyWindow = typeof window !== 'undefined' ? (window as any) : undefined;
  const isIframeEnvironment = anyWindow && anyWindow.parent !== anyWindow;
  return isIframeEnvironment;
};
