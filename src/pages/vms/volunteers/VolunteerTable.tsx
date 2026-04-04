import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CirclePlus, Funnel, Trash } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'

import type { Volunteer } from '@/types/volunteers'
import { volunteerHasCertificate } from '@/lib/volunteerUtils'
import { useGetVolunteers } from '@/operations/volunteers'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columnFilter = <T,>(
  column: Column<T, unknown>,
  columnName: string,
  options: Array<string>,
) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-sm" variant="ghost">
          {columnName}
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" side="bottom" align="start">
        {options.map((x) => {
          return (
            <DropdownMenuCheckboxItem
              key={x}
              checked={(
                (column.getFilterValue() as Array<string> | undefined) ?? []
              ).includes(x)}
              onCheckedChange={() => {
                const current =
                  (column.getFilterValue() as Array<string> | undefined) ?? []
                column.setFilterValue(
                  current.includes(x)
                    ? current.filter((v) => v !== x)
                    : [...current, x],
                )
              }}
            >
              {x}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function capitalizeGender(value: unknown): string {
  const g = typeof value === 'string' ? value : ''
  if (!g) return '—'
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
}

const columns: Array<ColumnDef<Volunteer>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="m-2 h-5 w-5 border-black shadow-sm"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div
        className="flex justify-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <Checkbox
          className="m-2 h-5 w-5 border-black shadow-sm"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    filterFn: (row, columnId, filterValue) => {
      const q = String(filterValue ?? '').trim().toLowerCase()
      if (!q) return true
      const name = String(row.getValue(columnId) ?? '').toLowerCase()
      return name.includes(q)
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'age',
    size: 80,
    header: ({ column }) => (
      <Button
        className="text-sm"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Age
        <Funnel />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">{row.getValue('age')}</div>
    ),
  },
  {
    accessorKey: 'gender',
    filterFn: (row, columnId, value) => {
      const selected = (value as Array<string> | undefined) ?? []
      if (selected.length === 0) return true
      return selected.includes(String(row.getValue(columnId) ?? ''))
    },
    header: ({ column }) =>
      columnFilter(column, 'Gender', ['male', 'female']),
    cell: ({ row }) => (
      <div className="text-center">{capitalizeGender(row.getValue('gender'))}</div>
    ),
  },
  {
    accessorKey: 'eventsAttended',
    header: ({ column }) => (
      <Button
        className="text-sm"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        No. of activities attended
        <Funnel />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {row.getValue('eventsAttended') ?? '—'}
      </div>
    ),
  },
  {
    accessorKey: 'trainingSessionsAttended',
    header: ({ column }) => (
      <Button
        className="text-sm"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        No. of training sessions attended
        <Funnel />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {row.getValue('trainingSessionsAttended') ?? '—'}
      </div>
    ),
  },
  {
    accessorKey: 'emailOptIn',
    filterFn: (row, columnId, value) => {
      const selected = (value as Array<string> | undefined) ?? []
      if (selected.length === 0) return true
      const yn = row.getValue(columnId) ? 'Yes' : 'No'
      return selected.includes(yn)
    },
    header: ({ column }) =>
      columnFilter(column, 'Email Notification Opt-In', ['Yes', 'No']),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue('emailOptIn') ? 'Yes' : 'No'}
      </div>
    ),
  },
  {
    id: 'certificate',
    accessorFn: (row) => row.certificate,
    header: 'Certificate',
    cell: ({ row }) => {
      const certified = volunteerHasCertificate(row.original.certificate)
      return (
        <div className="text-center text-sm">
          {certified ? 'Yes' : 'No'}
        </div>
      )
    },
  },
]

type VolunteerTableProps = {
  setClickedRow: Dispatch<SetStateAction<Volunteer | null>>
}

export function VolunteerTable({ setClickedRow }: VolunteerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { data: volunteers, isLoading, isError } = useGetVolunteers()
  const data = useMemo(() => volunteers ?? [], [volunteers])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.volunteerId ?? row.id ?? row.name,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleRowClick = (row: Volunteer) => {
    setClickedRow(row)
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Could not load volunteers. Check that you are signed in and try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-12 text-center text-slate-600">
        Loading volunteers…
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-end">
        <div className="flex flex-wrap items-end gap-2">
          <Link to="/volunteers/email">
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-full bg-gray-500 px-3 text-sm text-white hover:bg-gray-600"
              disabled
            >
              <CirclePlus className="mr-1 inline h-4 w-4" />
              Send Email
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-full bg-gray-500 px-3 text-sm text-white hover:bg-gray-600"
          >
            <Trash className="mr-1 inline h-4 w-4" />
            Delete
          </Button>
        </div>

        <div>
          <Label
            htmlFor="searchbar"
            className="mx-2 text-sm font-medium text-gray-700"
          >
            Search
          </Label>
          <Input
            id="searchbar"
            placeholder="Search by name"
            value={
              (table.getColumn('name')?.getFilterValue() as string | undefined) ||
              ''
            }
            onChange={(event) => {
              const col = table.getColumn('name')
              if (col) col.setFilterValue(event.target.value)
            }}
            className="h-8 max-w-sm"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader className="text-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-slate-50"
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No volunteers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
