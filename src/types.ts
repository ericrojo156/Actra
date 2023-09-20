export interface BaseAction {
  type: string;
}

export type IdType = string | null;

export interface IdProp {
  id: IdType;
}

export type IdPropWithParentId = IdProp & {parentId: IdType};

export type NavigationScreenProps<T> = {route: {params: T}};
