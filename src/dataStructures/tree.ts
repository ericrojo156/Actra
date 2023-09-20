import {IdType, IdPropWithParentId} from '../types';
import {flatten} from '../utils/array';

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
  public rootNodes: TreeNode<T>[];
  constructor(dataItems: T[], convertToNode: (data: T) => TreeNode<T>) {
    this.convertToNode = convertToNode;
    this.nodesMap = new Map(
      dataItems
        .map(data => this.convertToNode(data))
        .map(node => [node.id, node]),
    );
    this.rootNodes = [];
    if (!dataItems) {
      return;
    }
    dataItems.forEach((data: T) => {
      this.add(data);
    });
    this.reassignRootNodes();
  }
  reassignRootNodes() {
    this.rootNodes = [...this.nodesMap.values()].filter(
      node => node.parentId === null,
    );
  }
  add(data: T): void {
    const parentId = data.parentId;
    const node = this.convertToNode(data);
    const nodeToAdd = {
      ...node,
      parentId: parentId,
    };
    this.nodesMap.set(node.id, nodeToAdd);
    const parent = this.get(parentId);
    if (parent === null) {
      this.rootNodes.push(nodeToAdd);
      return;
    }
    const lastChild = this.get(parent?.lastChild ?? null);
    if (parent?.firstChild === null) {
      parent.firstChild = nodeToAdd.id;
      parent.lastChild = nodeToAdd.id;
    } else if (lastChild !== null) {
      lastChild.nextSibling = nodeToAdd.id;
      nodeToAdd.prevSibling = lastChild.id;
      parent.lastChild = nodeToAdd.id;
    }
    this.update(parent);
  }
  update(node: TreeNode<T>): void {
    this.nodesMap.set(node.id, node);
    if (node.parentId === null) {
      this.reassignRootNodes();
    }
  }
  delete(id: IdType): void {
    const nodeToDelete = this.get(id);
    if (nodeToDelete === null) {
      return;
    }
    const prevSibling = this.get(nodeToDelete.prevSibling ?? null);
    if (prevSibling) {
      prevSibling.nextSibling = nodeToDelete.nextSibling;
    }
    const nextSibling = this.get(nodeToDelete.nextSibling ?? null);
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
  get(id: IdType): TreeNode<T> | null {
    if (id === null) {
      return null;
    }
    return this.nodesMap.get(id) ?? null;
  }
  getChildren(parentId: IdType): TreeNode<T>[] {
    const parent = this.get(parentId) ?? null;
    if (parent === null) {
      return this.rootNodes;
    }
    const nodes = [];
    let curr: TreeNode<T> | null = this.get(parent.firstChild);
    while (curr !== null) {
      nodes.push(curr);
      curr = this.get(curr.nextSibling);
    }
    return nodes;
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
