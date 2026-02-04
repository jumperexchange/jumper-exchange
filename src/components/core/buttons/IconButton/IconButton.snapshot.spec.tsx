import { describe, expect, it } from 'vitest';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { render } from '../../../../../vitest.setup';

import { IconButton } from './IconButton';
import { Variant, Size } from '../types';

describe('IconButton snapshot', () => {
  describe('variants', () => {
    it('matches snapshot with default variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Default} aria-label="Default action">
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with primary variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Primary} aria-label="Primary action">
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with secondary variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Secondary} aria-label="Secondary action">
          <SettingsIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with alphaLight variant', () => {
      const { container } = render(
        <IconButton
          variant={Variant.AlphaLight}
          aria-label="Alpha light action"
        >
          <SearchIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with alphaDark variant', () => {
      const { container } = render(
        <IconButton variant={Variant.AlphaDark} aria-label="Alpha dark action">
          <CloseIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with lightBorder variant', () => {
      const { container } = render(
        <IconButton
          variant={Variant.LightBorder}
          aria-label="Light border action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with disabled variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Disabled} aria-label="Disabled action">
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with borderless variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Borderless} aria-label="Borderless action">
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with success variant', () => {
      const { container } = render(
        <IconButton variant={Variant.Success} aria-label="Success action">
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('sizes', () => {
    it('matches snapshot with XS size', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          size={Size.XS}
          aria-label="Extra small action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with SM size', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          size={Size.SM}
          aria-label="Small action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with MD size', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          size={Size.MD}
          aria-label="Medium action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with LG size', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          size={Size.LG}
          aria-label="Large action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with XL size', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          size={Size.XL}
          aria-label="Extra large action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('states', () => {
    it('matches snapshot when disabled', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          disabled
          aria-label="Disabled action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when loading', () => {
      const { container } = render(
        <IconButton
          variant={Variant.Primary}
          loading
          aria-label="Loading action"
        >
          <AddIcon />
        </IconButton>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
