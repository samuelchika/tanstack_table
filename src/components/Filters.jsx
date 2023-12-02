import {
  Box,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import SearchIcon from "./icons/SearchIcon";
import FilterPopover from "./FilterPopover";

// in doing the filter stuff, it will be good to take note of the below:
// the columFilter will take and object array with {id, value}
const Filters = ({ columnFilters, setColumnFilters }) => {
  const taskName = columnFilters.find((f) => f.id === "task")?.value || "";
  const onFilterChange = (id, value) => {
    //console.log("Filter", columnFilters);
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id != id)
        .concat({
          id,
          value,
        })
    );
  };
  return (
    <HStack mb={6}>
      <InputGroup size="sm" maxW="12rem">
        <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} />
        </InputLeftElement>
        <Input
          type="text"
          variant="filled"
          placeholder="Task name"
          borderRadius={5}
          value={taskName}
          onChange={(e) => onFilterChange("task", e.target.value)}
        />
      </InputGroup>
      <FilterPopover
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </HStack>
  );
};

export default Filters;
