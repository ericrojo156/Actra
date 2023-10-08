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
  IntervalAction,
  START_ACTIVITY,
  STOP_ACTIVITY,
  DELETED_ACTIVITIES,
} from './activityActions';
import {IdAction, IdsAction, ParentChildrenAction} from '../../redux/actions';
import {getNonNullProjections} from '../../utils/projections';
import {ActivityForest} from '../dataStructures/activityForest';

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
  activities: new ActivityForest([]),
  currentlyActive: null,
};

function deleteActivitiesFromStore(
  state: ActivityState,
  ids: IdType[],
): ActivityState {
  const activities = ActivityForest.copy(state.activities);
  ids.forEach((id: IdType) => {
    const activityToDelete = activities.getData(id);
    if (activityToDelete) {
      getNonNullProjections(
        activityToDelete.subactivitiesIds,
        activities.getData.bind(activities),
      ).forEach((subactivity: Activity) => {
        subactivity.parentId = null;
      });
    }
    activities.remove(id);
  });
  return {
    ...state,
    activities,
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
      return deleteActivitiesFromStore(state, [id]);
    }
    case DELETED_ACTIVITIES: {
      const ids = (action as IdsAction).payload;
      return deleteActivitiesFromStore(state, ids);
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
    case START_ACTIVITY: {
      const {activityId: id} = (action as IntervalAction).payload;
      return {
        ...state,
        currentlyActive: id,
      };
    }
    case STOP_ACTIVITY: {
      return {
        ...state,
        currentlyActive: null,
      };
    }
    default: {
      return state;
    }
  }
}
