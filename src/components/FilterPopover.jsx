import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  VStack,
  Flex,
  Button,
  Text,
  Icon,
  PopoverArrow,
  filter,
} from "@chakra-ui/react";
import FilterIcon from "./icons/FilterIcon";
import { STATUSES } from "../data";
import { ColorIcon } from "./StatusCell";

// since we want to filter by Array which is not string or number, we have to go to columnDef and do some magic.
// wee need to enableColumnFilter for this guy which is an array of objects

const StatusItem = ({ status, setColumnFilters, isActive }) => (
  <Flex
    align="center"
    cursor="pointer"
    borderRadius={5}
    fontWeight="bold"
    p={0.5}
    bg={isActive ? "gray.800" : "transparent"}
    _hover={{
      bg: "gray.800",
    }}
    onClick={() => {
      setColumnFilters((prev) => {
        // find if we already have in the columnFIlters array any array with id as status.
        // we can have array with id of task as we have in the filter
        const statuses = prev.find((filter) => filter.id === "status")?.value;
        if (!statuses) {
          // if we did not find any object in the columnFilter array with status as the ID, we add a new one
          return prev.concat({
            id: "status",
            value: [status.id],
          });
        }

        return prev.map((f) =>
          f.id === "status"
            ? {
                ...f,
                value: isActive
                  ? statuses.filter((s) => s !== status.id)
                  : statuses.concat(status.id),
              }
            : f
        );
      });
    }}
  >
    <ColorIcon color={status.color} mr={3} />
    {status.name}
  </Flex>
);

const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const filterStatus =
    columnFilters.find((f) => f.id === "status")?.value || [];
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button size="sm" leftIcon={<Icon as={FilterIcon} fontSize={18} />}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text fontSize="md" fontWeight="bold" mb={4}>
            Filter By:
          </Text>
          <Text color="gray.400" fontWeight="bold" mb={1}>
            Status
          </Text>
          <VStack align="flex-start" spacing={1}>
            {STATUSES.map((status) => (
              <StatusItem
                isActive={filterStatus.includes(status.id)}
                status={status}
                setColumnFilters={setColumnFilters}
                key={status.id}
              />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
