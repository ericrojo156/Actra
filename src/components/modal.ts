export enum SELECTION_TYPE {
  MULTI_SELECT,
  SINGLE_SELECT,
}
export interface SelectionModalParams {
  id: string;
  selectionType: SELECTION_TYPE.MULTI_SELECT;
  onConfirm: (selectedItems: string[]) => void;
}
export function openSelectionModal(_params: SelectionModalParams) {}
