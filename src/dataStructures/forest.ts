import {IdType, IdPropWithParentId} from '../types';
import {getNonNullProjections} from '../utils/projections';

export interface TreeNode<T> {
  id: IdType;
  parent: TreeNode<T> | null;
  firstChild: TreeNode<T> | null;
  lastChild: TreeNode<T> | null;
  prevSibling: TreeNode<T> | null;
  nextSibling: TreeNode<T> | null;
  data: T;
}

export interface IForestIdLayer {
  get ids(): IdType[];
  getChildrenIds(parentId: IdType): IdType[];
}

export interface IForestNodesLayer<T extends IdPropWithParentId> {
  get nodes(): TreeNode<T>[];
  get rootNodes(): TreeNode<T>[];
  reassignRootNodes(): void;
  getNode(id: IdType): TreeNode<T> | null;
  getParent(childId: IdType): TreeNode<T> | null;
  updateNode(node: TreeNode<T>): void;
  delete(id: IdType): void;
  removeFromParent(id: IdType): void;
  getChildren(parentId: IdType): TreeNode<T>[];
  addNode(nodeToAdd: TreeNode<T>, targetParentId: IdType): void;
}

export interface IForestDataLayer<T extends IdPropWithParentId> {
  get dataList(): T[];
  get roots(): T[];
  getData(id: IdType): T | null;
}

