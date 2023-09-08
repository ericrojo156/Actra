import {useEffect, useCallback, useState, useMemo} from 'react';
import {Activity} from '../components/ActivityElement';
import {uuidv4} from '../utils/uuid';

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
