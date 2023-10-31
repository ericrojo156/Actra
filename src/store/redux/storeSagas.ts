import {call, put, select, takeLatest} from 'redux-saga/effects';
import {STORE_LOAD_REQUESTED, STORE_SAVE_REQUESTED} from './storeActions';
import {IActraStore} from '../IActraStore';
import {IosStorePersistence} from '../ios/IosStorePersistence';
import {
  loadedActivities,
  setCurrentlyActive,
} from '../../activity/redux/activityActions';
import {loadedIntervals} from '../../interval/redux/intervalsActions';
import {ApplicationState} from '../../redux/rootReducer';
import {flatten} from '../../utils/array';
import {Activity} from '../../activity/ActivityElement';
import {IdType} from '../../types';
import {createActraStore} from '../actraStore';
import {Interval} from '../../interval/types';

function* storeLoadSaga() {
  const store: IActraStore = yield call(() => new IosStorePersistence().load());
  const {activities, intervals, currentlyActive} = store.data;
  yield put(loadedActivities(activities));
  yield put(loadedIntervals(intervals));
  yield put(
    setCurrentlyActive(currentlyActive.activityId, currentlyActive.intervalId),
  );
}

function* storeSaveSaga() {
  const activities: Activity[] = yield select(
    (state: ApplicationState) => state.activity.activities.dataList,
  );
  const intervals: Interval[] = yield select(
    (state: ApplicationState): Interval[] =>
      flatten(
        [...state.interval.activitiesIntervals.values()].map(
          intervalsRecord => [...intervalsRecord.values()],
        ),
      ),
  );
  const currentlyActive: {activityId: IdType; intervalId: IdType} = {
    activityId: yield select(
      (state: ApplicationState) => state.activity.currentlyActive,
    ),
    intervalId: yield select(
      (state: ApplicationState) => state.interval.currentlyActive,
    ),
  };
  const actraStore: IActraStore = createActraStore(
    activities,
    intervals,
    currentlyActive,
  );
  yield call(() => new IosStorePersistence().save(actraStore));
}

export default function* rootSaga() {
  yield takeLatest(STORE_LOAD_REQUESTED, storeLoadSaga);
  yield takeLatest(STORE_SAVE_REQUESTED, storeSaveSaga);
}
