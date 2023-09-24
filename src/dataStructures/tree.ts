import {IdType, IdPropWithParentId} from '../types';
import {flatten} from '../utils/array';
import {getNonNullProjections} from '../utils/projections';

export interface TreeNode<T> {
  id: IdType;
  parentId: IdType;
  firstChild: IdType;
  lastChild: IdType;
  prevSibling: IdType;
  nextSibling: IdType;
  data: T;
}

export const emptyNode = {
  id: null,
  parentId: null,
  firstChild: null,
  lastChild: null,
  prevSibling: null,
  nextSibling: null,
};

export class Forest<T extends IdPropWithParentId> {
  private nodesMap: Map<IdType, TreeNode<T>>;
  public convertToNode: (data: T) => TreeNode<T>;
  private roots: Set<IdType>;
  get rootNodes(): TreeNode<T>[] {
    return getNonNullProjections(
      [...this.roots.values()],
      this.getNode.bind(this),
    );
  }
  constructor(dataItems: T[], convertToNode: (data: T) => TreeNode<T>) {
    this.convertToNode = convertToNode;
    this.nodesMap = new Map(
      dataItems
        .map(data => this.convertToNode(data))
        .map(node => [node.id, node]),
    );
    this.roots = new Set();
    if (!dataItems) {
      return;
    }
    dataItems.forEach((data: T) => {
      this.add(data, data.parentId);
    });
    this.reassignRootNodes();
  }
  reassignRootNodes() {
    this.roots = new Set(
      [...this.nodesMap.values()]
        .filter(node => node.parentId === null)
        .map(node => node.id),
    );
  }
  getParentNode(child: IdType): TreeNode<T> | null {
    return this.getNode(this.getNode(child)?.parentId ?? null);
  }
  add(data: T, targetParentId: IdType): void {
    const node = this.convertToNode(data);
    const nodeToAdd = {
      ...node,
      parentId: targetParentId,
    };
    this.nodesMap.set(node.id, nodeToAdd);
    const targetParent = this.getNode(targetParentId);
    if (targetParent === null) {
      this.rootNodes.push(nodeToAdd);
      return;
    }
    const lastChild = this.getNode(targetParent?.lastChild ?? null);
    if (targetParent?.firstChild === null) {
      targetParent.firstChild = nodeToAdd.id;
      targetParent.lastChild = nodeToAdd.id;
    } else if (lastChild !== null) {
      lastChild.nextSibling = nodeToAdd.id;
      nodeToAdd.prevSibling = lastChild.id;
      targetParent.lastChild = nodeToAdd.id;
    }
    this.update(targetParent);
  }
  update(node: TreeNode<T>): void {
    this.nodesMap.set(node.id, node);
    if (node.parentId === null) {
      this.reassignRootNodes();
    }
  }
  delete(id: IdType): void {
    const nodeToDelete = this.getNode(id);
    if (nodeToDelete === null) {
      return;
    }
    const prevSibling = this.getNode(nodeToDelete.prevSibling ?? null);
    if (prevSibling) {
      prevSibling.nextSibling = nodeToDelete.nextSibling;
    }
    const nextSibling = this.getNode(nodeToDelete.nextSibling ?? null);
    if (nextSibling) {
      nextSibling.prevSibling = nodeToDelete.prevSibling;
    }
    this.getChildren(id)?.forEach(child => {
      // immediate child nodes become root nodes, but they maintain their own subtrees
      child.parentId = null;
      this.rootNodes.push(child);
    });
    this.nodesMap.delete(id);
    this.reassignRootNodes();
  }
  getNode(id: IdType): TreeNode<T> | null {
    if (id === null) {
      return null;
    }
    return this.nodesMap.get(id) ?? null;
  }
  getData(id: IdType): T | null {
    return this.getNode(id)?.data ?? null;
  }
  getChildren(parentId: IdType): TreeNode<T>[] {
    const parent = this.getNode(parentId) ?? null;
    if (parent === null) {
      return this.rootNodes;
    }
    const nodes = [];
    let curr: TreeNode<T> | null = this.getNode(parent.firstChild);
    while (curr !== null && curr.id !== curr.nextSibling) {
      nodes.push(curr);
      curr = this.getNode(curr.nextSibling);
    }
    return nodes;
  }
  getChildrenIds(parentId: IdType): IdType[] {
    return this.getChildren(parentId).map(node => node.id);
  }
  getDescendants(parentId: IdType): TreeNode<T>[] {
    const children = this.getChildren(parentId);
    const result = children.map(child => [
      child,
      ...this.getDescendants(child.id),
    ]);
    return flatten(result);
  }
  get ids(): IdType[] {
    return this.nodes.map((node: TreeNode<T>) => node.id);
  }
  get nodes(): TreeNode<T>[] {
    const trees = this.rootNodes.map((node: TreeNode<T>) => [
      node,
      ...this.getDescendants(node.id),
    ]);
    return flatten(trees);
  }
  get dataList(): T[] {
    return this.nodes.map(node => node.data);
  }
  static copy<T extends IdPropWithParentId>(forest: Forest<T>): Forest<T> {
    return new Forest(
      forest.nodes.map(node => node.data),
      forest.convertToNode,
    );
  }
}
