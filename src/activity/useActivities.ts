import {useCallback} from 'react';
import {Activity} from './ActivityElement';
import {ApplicationState} from '../redux/rootReducer';
import {useSelector} from 'react-redux';
import {IdType} from '../types';
import {uniqueBy} from '../utils/array';
//import * as ColorPalette from '../ColorPalette';
//
// async function getMockActivities(): Promise<Activity[]> {
//   const activities: Activity[] = [];
//   for (let index = 0; index < 100; index++) {
//     const activity: Activity = {
//       id: index.toString(),
//       parentId: null,
//       name: `Activity ${index}`,
//       subactivitiesIds: [],
//       intervalsIds: [],
//       currentlyActiveIntervalId: null,
//       color: ColorPalette.activityDefaultColor,
//     };
//     activities.push(activity);
//   }

//   return activities;
// }

export type GetActivity = (id: IdType) => Activity | null;
export type GetActivityName = (id: IdType) => string;

interface ActivitiesData extends ActivitiesGetters {
  activities: Activity[];
}

interface ActivitiesGetters {
  getActivity: GetActivity;
  getActivityName: GetActivityName;
  getSubactivities: (id: IdType) => Activity[];
  isChildOf: (id: IdType, parentId: IdType) => boolean;
  isDescendantOf: (id: IdType, parentId: IdType) => boolean;
  isAncestorOf: (possibleParentId: IdType, id: IdType) => boolean;
  canAddSubactivities: (id: IdType) => boolean;
  getParent: (id: IdType) => Activity | null;
}

export function useGetActivity(): ActivitiesGetters {
  const activityForest = useSelector(
    (state: ApplicationState) => state.activity.activities,
  );

  const getActivity = useCallback(
    (id: IdType): Activity | null => {
      const result = activityForest.getData(id) ?? null;
      return result;
    },
    [activityForest],
  );

  const getParent = useCallback(
    (id: IdType): Activity | null => activityForest.getParentData(id),
    [activityForest],
  );

  const getActivityName = useCallback(
    (id: IdType) => getActivity(id)?.name ?? '',
    [getActivity],
  );

  const isChildOf = (id: IdType, parentId: IdType): boolean =>
    !!activityForest.getChildrenIds(parentId).find(childId => childId === id);
  const getSubactivities = useCallback(
    (id: IdType) => activityForest.getChildrenData(id),
    [activityForest],
  );

  const isDescendantOf = (id1: IdType, id2: IdType): boolean => {
    const descendants = activityForest.getDescendantsSet(id2);
    return descendants.has(id1);
  };

  const isAncestorOf = (id1: IdType, id2: IdType): boolean => {
    const ancestors = activityForest.getAncestors(id2);
    return ancestors.has(id1);
  };

  const canAddSubactivities = (id: IdType): boolean => {
    const isWithinTreeDepthLimit = activityForest.getAncestors(id).size <= 5;
    const thereExistsASubactivityCandidate: boolean =
      !!activityForest.dataList
        .filter(activity => activity.id !== id)
        .find(
          activity =>
            !isAncestorOf(id, activity.id) && !isDescendantOf(id, activity.id),
        ) ?? false;
    return isWithinTreeDepthLimit && !!thereExistsASubactivityCandidate;
  };

  return {
    getSubactivities,
    isChildOf,
    getActivity,
    getActivityName,
    isDescendantOf,
    isAncestorOf,
    canAddSubactivities,
    getParent,
  };
}

export default function useActivities(parentId?: IdType): ActivitiesData {
  const activities: Activity[] = useSelector((state: ApplicationState) => {
    const dataList = state.activity.activities.dataList;
    if (typeof parentId === 'undefined') {
      return uniqueBy(
        state.activity.activities.dataList,
        (activity: Activity) => activity.id,
      );
    }
    return dataList.filter(activity => activity.parentId === parentId);
  });
  const activityGetters = useGetActivity();
  return {
    activities,
    ...activityGetters,
  };
}
