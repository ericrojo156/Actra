import {
  IForestDataLayer,
  IForestIdLayer,
  TreeNode,
} from '../../dataStructures/forest';
import {Activity} from '../ActivityElement';
import {ActivityNode} from '../redux/ActivityState';
import {emptyActivity} from '../redux/activityReducer';
import {Forest} from '../../dataStructures/forest';
import {IdType} from '../../types';

const defaultActivityNode: ActivityNode = {
  id: null,
  parent: null,
  firstChild: null,
  lastChild: null,
  prevSibling: null,
  nextSibling: null,
  data: emptyActivity,
};

function createActivityNode(data: Activity): TreeNode<Activity> {
  return {
    ...defaultActivityNode,
    id: data.id,
    data,
  };
}

export class ActivityForest
  implements IForestIdLayer, IForestDataLayer<Activity>
{
  private forest: Forest<Activity>;
  constructor(dataItems: Activity[]) {
    this.forest = new Forest<Activity>(dataItems, createActivityNode);
  }
  getData(id: IdType): Activity | null {
    return this.forest.getData(id);
  }
  getChildrenData(parentId: IdType): Activity[] {
    return this.forest.getChildren(parentId).map(node => node.data);
  }
  getChildrenIds(parentId: IdType): IdType[] {
    return this.forest.getChildrenIds(parentId);
  }
  getDescendantsData(parentId: IdType): Activity[] {
    return this.forest.getDescendants(parentId).map(node => node.data);
  }
  get ids(): IdType[] {
    return this.forest.ids;
  }
  get dataList(): Activity[] {
    return this.forest.dataList;
  }
  reassignRootNodes(): void {
    this.forest.reassignRootNodes();
  }
  add(dataToAdd: Activity, targetParentId: IdType): void {
    const nodeToAdd =
      this.forest.getNode(dataToAdd.id) ?? createActivityNode(dataToAdd);
    this.delete(dataToAdd.id);
    nodeToAdd.data.parentId = targetParentId;
    this.forest.addNode(nodeToAdd, targetParentId);
    console.log(`add ${nodeToAdd.id} to ${targetParentId}`);
    console.log('ActivityForest.add():');
    console.log(this);
    console.log('^^^');
  }
  updateActivity(activity: Activity): void {
    const nodeToUpdate = this.forest.getNode(activity.id);
    if (nodeToUpdate) {
      this.forest.updateNode({...nodeToUpdate, data: activity});
    }
  }
  delete(id: IdType): void {
    const parent = this.forest.getParent(id);
    if (parent) {
      parent.data.subactivitiesIds = parent.data.subactivitiesIds.filter(
        childId => childId !== id,
      );
    }
    this.forest.delete(id);
  }
  static copy(activityForest: ActivityForest): ActivityForest {
    const newActivityForest = new ActivityForest([]);
    newActivityForest.forest = Forest.copy(
      activityForest.forest,
      createActivityNode,
    );
    return newActivityForest;
  }
}
