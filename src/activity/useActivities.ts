import {useEffect, useCallback} from 'react';
import {Activity} from '../components/ActivityElement';
import * as ColorPalette from '../ColorPalette';
import {uuidv4} from '../utils/uuid';
import {ApplicationState} from '../redux/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import {activitiesLoaded} from './activityActions';

async function getMockActivities(): Promise<Activity[]> {
  const activities: Activity[] = Array.from({length: 100}, (_, index) => ({
    id: uuidv4(),
    name: `Item ${index + 1}`,
    subactivitiesIds: [],
    intervalsIds: [],
    currentlyActiveIntervalId: null,
    color: ColorPalette.activityDefaultColor,
  }));
  const subactivitiesIds = [
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
  ];
  subactivitiesIds.forEach((id, index) => {
    activities.push({
      id,
      name: `Item ${index + activities.length}`,
      subactivitiesIds: [],
      intervalsIds: [],
      currentlyActiveIntervalId: null,
      color: ColorPalette.activityDefaultColor,
    });
  });
  const activityWithSubactivities = {
    id: uuidv4(),
    name: `Item ${0}`,
    subactivitiesIds,
    intervalsIds: [],
    currentlyActiveIntervalId: null,
    color: ColorPalette.activityDefaultColor,
  };
  return [activityWithSubactivities, ...activities];
}

export type GetActivity = (id: string) => Activity | null;

interface ActivitiesData {
  activities: Activity[];
  getActivity: GetActivity;
  deleteActivity: (id: string) => void;
}

interface ActivitiesGetters {
  getActivity: GetActivity;
  getActivities: () => Promise<Activity[]>;
}

function useGetActivity(): ActivitiesGetters {
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
  const getActivities = useCallback(getMockActivities, []);
  return {getActivity, getActivities};
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
  const {getActivity} = useGetActivity();
  const {deleteActivity} = useUpdateActivity();
  return {
    activities,
    getActivity,
    deleteActivity,
  };
}
