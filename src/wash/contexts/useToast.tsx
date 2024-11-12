import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

type TToastContext = {
  message: string | null;
  set_message: (message: string | null) => void;
};

const ToastContext = createContext<TToastContext>({
  message: null,
  set_message: () => undefined,
});
export const ToastContextApp = (props: {
  children: ReactNode;
}): ReactElement => {
  const [message, set_message] = useState<string | null>(null);

  return (
    <ToastContext.Provider value={{ message, set_message }}>
      {props.children}
    </ToastContext.Provider>
  );
};

export const useToast = (): TToastContext => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('ToastContext not found');
  }
  return ctx;
};
