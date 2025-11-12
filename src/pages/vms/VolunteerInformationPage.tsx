import { useState } from 'react'
import { Button } from "@/components/ui/button"

import type { Volunteer } from './VolunteerTable.tsx'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { 
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { 
  Funnel, 
} from "lucide-react"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




type VolunteerInformationPageProps = {
  clickedRow : Volunteer
}
function formatTime(timeInt : number) {
  let hours = Math.floor(timeInt / 100);  
  let minutes = timeInt % 100;           

  let formattedHours = hours.toString().padStart(2, '0');
  let formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

function formatDate(date : Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


const events: VolunteerEvent[] = [
  {
    event: "Volunteer Event One",
    role: "Volunteer",
    hours: 5,
    time: 230,  // Time in 24-hour format (e.g., 2:30 PM)
    date: new Date('2024-03-24')
  },
  {
    event: "Community Cleanup",
    role: "Team Leader",
    hours: 4,
    time: 900,  // 9:00 AM
    date: new Date('2024-04-05')
  },
  {
    event: "Soup Kitchen Service",
    role: "Volunteer",
    hours: 3,
    time: 1200,  // 12:00 PM
    date: new Date('2024-05-10')
  },
  {
    event: "Charity Run",
    role: "Volunteer",
    hours: 6,
    time: 1500,  // 3:00 PM
    date: new Date('2024-06-14')
  },
  {
    event: "Environmental Awareness Campaign",
    role: "Speaker",
    hours: 2,
    time: 1030,  // 10:30 AM
    date: new Date('2024-07-21')
  },
  {
    event: "Food Drive",
    role: "Volunteer",
    hours: 4,
    time: 1800,  // 6:00 PM
    date: new Date('2024-08-02')
  },
  {
    event: "Senior Assistance Program",
    role: "Volunteer",
    hours: 3,
    time: 1100,  // 11:00 AM
    date: new Date('2024-09-12')
  },
  {
    event: "Homeless Shelter Help",
    role: "Coordinator",
    hours: 5,
    time: 1400,  // 2:00 PM
    date: new Date('2024-10-07')
  },
  {
    event: "Health and Wellness Workshop",
    role: "Volunteer",
    hours: 2,
    time: 1600,  // 4:00 PM
    date: new Date('2024-11-19')
  },
  {
    event: "Holiday Gift Wrapping",
    role: "Volunteer",
    hours: 3,
    time: 1500,  // 3:00 PM
    date: new Date('2024-12-05')
  }
];

type VolunteerEvent = {
  event : string;
  role : string;
  hours : number;
  time  : number;
  date : Date;
}

export const columns: ColumnDef<VolunteerEvent>[] = [
  {
    accessorKey: "event",
    header: "Event",
    size: 500,
    cell: ({ row }) => (
      <div className=" min-h-15 flex justify-center items-center capitalize items-center text-center ">{row.getValue("event")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 50,
    cell: ({ row }) => (
      <div className="min-h-15 flex justify-center items-center capitalize text-center">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "hours",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hours
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="min-h-15 flex justify-center items-center text-center">{row.getValue("hours")}</div>
    ),
  },
  {
    accessorKey: "time",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="min-h-15 flex justify-center items-center text-center">{formatTime(row.getValue("time"))}</div>
    ),
  },
  {
    accessorKey: "date",
    size:50,
    header: ({ column }) => {
      return (
        <Button
          className='text-sm '
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <Funnel />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="min-h-15 flex justify-center items-center  text-center">{formatDate(row.getValue("date"))}</div>
    ),
  },
]
function VolunteerHistoryTable () {



  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})


  const table = useReactTable<VolunteerEvent>({
    data : events,
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








  return (
  <div className="m-5 w-full overflow-hidden rounded-md border">
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
  )
}

export function VolunteerInformationPage ({clickedRow} : VolunteerInformationPageProps) {
  return (
    <div className='h-full flex flex-row w-full'>
      <div className='h-full flex flex-col'>
      <Card className="w-150 p-5 m-5">
        <div className='w-full flex flex-row justify-center'>
          <img className='m-5 w-28 h-28' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'> 
          </img>
          <div className='p-5'>
            <h2>{clickedRow.name}</h2>
            <p> Age : {clickedRow.age}</p>
            <p>{clickedRow.gender}</p>
            <p>Email Notification Opt-In: {clickedRow.optin ? "Yes" : "No"} </p>
          </div>
        </div>
        <p> Numbers of activities attended: {clickedRow.activities}</p>
        <p> Numbers of training sessions attended: {clickedRow.trainings}</p>
      </Card>

      <Card className='w-150 m-5 flex-grow'>
        <CardHeader>
          <h2>Certifications</h2>
        </CardHeader>
        {clickedRow.certifications.map(x => x)} 
      </Card>
      </div>
      <VolunteerHistoryTable />
    </div>
  )
}



