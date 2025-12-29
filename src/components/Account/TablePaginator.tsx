import React from "react";
import { TablePagination } from "@mui/material";

interface PaginatorProps {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  totalRows,
  rowsPerPage,
  currentPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={totalRows}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default Paginator;
