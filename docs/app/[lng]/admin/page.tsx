"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { selectUser } from "@/model/slices/user/slice";
import { Insider } from "@/entities/insider";
import { insiderService } from "@/services";
import { useAppSelector } from "@/model/hooks";
import { useTranslation } from "@/i18n/client";

interface ColumnMetaType {
  headerClassName?: string;
}

const apps = [
  {
    id: "fafa-runner",
    label: "FaFa Runner",
  },
  {
    id: "homing-pigeon",
    label: "Homing Pigeon",
  },
] as const;

const platforms = [
  {
    id: "ios",
    label: "iOS",
  },
  {
    id: "android",
    label: "Android",
  },
  {
    id: "macos",
    label: "MacOS",
  },
] as const;

export default function Admin({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "admin");
  const { t: tc } = useTranslation(params.lng, "common");
  const user = useAppSelector(selectUser);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [loading, setLoading] = useState(false);
  const [insiders, setInsiders] = useState<Insider[]>([]);

  const columns: ColumnDef<Insider, ColumnMetaType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "app",
      header: t("app"),
      cell: ({ row }) => {
        const app = row.getValue("app") as string | undefined;
        return (
          <Select defaultValue={app}>
            <SelectValue />
            <SelectContent>
              {apps.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "platform",
      header: t("platform"),
      cell: ({ row }) => {
        const platform = row.getValue("platform") as string | undefined;
        return (
          <Select defaultValue={platform}>
            <SelectValue />
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "user",
      header: () => <div className="text-right">{t("create_by")}</div>,
      cell: ({ row }) => {
        const user = row.getValue("user") as any;
        return (
          <div className="text-right font-medium">
            {user?.nickname || user?.username}
          </div>
        );
      },
    },
    {
      accessorKey: "create_date",
      header: () => <div className="text-right">{t("create_date")}</div>,
      cell: ({ row }) => {
        const date = new Date(row.getValue("create_date"));
        const formatted = dayjs(date).format("YYYY-MM-DD HH:ss");
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("actions")}</div>,
      enableHiding: false,
      meta: {
        headerClassName: "w-[120px]",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: insiders,
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
  });

  useEffect(() => {
    setLoading(true);
    insiderService
      .list()
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          setInsiders(res?.data || []);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: tc("error"),
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              wrapperClassName="w-full"
              placeholder={t("email-placeholder")}
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="w-full max-w-sm focus-visible:ring-0 focus-visible:ring-offset-0 max-sm:w-[90%]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {t("columns")} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={column.toggleVisibility}
                      >
                        {t(column.id)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={
                            (header.column.columnDef.meta as any)
                              ?.headerClassName
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
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
                        <TableCell
                          key={cell.id}
                          className={
                            (cell.column.columnDef.meta as any)?.cellClassName
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
                      {loading ? tc("loading") : t("no-results")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {t("selected", {
                selected: table.getFilteredSelectedRowModel().rows.length,
                total: table.getFilteredRowModel().rows.length,
              })}
            </div>
            <div className="space-x-2">
              <Button
                className="max-sm:hidden"
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                className="max-sm:hidden"
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
