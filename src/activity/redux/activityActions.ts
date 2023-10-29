import {Activity} from '../ActivityElement';
import {BaseAction, IdType} from '../../types';
import {
  CurrentlyActiveAction,
  IdAction,
  IdsAction,
  ParentChildAction,
  ParentChildrenAction,
} from '../../redux/actions';
import {IntervalAction} from '../../interval/redux/intervalsActions';
import {Interval} from '../../interval/types';
export const CREATED_ACTIVITY = 'CREATED_ACTIVITY';
export const EDITED_ACTIVITY = 'EDITED_ACTIVITY';
export const LOADED_ACTIVITIES = 'LOADED_ACTIVITIES';
export const START_ACTIVITY = 'START_ACTIVITY';
export const STOP_ACTIVITY = 'STOP_ACTIVITY';
export const SET_CURRENTLY_ACTIVE = 'SET_CURRENTLY_ACTIVE';
export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const STOPPED_ACTIVITY = 'STOPPED_ACTIVITY';
export const ADD_SUBACTIVITIES_REQUESTED = 'ADD_SUBACTIVITIES_REQUESTED';
export const ADDED_SUBACTIVITIES = 'ADDED_SUBACTIVITY';
export const CLEAR_SELECTED_ACTIVITIES = 'CLEAR_SELECTED_ACTIVITIES';
export const ADDED_CREATED_SUBACTIVITY = 'ADDED_CREATED_SUBACTIVITY';
export const REMOVED_SUBACTIVITY = 'REMOVED_SUBACTIVITY';
export const JOINED_ACTIVITIES = 'JOINED_ACTIVITIES';
export const DELETED_ACTIVITY = 'DELETED_ACTIVITY';
export const DELETED_ACTIVITIES = 'DELETED_ACTIVITIES';
export const ACTIVITIES_SELECTED = 'ACTIVITIES_SELECTED';

export interface ActivitiesAction extends BaseAction {
  payload: Activity[];
}

export interface ActivityFormData {
  id: IdType;
  name: string;
}

export interface CombinedActivitiesPayload {
  targetParentId: IdType;
  ids: IdType[];
}

export interface CombinedActivitiesAction extends BaseAction {
  payload: CombinedActivitiesPayload;
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

export function createdSubactivity(
  data: ActivityFormData,
  parentId: IdType,
): ParentChildAction<ActivityFormData> {
  return {
    type: ADDED_CREATED_SUBACTIVITY,
    payload: {parentId, child: data},
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

export function addSubactivitiesRequested(
  parentId: IdType,
  subactivities: IdType[],
): ParentChildrenAction {
  return {
    type: ADD_SUBACTIVITIES_REQUESTED,
    payload: {
      parentId,
      children: subactivities,
    },
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

export function clearSelectedActivities(): BaseAction {
  return {
    type: CLEAR_SELECTED_ACTIVITIES,
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

export function loadedActivities(activities: Activity[]): ActivitiesAction {
  return {
    type: LOADED_ACTIVITIES,
    payload: activities,
  };
}

export function startActivity(activityId: IdType): IdAction {
  return {
    type: START_ACTIVITY,
    payload: activityId,
  };
}

export function stopActivity(intervalToStop: Interval): IntervalAction {
  return {
    type: STOP_ACTIVITY,
    payload: intervalToStop,
  };
}

export function startedActivity(activityId: IdType): IdAction {
  return {
    type: STARTED_ACTIVITY,
    payload: activityId,
  };
}

export function stoppedActivity(intervalToStop: Interval): IntervalAction {
  return {
    type: STOPPED_ACTIVITY,
    payload: intervalToStop,
  };
}

export function joinedActivities(
  targetParentId: IdType,
  ids: IdType[],
): CombinedActivitiesAction {
  return {
    type: JOINED_ACTIVITIES,
    payload: {targetParentId, ids},
  };
}

export function activitiesSelected(ids: IdType[]): IdsAction {
  return {
    type: ACTIVITIES_SELECTED,
    payload: ids,
  };
}

export function setCurrentlyActive(
  activityId: IdType,
  intervalId: IdType,
): CurrentlyActiveAction {
  return {
    type: SET_CURRENTLY_ACTIVE,
    payload: {
      activityId,
      intervalId,
    },
  };
}
