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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/home/page-header";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { insiderService, userService } from "@/services";
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
  platform: z.string().min(1, {
    message: "platform-validator",
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
  const { t: tc } = useTranslation(params.lng, "common");
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app: "",
      platform: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
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
          toast({
            title: tc("succeed"),
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
          variant: "destructive",
          description: error?.msg || tc("error-description"),
        });
      });
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
                  name="platform"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          {tf("platform-label")}
                        </FormLabel>
                        <FormDescription className="text-[12px]">
                          {tf("platform-description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                              <FormLabel className="font-normal after:hidden">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>

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
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-blue-500 py-4 text-black hover:bg-blue-600 dark:text-white"
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
