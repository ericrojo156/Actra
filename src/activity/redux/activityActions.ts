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

export const CREATE_ACTIVITY_REQUESTED = 'CREATE_ACTIVITY_REQUESTED';
export const EDIT_ACTIVITY_REQUESTED = 'EDIT_ACTIVITY_REQUESTED';
export const START_ACTIVITY_REQUESTED = 'START_ACTIVITY_REQUESTED';
export const STOP_ACTIVITY_REQUESTED = 'STOP_ACTIVITY_REQUESTED';
export const ADD_SUBACTIVITIES_REQUESTED = 'ADD_SUBACTIVITIES_REQUESTED';
export const ADD_CREATED_SUBACTIVITY_REQUESTED =
  'ADD_CREATED_SUBACTIVITY_REQUESTED';
export const REMOVE_SUBACTIVITY_REQUESTED = 'REMOVE_SUBACTIVITY_REQUESTED';
export const DELETE_ACTIVITY_REQUESTED = 'DELETE_ACTIVITY_REQUESTED';
export const DELETE_ACTIVITIES_REQUESTED = 'DELETE_ACTIVITIES_REQUESTED';
export const ACTIVITIES_JOIN_REQUESTED = 'ACTIVITIES_JOIN_REQUESTED';

export const CREATE_ACTIVITY = 'CREATE_ACTIVITY';
export const EDIT_ACTIVITY = 'EDIT_ACTIVITY';
export const START_ACTIVITY = 'START_ACTIVITY';
export const STOP_ACTIVITY = 'STOP_ACTIVITY';
export const ADD_SUBACTIVITIES = 'ADD_SUBACTIVITIES';
export const ADD_CREATED_SUBACTIVITY = 'ADD_CREATED_SUBACTIVITY';
export const REMOVE_SUBACTIVITY = 'REMOVE_SUBACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const DELETE_ACTIVITIES = 'DELETE_ACTIVITIES';
export const ACTIVITIES_JOIN = 'ACTIVITIES_JOIN';
export const ACTIVITIES_SELECTED = 'ACTIVITIES_SELECTED';

export const LOADED_ACTIVITIES = 'LOADED_ACTIVITIES';
export const CLEAR_SELECTED_ACTIVITIES = 'CLEAR_SELECTED_ACTIVITIES';
export const SET_CURRENTLY_ACTIVE = 'SET_CURRENTLY_ACTIVE';

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

export interface ActivityIntervalAction extends BaseAction {
  payload: {
    activityId: IdType;
    intervalId: IdType;
  };
}

function createActivityRequested(data: ActivityFormData): ActivityFormAction {
  return {
    type: CREATE_ACTIVITY_REQUESTED,
    payload: data,
  };
}

function createSubactivityRequested(
  data: ActivityFormData,
  parentId: IdType,
): ParentChildAction<ActivityFormData> {
  return {
    type: ADD_CREATED_SUBACTIVITY_REQUESTED,
    payload: {parentId, child: data},
  };
}

function deleteActivityRequested(id: IdType): IdAction {
  return {
    type: DELETE_ACTIVITY_REQUESTED,
    payload: id,
  };
}

function deleteActivitiesRequested(ids: IdType[]): IdsAction {
  return {
    type: DELETE_ACTIVITIES_REQUESTED,
    payload: ids,
  };
}

function addSubactivitiesRequested(
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

function removeSubactivityRequested(child: IdType): IdAction {
  return {
    type: REMOVE_SUBACTIVITY_REQUESTED,
    payload: child,
  };
}

function editActivityRequested(data: ActivityFormData): ActivityFormAction {
  return {
    type: EDIT_ACTIVITY_REQUESTED,
    payload: data,
  };
}

function startActivityRequested(activityId: IdType): IdAction {
  return {
    type: START_ACTIVITY_REQUESTED,
    payload: activityId,
  };
}

function stopActivityRequested(intervalToStop: Interval): IntervalAction {
  return {
    type: STOP_ACTIVITY_REQUESTED,
    payload: intervalToStop,
  };
}

function activitiesJoinRequested(
  targetParentId: IdType,
  ids: IdType[],
): CombinedActivitiesAction {
  return {
    type: ACTIVITIES_JOIN_REQUESTED,
    payload: {targetParentId, ids},
  };
}
function createActivity(data: ActivityFormData): ActivityFormAction {
  return {
    type: CREATE_ACTIVITY,
    payload: data,
  };
}

function createSubactivity(
  data: ActivityFormData,
  parentId: IdType,
): ParentChildAction<ActivityFormData> {
  return {
    type: ADD_CREATED_SUBACTIVITY,
    payload: {parentId, child: data},
  };
}

function deleteActivity(id: IdType): IdAction {
  return {
    type: DELETE_ACTIVITY,
    payload: id,
  };
}

function deleteActivities(ids: IdType[]): IdsAction {
  return {
    type: DELETE_ACTIVITIES,
    payload: ids,
  };
}

function addSubactivities(
  parentId: IdType,
  subactivities: IdType[],
): ParentChildrenAction {
  return {
    type: ADD_SUBACTIVITIES,
    payload: {
      parentId,
      children: subactivities,
    },
  };
}

function removeSubactivity(child: IdType): IdAction {
  return {
    type: REMOVE_SUBACTIVITY,
    payload: child,
  };
}

function editActivity(data: ActivityFormData): ActivityFormAction {
  return {
    type: EDIT_ACTIVITY,
    payload: data,
  };
}

function startActivity(
  activityId: IdType,
  intervalId: IdType,
): ActivityIntervalAction {
  return {
    type: START_ACTIVITY,
    payload: {activityId, intervalId},
  };
}

function stopActivity(intervalToStop: Interval): IntervalAction {
  return {
    type: STOP_ACTIVITY,
    payload: intervalToStop,
  };
}

function activitiesJoin(
  targetParentId: IdType,
  ids: IdType[],
): CombinedActivitiesAction {
  return {
    type: ACTIVITIES_JOIN,
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

export function clearSelectedActivities(): BaseAction {
  return {
    type: CLEAR_SELECTED_ACTIVITIES,
  };
}

export function loadedActivities(activities: Activity[]): ActivitiesAction {
  return {
    type: LOADED_ACTIVITIES,
    payload: activities,
  };
}

export default {
  createActivity: {
    request: createActivityRequested,
    action: createActivity,
  },
  createSubactivity: {
    request: createSubactivityRequested,
    action: createSubactivity,
  },
  deleteActivities: {
    request: deleteActivitiesRequested,
    action: deleteActivities,
  },
  deleteActivity: {
    request: deleteActivityRequested,
    action: deleteActivity,
  },
  addSubactivities: {
    request: addSubactivitiesRequested,
    action: addSubactivities,
  },
  removeSubactivity: {
    request: removeSubactivityRequested,
    action: removeSubactivity,
  },
  editActivity: {
    request: editActivityRequested,
    action: editActivity,
  },
  startActivity: {
    request: startActivityRequested,
    action: startActivity,
  },
  stopActivity: {
    request: stopActivityRequested,
    action: stopActivity,
  },
  activitiesJoin: {
    request: activitiesJoinRequested,
    action: activitiesJoin,
  },
};
