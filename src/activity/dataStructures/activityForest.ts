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
  getParentData(id: IdType): Activity | null {
    return this.forest.getParent(id)?.data ?? null;
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
  getAncestors(descendantId: IdType): Set<IdType> {
    return this.forest.getAncestors(descendantId);
  }
  get roots(): Activity[] {
    return this.forest.rootNodes.map(node => node.data);
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
    this.removeFromParent(dataToAdd.id);
    nodeToAdd.data.parentId = targetParentId;
    const targetParent = this.forest.getNode(targetParentId);
    if (targetParent) {
      if (typeof targetParent.data.subactivitiesIds === 'undefined') {
        targetParent.data.subactivitiesIds = [];
      }
      targetParent.data.subactivitiesIds.push(dataToAdd.id);
    }
    this.forest.addNode(nodeToAdd, targetParentId);
  }
  updateActivity(activity: Activity): void {
    const nodeToUpdate = this.forest.getNode(activity.id);
    if (nodeToUpdate) {
      this.forest.updateNode({...nodeToUpdate, data: activity});
    }
  }
  delete(id: IdType): void {
    // note: it is cleanest to first remove the node before deleting, which must be done through the data layer of ActivityForest (and in that method, the node layer will be taken care of)
    this.removeFromParent(id);
    this.forest.delete(id);
  }
  removeFromParent(id: IdType): void {
    const parent = this.forest.getParent(id);
    if (parent) {
      parent.data.subactivitiesIds =
        parent.data.subactivitiesIds?.filter(childId => childId !== id) ?? [];
    }
    const activity: Activity | null = this.getData(id);
    if (activity) {
      activity.parentId = null;
    }
    this.forest.removeFromParent(id);
  }
  static copy(activityForest: ActivityForest): ActivityForest {
    const newActivityForest = new ActivityForest([]);
    newActivityForest.forest = Forest.copy(
      activityForest.forest,
      createActivityNode,
    );
    return newActivityForest;
  }
  getDescendantsSet(id: IdType): Set<IdType> {
    return this.forest.getDescendantsRecord(id);
  }
}
