import {Activity} from '../ActivityElement';
import {BaseAction, IdType} from '../../types';
import {IdAction, ParentChildrenAction} from '../../redux/actions';

export const CREATED_ACTIVITY = 'CREATED_ACTIVITY';
export const EDITED_ACTIVITY = 'EDITED_ACTIVITY';
export const LOADED_ACTIVITIES = 'LOADED_ACTIVITIES';
export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const STOPPED_ACTIVITY = 'STOPPED_ACTIVITY';
export const ADDED_SUBACTIVITIES = 'ADDED_SUBACTIVITY';
export const ADDED_CREATED_SUBACTIVITY = 'ADDED_CREATED_SUBACTIVITY';
export const REMOVED_SUBACTIVITY = 'REMOVED_SUBACTIVITY';
export const DELETED_ACTIVITY = 'DELETED_ACTIVITY';

export interface ActivitiesAction extends BaseAction {
  payload: Activity[];
}

export interface TimerAction extends BaseAction {
  payload: {
    activityId: IdType;
    intervalId: IdType;
  };
}

export interface ActivityFormData {
  id: IdType;
  name: string;
}

export type ActivityFormAction = BaseAction & {
  payload: ActivityFormData;
};

export function createdActivity(data: ActivityFormData): ActivityFormAction {
  return {
    type: CREATED_ACTIVITY,
    payload: data,
  };
}

export function deletedActivity(id: IdType): IdAction {
  return {
    type: DELETED_ACTIVITY,
    payload: id,
  };
}

export function addedSubactivities(
  parentId: IdType,
  subactivities: IdType[],
): ParentChildrenAction {
  return {
    type: ADDED_SUBACTIVITIES,
    payload: {
      parentId,
      children: subactivities,
    },
  };
}

export function removedSubactivity(child: IdType): IdAction {
  return {
    type: REMOVED_SUBACTIVITY,
    payload: child,
  };
}

export function activityWasEdited(data: ActivityFormData): ActivityFormAction {
  return {
    type: EDITED_ACTIVITY,
    payload: data,
  };
}

export function activitiesLoaded(activities: Activity[]): ActivitiesAction {
  return {
    type: LOADED_ACTIVITIES,
    payload: activities,
  };
}

export function startedActivity(
  activityId: IdType,
  intervalId: IdType,
): TimerAction {
  return {
    type: STARTED_ACTIVITY,
    payload: {activityId, intervalId},
  };
}

export function stoppedActivity(
  id: IdType,
  currentlyActiveInterval: IdType,
): TimerAction {
  return {
    type: STOPPED_ACTIVITY,
    payload: {
      activityId: id,
      intervalId: currentlyActiveInterval,
    },
  };
}
