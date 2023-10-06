import {useEffect, useCallback} from 'react';
import {Activity} from './ActivityElement';
import * as ColorPalette from '../ColorPalette';
import {ApplicationState} from '../redux/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import {activitiesLoaded} from './redux/activityActions';
import {IdType} from '../types';
import {uniqueBy} from '../utils/array';

async function getMockActivities(): Promise<Activity[]> {
  const activities: Activity[] = [];
  for (let index = 0; index < 6; index++) {
    const activity: Activity = {
      id: index.toString(),
      parentId: null,
      name: `Item ${index}`,
      subactivitiesIds: [],
      intervalsIds: [],
      currentlyActiveIntervalId: null,
      color: ColorPalette.activityDefaultColor,
    };

    activities.push(activity);
  }

  return activities;
}

export type GetActivity = (id: IdType) => Activity | null;
export type GetActivityName = (id: IdType) => string;

interface ActivitiesData extends ActivitiesGetters {
  activities: Activity[];
}

interface ActivitiesGetters {
  getActivity: GetActivity;
  getActivityName: GetActivityName;
  getActivities: () => Promise<Activity[]>;
  getSubactivities: (id: IdType) => Activity[];
  isChildOf: (id: IdType, parentId: IdType) => boolean;
  isDescendantOf: (id: IdType, parentId: IdType) => boolean;
  canAddSubactivities: (id: IdType) => boolean;
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
  const getActivityName = useCallback(
    (id: IdType) => getActivity(id)?.name ?? '',
    [getActivity],
  );
  const getActivities = useCallback(getMockActivities, []);
  const isChildOf = (id: IdType, parentId: IdType): boolean =>
    !!activityForest.getChildrenIds(parentId).find(childId => childId === id);
  const getSubactivities = useCallback(
    (id: IdType) => activityForest.getChildrenData(id),
    [activityForest],
  );
  const isDescendantOf = (id: IdType, parentId: IdType): boolean =>
    !!activityForest.getDescendantsSet(parentId).has(id);
  const canAddSubactivities = (id: IdType): boolean =>
    !(
      activityForest.roots.length === 1 &&
      isDescendantOf(id, activityForest.roots[0]?.id)
    );
  return {
    getSubactivities,
    isChildOf,
    getActivity,
    getActivityName,
    getActivities,
    isDescendantOf,
    canAddSubactivities,
  };
}

export function useActivitiesFetch() {
  const dispatch = useDispatch();
  const setActivities = useCallback(
    (payload: Activity[]) => {
      dispatch(activitiesLoaded(payload));
    },
    [dispatch],
  );
  const {getActivities} = useGetActivity();
  useEffect(() => {
    (async () => {
      try {
        setActivities(await getActivities());
      } catch (e) {
        console.log(e);
      }
    })();
  }, [getActivities, setActivities]);
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
