import App from '../../ui/app/App';

export const dynamicParams = false;

export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;
  const response = await fetch(`${apiUrl}/tools`);
  const result = await response.json();
  const bridges = result?.bridges;
  const exchanges = result?.exchanges;
  let filteredBridges = [];
  let filteredDexes = [];
  if (bridges) {
    filteredBridges = Object.values(bridges).map((elem: any) => elem.key);
  }
  if (exchanges) {
    filteredDexes = Object.values(exchanges).map((elem: any) => elem.key);
  }
  const res = filteredBridges.concat(filteredDexes);
  const path = res.map((partnerTheme) => ({ partnerTheme }));
  return path;
}

export default function Page() {
  return <App starterVariant="default" />;
}
