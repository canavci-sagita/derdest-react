import { TableRoot } from "./TableRoot";
import { Thead } from "./Thead";
import { Tbody } from "./Tbody";
import { Tr } from "./Tr";
import { Th } from "./Th";
import { Td } from "./Td";

const Table = Object.assign(TableRoot, {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
});

export { Table };
