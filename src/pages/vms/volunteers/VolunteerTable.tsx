import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,

} from "@tanstack/react-table"
import type { 
    Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { 
  Funnel, 
  CirclePlus, Trash, ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Volunteer } from '@/types/vms'
import { volunteerListData } from '@/data/vms'

const columnFilter= <T,>(column :Column<T, any>, columnName : string, options : string[]) => {
  return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button
              className='text-sm'
              variant="ghost"
            >
              {columnName}
              <Funnel />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='' side="bottom" align="start">
            {options.map(
              x => {
                return (
                  <DropdownMenuCheckboxItem
                  checked={(column?.getFilterValue() as string[] | undefined ?? []).includes(x)}
                    onCheckedChange={() => {
                      const current = column?.getFilterValue() as string[] | undefined ?? [];
                      column.setFilterValue(current.includes(x) ? current.filter(v => v !== x) // remove if already selected
                                  : [...current, x] )
                    }}
                  >
                    {x}
                  </DropdownMenuCheckboxItem>
                )
              } 
            )
            }
          </DropdownMenuContent>
        </DropdownMenu>
  )
}

export const columns: ColumnDef<Volunteer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className='shadow-sm m-2 border-black w-5 h-5'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className='flex justify-center'>
      <Checkbox
        className='shadow-sm m-2 border-black w-5 h-5 '
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
    accessorKey: "name",
    header: "Name",
    size: 500,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "age",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("age")}</div>
    ),
  },
  {
    accessorKey: "gender",
    filterFn: (row, columnId, value) => {
      // If no filter value is applied, show all rows
      if (value.length === 0) return true;
      return value.includes(row.getValue(columnId)); // Check if gender matches filter
    },
    header: ({ column }) => {
      return columnFilter(column, "Gender", ["Male", "Female"])
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("gender")}</div>
    ),
  },
  {
    accessorKey: "language",
    filterFn: (row, columnId, value) => {
      // If no filter value is applied, show all rows
      if (value.length === 0) return true;
      
      return value.filter((x : string) => !(row.getValue(columnId) as string[]).includes(x)).length === 0;
    },
    header: ({ column }) => {
      return (
        columnFilter(column, "Language", ["English", "Chinese", "Malay"])
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{(row.getValue("language") as string[]).join(', ')}</div>
    ),
  },
  {
    accessorKey: "activities",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. of activities attended
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("activities")}</div>
    ),
  },
  {
    accessorKey: "trainings",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. of training sessions attended
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("trainings")}</div>
    ),
  },
  {
    accessorKey: "optin",
    filterFn: (row, columnId, value) => {
      // If no filter value is applied, show all rows
      if (value.length === 0) return true;
      return value.includes(row.getValue(columnId)  ? "Yes" : "No"); // Check if gender matches filter
    },
    header: ({ column }) => {
      return columnFilter(column, "Email Notification Opt-In", ["Yes", "No"])
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("optin") ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "certifications",
    filterFn: (row, columnId, value) => {
      if (value.length === 0) return true;
      
      return value.filter((x : string) => !(row.getValue(columnId) as string[]).includes(x)).length === 0;
    },
    header: ({ column }) => {
      return columnFilter(column, "Certifications", ["First Aid", "-"])
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("certifications")}</div>
    ),
  },
  {
    accessorKey: "volunteerHistory",
    header: () => {
      return (
        <Button
          className='text-sm'
          variant="ghost"
        >
          Volunteer History
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex justify-between items-center w-full">
          <div className='flex-grow text-center'> {row.getValue("volunteerHistory")}  </div>
          <ChevronRight />
      </div>
    ),
  },
]

type actionButtonProps = {
  children : React.ReactNode;
}

function ActionButton ({children} : actionButtonProps) {
  return ( 
    <Button variant="outline" className="rounded-full text-sm h-8 bg-gray-500 text-white mx-3"> 
      {children}
    </Button>
  )
}



type VolunteerTableProps = {
  setClickedRow : React.Dispatch<React.SetStateAction<Volunteer | null>>
}

export function VolunteerTable ({setClickedRow } : VolunteerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})


  const table = useReactTable({
    data: volunteerListData,
    columns,
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

  const handleRowClick = (row : Volunteer) => {
    setClickedRow(row)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <div className="flex  items-end">
          <ActionButton>
            <CirclePlus />
            Send Email
          </ActionButton>
          <ActionButton>
            <Trash />
            Delete 
          </ActionButton>
        </div>

        <div>
        <Label htmlFor="searchbar" className="mx-2 text-sm font-medium text-gray-700">
          Search
        </Label>  
        <Input
          id="searchbar"
          placeholder="Search"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-8"
        />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className='text-center'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className='text-center' key={header.id} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
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
