import { CSSProperties } from "react";
import {
  ButtonProps,
  CellProps,
  ColumnProps,
  TableLocaleType,
  TableProps,
} from "rsuite";

export enum ECellAnims {
  newTableRow = "newTableRow",
}

export type TRowBuilder<TData, TRes> = ({
  rowData,
}: {
  rowData: TData;
}) => TRes;

interface ICell<TData> extends Omit<CellProps, "dataKey"> {
  dataKey: keyof TData;
  rowData?: TData;
  cellStyle?: CSSProperties;
  cellClassName?: TRowBuilder<TData, string> | string;
}

export interface ICustomCell<TData> extends ICell<TData> {
  customCell?: TRowBuilder<TData, JSX.Element>;
}

interface IButton extends Omit<ButtonProps, "onClick"> {
  onClick?: TRowBuilder<any, void>;
}
export interface IButtonCell<TData> extends ICell<TData> {
  buttonProps?: IButton;
  buttonIcon?: any;
  buttonAppearance?: ButtonProps["appearance"];
  buttonLabel?: string;
}

export interface INormalCell<TData> extends ICell<TData> {
  formatter?: (data: string) => string;
}

export interface IColumn<TData> extends ColumnProps {
  customCell?: TRowBuilder<TData, JSX.Element>;
  cellClassName?: TRowBuilder<TData, string> | string;
  formatter?: (data: string) => string;
  cellStyle?: CSSProperties;
  header: string;
  dataKey: keyof TData;
  width?: number;
  isButton?: boolean;
  buttonProps?: IButton;
  buttonIcon?: any;
  buttonAppearance?: ButtonProps["appearance"];
  buttonLabel?: string;
}

export interface TTable<TData>
  extends Omit<
    TableProps,
    "locale" | "minHeight" | "hover" | "headerHeight" | "rowHeight"
  > {
  data: TData[];
  columns: IColumn<TData>[];
  columnsSameProps?: ColumnProps;
  containerStyle?: CSSProperties;
  containerClassname?: string;
  minHeight?: number;
  hover?: boolean;
  headerHeight?: number;
  locale?: TableLocaleType;
  rowHeight?: number;
}

export interface ITableData {
  tableTimestamp?: string;
}
