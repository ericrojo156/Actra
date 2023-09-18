import {Activity} from '../ActivityElement';

export interface ActivityState {
  activities: Map<string, Activity>;
  currentlyActive: string | null;
}
