"use client";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAgreementDialog } from "@/components/home/agreement-dialog";
import { Apple, Google, LoadingDots } from "@/components/shared/icons";
import { basePath, cacheTokenKey } from "@/constants";
// import { authService } from "@/services";
import { useTranslation } from "@/i18n/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    username: z.string().min(6),
    nickname: z.string(),
    email: z.string().email({ message: "Email is invalid." }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    "repeat-password": z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data["repeat-password"], {
    message: "The passwords entered are different.",
    path: ["repeat-password"],
  });

export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "footer");
  const { t: tl } = useTranslation(params.lng, "login");
  const search = useSearchParams();
  const redirectUrl = search.get("r");
  const [googleClicked, setGoogleClicked] = useState(false);
  const [appleClicked, setAppleClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setShowAgreementDialog, AgreementDialog, approved, setApproved } =
    useAgreementDialog();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      nickname: "",
      email: "",
      password: "",
      "repeat-password": "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { username, nickname, email, password } = values;
    // setLoading(true);
    // await authService
    //   .login({
    //     account,
    //     password,
    //   })
    //   .then((res: any) => {
    //     setLoading(false);
    //     if (res?.code === 0) {
    //       Cookies.set(cacheTokenKey, res?.data?.access_token);
    //       redirectUrl && window.location.replace(redirectUrl);
    //     }
    //   })
    //   .catch((error: any) => {
    //     setLoading(false);
    //     console.error(error);
    //   });
  }

  return (
    <>
      <div className="flex w-screen justify-center">
        <div className="z-10 h-fit w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-900 sm:rounded-2xl sm:shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-16">
            <Link href="/">
              <Image
                src={`${basePath}/logo.jpg`}
                alt="CYF logo"
                className="h-10 w-10 rounded-full"
                width={20}
                height={20}
              />
            </Link>
            <h3 className="text-xl font-semibold">{tl("signup-title")}</h3>
            <p className="text-sm text-gray-500">{tl("tips")}</p>
          </div>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tl("username-label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tl("username-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="!mt-1 text-[12px] font-normal" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tl("nickname-label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tl("nickname-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="!mt-1 text-[12px] font-normal" />
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tl("email-label")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={tl("email-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="!mt-1 text-[12px] font-normal" />
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="password"
                  render={({ field }) => (
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
                      <FormMessage className="!mt-1 text-[12px] font-normal" />
                    </FormItem>
                  )}
                />
                <FormField
                  required
                  control={form.control}
                  name="repeat-password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tl("repeat-password-label")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={tl("repeat-password-placeholder")}
                          {...field}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="!mt-1 text-[12px] font-normal" />
                    </FormItem>
                  )}
                />
                <Button
                  className={`${
                    loading
                      ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                      : ""
                  } flex w-full items-center justify-center gap-3.5 rounded-[4px] bg-blue-500 py-4 text-black hover:bg-blue-600 dark:text-white`}
                  type="submit"
                >
                  {tl("signup")}
                  {loading && <LoadingDots />}
                </Button>
              </form>
            </Form>
            <div className="flex flex-row justify-center text-[12px] text-gray-500 dark:text-gray-400">
              <span>{tl("has-account")},&nbsp;</span>
              <Link
                href={`/${params.lng}/login${redirectUrl ? `?r=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="text-blue-500"
              >
                {tl("go-to-login")}
              </Link>
            </div>
            <div className="flex items-center text-[14px] text-gray-500 before:mr-[10px] before:h-[1px] before:flex-1 before:border-dashed before:bg-gray-300 before:content-[''] after:ml-[10px] after:h-[1px] after:flex-1 after:border-dashed after:bg-gray-300 after:content-[''] dark:text-gray-100 before:dark:bg-gray-600 after:dark:bg-gray-600">
              {tl("or")}
            </div>
            <div className="flex flex-row justify-center gap-3.5 space-y-0 pt-4">
              <button
                disabled={googleClicked}
                className={`${
                  googleClicked
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
                    : "border border-gray-200 bg-white text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-700"
                } flex h-10 flex-1 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                onClick={() => {
                  if (!approved) {
                    setShowAgreementDialog(true);
                    return;
                  }
                  // setGoogleClicked(true);
                  // signIn("google", {
                  //   ...(callbackUrl ? { callbackUrl } : {}),
                  // }).finally(() => {
                  //   setGoogleClicked(false);
                  // });
                }}
              >
                {googleClicked ? (
                  <LoadingDots />
                ) : (
                  <Google className="h-5 w-5" />
                )}
              </button>
              <button
                disabled={appleClicked}
                className={`${
                  appleClicked
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
                    : "border border-gray-200 bg-white text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-700"
                } flex h-10 flex-1 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                onClick={() => {
                  if (!approved) {
                    setShowAgreementDialog(true);
                    return;
                  }
                  // setAppleClicked(true);
                  // signIn("apple", {
                  //   ...(callbackUrl ? { callbackUrl } : {}),
                  // }).finally(() => {
                  //   setAppleClicked(false);
                  // });
                }}
              >
                {appleClicked ? <LoadingDots /> : <Apple className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-row items-start justify-center border-b border-gray-200 bg-white px-4 pb-8 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-16">
            <input
              checked={approved}
              type="checkbox"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setApproved(e.target.checked)
              }
              className="mr-1 mt-[0.1875rem] h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <p className="text-left text-sm text-gray-500">
              {tl("agree-content")}
              <Link
                className="text-blue-500"
                href={`/${params.lng}/legal/privacy`}
              >
                {t("privacy")}
              </Link>
              {tl("and")}
              <Link
                className="text-blue-500"
                href={`/${params.lng}/legal/terms-of-use`}
              >
                {t("terms-of-use")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AgreementDialog lng={params.lng} />
    </>
  );
}
