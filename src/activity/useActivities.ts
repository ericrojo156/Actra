import {useEffect, useCallback} from 'react';
import {Activity} from './ActivityElement';
import * as ColorPalette from '../ColorPalette';
import {ApplicationState} from '../redux/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import {activitiesLoaded} from './redux/activityActions';

async function getMockActivities(): Promise<Activity[]> {
  const activities: Activity[] = [];

  for (let index = 0; index < 1000; index++) {
    const activity: Activity = {
      id: index.toString(),
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

export type GetActivity = (id: string) => Activity | null;
export type GetActivityName = (id: string) => string;

interface ActivitiesData {
  activities: Activity[];
  getActivity: GetActivity;
  getActivityName: GetActivityName;
  deleteActivity: (id: string) => void;
}

interface ActivitiesGetters {
  getActivity: GetActivity;
  getActivityName: GetActivityName;
  getActivities: () => Promise<Activity[]>;
}

export function useGetActivity(): ActivitiesGetters {
  const activitiesMap = useSelector(
    (state: ApplicationState) => state.activity.activities,
  );
  const getActivity = useCallback(
    (id: string) => {
      const result = activitiesMap.get(id) ?? null;
      return result;
    },
    [activitiesMap],
  );
  const getActivityName = useCallback(
    (id: string) => getActivity(id)?.name ?? '',
    [getActivity],
  );
  const getActivities = useCallback(getMockActivities, []);
  return {getActivity, getActivityName, getActivities};
}

function useUpdateActivity() {
  const deleteActivity = useCallback((id: string) => {
    console.log(`delete activity: ${id}`);
  }, []);
  return {
    deleteActivity,
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

export default function useActivities(): ActivitiesData {
  const activities: Activity[] = useSelector((state: ApplicationState) => [
    ...state.activity.activities.values(),
  ]);
  const {getActivity, getActivityName} = useGetActivity();
  const {deleteActivity} = useUpdateActivity();
  return {
    activities,
    getActivity,
    getActivityName,
    deleteActivity,
  };
}
