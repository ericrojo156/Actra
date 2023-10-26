import {BaseAction, IdType} from '../types';

export interface IdAction extends BaseAction {
  payload: IdType;
}

export interface IdsAction extends BaseAction {
  payload: IdType[];
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

export interface CurrentlyActiveAction extends BaseAction {
  payload: {
    activityId: IdType;
    intervalId: IdType;
  };
}
