import {Activity} from './ActivityElement';
import {BaseAction} from '../types';
import {uuidv4} from '../utils/uuid';

export const ACTIVITY_WAS_CREATED = 'ACTIVITY_WAS_CREATED';
export const ACTIVITY_WAS_EDITED = 'ACTIVITY_WAS_EDITED';
export const ACTIVITIES_LOADED = 'ACTIVITIES_LOADED';

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
