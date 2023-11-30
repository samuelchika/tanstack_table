import React from 'react';
import { STATUSES } from '../data';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
  } from '@chakra-ui/react'


const ColorIcon = ({color, ...props}) => (
    <Box w="12px" h="12px" bg={color} borderRadius="3px" { ...props} />
)

const StatusCell = ({ getValue, row, column, table }) => {
    const {name, color} = getValue() || {};
    const {updateData} = table.options.meta;
  return (
    <Menu
    isLazy
    offset={[0,0]}
    flip={false}
    autoSelect={false}
    >
  <MenuButton h="100%" w="100%" textAlign="left" p="1.5" bg={color || "transparent"}>
    {name}
  </MenuButton>
  <MenuList>
    <MenuItem
                onClick={
                    () => updateData(row.index, column.id, null)
                }
            >
                <ColorIcon color="red.400" mr={3} />
                None</MenuItem>
    { STATUSES.map(status => (
        <MenuItem
            onClick={
                () => updateData(row.index, column.id, status)
            }
            key={status.id}
        >
            <ColorIcon color={status.color} mr={3} />
            {status.name}</MenuItem>
    ))}
    
  </MenuList>
</Menu>
  )
}

export default StatusCell