import { describe, expect, it } from 'vitest';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { render } from '../../../../../vitest.setup';

import { Button } from './Button';
import { Variant, Size } from '../types';

describe('Button snapshot', () => {
  describe('variants', () => {
    it('matches snapshot with default variant', () => {
      const { container } = render(
        <Button variant={Variant.Default}>Default</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with primary variant', () => {
      const { container } = render(
        <Button variant={Variant.Primary}>Primary</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with secondary variant', () => {
      const { container } = render(
        <Button variant={Variant.Secondary}>Secondary</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with alphaLight variant', () => {
      const { container } = render(
        <Button variant={Variant.AlphaLight}>Alpha Light</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with alphaDark variant', () => {
      const { container } = render(
        <Button variant={Variant.AlphaDark}>Alpha Dark</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with lightBorder variant', () => {
      const { container } = render(
        <Button variant={Variant.LightBorder}>Light Border</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with disabled variant', () => {
      const { container } = render(
        <Button variant={Variant.Disabled}>Disabled</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with borderless variant', () => {
      const { container } = render(
        <Button variant={Variant.Borderless}>Borderless</Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with success variant', () => {
      const { container } = render(
        <Button variant={Variant.Success}>Success</Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('sizes', () => {
    it('matches snapshot with SM size', () => {
      const { container } = render(
        <Button variant={Variant.Primary} size={Size.SM}>
          Small
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with MD size', () => {
      const { container } = render(
        <Button variant={Variant.Primary} size={Size.MD}>
          Medium
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with LG size', () => {
      const { container } = render(
        <Button variant={Variant.Primary} size={Size.LG}>
          Large
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with XL size', () => {
      const { container } = render(
        <Button variant={Variant.Primary} size={Size.XL}>
          Extra Large
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('states', () => {
    it('matches snapshot when disabled', () => {
      const { container } = render(
        <Button variant={Variant.Primary} disabled>
          Disabled Button
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when loading', () => {
      const { container } = render(
        <Button variant={Variant.Primary} loading>
          Loading Button
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when fullWidth', () => {
      const { container } = render(
        <Button variant={Variant.Primary} fullWidth>
          Full Width Button
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('adornments', () => {
    it('matches snapshot with startAdornment', () => {
      const { container } = render(
        <Button variant={Variant.Primary} startAdornment={<AddIcon />}>
          With Start Icon
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with endAdornment', () => {
      const { container } = render(
        <Button variant={Variant.Primary} endAdornment={<ArrowForwardIcon />}>
          With End Icon
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with both adornments', () => {
      const { container } = render(
        <Button
          variant={Variant.Primary}
          startAdornment={<AddIcon />}
          endAdornment={<ArrowForwardIcon />}
        >
          With Both Icons
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
