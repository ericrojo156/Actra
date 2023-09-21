import {Activity} from '../ActivityElement';
import {BaseAction} from '../../types';
import {ActivityNode, ActivityState} from './ActivityState';
import {
  LOADED_ACTIVITIES,
  STARTED_ACTIVITY,
  STOPPED_ACTIVITY,
  CREATED_ACTIVITY,
  DELETED_ACTIVITY,
  EDITED_ACTIVITY,
  ActivitiesAction,
  ActivityFormAction,
  ADDED_SUBACTIVITIES,
} from './activityActions';
import {IdAction, ParentChildrenAction} from '../../redux/actions';
import {Forest, emptyNode} from '../../dataStructures/tree';
import {getNonNullProjections} from '../../utils/projections';

export const emptyActivity: Activity = {
  id: null,
  parentId: null,
  name: '',
  subactivitiesIds: [],
  intervalsIds: [],
  currentlyActiveIntervalId: null,
};

const defaultActivityNode: ActivityNode = {
  ...emptyNode,
  data: emptyActivity,
};

function convertActivityToTreeNode(activity: Activity): ActivityNode {
  return {
    ...defaultActivityNode,
    id: activity.id,
    parentId: activity.parentId,
    firstChild: activity.subactivitiesIds[0] ?? null,
    lastChild:
      activity.subactivitiesIds[activity.subactivitiesIds.length - 1] ?? null,
    nextSibling: null,
    prevSibling: null,
    data: activity,
  };
}

const defaultActivityState: ActivityState = {
  activities: new Forest<Activity>([], convertActivityToTreeNode),
  currentlyActive: null,
};

export default function activityReducer(
  state: ActivityState = defaultActivityState,
  action: BaseAction,
): ActivityState {
  switch (action.type) {
    case LOADED_ACTIVITIES: {
      const activities = (action as ActivitiesAction).payload;
      const activitiesForest = new Forest(
        activities,
        convertActivityToTreeNode,
      );
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
      const activities = Forest.copy(state.activities);
      activities.add(activity);
      return {
        ...state,
        activities,
      };
    }
    case EDITED_ACTIVITY: {
      const activities = Forest.copy(state.activities);
      const formData = (action as ActivityFormAction).payload;
      const preexistingNode: ActivityNode | null =
        state.activities.getNode(formData.id) ?? null;
      if (!preexistingNode) {
        return state;
      }
      const updatedNode: ActivityNode = {
        ...preexistingNode,
        data: {
          ...preexistingNode.data,
          ...formData,
        },
      };
      activities.update(updatedNode);
      return {
        ...state,
        activities: activities,
      };
    }
    case DELETED_ACTIVITY: {
      const activities = Forest.copy(state.activities);
      const id = (action as IdAction).payload;
      const activityToDelete = activities.getData(id);
      if (activityToDelete) {
        getNonNullProjections(
          activityToDelete.subactivitiesIds,
          activities.getData.bind(activities),
        ).forEach((subactivity: Activity) => {
          subactivity.parentId = null;
        });
      }
      activities.delete(id);
      return {
        ...state,
        activities: activities,
      };
    }
    case ADDED_SUBACTIVITIES: {
      const activities = Forest.copy(state.activities);
      const {parentId, children} = (action as ParentChildrenAction).payload;
      const parent = activities.getNode(parentId);
      if (!parent) {
        return state;
      }
      getNonNullProjections<Activity>(children, activities.getData).forEach(
        (activityToAdd: Activity): void => {
          activities.add({...activityToAdd, parentId});
          parent.data.subactivitiesIds.push(activityToAdd.id);
        },
      );
      return {
        ...state,
        activities,
      };
    }
    case STARTED_ACTIVITY: {
      const id = (action as IdAction).payload;
      return {
        ...state,
        currentlyActive: id,
      };
    }
    case STOPPED_ACTIVITY: {
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
