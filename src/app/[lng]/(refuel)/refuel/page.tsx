import dynamic from 'next/dynamic';
import { generateMetadata } from 'src/app/lib/generateMetadata';

const App = dynamic(() => import('../../../ui/app/App'), { ssr: false });

const Page = () => {
  generateMetadata();
  return <App starterVariant="refuel" />;
};

export default Page;
