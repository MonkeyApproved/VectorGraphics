export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function viewBoxString({ viewBox }: { viewBox: ViewBox }): string {
  return `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
}
