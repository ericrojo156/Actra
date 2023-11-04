import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {
  IdAction,
  ParentChildAction,
  ParentChildrenAction,
} from '../../redux/actions';
import {
  IntervalAction,
  deletedInterval,
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
  stopActivity,
  startActivity,
  deletedActivities,
  clearSelectedActivities,
  addSubactivitiesRequested,
  ADD_SUBACTIVITIES_REQUESTED,
  CombinedActivitiesAction,
  stoppedActivity,
} from './activityActions';
import {uuidv4} from '../../utils/uuid';
import {ApplicationState} from '../../redux/rootReducer';
import {IdType} from '../../types';
import {storeSaveRequested} from '../../store/redux/storeActions';
import {Interval} from '../../interval/types';

function* startActivitySaga(action: IdAction): any {
  const activityIdToStart: IdType = action.payload;
  const previouslyActiveInterval: Interval | null = yield select(
    (state: ApplicationState) => {
      const currentlyActiveIntervalId = state.interval.currentlyActive;
      const currentlyActiveActivityId = state.activity.currentlyActive;
      return (
        state.interval.activitiesIntervals
          .get(currentlyActiveActivityId)
          ?.get(currentlyActiveIntervalId) ?? null
      );
    },
  );
  if (previouslyActiveInterval !== null) {
    yield put(stopActivity(previouslyActiveInterval));
  }
  yield put(startActivity(activityIdToStart));
  yield put(storeSaveRequested());
}

function* stopActivitySaga(action: IntervalAction): any {
  const intervalToStop: Interval = action.payload;
  yield put(stopActivity(intervalToStop));
  const duration = Date.now() - intervalToStop.startTimeEpochMilliseconds;
  if (duration < 1000) {
    // if the duration is less than a second, then don't bother with the interval... delete it from the store
    yield put(deletedInterval(intervalToStop, false));
  }
  yield put(storeSaveRequested());
}

function* addSubactivitiesSaga(action: ParentChildrenAction) {
  const {parentId, children: selectedIds} = action.payload;
  const currentlyActiveActivityId: IdType = yield select(
    (state: ApplicationState) => state.activity.currentlyActive,
  );
  const parentIsActive: boolean = currentlyActiveActivityId === parentId;
  if (parentIsActive) {
    const currentlyActiveInterval: Interval | null = yield select(
      (state: ApplicationState) => {
        const currentlyActiveIntervalId: IdType =
          state.interval.currentlyActive;
        const currentlyActiveInterval: Interval | null =
          state.interval.activitiesIntervals
            .get(currentlyActiveActivityId)
            ?.get(currentlyActiveIntervalId) ?? null;
        return currentlyActiveInterval;
      },
    );
    if (currentlyActiveInterval !== null) {
      yield put(stoppedActivity(currentlyActiveInterval));
    }
  }
  yield put(addedSubactivities(parentId, selectedIds));
  yield put(clearSelectedActivities());
  yield put(storeSaveRequested());
}

function* createAndAddSubactivitySaga(
  action: ParentChildAction<ActivityFormData>,
) {
  const {parentId, child} = action.payload;
  yield put(createdActivity(child));
  const selectedIds: IdType[] = yield select(
    (state: ApplicationState): IdType[] => [
      ...state.activity.selectedActivitiesIds.values(),
    ],
  );
  yield put(addSubactivitiesRequested(parentId, [child.id, ...selectedIds]));
  yield put(storeSaveRequested());
}

function* joinActivities(action: CombinedActivitiesAction) {
  const {targetParentId, ids} = action.payload;
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
  yield put(addedSubactivities(targetParentId, [combinedActivityId]));
  yield put(joinIntervalsToActivity(combinedActivityId, ids));
  yield put(deletedActivities(ids));
  yield put(storeSaveRequested());
}

export default function* rootSaga() {
  yield takeLatest(ADD_SUBACTIVITIES_REQUESTED, addSubactivitiesSaga);
  yield takeLatest(STARTED_ACTIVITY, startActivitySaga);
  yield takeLatest(STOPPED_ACTIVITY, stopActivitySaga);
  yield takeEvery(JOINED_ACTIVITIES, joinActivities);
  yield takeLatest(ADDED_CREATED_SUBACTIVITY, createAndAddSubactivitySaga);
}
