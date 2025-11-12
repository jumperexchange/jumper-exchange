import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ColumnTable } from './ColumnTable';
import { ColumnDefinition } from './ColumnTable.types';
import { createEmptyColumn } from './utils';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

const meta = {
  title: 'Core/ColumnTable',
  component: ColumnTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColumnTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}

const sampleData: Person[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 28,
    email: 'john@example.com',
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 34,
    email: 'jane@example.com',
    status: 'active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    age: 45,
    email: 'bob@example.com',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Alice Brown',
    age: 29,
    email: 'alice@example.com',
    status: 'active',
  },
];

const basicColumns: ColumnDefinition<Person>[] = [
  {
    id: 'name',
    header: 'Name',
    render: (row) => (
      <Typography variant="bodyMediumStrong">{row.name}</Typography>
    ),
    gridProps: { size: 'grow' },
  },
  {
    id: 'age',
    header: 'Age',
    render: (row) => <Typography variant="bodyMedium">{row.age}</Typography>,
    gridProps: { size: 'grow' },
  },
  {
    id: 'email',
    header: 'Email',
    render: (row) => <Typography variant="bodyMedium">{row.email}</Typography>,
    gridProps: { size: 'grow' },
  },
  {
    id: 'status',
    header: 'Status',
    render: (row) => (
      <Typography
        variant="bodyMedium"
        color={row.status === 'active' ? 'success.main' : 'error.main'}
      >
        {row.status}
      </Typography>
    ),
    gridProps: { size: 'grow' },
  },
];

export const Basic: Story = {
  args: {
    columns: basicColumns,
    data: sampleData,
  },
};

const columnsWithActions: ColumnDefinition<Person>[] = [
  ...basicColumns.slice(0, 3),
  {
    id: 'actions',
    hideHeader: true,
    render: (row) => (
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button size="small" variant="outlined">
          Edit
        </Button>
        <Button size="small" variant="contained">
          View
        </Button>
      </Stack>
    ),
    gridProps: { size: 'grow' },
    align: 'end',
  },
];

export const WithActions: Story = {
  args: {
    columns: columnsWithActions,
    data: sampleData,
  },
};

const columnsWithAlignment: ColumnDefinition<Person>[] = [
  {
    id: 'name',
    header: 'Name',
    render: (row) => (
      <Typography variant="bodyMediumStrong">{row.name}</Typography>
    ),
    gridProps: { size: 'grow' },
    align: 'left',
  },
  {
    id: 'age',
    header: 'Age',
    render: (row) => <Typography variant="bodyMedium">{row.age}</Typography>,
    gridProps: { size: 'grow' },
    align: 'center',
  },
  {
    id: 'status',
    header: 'Status',
    render: (row) => (
      <Typography
        variant="bodyMedium"
        color={row.status === 'active' ? 'success.main' : 'error.main'}
      >
        {row.status}
      </Typography>
    ),
    gridProps: { size: 'grow' },
    align: 'right',
  },
];

export const WithAlignment: Story = {
  args: {
    columns: columnsWithAlignment,
    data: sampleData,
  },
};

export const WithoutHeader: Story = {
  args: {
    columns: basicColumns,
    data: sampleData,
    showHeader: false,
  },
};

export const CustomSpacing: Story = {
  args: {
    columns: basicColumns,
    data: sampleData,
    spacing: 1,
    dataRowGap: 3,
    headerGap: 2,
  },
};

export const WithRowClick: Story = {
  args: {
    columns: basicColumns,
    data: sampleData,
    onRowClick: (row: Person) => {
      alert(`Clicked on ${row.name}`);
    },
  },
};

export const Empty: Story = {
  args: {
    columns: basicColumns,
    data: [],
  },
};

const complexColumns: ColumnDefinition<Person>[] = [
  {
    id: 'user',
    header: 'User Information',
    render: (row) => (
      <Stack spacing={0.5}>
        <Typography variant="bodyMediumStrong">{row.name}</Typography>
        <Typography variant="bodyXSmall" color="textSecondary">
          {row.email}
        </Typography>
      </Stack>
    ),
    gridProps: { size: 'grow' },
  },
  {
    id: 'details',
    header: 'Details',
    render: (row) => (
      <Stack spacing={0.5}>
        <Typography variant="bodyMedium">Age: {row.age}</Typography>
        <Typography
          variant="bodyXSmall"
          color={row.status === 'active' ? 'success.main' : 'error.main'}
        >
          Status: {row.status.toUpperCase()}
        </Typography>
      </Stack>
    ),
    gridProps: { size: 'grow' },
  },
  {
    id: 'actions',
    hideHeader: true,
    render: (row) => (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Button size="small" variant="outlined">
          Edit
        </Button>
        <Button size="small" variant="contained" color="primary">
          Manage
        </Button>
      </Stack>
    ),
    gridProps: { size: 'grow' },
    align: 'end',
  },
];

export const Complex: Story = {
  args: {
    columns: complexColumns,
    data: sampleData,
  },
};

const columnsWithEmpty: ColumnDefinition<Person>[] = [
  {
    id: 'name',
    header: 'Name',
    render: (row) => (
      <Typography variant="bodyMediumStrong">{row.name}</Typography>
    ),
    gridProps: { size: 'grow' },
  },
  {
    id: 'email',
    header: 'Email',
    render: (row) => <Typography variant="bodyMedium">{row.email}</Typography>,
    gridProps: { size: 'grow' },
  },
  createEmptyColumn<Person>('empty'),
  {
    id: 'actions',
    hideHeader: true,
    render: () => (
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button size="small" variant="contained">
          View
        </Button>
      </Stack>
    ),
    gridProps: { size: 'grow' },
    align: 'end',
  },
];

export const WithEmptyColumn: Story = {
  args: {
    columns: columnsWithEmpty,
    data: sampleData,
  },
};
