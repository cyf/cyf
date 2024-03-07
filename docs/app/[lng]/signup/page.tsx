"use client";
import React, { ChangeEvent, createRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Cropper from "react-cropper";
import EmailValidator from "email-validator";
import Zoom from "react-medium-image-zoom";
import Cookies from "js-cookie";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAgreementDialog } from "@/components/home/agreement-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Apple, Google, LoadingDots } from "@/components/shared/icons";
import { domain, basePath, cacheTokenKey } from "@/constants";
import { authService, userService } from "@/services";
import { setUser } from "@/model/slices/user/slice";
import { useAppDispatch } from "@/model/hooks";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";

import type { ReactCropperElement } from "react-cropper";
import type { IBlob } from "@/utils/image";

import "cropperjs/dist/cropper.css";
import "react-medium-image-zoom/dist/styles.css";

const hasUsernameAsync = async (username: string) => {
  try {
    const res = await userService.hasUsername(username);
    return res?.data || false;
  } catch (e) {
    console.error(e);
  }
  return true;
};

const debounceUsername = AwesomeDebouncePromise(hasUsernameAsync, 500);

const hasEmailAsync = async (email: string) => {
  try {
    const res = await userService.hasEmail(email);
    console.log(res);
    return res?.data || false;
  } catch (e) {
    console.error(e);
  }
  return true;
};

const debounceEmail = AwesomeDebouncePromise(hasEmailAsync, 500);

const formSchema = z
  .object({
    file: z.any(),
    username: z.string().min(6, {
      message: "username-validator",
    }),
    nickname: z.string(),
    email: z.string().email({ message: "email-validator" }),
    password: z.string().min(6, {
      message: "password-validator",
    }),
    "repeat-password": z.string().min(6, {
      message: "password-validator",
    }),
  })
  .refine((data) => !!data.file, {
    message: "file-validator",
    path: ["file"],
  })
  .refine((data) => (data.file?.size || 0) < 5 * 1000 * 1000, {
    message: "file-size-validator",
    path: ["file"],
  })
  .refine((data) => data.password === data["repeat-password"], {
    message: "repeat-password-validator",
    path: ["repeat-password"],
  })
  .refine(
    async (data) => {
      const username = data.username;
      if (!username || username.length < 6) {
        return true;
      }
      return await debounceUsername(username);
    },
    {
      message: "username-existed-validator",
      path: ["username"],
    },
  )
  .refine(
    async (data) => {
      const email = data.email;
      if (!email || !EmailValidator.validate(email)) {
        return true;
      }
      return await debounceEmail(email);
    },
    {
      message: "email-existed-validator",
      path: ["email"],
    },
  );

export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "validator");
  const { t: tf } = useTranslation(params.lng, "footer");
  const { t: tl } = useTranslation(params.lng, "login");
  const dispatch = useAppDispatch();
  const search = useSearchParams();
  const redirectUrl = search.get("r");
  const fileInput = createRef<HTMLInputElement>();
  const cropperRef = createRef<ReactCropperElement>();
  const [googleClicked, setGoogleClicked] = useState(false);
  const [appleClicked, setAppleClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>();
  const [imageInfo, setImageInfo] = useState<IBlob>();
  const [originImage, setOriginImage] = useState();
  const [open, setOpen] = useState<boolean>(false);
  const { setShowAgreementDialog, AgreementDialog, approved, setApproved } =
    useAgreementDialog();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, undefined, { mode: "async" }),
    defaultValues: {
      file: null,
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
    console.log("values", values);
    const { file, username, nickname, email, password } = values;
    setLoading(true);
    await authService
      .register({
        file,
        username,
        nickname,
        email,
        password,
      })
      .then((res: any) => {
        setLoading(false);
        if (res?.code === 0) {
          Cookies.set(cacheTokenKey, res?.data?.access_token);
          dispatch(setUser(res?.data?.user));
          window.location.replace(
            redirectUrl || `${domain}/${params.lng}/admin`,
          );
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
                  name="file"
                  render={({
                    field: { value, onChange, ...fieldProps },
                    fieldState: { error },
                  }) => (
                    <FormItem>
                      <FormLabel>{tl("avatar-label")}</FormLabel>
                      {image && (
                        <div className="flex justify-center">
                          <Zoom classDialog="custom-zoom">
                            <Image
                              className="rounded-full"
                              src={image}
                              width={120}
                              height={120}
                              alt="@avatar"
                            />
                          </Zoom>
                        </div>
                      )}
                      <FormControl>
                        <Input
                          {...fieldProps}
                          id="avatar"
                          ref={fileInput}
                          placeholder={tl("avatar-placeholder")}
                          accept="image/jpg, image/jpeg, image/png"
                          type="file"
                          multiple={false}
                          onChange={async (event) => {
                            if (
                              event.target.files &&
                              event.target.files.length > 0
                            ) {
                              const file = event.target.files[0];
                              import("@/utils/image")
                                .then(async (module) => {
                                  const content = await module.getBase64(file);
                                  setOriginImage(content);
                                  setOpen(true);
                                  setImageInfo({
                                    name: file.name,
                                    type: file.type,
                                    lastModified: file.lastModified,
                                  });
                                  // onChange(file);
                                })
                                .catch((error) => console.error(error));
                            }
                          }}
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
                  name="username"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{tl("username-label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tl("username-placeholder")}
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
                  control={form.control}
                  name="nickname"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{tl("nickname-label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tl("nickname-placeholder")}
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
                  name="email"
                  render={({ field, fieldState: { error } }) => (
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
                <FormField
                  required
                  control={form.control}
                  name="repeat-password"
                  render={({ field, fieldState: { error } }) => (
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
                      <ShowContent isShow={!!error?.message}>
                        <ValidMessage className="!mt-1 text-[12px] font-normal">
                          {t(error?.message || "")}
                        </ValidMessage>
                      </ShowContent>
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
          <div className="flex flex-row items-start justify-center border-b border-gray-200 bg-white px-4 py-4 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-16">
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
                {tf("privacy")}
              </Link>
              {tl("and")}
              <Link
                className="text-blue-500"
                href={`/${params.lng}/legal/terms-of-use`}
              >
                {tf("terms-of-use")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">
              {tf("image-cropping")}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Set your daily activity goal.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-auto flex h-[50vh] w-full flex-col items-center">
            <Cropper
              ref={cropperRef}
              style={{ height: "100%", width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              aspectRatio={1}
              // preview=".img-preview"
              src={originImage}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
            />
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                if (typeof cropperRef.current?.cropper !== "undefined") {
                  const canvas = cropperRef.current?.cropper.getCroppedCanvas();
                  const dataURL = canvas.toDataURL();
                  setImage(dataURL);
                  canvas.toBlob((blob) => {
                    if (blob && imageInfo) {
                      import("@/utils/image")
                        .then(async (module) => {
                          const file = await module.blobToFile(blob, imageInfo);
                          console.log("file", file);
                          form.setValue("file", file);
                          setOpen(false);
                        })
                        .catch((error) => console.error(error));
                    }
                  });
                }
              }}
            >
              {tf("crop-image")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (fileInput.current) {
                  fileInput.current.files = null;
                  fileInput.current.value = "";
                }
                setOpen(false);
              }}
            >
              {tf("cancel")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AgreementDialog lng={params.lng} />
    </>
  );
}
