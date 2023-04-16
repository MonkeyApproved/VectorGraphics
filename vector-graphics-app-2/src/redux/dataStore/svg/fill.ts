export const defaultFillStyle: FillStyle = {
  color: 'black',
  opacity: 1,
};

export interface FillStyle {
  color?: string;
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
}
