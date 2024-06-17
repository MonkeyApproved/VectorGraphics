import { BaseContext } from 'src/redux/math';

export const DATA_CONTEXT_TYPE = 'data';

export interface DataContext extends BaseContext {
  type: typeof DATA_CONTEXT_TYPE;
}
