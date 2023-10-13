export interface BaseAction {
  type: string;
}

export interface BooleanAction extends BaseAction {
  payload: boolean;
}

export type IdType = string | null;

export interface IdProp {
  id: IdType;
}

export type IdPropWithParentId = IdProp & {parentId: IdType};

export type NavigationScreenProps<T> = {route: {params: T}};

export type FilterCondition<T> = (data: T) => boolean;
