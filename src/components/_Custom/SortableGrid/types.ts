export type TItem = JSX.Element | string;

export interface ISortableGrid {
  style?: React.CSSProperties;
  items: TItem[];
  onChange?: (sortedItems: TItem[]) => void;
  renderItem?: (params: IRenderItem) => JSX.Element;
  deletable?: boolean;
}

export interface ISortableItem {
  item: TItem;
  sortId: number;
}

export interface IRenderItem {
  item: TItem;
  currentIndex: number;
}
