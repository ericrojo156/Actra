import {Activity} from '../ActivityElement';
import {TreeNode, Forest} from '../../dataStructures/tree';
import {IdType} from '../../types';

export type ActivityNode = TreeNode<Activity>;
export type ActivitiesForest = Forest<Activity>;

export interface ActivityState {
  activities: ActivitiesForest;
  currentlyActive: IdType;
}
