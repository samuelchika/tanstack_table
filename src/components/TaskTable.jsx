import { useState } from "react";
import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import DATA from "../data";
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell";
import Filters from "./Filters";
import SortIcon from "./icons/SortIcon";

const TaskTable = () => {
  // 3. Define your column headers which will be used to manipulate the data
  // : This column help react-table do some manipulations
  // : The column is like the object param for each row in the data. Visit Doc for ore

  // 11. For sizing, the resizing of the table, we need a resizer div with 0 opacity but visible when hovered over.
  // 12. We develop a separate component to use to display any cell we want to be unique like the Task below
  // 12.... Visit the component to see more about what to do
  // 13 Update the general table when we update one cell. Use the meta tag in the table instance
  // 13.a the meta takes a function which will used to update whats happening. The function takes 3 params:
  // 13.b the 3 params are: (id of the element, the column to be updated, and the new value)

  // 14, we are now looking at doing filter on our table. This will be done using state and filter function.
  // 14, this state will be a useState to keep track of the filtered data and default to an empty array []
  // 14a - create a filter state - const [columnFilters, setColumnFilters] = useState([])
  // 14b - We need to create the input to help us take in the value we need to be able to filter. Filters.js
  // 14c - Import the Filters.js#

  // 15 We need to add the sorting functionality.
  // 15, once we add the getSortRowModel into our table instance, we need to add the sorting icon in our table head.

  // 16 Pagination: This will be possible using some utility function as below before the last <Box> closing tag.

  const columns = [
    {
      accessorKey: "task", // this will be used to fetch all the row within the object with 'task'
      header: "TASK", // this will display on the table
      cell: EditableCell, // this will return JSX for us with the information property of the accessorKey
      size: 225, // This will be the size of the cells in the table
      enableColumnFilter: true, // this will enable this column to be part of the filter columns options
      filterFn: "includesString", // This just do normal string filter and checking if the string contains the given value in the columnFilters array.
    },
    {
      accessorKey: "status", // this will be used to fetch all the row within the object with 'status'
      header: "STATUS", // this will display on the table
      cell: StatusCell, // this will return JSX for us with the information property of the accessorKey
      enableColumnFilter: true, // this will enable this column to be part of the filter columns options
      enableSorting: true, // this will return false for this column in sorting.
      sortingFn: (rowA, rowB, columnId) => {
        console.log(
          "A",
          rowA.getValue(columnId),
          "\nB",
          rowB.getValue(columnId)
        );
        const rowAId = rowA?.getValue(columnId)?.id;
        const rowBId = rowB?.getValue(columnId)?.id;
        return rowAId < rowBId ? 1 : rowAId > rowBId ? -1 : 0;
      },
      filterFn: (row, columnId, filterStatuses) => {
        // After we are done with the filtering below, noticed removing the whole filter condition leaves the table empty.
        if (filterStatuses.length === 0) return true;

        // row: Gives us each value of the data array, we use the getValue(columnId) function to get the value of our interested column
        // columnId: This is the accessorKey value - "status"
        // filterStatus: This will return the value filed added to the columnFilters to be used for filtering
        const status = row.getValue(columnId); // This get the status of a current row
        return filterStatuses.includes(status?.id); // This will get all the value added into the array columnFilters with columnId status then check if each status id is in there
      },
    },
    {
      accessorKey: "due", // this will be used to fetch all the row within the object with 'due'
      header: "DUE", // this will display on the table
      cell: DateCell, // this will return JSX for us with the information property of the accessorKey
    },
    {
      accessorKey: "notes", // this will be used to fetch all the row within the object with 'notes'
      header: "NOTES", // this will display on the table
      cell: EditableCell, // this will return JSX for us with the information property of the accessorKey
    },
  ];
  // 2a. the use state to help us keep track of data
  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([]);
  //console.log(data);
  // 1. Create a table instance using the useReactTable
  const table = useReactTable({
    // 2. provide the data we need and tie it to the useState above
    data, // all the data to be displayed.
    columns, // this will display the column using the column definintion
    state: {
      // 14 d anything defined here can be access by the table util function (globally) eg: table.getState.
      columnFilters, // for filtering
      pagination: {
        // 16 set pagination option
        pageIndex: 0, // page to view
        pageSize: 3, // by default its 10 row per page
      },
    },
    getCoreRowModel: getCoreRowModel(), // 4 Use this to get all the row element to display
    getFilteredRowModel: getFilteredRowModel(), // 14f - This is responsible for doing the filter behind the scene. it needs {id(column id), value(for the filter)}
    getSortedRowModel: getSortedRowModel(), // 15 This is responsible for sorting
    getPaginationRowModel: getPaginationRowModel(), // 16 This is responsible for pagination
    columnResizeMode: "onChange", // 11.d This will make the changes when the column is resized
    meta: {
      //13 this function will be globally available and can be used anywhere the table is used, even with the component attached to columnDef cell.
      updateData: (rowIndex, columnId, value) =>
        setData(
          // 13 we loop through the previous data.
          // 13 when we loop, we get the index and compare and do the required update.
          // rowIndex = index of the row in the array, of returned value,
          // the columId = as defined in the columnDef accessorKey
          // value = new value to update.
          (prev) =>
            prev.map((row, index) =>
              index === rowIndex
                ? {
                    ...prev[rowIndex],
                    [columnId]: value,
                  }
                : row
            )
        ),
    },
  });

  //console.log(columnFilters);
  return (
    <Box>
      {/* // 14e - add the filter component to the table for filtering */}
      {/* 14g - pass the columnFilter and setColumnFilter to the filter component */}
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      {/* // 5 use the table.getHeaderGroups() to get the whole header you need */}
      <Box className="table" w={table.getTotalSize()}>
        {/* // 7. add the width element to make the table look organized using the w={} */}
        {/* // 8 in adding the width, use the getTotalSize property to make all the element in the table align */}

        {table.getHeaderGroups().map((headerGroup) => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map(
              // 9 use the header.getSize function to make the heder cells aligns with the header
              (header) => (
                <Box className="th" key={header.id} w={header.getSize()}>
                  {header.column.columnDef.header}
                  {/* // 15, we use a utility function to check if header is sortable and add our button 
                  // the utility function tells us if this guys is sortable - header.column.getCanSort: boolean
                  // in the onClick function, we use the utility function getToogleSortingHandler, which returns another function that get sorting to work.
                  // we can disable a particular column from been used for sorting in the column def
                  */}
                  {header.column.getCanSort && (
                    <Icon
                      as={SortIcon}
                      mx={3}
                      fontSize={14}
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}

                  {/* // we can also add an arrow to show if its sorting ascending or descending 
                    This is done using the getIsSorted() which return either ASC or DESC
                  */}
                  {{ asc: "🔼", desc: "🔽" }[header.column.getIsSorted()]}
                  {/* // 11.a After creating the header value, we create the div and give it a name of resizer: 
              // 11.b there is a utility hook to know if the column is being resized, header.column.getIsResizing() which return boolean
              // 11.c we need to also get the resizing handler to help us do the needful: using header.getResizeHandler and tell it when to use it
              // 11.d Lastly, we need to add the columnResizeMode as onChange to the talbe instance, so resize kicks in when we change anything in the table.
            */}
                  <Box
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  ></Box>
                </Box>
              )
            )}
          </Box>
        ))}
        {/* // 6  lets output the rows */}
        {table.getRowModel().rows.map((row) => (
          <Box className="tr" key={row.id}>
            {/* // 10. use the cell.column.getSize with the width to align the cells for the rows */}
            {row.getVisibleCells().map((cell) => (
              <Box className="td" w={cell.column.getSize()} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <br />
      <Text mb={2}>
        Page
        {
          // 16 The below will give you the index of the page of which are in, the default is 0, we need to add one to it.
          table.getState().pagination.pageIndex + 1
        }{" "}
        of{" "}
        {
          // This give us how many page we are needing
          table.getPageCount()
        }
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage}
        >
          {">"}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default TaskTable;
