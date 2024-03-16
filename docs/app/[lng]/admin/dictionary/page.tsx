"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, MoreHorizontal, Plus, Send } from "lucide-react";
import DatalistInput from "react-datalist-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Dictionary } from "@/entities/dictionary";
import { dictionaryService } from "@/services";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";

interface ColumnMetaType {
  headerClassName?: string;
}

const formSchema = z.object({
  primary: z.string().min(1, {
    message: "primary-validator",
  }),
  key: z.string().min(1, {
    message: "key-validator",
  }),
  label: z.string().min(1, {
    message: "label-validator",
  }),
  description: z.any(),
});

export default function Dictionaries({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "dictionary");
  const { t: tv } = useTranslation(params.lng, "validator");
  const { t: tc } = useTranslation(params.lng, "common");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [showAddDialogOpened, setAddDialogOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 列表
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);

  // 编辑
  const [dictionaryId, setDictionaryId] = useState<string | null>();

  const columns: ColumnDef<Dictionary, ColumnMetaType>[] = [
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
      accessorKey: "primary",
      header: t("primary"),
      cell: ({ row }) => {
        return <div>{row.getValue("primary")}</div>;
      },
    },
    {
      accessorKey: "key",
      header: t("key"),
      cell: ({ row }) => {
        return <div>{row.getValue("key")}</div>;
      },
    },
    {
      accessorKey: "label",
      header: t("label"),
      cell: ({ row }) => {
        return <div>{row.getValue("label")}</div>;
      },
    },
    {
      accessorKey: "description",
      header: t("description"),
      cell: ({ row }) => {
        return <div>{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "user",
      header: () => <div className="text-right">{t("user")}</div>,
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
        const item = row.original;

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
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                {t("copy-dictionary-id")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDictionaryId(item.id);
                  setAddDialogOpened(true);
                }}
              >
                {t("edit")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dictionaries,
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary: "",
      key: "",
      label: "",
    },
  });

  // 列表
  const fetchData = () => {
    setLoading(true);
    dictionaryService
      .list()
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          setDictionaries(res?.data || []);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: tc("error"),
          duration: 2000,
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  };

  // 详情
  const fetchDetail = (id: string) => {
    setLoading(true);
    dictionaryService
      .findOne(id)
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          form.setValue("primary", res?.data?.primary || "");
          form.setValue("key", res?.data?.key || "");
          form.setValue("label", res?.data?.label || "");
          form.setValue("description", res?.data?.description || "");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: tc("error"),
          duration: 2000,
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dictionaryId) {
      fetchDetail(dictionaryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryId]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
    if (!dictionaryId) {
      await create(values);
    } else {
      await update(values);
    }
  }

  // 创建
  const create = async (values: z.infer<typeof formSchema>) => {
    const { primary, key, label, description } = values;
    setLoading(true);
    await dictionaryService
      .create({
        primary,
        key,
        label,
        description,
      })
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          setAddDialogOpened(false);
          fetchData();
          toast({
            title: tc("succeed"),
            duration: 2000,
            action: (
              <ToastAction
                className="focus:ring-0 focus:ring-offset-0"
                altText="Goto schedule to undo"
              >
                {tc("confirm")}
              </ToastAction>
            ),
          });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: tc("error"),
          duration: 2000,
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  };

  // 更新
  const update = async (values: z.infer<typeof formSchema>) => {
    if (!dictionaryId) return;
    const { primary, key, label, description } = values;
    setLoading(true);
    await dictionaryService
      .update(dictionaryId, {
        primary,
        key,
        label,
        description,
      })
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          setAddDialogOpened(false);
          fetchData();
          toast({
            title: tc("succeed"),
            duration: 2000,
            action: (
              <ToastAction
                className="focus:ring-0 focus:ring-offset-0"
                altText="Goto schedule to undo"
              >
                {tc("confirm")}
              </ToastAction>
            ),
          });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: tc("error"),
          duration: 2000,
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  };

  useEffect(() => {
    if (!showAddDialogOpened) {
      form?.reset();
    }
  }, [form, showAddDialogOpened]);

  // 根据内容判断是否显示的页面内组件
  const ShowContent = useCallback(
    ({
      isShow,
      children,
    }: {
      isShow: boolean;
      children: React.ReactElement;
    }) => (isShow ? children : null),
    [],
  );

  const ValidMessage = useCallback(
    ({
      className,
      children,
    }: {
      className?: string;
      children: React.ReactNode;
    }) => (
      <p className={cn("text-sm font-medium text-destructive", className)}>
        {children}
      </p>
    ),
    [],
  );

  return (
    <>
      <div className="w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              wrapperClassName="w-full"
              placeholder={t("form.label-placeholder")}
              value={
                (table.getColumn("label")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("label")?.setFilterValue(event.target.value)
              }
              className="w-full max-w-sm focus-visible:ring-0 focus-visible:ring-offset-0 max-sm:w-[90%]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {t("columns")}
                  <ChevronDown className="ml-2 h-4 w-4" />
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
            <Button
              variant="outline"
              className="ml-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => setAddDialogOpened(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("add")}
            </Button>
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
      <Dialog
        open={showAddDialogOpened}
        onOpenChange={(open: boolean) => {
          setAddDialogOpened(open);
          !open && setDictionaryId(null);
        }}
      >
        <DialogContent
          className="max-w-[60%] max-sm:max-w-[95%]"
          onEscapeKeyDown={(e) => e.preventDefault()}
          // onPointerDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {dictionaryId ? t("edit") : t("add")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  required
                  control={form.control}
                  name="primary"
                  render={({
                    field: { onChange, value, ...ret },
                    fieldState: { error },
                  }) => (
                    <FormItem>
                      <FormLabel>{t("form.primary-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.primary-description")}
                      </FormDescription>
                      <FormControl>
                        <DatalistInput
                          showLabel={false}
                          label=""
                          value={value}
                          placeholder={t("form.primary-placeholder")}
                          onSelect={(item) => onChange(item.id)}
                          className="relative"
                          inputProps={{
                            ...ret,
                            onChange,
                            className:
                              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                          }}
                          listboxProps={{
                            className:
                              "w-full max-h-[300px] overflow-y-auto border border-input rounded-[5px] absolute mt-[2px] p-0 flex flex-col list-none z-10 bg-white dark:bg-black",
                          }}
                          listboxOptionProps={{
                            className:
                              "w-full cursor-pointer m-0 p-[5px] text-slate-500 dark:text-slate-400 focus:bg-gray-100 dark:focus:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900",
                          }}
                          items={[
                            { id: "app", value: "app" },
                            { id: "platform", value: "platform" },
                          ]}
                        />
                      </FormControl>
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {tv(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="key"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{t("form.key-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.key-description")}
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder={t("form.key-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {tv(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="label"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{t("form.label-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.label-description")}
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder={t("form.label-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {tv(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{t("form.description-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.description-description")}
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.description-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {tv(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-blue-500 py-4 text-black hover:bg-blue-600 dark:text-white"
                  type="submit"
                >
                  <Send className="mr-2 h-5 w-5 dark:text-gray-300" />
                  <p className="text-lg">{t("form.submit")}</p>
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
