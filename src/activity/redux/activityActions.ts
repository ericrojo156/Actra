import {Activity} from '../ActivityElement';
import {BaseAction} from '../../types';
import {uuidv4} from '../../utils/uuid';
import {IdAction} from '../../redux/actions';

export const ACTIVITY_WAS_CREATED = 'ACTIVITY_WAS_CREATED';
export const ACTIVITY_WAS_EDITED = 'ACTIVITY_WAS_EDITED';
export const ACTIVITIES_LOADED = 'ACTIVITIES_LOADED';
export const ACTIVITY_STARTED = 'ACTIVITY_STARTED';
export const ACTIVITY_STOPPED = 'ACTIVITY_STOPPED';

export interface ActivitiesAction extends BaseAction {
  payload: Activity[];
}

export interface ActivityFormData {
  id?: string | null;
  name: string;
}

export type ActivityFormAction = BaseAction & {
  payload: ActivityFormData;
};

export function activityWasCreated(data: ActivityFormData): ActivityFormAction {
  return {
    type: ACTIVITY_WAS_CREATED,
    payload: {
      ...data,
      id: uuidv4(),
    },
  };
}

export function activityWasEdited(data: ActivityFormData): ActivityFormAction {
  return {
    type: ACTIVITY_WAS_EDITED,
    payload: data,
  };
}

export function activitiesLoaded(activities: Activity[]): ActivitiesAction {
  return {
    type: ACTIVITIES_LOADED,
    payload: activities,
  };
}

export function activityStarted(id: string | null): IdAction {
  return {
    type: ACTIVITY_STARTED,
    payload: id,
  };
}

export function activityStopped(id: string | null): IdAction {
  return {
    type: ACTIVITY_STOPPED,
    payload: id,
  };
}
