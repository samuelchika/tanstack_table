import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import DATA from "../data";
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell";


const TaskTable = () => {
  // 3. Define your column headers which will be used to manipulate the data
  // : This column help react-table do some manipulations
  // : The column is like the object param for each row in the data. Visit Doc for ore

  // 11. For sizing, the resizing of the talbe, we need a resizer div with 0 opacity but visible when hovered over. 
  // 12 We develop a seperate component to use to display any cell we want to be unique like the Task below
  // 12.... Visit the component to see more about what to do
  // 13 Update the general table when we update one cell. Use the meta tag in the table instance
  // 13.a the meta takes a function which will used to update whats happening. The function takes 3 params:
  // 13.b the 3 params are: (id of the element, the column to be updated, and the new value)
  const columns = [
    {
      accessorKey: 'task', // this will be used to fetch all the row within the object with 'task'
      header: "TASK", // this will display on the table
      cell: EditableCell, // this will return JSX for us with the information property of the accessorKey
      size: 225, // This will be the size of the cells in the table
    },
    {
      accessorKey: 'status', // this will be used to fetch all the row within the object with 'status'
      header: "STATUS", // this will display on the table
      cell: StatusCell,  // this will return JSX for us with the information property of the accessorKey
    },
    {
      accessorKey: 'due', // this will be used to fetch all the row within the object with 'due'
      header: "DUE", // this will display on the table
      cell: DateCell,  // this will return JSX for us with the information property of the accessorKey
    },
    {
      accessorKey: 'notes', // this will be used to fetch all the row within the object with 'notes'
      header: "NOTES", // this will display on the table
      cell: EditableCell,  // this will return JSX for us with the information property of the accessorKey
    },

  ]
  // 2a. the use state to help us keep track of data
  const [data, setData] = useState(DATA)
  console.log(data);
  // 1. Create a table instance using the useReactTable
  const table = useReactTable({
    // 2. provide the data we need and tie it to the useState above
    data, // all the data to be displayed.
    columns, // this will display the column using the column definintion
    getCoreRowModel: getCoreRowModel(), // 4 Use this to get all the row element to display
    columnResizeMode: "onChange", // 11.d This will make the changes when the column is resized
    meta: { //13 this function will be globally avialable and can be used anywhere the table is used, even with the component attached to columnDef cell.
      updateData: (rowIndex, columnId, value) => setData(
        // 13 we loop through the previous data.
        // 13 when we loop, we get the index and compare and do the required update.
        // rowIndex = index of the row in the array, of returned value,
        // the columId = as defined in the columnDef accessorKey
        // value = new value to update.
        prev => prev.map((row, index) =>
          index === rowIndex ? {
            ...prev[rowIndex], [columnId]: value
          } : row
        )
      )
    }

  });

  console.log(table.getHeaderGroups());
  return <Box>
    {/* // 5 use the table.getHeaderGroups() to get the whole header you need */}
    <Box className="table" w={table.getTotalSize()}>
      {/* // 7. add the width element to make the table look organized using the w={} */}
      {/* // 8 in adding the width, use the getTotalSize property to make all the element in the table align */}

      { table.getHeaderGroups().map(headerGroup => <Box className="tr" key={headerGroup.id}>
        {headerGroup.headers.map(
          // 9 use the header.getSize function to make the heder cells aligns with the header
          header => <Box className="th" key={header.id} w={header.getSize()}>
            { header.column.columnDef.header}
            {/* // 11.a After creating the header value, we create the div and give it a name of resizer: 
              // 11.b there is a utility hook to know if the column is being resized, header.column.getIsResizing() which return boolean
              // 11.c we need to also get the resizing handler to help us do the needful: using header.getResizeHandler and tell it when to use it
              // 11.d Lastly, we need to add the columnResizeMode as onChange to the talbe instance, so resize kicks in when we change anything in the table.
            */}
            <Box 
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}></Box>
          </Box>
        )}
      </Box>)}
      {/* // 6  lets output the rows */}
      {
        table.getRowModel().rows.map(row => <Box className="tr" key={row.id}>
          {/* // 10. use the cell.column.getSize with the width to align the cells for the rows */}
          { row.getVisibleCells().map(cell => <Box className="td" w={cell.column.getSize()} key={cell.id}>
            {
              flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )
            }
          </Box>)}
        </Box>)
      }
    </Box>
  </Box>;
};
export default TaskTable;