export class Forest<T extends IdPropWithParentId>
  implements IForestIdLayer, IForestNodesLayer<T>
{
  private nodesMap: Map<IdType, TreeNode<T>>;
  private roots: Set<IdType>;
  get rootNodes(): TreeNode<T>[] {
    return getNonNullProjections(
      [...this.roots.values()],
      this.getNode.bind(this),
    );
  }
  constructor(dataItems: T[], createNode: (data: T) => TreeNode<T>) {
    this.nodesMap = new Map(
      dataItems.map(data => [
        data.id,
        createNode(JSON.parse(JSON.stringify(data))),
      ]),
    );
    this.roots = new Set();
    if (!dataItems) {
      return;
    }
    dataItems.forEach((data: T) => {
      const node = this.getNode(data.id) ?? createNode(data);
      this.addNode(node, data.parentId);
    });
    this.reassignRootNodes();
  }
  getAncestors(descendantId: IdType): Set<IdType> {
    const ids = new Set<IdType>();
    let parentId = this.getParent(descendantId)?.id ?? null;
    while (parentId !== null) {
      ids.add(parentId);
      parentId = this.getParent(parentId)?.id ?? null;
    }
    return ids;
  }
  reassignRootNodes() {
    this.roots = new Set(
      [...this.nodesMap.values()]
        .filter(node => node.parent === null)
        .map(node => node.id),
    );
  }
  addNode(nodeToAdd: TreeNode<T>, targetParentId: IdType): void {
    const targetParent = this.getNode(targetParentId);
    nodeToAdd.parent = targetParent;
    this.nodesMap.set(nodeToAdd.id, nodeToAdd);
    if (targetParent === null) {
      this.roots.add(nodeToAdd.id);
      return;
    }
    const lastChild = targetParent?.lastChild ?? null;
    if (targetParent?.firstChild === null) {
      targetParent.firstChild = nodeToAdd;
      targetParent.lastChild = nodeToAdd;
    } else if (lastChild !== null) {
      targetParent.lastChild = nodeToAdd;
      lastChild.nextSibling = nodeToAdd;
      nodeToAdd.prevSibling = lastChild;
    }
    this.reassignRootNodes();
  }
  updateNode(node: TreeNode<T>): void {
    this.nodesMap.set(node.id, node);
    if (node.parent === null) {
      this.reassignRootNodes();
    }
  }
  *getNextChild(node: TreeNode<T>): Generator<TreeNode<T> | null> {
    let currentChild = node.firstChild;
    while (currentChild) {
      yield currentChild;
      if (currentChild === node.lastChild) {
        break;
      }
      currentChild = currentChild.nextSibling;
    }
    yield null;
  }
  private removeNodeFromParentLinkings(node: TreeNode<T>) {
    const parent = this.getParent(node.id);
    if (parent && parent.firstChild !== null) {
      if (parent.firstChild.id === node.id) {
        parent.firstChild = node.nextSibling;
      }
      if (parent.lastChild?.id === node.id) {
        parent.lastChild = node.prevSibling;
      }
      node.parent = null;
    }
  }
  private removeNodeFromSiblingsLinkings(node: TreeNode<T>) {
    const nodePrevSibling = node.prevSibling;
    const nodeNextSibling = node.nextSibling;
    if (nodePrevSibling) {
      nodePrevSibling.nextSibling = nodeNextSibling;
    }
    if (nodeNextSibling) {
      nodeNextSibling.prevSibling = nodePrevSibling;
    }
    // This node becomes a root node. There is no need to keep references to sibling root nodes, since order is maintained by Forest.rootNodes array rather than via sibling nodes linked list
    node.nextSibling = null;
    node.prevSibling = null;
  }
  delete(id: IdType): void {
    const nodeToDelete = this.getNode(id);
    if (nodeToDelete === null) {
      return;
    }
    const prevSibling = nodeToDelete.prevSibling ?? null;
    if (prevSibling) {
      prevSibling.nextSibling = nodeToDelete.nextSibling;
    }
    const nextSibling = nodeToDelete.nextSibling ?? null;
    if (nextSibling) {
      nextSibling.prevSibling = nodeToDelete.prevSibling;
    }
    this.getChildren(id)?.forEach(child => {
      // Immediate child nodes become root nodes, but they maintain their own subtrees
      child.parent = null;
      this.rootNodes.push(child);
    });
    this.removeFromParent(id);
    this.nodesMap.delete(id);
    this.reassignRootNodes();
  }
  removeFromParent(id: IdType): void {
    const node = this.getNode(id);
    const parent = this.getParent(id);
    if (node && parent) {
      this.removeNodeFromParentLinkings(node);
      this.removeNodeFromSiblingsLinkings(node);
      this.reassignRootNodes();
    }
  }
  getNode(id: IdType): TreeNode<T> | null {
    if (id === null) {
      return null;
    }
    return this.nodesMap.get(id) ?? null;
  }
  getParent(childId: IdType): TreeNode<T> | null {
    return this.getNode(childId)?.parent ?? null;
  }
  getData(id: IdType): T | null {
    return this.getNode(id)?.data ?? null;
  }
  getChildren(parentId: IdType): TreeNode<T>[] {
    const children: TreeNode<T>[] = [];
    const node = this.getNode(parentId);
    if (node === null) {
      return children;
    }
    for (const child of this.getNextChild(node)) {
      if (child !== null) {
        children.push(child);
      }
    }
    return children;
  }
  getChildrenIds(parentId: IdType): IdType[] {
    return this.getChildren(parentId).map(node => node.id);
  }
  getDescendants(parentId: IdType): TreeNode<T>[] {
    const children = this.getChildren(parentId);
    const result = children.flatMap(child => [
      child,
      ...this.getDescendants(child.id),
    ]);
    return result;
  }
  get ids(): IdType[] {
    return this.nodes.map((node: TreeNode<T>) => node.id);
  }
  get nodes(): TreeNode<T>[] {
    const trees = this.rootNodes.flatMap((node: TreeNode<T>) => [
      node,
      ...this.getDescendants(node.id),
    ]);
    return trees;
  }
  get dataList(): T[] {
    return this.nodes.map(node => node.data);
  }
  getDescendantsRecord(id: IdType): Set<IdType> {
    return new Set(this.getDescendants(id).map(node => node.id));
  }
  static copy<T extends IdPropWithParentId>(
    forest: Forest<T>,
    createNode: (data: T) => TreeNode<T>,
  ): Forest<T> {
    return new Forest(
      forest.nodes.map(node => node.data),
      createNode,
    );
  }
}
