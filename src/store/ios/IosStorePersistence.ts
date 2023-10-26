import * as RNFS from 'react-native-fs';
import {IStorePersistence} from '../IStorePersistence';
import {IActraStore} from '../IActraStore';
import {createActraStore} from '../actraStore';

// ios
export class IosStorePersistence implements IStorePersistence {
  filepath: string;
  constructor() {
    this.filepath = `${RNFS.DocumentDirectoryPath}/store.json`;
  }
  serialize(store: IActraStore): string {
    return JSON.stringify(store);
  }
  deserialize(serializedStore: string): IActraStore {
    // TODO: consider string validation here to ensure the explicit casting is guaranteed to be valid
    return JSON.parse(serializedStore) as IActraStore;
  }
  save(store: IActraStore): Promise<boolean> {
    const serializedStore = this.serialize(store);
    return RNFS.writeFile(this.filepath, serializedStore, 'utf8')
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  async load(): Promise<IActraStore> {
    const emptySerializedStore: string = JSON.stringify(
      createActraStore([], [], {
        activityId: null,
        intervalId: null,
      }),
    );
    let serializedStore: string = emptySerializedStore;
    const writeEmptyStoreFile = async () =>
      await RNFS.writeFile(this.filepath, emptySerializedStore);
    try {
      let statResult: RNFS.StatResult = await RNFS.stat(this.filepath);
      if (statResult.isFile()) {
        serializedStore = await RNFS.readFile(this.filepath, 'utf8');
      } else {
        await writeEmptyStoreFile();
      }
    } catch (e: any) {
      await writeEmptyStoreFile();
    }

    return this.deserialize(serializedStore);
  }
}
