import {put, select, takeEvery} from 'redux-saga/effects';
import {
  IdAction,
  IdsAction,
  ParentChildAction,
  ParentChildrenAction,
} from '../../redux/actions';
import intervalsActions, {
  IntervalAction,
} from '../../interval/redux/intervalsActions';
import activityActions, {
  ActivityFormData,
  ADD_CREATED_SUBACTIVITY_REQUESTED,
  ADD_SUBACTIVITIES_REQUESTED,
  CombinedActivitiesAction,
  clearSelectedActivities,
  START_ACTIVITY_REQUESTED,
  STOP_ACTIVITY_REQUESTED,
  ACTIVITIES_JOIN_REQUESTED,
  CREATE_ACTIVITY_REQUESTED,
  DELETE_ACTIVITIES_REQUESTED,
  DELETE_ACTIVITY_REQUESTED,
  EDIT_ACTIVITY_REQUESTED,
  REMOVE_SUBACTIVITY_REQUESTED,
  ActivityFormAction,
} from './activityActions';
import {uuidv4} from '../../utils/uuid';
import {ApplicationState} from '../../redux/rootReducer';
import {IdType} from '../../types';
import {storeSaveRequested} from '../../store/redux/storeActions';
import {Interval} from '../../interval/types';

// Assuming you have corresponding actions and imports

function* createActivitySaga(action: ActivityFormAction) {
  yield put(activityActions.createActivity.action(action.payload));
  yield put(storeSaveRequested());
}

function* editActivitySaga(action: ActivityFormAction) {
  yield put(activityActions.editActivity.action(action.payload));
  yield put(storeSaveRequested());
}

function* removeSubactivitySaga(action: IdAction) {
  yield put(activityActions.removeSubactivity.action(action.payload));
  yield put(storeSaveRequested());
}

function* deleteActivitySaga(action: IdAction) {
  yield put(activityActions.deleteActivity.action(action.payload));
  yield put(storeSaveRequested());
}

function* deleteActivitiesSaga(action: IdsAction) {
  yield put(activityActions.deleteActivities.action(action.payload));
  yield put(storeSaveRequested());
}

function* startActivitySaga(action: IdAction): any {
  const activityId = action.payload;
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
    yield put(activityActions.stopActivity.action(previouslyActiveInterval));
  }
  const intervalId = uuidv4();
  yield put(activityActions.startActivity.action(activityId, intervalId));
  yield put(storeSaveRequested());
}

function* stopActivitySaga(action: IntervalAction): any {
  const intervalToStop: Interval = action.payload;
  yield put(activityActions.stopActivity.action(intervalToStop));
  const duration = Date.now() - intervalToStop.startTimeEpochMilliseconds;
  if (duration < 1000) {
    // if the duration is less than a second, then don't bother with the interval... delete it from the store
    yield put(intervalsActions.deleteInterval.request(intervalToStop, false));
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
      yield put(activityActions.stopActivity.action(currentlyActiveInterval));
    }
  }
  yield put(activityActions.addSubactivities.action(parentId, selectedIds));
  yield put(clearSelectedActivities());
  yield put(storeSaveRequested());
}

function* addCreatedSubactivitySaga(
  action: ParentChildAction<ActivityFormData>,
) {
  const {parentId, child} = action.payload;
  yield put(activityActions.createActivity.action(child));
  const selectedIds: IdType[] = yield select(
    (state: ApplicationState): IdType[] => [
      ...state.activity.selectedActivitiesIds.values(),
    ],
  );
  yield put(
    activityActions.addSubactivities.action(parentId, [
      child.id,
      ...selectedIds,
    ]),
  );
  yield put(storeSaveRequested());
}

function* activitiesJoinSaga(action: CombinedActivitiesAction) {
  const {targetParentId, ids} = action.payload;
  const nameOfCombinedActivity: string = yield select(
    (state: ApplicationState) =>
      state.activity.activities.getData(ids[0] ?? null)?.name ?? '',
  );
  const combinedActivityId = uuidv4();
  yield put(
    activityActions.createActivity.action({
      id: combinedActivityId,
      name: nameOfCombinedActivity,
    }),
  );
  yield put(
    activityActions.addSubactivities.action(targetParentId, [
      combinedActivityId,
    ]),
  );
  yield put(
    intervalsActions.joinIntervalsToActivity.request(combinedActivityId, ids),
  );
  yield put(activityActions.deleteActivities.action(ids));
  yield put(storeSaveRequested());
}

export default function* rootSaga() {
  yield takeEvery(CREATE_ACTIVITY_REQUESTED, createActivitySaga);
  yield takeEvery(EDIT_ACTIVITY_REQUESTED, editActivitySaga);
  yield takeEvery(START_ACTIVITY_REQUESTED, startActivitySaga);
  yield takeEvery(STOP_ACTIVITY_REQUESTED, stopActivitySaga);
  yield takeEvery(ADD_SUBACTIVITIES_REQUESTED, addSubactivitiesSaga);
  yield takeEvery(ADD_CREATED_SUBACTIVITY_REQUESTED, addCreatedSubactivitySaga);
  yield takeEvery(REMOVE_SUBACTIVITY_REQUESTED, removeSubactivitySaga);
  yield takeEvery(DELETE_ACTIVITY_REQUESTED, deleteActivitySaga);
  yield takeEvery(DELETE_ACTIVITIES_REQUESTED, deleteActivitiesSaga);
  yield takeEvery(ACTIVITIES_JOIN_REQUESTED, activitiesJoinSaga);
}
