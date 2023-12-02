import { Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";

const EditableCell = ({ getValue, row, column, table }) => {
  // console.log(row, column)
  // 1 we can see we need to have the value synced, we need to use the data as the default value - destructuring the getValue as above.
  const initialValue = getValue();
  // 3 monitor the value using the use state below.
  const [value, setValue] = useState(initialValue);
  // 4 we want the table to stay in sync with our current changes:

  // 7 at this point we have set up our updateFunction in the meta field in the main table instance
  // 7.a We can now access it and do the magic we need:
  const onBlur = () => {
    console.log("Column id", column.id);
    table.options.meta?.updateData(row.index, column.id, value);
  };

  // 5 this will run only when initialValue change
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 6 we need to update the overall data, like update our backend when something changes:
  // 6.a To do that we use the meta property on the table instance in the TaskTable component
  return (
    // 2 Create the component we need and style it.
    <Input
      value={value}
      onBlur={onBlur}
      onChange={(e) => setValue(e.target.value)}
      variant="filled"
      size="sm"
      w="85%"
      overflow="ellipsis"
      whiteSpace="nowrap"
    />
  );
};

export default EditableCell;
