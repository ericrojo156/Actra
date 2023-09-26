import {
  IForestDataLayer,
  IForestIdLayer,
  TreeNode,
  emptyNode,
} from '../../dataStructures/forest';
import {Activity} from '../ActivityElement';
import {ActivityNode} from '../redux/ActivityState';
import {emptyActivity} from '../redux/activityReducer';
import {Forest} from '../../dataStructures/forest';
import {IdType} from '../../types';

const defaultActivityNode: ActivityNode = {
  ...emptyNode,
  data: emptyActivity,
};

export class ActivityForest
  implements IForestIdLayer, IForestDataLayer<Activity>
{
  private forest: Forest<Activity>;
  constructor(dataItems: Activity[]) {
    this.forest = new Forest<Activity>(dataItems, this.convertToNode);
  }
  convertToNode(
    data: Activity,
    parentData: Activity | null,
  ): TreeNode<Activity> {
    const siblingIndexUnderParent: number =
      parentData?.subactivitiesIds.findIndex(id => id === data.id) ?? -1;
    const siblingNeighborhood: {nextSibling: IdType; prevSibling: IdType} = {
      nextSibling: null,
      prevSibling: null,
    };
    if (parentData !== null && siblingIndexUnderParent >= 0) {
      const nextSiblingIndex = siblingIndexUnderParent + 1;
      siblingNeighborhood.nextSibling =
        nextSiblingIndex < parentData.subactivitiesIds.length
          ? parentData.subactivitiesIds[nextSiblingIndex]
          : null;

      const prevSiblingIndex = siblingIndexUnderParent - 1;
      siblingNeighborhood.prevSibling =
        prevSiblingIndex >= 0
          ? parentData.subactivitiesIds[prevSiblingIndex]
          : null;
    }
    return {
      ...defaultActivityNode,
      id: data.id,
      parentId: data.parentId,
      firstChild: data.subactivitiesIds[0] ?? null,
      lastChild:
        data.subactivitiesIds[data.subactivitiesIds.length - 1] ?? null,
      ...siblingNeighborhood,
      data: data,
    };
  }
  get rootNodes(): TreeNode<Activity>[] {
    return this.forest.rootNodes;
  }
  getData(id: IdType): Activity | null {
    return this.forest.getData(id);
  }
  getChildren(parentId: IdType): TreeNode<Activity>[] {
    return this.forest.getChildren(parentId);
  }
  getChildrenIds(parentId: IdType): IdType[] {
    return this.forest.getChildrenIds(parentId);
  }
  getDescendants(parentId: IdType): TreeNode<Activity>[] {
    return this.forest.getDescendants(parentId);
  }
  get ids(): IdType[] {
    return this.forest.ids;
  }
  get nodes(): TreeNode<Activity>[] {
    return this.forest.nodes;
  }
  get dataList(): Activity[] {
    return this.forest.dataList;
  }
  reassignRootNodes(): void {
    this.forest.reassignRootNodes();
  }
  add(subactivityToAdd: Activity, targetParentId: IdType): void {
    this.forest.addNode(
      this.convertToNode(
        subactivityToAdd,
        this.getData(subactivityToAdd.parentId),
      ),
      targetParentId,
    );
    const originalParent: Activity | null = this.getData(
      subactivityToAdd.parentId,
    );
    if (originalParent) {
      const updatedOriginalParent = {
        ...originalParent,
        subactivitiesIds: originalParent.subactivitiesIds.filter(
          id => id !== subactivityToAdd.id,
        ),
      };
      this.forest.updateNode(
        this.convertToNode(
          updatedOriginalParent,
          this.getData(updatedOriginalParent.parentId),
        ),
      );
    }
  }
  update(node: TreeNode<Activity>): void {
    this.updateActivity(node.data);
  }
  updateActivity(activity: Activity): void {
    const nodeToUpdate = this.forest.getNode(activity.id);
    if (nodeToUpdate) {
      this.forest.updateNode({...nodeToUpdate, data: activity});
    }
  }
  delete(id: IdType): void {
    this.forest.delete(id);
  }
  static copy(activityForest: ActivityForest): ActivityForest {
    const newActivityForest = new ActivityForest([]);
    newActivityForest.forest = Forest.copy(activityForest.forest);
    return newActivityForest;
  }
}
