export function range({ n, start = 0 }: { n: number; start?: number }): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => start + i);
}
