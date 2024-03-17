"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAgreementDialog } from "@/components/home/agreement-dialog";
import Legal from "@/components/home/legal";
import Or from "@/components/home/or";
import PageHeader from "@/components/home/page-header";
import ThirdPartyAccount from "@/components/home/third-party-account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setUser } from "@/model/slices/user/slice";
import { useAppDispatch } from "@/model/hooks";
import { cacheIdKey, cacheTokenKey } from "@/constants";
import { authService } from "@/services";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  account: z.string().min(1, {
    message: "account-validator",
  }),
  password: z.string().min(6, {
    message: "password-validator",
  }),
});

export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "validator");
  const { t: tl } = useTranslation(params.lng, "login");
  const dispatch = useAppDispatch();
  const search = useSearchParams();
  const redirectUrl = search.get("r");
  const [loading, setLoading] = useState(false);
  const { setShowAgreementDialog, AgreementDialog, approved, setApproved } =
    useAgreementDialog();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { account, password } = values;
    setLoading(true);
    await authService
      .login({
        account,
        password,
      })
      .then((res: any) => {
        setLoading(false);
        console.log("res", res);
        if (res?.code === 0) {
          if (res?.data?.user?.id) {
            Cookies.set(cacheIdKey, res?.data?.user?.id);
          }
          Cookies.set(cacheTokenKey, res?.data?.access_token);
          dispatch(setUser(res?.data?.user));
          redirectUrl && window.location.replace(redirectUrl);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
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
        <div className="z-10 h-fit w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-900 sm:rounded-2xl sm:shadow-xl">
          <PageHeader title={tl("title")} description={tl("tips")} />
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-10">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(
                    async (values: z.infer<typeof formSchema>) => {
                      if (!approved) {
                        setShowAgreementDialog(true);
                        return;
                      }
                      await onSubmit(values);
                    },
                  )(e);
                }}
                className="space-y-4"
              >
                <FormField
                  required
                  control={form.control}
                  name="account"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{tl("account-label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tl("account-placeholder")}
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
                <FormField
                  required
                  control={form.control}
                  name="password"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{tl("password-label")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={tl("password-placeholder")}
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
                  className={`${
                    loading
                      ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                      : ""
                  } flex w-full items-center justify-center gap-3.5 rounded-[4px] bg-blue-500 py-4 text-black hover:bg-blue-600 dark:text-white`}
                  type="submit"
                >
                  {tl("login")}
                </Button>
              </form>
            </Form>
            <div className="flex flex-row justify-center text-[12px] text-gray-500 dark:text-gray-400">
              <span>{tl("no-account")},&nbsp;</span>
              <Link
                href={`/${params.lng}/signup${redirectUrl ? `?r=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="text-blue-500"
              >
                {tl("go-to-register")}
              </Link>
            </div>
            <Or lng={params.lng} />
            <ThirdPartyAccount
              approved={approved}
              setShowAgreementDialog={setShowAgreementDialog}
              lng={params.lng}
            />
          </div>
          <Legal
            approved={approved}
            setApproved={setApproved}
            lng={params.lng}
          />
        </div>
      </div>
      <AgreementDialog lng={params.lng} />
    </>
  );
}
