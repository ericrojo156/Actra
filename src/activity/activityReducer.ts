import {Activity} from '../components/ActivityElement';
import {BaseAction} from '../types';
import {ActivityState} from './ActivityState';
import {ACTIVITIES_LOADED, ActivitiesAction} from './activityActions';

const defaultActivityState = {
  activities: new Map(),
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
    default: {
      return state;
    }
  }
}
