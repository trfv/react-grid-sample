import React from 'react';
import DataGrid, { SelectColumn, Column, TextEditor} from 'react-data-grid';
import { useMediaQuery } from './useMediaQuery';

export function App() {
  const isSmall = useMediaQuery('(max-width: 760px)'); 
  return (
    <div style={{ margin: isSmall ? 16 : 80 }}>
      <ReactDataGridSample />
    </div>
  )
}

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: 'currency',
  currency: 'jpy'
});

function DateFormatter({ date }: { date: string }) {
  return <>{dateFormatter.format(new Date(date))}</>;
}

function DateTimeFormatter({ datetime }: { datetime: Date }) {
  return <>{dateTimeFormatter.format(datetime)}</>;
}

function CurrencyFormatter({ value }: { value: number }) {
  return <>{currencyFormatter.format(value)}</>;
}

type Row = {
  id: string,
  code: string,
  name: string,
  price: string,
  date: string,
  create_datetime: Date;
};

function rowKeyGetter(row: Row) {
  return row.id;
}

function onCellKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "Enter") {
    event.preventDefault()
  }
}

const columns: Column<Row>[] = [
  SelectColumn,
  { 
    key: 'id',
    name: 'ID',
    width: 80,
  },
  { 
    key: 'code',
    name: 'Code',
    width: 80,
    editor: TextEditor,
    editorOptions: { onCellKeyDown },
  },
  { 
    key: 'name',
    name: 'Name',
    width: 80,
    editor: TextEditor,
    editorOptions: { onCellKeyDown },
  },
  { 
    key: 'price',
    name: 'Price',
    width: 160,
    editor: TextEditor,
    editorOptions: { onCellKeyDown },
    formatter: ({ row }) =>  <CurrencyFormatter value={Number(row.price)} />
  },
  { 
    key: 'date',
    name: 'Date',
    width: 160,
    editor: TextEditor,
    editorOptions: { onCellKeyDown },
    formatter: ({ row }) =>  <DateFormatter date={row.date} />
  },
  { 
    key: 'create_datetime',
    name: 'CreateDatetime',
    width: 200,
    formatter: ({ row }) =>  <DateTimeFormatter datetime={row.create_datetime} />
  },
];

function generateRow(id: number): Row {
  return {
    id: `${id}`,
    code: `Code${id}`,
    name: `Name${id}`,
    price: (Number(id) * 1000).toString(),
    date: "2021-01-01",
    create_datetime: new Date("2021-01-01T00:00:00.000Z"),
  }
}

function ReactDataGridSample() {
  const [rows, setRows] = React.useState<Readonly<Row>[]>(
    [...new Array(10)].map((_, i) => generateRow(i + 1))
  );

  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<string>>(new Set());

  return (
    <DataGrid
      className="rdg-light" // これを入れないと darkTheme が採用されてしまう
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      defaultColumnOptions={{
        sortable: false,
        resizable: true
      }}
    />
  )
}
