import {BaseAction, IdType} from '../types';

export interface IdAction extends BaseAction {
  payload: IdType;
}

export interface ParentChildAction<T = IdType> extends BaseAction {
  payload: {
    parentId: IdType;
    child: T;
  };
}

export interface ParentChildrenAction<T = IdType> extends BaseAction {
  payload: {
    parentId: IdType;
    children: T[];
  };
}
