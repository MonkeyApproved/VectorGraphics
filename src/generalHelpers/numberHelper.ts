export function range({ n, start = 0 }: { n: number; start?: number }): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => start + i);
}

interface XY {
  x: number;
  y: number;
}

export function range2d({ x, y }: XY): XY[] {
  const result: XY[] = [];
  range({ n: x }).forEach((x) => {
    range({ n: y }).forEach((y) => result.push({ x, y }));
  });
  return result;
}
