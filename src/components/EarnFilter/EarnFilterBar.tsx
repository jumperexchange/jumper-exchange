import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';

export const EarnFilterBar: React.FC<{}> = () => {
  const { allChains, allProtocols, allAssets, allTags, allAPY } =
    useEarnFiltering();

  return (
    <div>
      <h1>Filter</h1>
      <ul>
        <li>chains: {allChains.map((x) => x.chainKey).join(', ')}</li>
        <li>protocols: {allProtocols.map((x) => x.name).join(', ')}</li>
        <li>assets: {allAssets.map((x) => x.name).join(', ')}</li>
        <li>tags: {allTags.join(', ')}</li>
        <li>
          apy:{' '}
          {Object.entries(allAPY)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
        </li>
      </ul>
    </div>
  );
};
