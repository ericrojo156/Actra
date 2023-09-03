import {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Activity} from '../components/ActivityElement';
import {uuidv4} from '../utils/uuid';
import {
  deleteActivityOptionInvoked,
  editActivityOptionInvoked,
  historyActivityOptionInvoked,
  joinActivityOptionInvoked,
} from './actions';

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

interface ActivitiesData {
  activities: Activity[];
  onDeleteActivityOption: (id: string) => void;
  onJoinActivityOption: (id: string) => void;
  onEditActivityOption: (id: string) => void;
  onHistoryActivityOption: (id: string) => void;
}

export default function useActivities(): ActivitiesData {
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    (async () => {
      try {
        setActivities(await getActivities());
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  const onDeleteActivityOption = useCallback(
    (id: string) => {
      dispatch(deleteActivityOptionInvoked(id));
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
  return {
    activities,
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
  };
}
