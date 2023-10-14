import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {IdsAction, ParentChildAction} from '../../redux/actions';
import {
  deleteInterval,
  joinIntervalsToActivity,
} from '../../interval/redux/intervalsActions';
import {
  ActivityFormData,
  ADDED_CREATED_SUBACTIVITY,
  createdActivity,
  addedSubactivities,
  JOINED_ACTIVITIES,
  STARTED_ACTIVITY,
  STOPPED_ACTIVITY,
  IntervalAction,
  stopActivity,
  startActivity,
  deletedActivities,
} from './activityActions';
import {uuidv4} from '../../utils/uuid';
import {ApplicationState} from '../../redux/rootReducer';
import {IdType} from '../../types';

function* startActivitySaga(action: IntervalAction): any {
  const previouslyActiveActivity = yield select(
    (state: ApplicationState) => state.activity.currentlyActive,
  );
  const previouslyActiveInterval = yield select(
    (state: ApplicationState) => state.interval.currentlyActive,
  );
  if (previouslyActiveActivity !== null && previouslyActiveInterval !== null) {
    yield put(stopActivity(previouslyActiveActivity, previouslyActiveInterval));
  }
  yield put(
    startActivity(action.payload.activityId, action.payload.intervalId),
  );
}

function* stopActivitySaga(action: IntervalAction): any {
  const {activityId, intervalId} = action.payload;
  yield put(stopActivity(activityId, intervalId));
  const interval = yield select((state: ApplicationState) =>
    state.interval.activitiesIntervals.get(activityId)?.get(intervalId),
  );
  const duration =
    interval.endTimeEpochMilliseconds - interval.startTimeEpochMilliseconds;
  if (duration < 1000) {
    // if the duration is less than a second, then don't bother with the interval... delete it from the store
    yield put(deleteInterval(activityId, intervalId));
  }
}

function* createAndAddSubactivity(action: ParentChildAction<ActivityFormData>) {
  const {parentId, child} = action.payload;
  yield put(createdActivity(child));
  const selectedIds: IdType[] = yield select(
    (state: ApplicationState): IdType[] => [
      ...state.activity.selectedActivitiesIds.values(),
    ],
  );
  yield put(addedSubactivities(parentId, [child.id, ...selectedIds]));
}

function* joinActivities(action: IdsAction) {
  const ids = action.payload;
  const nameOfCombinedActivity: string = yield select(
    (state: ApplicationState) =>
      state.activity.activities.getData(ids[0] ?? null)?.name ?? '',
  );
  const combinedActivityId = uuidv4();
  yield put(
    createdActivity({
      id: combinedActivityId,
      name: nameOfCombinedActivity,
    }),
  );
  yield put(joinIntervalsToActivity(combinedActivityId, ids));
  yield put(deletedActivities(ids));
}

export default function* rootSaga() {
  yield takeLatest(STARTED_ACTIVITY, startActivitySaga);
  yield takeLatest(STOPPED_ACTIVITY, stopActivitySaga);
  yield takeEvery(JOINED_ACTIVITIES, joinActivities);
  yield takeLatest(ADDED_CREATED_SUBACTIVITY, createAndAddSubactivity);
}
