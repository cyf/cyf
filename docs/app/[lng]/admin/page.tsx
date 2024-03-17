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
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Send,
  RefreshCcw,
} from "lucide-react";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Insider } from "@/entities/insider";
import { Dictionary } from "@/entities/dictionary";
import { insiderService, dictionaryService } from "@/services";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";

interface ColumnMetaType {
  headerClassName?: string;
}

const formSchema = z.object({
  app: z.string().min(1, {
    message: "app-validator",
  }),
  platform: z.string().min(1, {
    message: "platform-validator",
  }),
  email: z.string().email({ message: "email-validator" }),
});

export default function Admin({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "admin");
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
  const [insiders, setInsiders] = useState<Insider[]>([]);
  const [apps, setApps] = useState<Pick<Dictionary, "id" | "label">[]>([]);
  const [platforms, setPlatforms] = useState<
    Pick<Dictionary, "id" | "label">[]
  >([]);

  // 编辑
  const [insiderId, setInsiderId] = useState<string | null>();
  const [insider, setInsider] = useState<Insider | null>();

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
                {t("copy-insider-id")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setInsiderId(item.id);
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app: "",
      platform: "",
      email: "",
    },
  });

  const fetchApps = () => {
    dictionaryService
      .listByPrimary("app")
      .then((res: any) => {
        console.log(res);
        if (res?.code === 0) {
          const data = res?.data || [];
          setApps(
            data.map((item: Dictionary) => ({
              id: item.key,
              label: item.label,
            })),
          );
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const fetchPlatforms = () => {
    dictionaryService
      .listByPrimary("platform")
      .then((res: any) => {
        console.log(res);
        if (res?.code === 0) {
          const data = res?.data || [];
          setPlatforms(
            data.map((item: Dictionary) => ({
              id: item.key,
              label: item.label,
            })),
          );
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  // 列表
  const fetchData = () => {
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
          duration: 2000,
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
  };

  // 详情
  const fetchDetail = (id: string) => {
    setLoading(true);
    insiderService
      .findOne(id)
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          setInsider(res?.data || null);
          form.setValue("app", res?.data?.app || "");
          form.setValue("platform", res?.data?.platform || "");
          form.setValue("email", res?.data?.email || "");
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
    fetchApps();
    fetchPlatforms();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (insiderId) {
      fetchDetail(insiderId);
    } else {
      setInsider(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insiderId]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
    if (!insiderId) {
      await create(values);
    } else {
      await update(values);
    }
  }

  // 创建
  const create = async (values: z.infer<typeof formSchema>) => {
    const { app, platform, email } = values;
    setLoading(true);
    await insiderService
      .create({
        app,
        platform,
        email,
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
    if (!insiderId) return;
    const { app, platform, email } = values;
    setLoading(true);
    await insiderService
      .update(insiderId, {
        app,
        platform,
        email,
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
      <div className="mt-16 w-full max-w-screen-xl flex-1 px-5 xl:px-0">
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
            <Button
              variant="outline"
              className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={fetchData}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-2 focus-visible:ring-0 focus-visible:ring-offset-0"
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
          !open && setInsiderId(null);
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
              {insiderId ? t("edit") : t("add")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("form.tips")}
            </DialogDescription>
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
                  name="app"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{t("form.app-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.app-description")}
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={insider?.app}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue
                              placeholder={t("form.app-placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {apps.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  name="platform"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          {t("form.platform-label")}
                        </FormLabel>
                        <FormDescription className="text-[12px]">
                          {t("form.platform-description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={insider?.platform}
                          className="flex flex-col space-y-1"
                        >
                          {platforms.map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={item.id} />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal after:hidden">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
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
                  name="email"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{t("form.email-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {t("form.email-description")}
                        <br />
                        <span className="text-red-400">
                          {t("form.email-description2")}
                        </span>
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.email-placeholder")}
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
