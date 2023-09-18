import {Activity} from '../ActivityElement';
import {BaseAction} from '../../types';
import {ActivityState} from './ActivityState';
import {
  ACTIVITIES_LOADED,
  ACTIVITY_STARTED,
  ACTIVITY_STOPPED,
  ACTIVITY_WAS_CREATED,
  ACTIVITY_WAS_EDITED,
  ActivitiesAction,
} from './activityActions';
import {IdAction} from '../../redux/actions';

const defaultActivityState: ActivityState = {
  activities: new Map(),
  currentlyActive: null,
};

export default function activityReducer(
  state: ActivityState = defaultActivityState,
  action: BaseAction,
) {
  switch (action.type) {
    case ACTIVITIES_LOADED: {
      const activities = (action as ActivitiesAction).payload;
      return {
        ...state,
        activities: new Map(
          activities.map((activity: Activity) => [activity.id, activity]),
        ),
      };
    }
    case ACTIVITY_WAS_CREATED:
    case ACTIVITY_WAS_EDITED: {
      console.log(action);
      return state;
    }
    case ACTIVITY_STARTED: {
      const id = (action as IdAction).payload;
      return {
        ...state,
        currentlyActive: id,
      };
    }
    case ACTIVITY_STOPPED: {
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
