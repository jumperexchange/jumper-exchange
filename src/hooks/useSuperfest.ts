import { usePathname } from 'next/navigation';

interface useIncludePathProps {
  includePath: boolean;
}

export const useIncludePath = (path: string): useIncludePathProps => {
  const pathname = usePathname();

  return {
    includePath: pathname?.includes(path) ?? false,
  };
};
