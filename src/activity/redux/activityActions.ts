import {Activity} from '../ActivityElement';
import {BaseAction, IdType} from '../../types';
import {IdAction, IdsAction, ParentChildrenAction} from '../../redux/actions';

export const CREATED_ACTIVITY = 'CREATED_ACTIVITY';
export const EDITED_ACTIVITY = 'EDITED_ACTIVITY';
export const LOADED_ACTIVITIES = 'LOADED_ACTIVITIES';
export const START_ACTIVITY = 'START_ACTIVITY';
export const STOP_ACTIVITY = 'STOP_ACTIVITY';
export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const STOPPED_ACTIVITY = 'STOPPED_ACTIVITY';
export const ADDED_SUBACTIVITIES = 'ADDED_SUBACTIVITY';
export const ADDED_CREATED_SUBACTIVITY = 'ADDED_CREATED_SUBACTIVITY';
export const REMOVED_SUBACTIVITY = 'REMOVED_SUBACTIVITY';
export const JOINED_ACTIVITIES = 'JOINED_ACTIVITIES';
export const DELETED_ACTIVITY = 'DELETED_ACTIVITY';
export const DELETED_ACTIVITIES = 'DELETED_ACTIVITIES';

export interface ActivitiesAction extends BaseAction {
  payload: Activity[];
}

export interface IntervalAction extends BaseAction {
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

export function deletedActivities(ids: IdType[]): IdsAction {
  return {
    type: DELETED_ACTIVITIES,
    payload: ids,
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

export function startActivity(
  activityId: IdType,
  intervalId: IdType,
): IntervalAction {
  return {
    type: START_ACTIVITY,
    payload: {activityId, intervalId},
  };
}

export function stopActivity(
  id: IdType,
  currentlyActiveInterval: IdType,
): IntervalAction {
  return {
    type: STOP_ACTIVITY,
    payload: {
      activityId: id,
      intervalId: currentlyActiveInterval,
    },
  };
}

export function startedActivity(
  activityId: IdType,
  intervalId: IdType,
): IntervalAction {
  return {
    type: STARTED_ACTIVITY,
    payload: {activityId, intervalId},
  };
}

export function stoppedActivity(
  id: IdType,
  currentlyActiveInterval: IdType,
): IntervalAction {
  return {
    type: STOPPED_ACTIVITY,
    payload: {
      activityId: id,
      intervalId: currentlyActiveInterval,
    },
  };
}

export function joinedActivities(ids: IdType[]): IdsAction {
  return {
    type: JOINED_ACTIVITIES,
    payload: ids,
  };
}
