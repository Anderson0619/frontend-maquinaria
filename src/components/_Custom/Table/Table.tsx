import NoResult from "components/_Custom/NoResult/NoResult";
import { useEffect, useState } from "react";
import { Pagination, Table as RSTable, TableProps } from "rsuite";

import { ButtonCell, CustomCell, NormalCell } from "./Cells";
import { Container } from "./Table.styles";
import { ITableData, TTable } from "./Table.types";

const { Column, HeaderCell } = RSTable;

const cellDefaultStyle = {
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
};

const Table = <TData extends {}>(props: TTable<TData>) => {
  const {
    data,
    columns,
    columnsSameProps,
    containerStyle,
    containerClassname,
    ...RSTableProps
  } = props;

  const [tableData, setTableData] = useState<ITableData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  // const [xScroll, setXScroll] = useState<number>(0);
  // const [yScroll, setYScroll] = useState<number>(0);

  const [displayLength, setDisplayLength] = useState(10);
  const [page, setPage] = useState(1);

  const [sortColumn, setSortColumn] = useState<string>();
  const [sortType, setSortType] = useState<TableProps["sortType"]>();

  // * Little hack needed for the table width to adjust
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      let newTableData: ITableData[] = [...data];

      if (sortColumn && sortType) {
        newTableData.sort((a, b) => {
          const x = a[sortColumn];
          const y = b[sortColumn];

          return sortType === "asc" ? (x > y ? 1 : -1) : x > y ? -1 : 1;
        });
      }

      newTableData = newTableData.filter((v, i) => {
        const start = displayLength * (page - 1);
        const end = start + displayLength;
        return i >= start && i < end;
      });

      // * Add a timestamp for when of each row was added to the table
      // newTableData = newTableData.map((d) => {
      //   if (d.tableTimestamp) return d;

      //   return { ...d, tableTimestamp: new Date().toISOString() };
      // });

      setTableData(newTableData);
    }
  }, [data, sortColumn, sortType, page, displayLength]);

  // * Set page=1 when change data

  useEffect(() => {
    if (data) {
      setPage(1);
    }
  }, [data]);

  // * HANDLERS

  const handleChangeLength = (length: number) => {
    setPage(1);
    setDisplayLength(length);
  };

  const handleSortColumn = (dataKey: string) => {
    setSortColumn(dataKey);
    setSortType(sortType === "asc" ? "desc" : "asc");
  };

  if (!data) return null;

  return (
    <Container style={containerStyle} className={containerClassname}>
      <RSTable
        onSortColumn={handleSortColumn}
        // onDataUpdated={handleDataUpdate}
        renderEmpty={() => <NoResult />}
        data={tableData}
        shouldUpdateScroll
        wordWrap
        affixHorizontalScrollbar
        autoHeight
        headerHeight={50}
        rowHeight={55}
        loading={loading}
        height={400}
        {...RSTableProps}
      >
        {columns?.map((column) => {
          const {
            dataKey,
            header,
            width = 150,
            isButton,
            buttonProps,
            buttonIcon,
            buttonLabel = "Click me",
            buttonAppearance,
            cellStyle: cellStyleProp,
            cellClassName,
            customCell,
            formatter,
            ...columnProps
          } = column;

          const cellStyle = { ...cellDefaultStyle, ...cellStyleProp };
          const cellProps = { dataKey, cellStyle, cellClassName };

          return (
            <Column
              key={dataKey as string}
              {...{ width, ...columnProps, ...columnsSameProps }}
            >
              <HeaderCell style={{ fontSize: "1.1rem" }}>{header}</HeaderCell>

              {customCell ? (
                <CustomCell<TData>
                  {...{
                    ...cellProps,
                    customCell,
                  }}
                />
              ) : isButton ? (
                <ButtonCell<TData>
                  {...{
                    ...cellProps,
                    buttonProps,
                    buttonIcon,
                    buttonLabel,
                    buttonAppearance,
                  }}
                />
              ) : (
                <NormalCell<TData>
                  {...{
                    ...cellProps,
                    formatter,
                  }}
                />
              )}
            </Column>
          );
        })}
      </RSTable>

      <Pagination
        size="xs"
        className="mt-6"
        limitOptions={[10, 20]}
        activePage={page}
        limit={displayLength}
        total={data?.length}
        onChangePage={setPage}
        onChangeLimit={handleChangeLength}
      />
    </Container>
  );
};

export default Table;
