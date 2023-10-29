import {Activity} from '../ActivityElement';
import {BaseAction, IdType} from '../../types';
import {ActivityState} from './ActivityState';
import * as ColorPalette from '../../ColorPalette';
import {
  LOADED_ACTIVITIES,
  CREATED_ACTIVITY,
  DELETED_ACTIVITY,
  EDITED_ACTIVITY,
  ActivitiesAction,
  ActivityFormAction,
  ADDED_SUBACTIVITIES,
  START_ACTIVITY,
  STOP_ACTIVITY,
  DELETED_ACTIVITIES,
  REMOVED_SUBACTIVITY,
  ACTIVITIES_SELECTED,
  CLEAR_SELECTED_ACTIVITIES,
  SET_CURRENTLY_ACTIVE,
} from './activityActions';
import {
  CurrentlyActiveAction,
  IdAction,
  IdsAction,
  ParentChildrenAction,
} from '../../redux/actions';
import {getNonNullProjections} from '../../utils/projections';
import {ActivityForest} from '../dataStructures/activityForest';
import {
  DELETE_INTERVAL,
  DeletedIntervalAction,
  IntervalAction,
  UNDO_INTERVAL_DELETION,
} from '../../interval/redux/intervalsActions';
import {produce} from 'immer';

export const emptyActivity: Activity = {
  id: null,
  parentId: null,
  name: '',
  subactivitiesIds: [],
  intervalsIds: [],
  currentlyActiveIntervalId: null,
  color: ColorPalette.activityDefaultColor,
};

const defaultActivityState: ActivityState = {
  selectedActivitiesIds: new Set(),
  activities: new ActivityForest([]),
  currentlyActive: null,
};

function deleteActivitiesFromState(
  state: ActivityState,
  ids: IdType[],
): ActivityState {
  const activities = ActivityForest.copy(state.activities);
  ids.forEach((id: IdType) => {
    const activityToDelete = activities.getData(id);
    if (activityToDelete) {
      getNonNullProjections(
        activityToDelete.subactivitiesIds ?? [],
        activities.getData.bind(activities),
      ).forEach((subactivity: Activity) => {
        subactivity.parentId = null;
      });
    }
    activities.delete(id);
  });
  const currentlyActive = !ids.every(id => state.currentlyActive !== id)
    ? null
    : state.currentlyActive;
  return {
    ...state,
    activities,
    currentlyActive,
  };
}

export default function activityReducer(
  state: ActivityState = defaultActivityState,
  action: BaseAction,
): ActivityState {
  switch (action.type) {
    case LOADED_ACTIVITIES: {
      const activities = (action as ActivitiesAction).payload;
      const activitiesForest = new ActivityForest(activities);
      return {
        ...state,
        activities: activitiesForest,
      };
    }
    case CREATED_ACTIVITY: {
      const formData = (action as ActivityFormAction).payload;
      const activity: Activity = {
        ...emptyActivity,
        ...formData,
      };
      const activities = ActivityForest.copy(state.activities);
      activities.add(activity, null);
      return {
        ...state,
        activities,
      };
    }
    case EDITED_ACTIVITY: {
      const activities = ActivityForest.copy(state.activities);
      const formData = (action as ActivityFormAction).payload;
      const activityToUpdate = activities.getData(formData.id);
      if (activityToUpdate) {
        activities.updateActivity({
          ...activityToUpdate,
          ...formData,
        });
      }
      return {
        ...state,
        activities,
      };
    }
    case DELETED_ACTIVITY: {
      const id = (action as IdAction).payload;
      return deleteActivitiesFromState(state, [id]);
    }
    case DELETED_ACTIVITIES: {
      const ids = (action as IdsAction).payload;
      return deleteActivitiesFromState(state, ids);
    }
    case ADDED_SUBACTIVITIES: {
      const {parentId, children} = (action as ParentChildrenAction).payload;
      const activities = ActivityForest.copy(state.activities);
      const parent = activities.getData(parentId);
      if (!parent) {
        return state;
      }
      getNonNullProjections<Activity>(
        children,
        activities.getData.bind(activities),
      ).forEach((activityToAdd: Activity): void => {
        activities.add(activityToAdd, parentId);
      });
      return {
        ...state,
        activities,
      };
    }
    case REMOVED_SUBACTIVITY: {
      const id = (action as IdAction).payload;
      const activities = ActivityForest.copy(state.activities);
      activities.removeFromParent(id);
      return {
        ...state,
        activities,
      };
    }
    case START_ACTIVITY: {
      const {activityId: id} = (action as IntervalAction).payload;
      return {
        ...state,
        currentlyActive: id,
      };
    }
    case SET_CURRENTLY_ACTIVE: {
      const {activityId} = (action as CurrentlyActiveAction).payload;
      return {
        ...state,
        currentlyActive: activityId,
      };
    }
    case STOP_ACTIVITY: {
      return {
        ...state,
        currentlyActive: null,
      };
    }
    case ACTIVITIES_SELECTED: {
      const ids = (action as IdsAction).payload;
      return {
        ...state,
        selectedActivitiesIds: new Set(ids),
      };
    }
    case CLEAR_SELECTED_ACTIVITIES: {
      return {
        ...state,
        selectedActivitiesIds: new Set(),
      };
    }
    case DELETE_INTERVAL: {
      const {deletedInterval, wasActive} = (action as DeletedIntervalAction)
        .payload;
      return produce(state, draft => {
        if (wasActive) {
          draft.currentlyActive = null;
        }
        const activity = draft.activities.getData(
          deletedInterval.parentActivityId,
        );
        if (activity === null) {
          return;
        }
        if (!activity.intervalsIds) {
          activity!.intervalsIds = [];
        }
        activity.intervalsIds = activity.intervalsIds.filter(
          intervalId => intervalId !== deletedInterval.intervalId,
        );
      });
    }
    case UNDO_INTERVAL_DELETION: {
      const {deletedInterval, wasActive} = (action as DeletedIntervalAction)
        .payload;
      return produce(state, draft => {
        if (wasActive) {
          draft.currentlyActive = deletedInterval.parentActivityId;
        }
        const activity = draft.activities.getData(
          deletedInterval.parentActivityId,
        );
        if (activity === null) {
          return;
        }
        if (!activity.intervalsIds) {
          activity!.intervalsIds = [];
        }
        activity.intervalsIds.push(deletedInterval.intervalId);
      });
    }
    default: {
      return state;
    }
  }
}
