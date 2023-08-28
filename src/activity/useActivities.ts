import {useEffect, useState} from 'react';
import {Activity} from '../components/ActivityElement';
import {uuidv4} from '../utils/uuid';

async function getActivities(): Promise<Activity[]> {
  const activities: Activity[] = Array.from({length: 100}, (_, index) => ({
    id: uuidv4(),
    name: `Item ${index}`,
    subactivitiesIds: [],
    intervalsIds: [],
    currentlyActiveIntervalId: null,
  }));
  return activities;
}

export default function useActivities(): Activity[] {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    (async () => {
      setActivities(await getActivities());
    })();
  }, []);
  return activities;
}
