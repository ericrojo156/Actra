export interface BaseAction {
  type: string;
}

export interface IdProp {
  id: string | null;
}

export type NavigationScreenProps<T> = {route: {params: T}};
