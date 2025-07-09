import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TwoColumnLayout } from '../TwoColumnLayout/TwoColumnLayout';
import { ZapDetails } from './ZapDetails';
import { ZapWidgetTabs } from './ZapWidgetTabs';
import { ZapWidget } from './ZapWidget';
import { fetchTaskOpportunities } from 'src/utils/merkl/fetchTaskOpportunities';
import { ZapWidgets } from './ZapWidgets';

interface ZapPageProps {
  market: Quest;
  detailInformation?: CustomInformation;
}

export const ZapPage = async ({ market, detailInformation }: ZapPageProps) => {
  // const { data, isSuccess, refetch } = useZaps(detailInformation?.projectData);
  // const [token, setToken] = useState<TokenAmount>();

  // useEffect(() => {
  //   if (isSuccess) {
  //     setToken({
  //       chainId: detailInformation?.projectData?.chainId,
  //       address: data?.data?.market?.address as `0x${string}`,
  //       symbol: data?.data?.market?.lpToken.symbol,
  //       name: data?.data?.market?.lpToken.name,
  //       decimals: data?.data?.market?.lpToken.decimals,
  //       priceUSD: '0',
  //       coinKey: data?.data?.market?.lpToken.name as any,
  //       logoURI: data?.data?.meta?.logoURI,
  //       amount: '0' as any,
  //     });
  //   }
  // }, [isSuccess]);

  const tasksVerification = market.tasks_verification;
  const taskOpportunities = await fetchTaskOpportunities(tasksVerification);

  return (
    <TwoColumnLayout
      mainContent={<ZapDetails market={market} tasks={taskOpportunities} />}
      sideContent={<ZapWidgets detailInformation={detailInformation} />}
    />
  );
};
