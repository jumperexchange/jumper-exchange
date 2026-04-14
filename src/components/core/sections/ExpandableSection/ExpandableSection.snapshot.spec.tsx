import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../../vitest.setup';
import { ExpandableSection } from './ExpandableSection';
import Typography from '@mui/material/Typography';

const defaultHeader = <Typography>Section Title</Typography>;
const defaultItems = ['Section Content'];
const renderItem = (item: string) => <Typography>{item}</Typography>;

const getAccordionSummaryButton = () =>
  screen.getByRole('button', { name: /section title/i });

describe('ExpandableSection behavior', () => {
  it('does not toggle expansion when the header is clicked and shouldExpand is false', () => {
    render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        shouldExpand={false}
      />,
    );

    const summary = getAccordionSummaryButton();
    expect(summary).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(summary);

    expect(summary).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles expansion when the header is clicked and shouldExpand is true', () => {
    render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        shouldExpand={true}
      />,
    );

    const summary = getAccordionSummaryButton();
    expect(summary).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the default cursor on detail rows when isDetailsItemClickable is false', () => {
    render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
        isDetailsItemClickable={false}
      />,
    );

    const detailRow = screen.getByText('Section Content').parentElement;
    expect(detailRow).toBeTruthy();
    expect(detailRow).toHaveStyle({ cursor: 'default' });
  });

  it('uses the pointer cursor on detail rows when isDetailsItemClickable is true', () => {
    render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
        isDetailsItemClickable={true}
      />,
    );

    const detailRow = screen.getByText('Section Content').parentElement;
    expect(detailRow).toHaveStyle({ cursor: 'pointer' });
  });
});

describe('ExpandableSection snapshot', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when initially expanded', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when initially collapsed', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot without expand icon', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        showExpandIcon={false}
        isExpanded={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with expanded end divider', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
        showExpandedEndDivider={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when expansion is disabled', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        shouldExpand={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when detail rows are not clickable', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
        isDetailsItemClickable={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with custom sx, detailsListSx, and detailsItemSx', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={defaultItems}
        renderItem={renderItem}
        isExpanded={true}
        sx={{ maxWidth: 320 }}
        detailsListSx={{ gap: 3 }}
        detailsItemSx={{ padding: 2 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with multiple items', () => {
    const { container } = render(
      <ExpandableSection
        header={defaultHeader}
        items={['Child One', 'Child Two', 'Child Three']}
        renderItem={renderItem}
        isExpanded={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
