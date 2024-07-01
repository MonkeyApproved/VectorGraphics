export interface DataExplorer {
  id: string;
  label?: string;
  data: object;
}

export function getEmptyExplorer({ label }: { label?: string }): Omit<DataExplorer, 'id'> {
  return {
    label,
    data: [],
  };
}
