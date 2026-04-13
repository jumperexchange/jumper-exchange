import { describe, expect, it } from 'vitest';
import { render } from '../../../../../vitest.setup';
import { ExpandableSection } from './ExpandableSection';
import Typography from '@mui/material/Typography';

const defaultHeader = () => <Typography>Section Title</Typography>;
const defaultChildren = <Typography>Section Content</Typography>;

describe('ExpandableSection snapshot', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(
      <ExpandableSection renderHeader={defaultHeader}>
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when initially expanded', () => {
    const { container } = render(
      <ExpandableSection renderHeader={defaultHeader} isExpanded={true}>
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when initially collapsed', () => {
    const { container } = render(
      <ExpandableSection renderHeader={defaultHeader} isExpanded={false}>
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot without expand icon', () => {
    const { container } = render(
      <ExpandableSection
        renderHeader={defaultHeader}
        showExpandIcon={false}
        isExpanded={true}
      >
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with expanded end divider', () => {
    const { container } = render(
      <ExpandableSection
        renderHeader={defaultHeader}
        isExpanded={true}
        showExpandedEndDivider={true}
      >
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when expansion is disabled', () => {
    const { container } = render(
      <ExpandableSection renderHeader={defaultHeader} shouldExpand={false}>
        {defaultChildren}
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with multiple children', () => {
    const { container } = render(
      <ExpandableSection renderHeader={defaultHeader} isExpanded={true}>
        <Typography>Child One</Typography>
        <Typography>Child Two</Typography>
        <Typography>Child Three</Typography>
      </ExpandableSection>,
    );
    expect(container).toMatchSnapshot();
  });
});
