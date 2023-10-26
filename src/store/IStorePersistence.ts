import {IActraStore} from './IActraStore';

export interface IStorePersistence {
  save(store: IActraStore): Promise<boolean>;
  load(): Promise<IActraStore>;
}
