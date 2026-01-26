export interface BorderConfig {
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'none';
  color: string;
}

export interface ThemeBorders {
  surface1: BorderConfig;
  surface2: BorderConfig;
  surface3: BorderConfig;
  surface4: BorderConfig;
}

export const defaultBorders: ThemeBorders = {
  surface1: {
    width: 0,
    style: 'none',
    color: 'transparent',
  },
  surface2: {
    width: 0,
    style: 'none',
    color: 'transparent',
  },
  surface3: {
    width: 0,
    style: 'none',
    color: 'transparent',
  },
  surface4: {
    width: 0,
    style: 'none',
    color: 'transparent',
  },
};
