import {Activity} from '../ActivityElement';
import {TreeNode} from '../../dataStructures/forest';
import {IdType} from '../../types';
import {ActivityForest} from '../dataStructures/activityForest';

export type ActivityNode = TreeNode<Activity>;

export interface ActivityState {
  activities: ActivityForest;
  currentlyActive: IdType;
}
