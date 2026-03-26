export type BlockChild = {
  type: string;
  text?: string;
  children?: BlockChild[];
};

export type HeadingNode = {
  type: 'heading';
  level: number;
  children: BlockChild[];
};
