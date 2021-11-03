// import { withGlobalStyle } from '../src/utils'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

// export const decorators = [withGlobalStyle(true)]

const customViewports = {
  figma: {
    name: 'figma',
    styles: {
      width: '360px',
      height: '1000px',
    },
  },
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
}
