import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

export function DynamicTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No records found.',
  keyExtractor
}: DynamicTableProps<T>) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-start rtl:text-end">
          <TableHeader className="text-xs uppercase bg-muted/50 text-muted-foreground">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length} className="px-6 py-4">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
