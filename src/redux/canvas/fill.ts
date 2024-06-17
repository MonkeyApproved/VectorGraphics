export const defaultFillStyle: Fill = {
  color: 'black',
  opacity: 1,
};

export interface Fill {
  color?: string;
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
}
