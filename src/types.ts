export interface BaseAction {
  type: string;
}

export interface IdProp {
  id: string;
}

export type NavigationScreenProps<T> = {route: {params: T}};
