"use client";
import React, { useCallback, useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/home/page-header";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";

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

const formSchema = z.object({
  app: z.string().min(1, {
    message: "app-validator",
  }),
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "platforms-validator",
  }),
  email: z.string().email({ message: "email-validator" }),
});

export default function User({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "validator");
  const { t: tf } = useTranslation(params.lng, "form");
  const [submitClicked, setSubmitClicked] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, undefined, { mode: "async" }),
    defaultValues: {
      app: "",
      platforms: [],
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
  }

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
      <div className="flex w-screen justify-center">
        <div className="z-10 h-fit w-full max-w-xl overflow-hidden border border-gray-100 dark:border-gray-900 sm:rounded-2xl sm:shadow-xl">
          <PageHeader title={tf("title")} description={tf("tips")} />
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
                      <FormLabel>{tf("app-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {tf("app-description")}
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder={tf("app-placeholder")} />
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
                          {t(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="platforms"
                  render={({ fieldState: { error } }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          {tf("platform-label")}
                        </FormLabel>
                        <FormDescription className="text-[12px]">
                          {tf("platform-description")}
                        </FormDescription>
                      </div>
                      {platforms.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {t(error?.message || "")}
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
                      <FormLabel>{tf("email-label")}</FormLabel>
                      <FormDescription className="text-[12px]">
                        {tf("email-description")}
                        <br />
                        <span className="text-red-400">
                          {tf("email-description2")}
                        </span>
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={tf("email-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {t(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={submitClicked}
                  className={`${
                    submitClicked
                      ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                      : ""
                  } flex w-full items-center justify-center gap-1 rounded-[4px] bg-blue-500 py-4 text-black hover:bg-blue-600 dark:text-white`}
                  type="submit"
                >
                  <RiAddCircleLine className="h-5 w-5 dark:text-gray-300" />
                  <p className="text-lg">{tf("submit")}</p>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
