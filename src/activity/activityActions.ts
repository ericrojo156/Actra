import {Activity} from './ActivityElement';
import {BaseAction} from '../types';

export const ACTIVITIES_LOADED = 'ACTIVITIES_LOADED';

export interface ActivitiesAction extends BaseAction {
  payload: Activity[];
}

export function activitiesLoaded(activities: Activity[]): ActivitiesAction {
  return {
    type: ACTIVITIES_LOADED,
    payload: activities,
  };
}
