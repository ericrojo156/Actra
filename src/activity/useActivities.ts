import {useEffect, useCallback, useState, useMemo} from 'react';
import {ActionSheetIOS} from 'react-native';
import {useDispatch} from 'react-redux';
import {Activity} from '../components/ActivityElement';
import {uuidv4} from '../utils/uuid';
import {
  addSubactivityOptionInvoked,
  deleteActivity,
  deleteActivityOptionInvoked,
  editActivityOptionInvoked,
  historyActivityOptionInvoked,
  joinActivityOptionInvoked,
} from './actions';

export function useActivityOptionCallbacks() {
  const dispatch = useDispatch();
  const onDeleteActivityOption = useCallback(
    (id: string) => {
      dispatch(deleteActivityOptionInvoked(id));
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['dict.Cancel', 'dict.DeleteActivity'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            dispatch(deleteActivity(id));
          }
        },
      );
    },
    [dispatch],
  );
  const onJoinActivityOption = useCallback(
    (id: string) => {
      dispatch(joinActivityOptionInvoked(id));
    },
    [dispatch],
  );
  const onEditActivityOption = useCallback(
    (id: string) => {
      dispatch(editActivityOptionInvoked(id));
    },
    [dispatch],
  );
  const onHistoryActivityOption = useCallback(
    (id: string) => {
      dispatch(historyActivityOptionInvoked(id));
    },
    [dispatch],
  );
  const onAddSubactivityOption = useCallback(
    (id: string) => {
      dispatch(addSubactivityOptionInvoked(id));
    },
    [dispatch],
  );
  return {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
    onAddSubactivityOption,
  };
}

async function getMockActivities(): Promise<Activity[]> {
  const activities: Activity[] = Array.from({length: 100}, (_, index) => ({
    id: uuidv4(),
    name: `Item ${index + 1}`,
    subactivitiesIds: [],
    intervalsIds: [],
    currentlyActiveIntervalId: null,
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
    });
  });
  const activityWithSubactivities = {
    id: uuidv4(),
    name: `Item ${0}`,
    subactivitiesIds,
    intervalsIds: [],
    currentlyActiveIntervalId: null,
  };
  return [activityWithSubactivities, ...activities];
}

export type GetActivityById = (id: string) => Activity | null;

interface ActivitiesData {
  activities: Activity[];
  getActivityById: GetActivityById;
}

interface ActivitiesGetters {
  getActivityById: GetActivityById;
  getActivities: () => Promise<Activity[]>;
}

function useGetActivity(activities: Activity[]): ActivitiesGetters {
  const activitiesMap = useMemo(
    () =>
      new Map(activities.map((activity: Activity) => [activity.id, activity])),
    [activities],
  );
  const getActivityById = useCallback(
    (id: string) => {
      const result = activitiesMap.get(id) ?? null;
      return result;
    },
    [activitiesMap],
  );
  const getActivities = useCallback(getMockActivities, []);
  return {getActivityById, getActivities};
}

export default function useActivities(): ActivitiesData {
  const [activities, setActivities] = useState<Activity[]>([]);
  const {getActivityById, getActivities} = useGetActivity(activities);
  useEffect(() => {
    (async () => {
      try {
        setActivities(await getActivities());
      } catch (e) {
        console.log(e);
      }
    })();
  }, [getActivities]);

  return {
    activities,
    getActivityById,
  };
}
