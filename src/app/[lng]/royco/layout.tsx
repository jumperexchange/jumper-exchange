import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { RoycoProvider } from 'src/sdk';

export default async function RoycoLayout({ children }: PropsWithChildren) {
  return (
    <RoycoProvider
      originUrl="https://istbjtfzjcnstpzunkje.supabase.co"
      originKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdGJqdGZ6amNuc3RwenVua2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwOTk4NDYsImV4cCI6MjAzMDY3NTg0Nn0.1OCizFgWEFXQUeVnQ0NavmTaq0RxYaiJUL2zhlrPDQw"
    >
      <Layout>{children}</Layout>
    </RoycoProvider>
  );
}
