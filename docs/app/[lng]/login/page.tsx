"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import EmailValidator from "email-validator";
import Cookies from "js-cookie";
import { Apple, Google, LoadingDots } from "@/components/shared/icons";
import { basePath, cacheTokenKey } from "@/constants";
import { authService } from "@/services";

export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const search = useSearchParams();
  const redirectUrl = search.get("r");
  const [checked, setChecked] = useState(false);
  const [showRed, setRed] = useState(false);
  const [googleClicked, setGoogleClicked] = useState(false);
  const [appleClicked, setAppleClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [accountError, setAccountError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const accountRuler = (input: string | null) => {
    if (!input) {
      return "account must not be empty.";
    }
    // if (!EmailValidator.validate(input)) {
    //   return "email format is incorrect.";
    // }
    return null;
  };

  const passwordRuler = (input: string | null) => {
    if (!input) {
      return "password must not be empty.";
    }
    if (input.length < 6 || input.length > 20) {
      return "password length is between 6 and 20.";
    }
    return null;
  };

  const login = async (account: string | null, password: string | null) => {
    const eError = accountRuler(account);
    const pwdError = passwordRuler(password);
    if (eError || pwdError) {
      setAccountError(eError);
      setPasswordError(pwdError);
      return;
    }
    setAccountError(null);
    setPasswordError(null);

    setLoading(true);
    await authService
      .login({
        account,
        password,
      })
      .then((res: any) => {
        setLoading(false);
        if (res?.code === 0) {
          Cookies.set(cacheTokenKey, res?.data?.access_token);
          redirectUrl && window.location.replace(redirectUrl);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
      });
  };

  const onCheckboxChange = (e: any) => {
    e.target.checked && setRed(false);
    setChecked(e.target.checked);
  };

  return (
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
          <h3 className="text-xl font-semibold">Sign in to CYF</h3>
          <p className="text-sm text-gray-500">
            Only your email and profile picture will be stored.
          </p>
        </div>
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-10">
          <form
            name="loginForm"
            className="flex flex-col space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!checked) {
                setRed(true);
                return;
              }
              await login(
                (e.target as any)?.account?.value,
                (e.target as any)?.password?.value,
              );
            }}
          >
            <label htmlFor="account" className="text-black dark:text-white">
              Account
            </label>
            <input
              type="text"
              name="account"
              placeholder="please enter you username or email"
              className={`rounded-[8px] bg-white text-black dark:bg-black dark:text-white ${
                accountError ? "border-red-400 dark:border-red-400" : ""
              }`}
            />
            {accountError && (
              <span className="!mt-1 text-[12px] text-red-400">
                {accountError}
              </span>
            )}
            <label htmlFor="password" className="text-black dark:text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="please enter you password"
              className={`rounded-[8px] bg-white text-black dark:bg-black dark:text-white ${
                passwordError ? "border-red-400 dark:border-red-400" : ""
              }`}
            />
            {passwordError && (
              <span className="!mt-1 text-[12px] text-red-400">
                {passwordError}
              </span>
            )}
            <button
              className={`${
                loading ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700" : ""
              } flex items-center justify-center gap-3.5 rounded-[4px] bg-blue-500 py-2 hover:bg-blue-600`}
              type="submit"
            >
              登录{loading && <LoadingDots />}
            </button>
          </form>

          <div className="flex items-center text-[16px] text-gray-500 before:mr-[10px] before:h-[1px] before:flex-1 before:bg-gray-300 before:content-[''] after:ml-[10px] after:h-[1px] after:flex-1 after:bg-gray-300 after:content-[''] dark:text-gray-100 before:dark:bg-gray-600 after:dark:bg-gray-600">
            or
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
                if (!checked) {
                  setRed(true);
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
              {googleClicked ? <LoadingDots /> : <Google className="h-5 w-5" />}
            </button>
            <button
              disabled={appleClicked}
              className={`${
                appleClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-700"
              } flex h-10 flex-1 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
              onClick={() => {
                if (!checked) {
                  setRed(true);
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
            checked={checked}
            type="checkbox"
            onChange={onCheckboxChange}
            className={`mt-[0.1875rem] h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 ${
              showRed
                ? "border-2 border-red-400 dark:border-2 dark:border-red-400"
                : ""
            }`}
          />
          <p className="text-sm text-gray-500">
            I have carefully read and agreed to{" "}
            <Link
              className="text-blue-500"
              href={`/${params.lng}/legal/privacy`}
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              className="text-blue-500"
              href={`/${params.lng}/legal/terms-of-use`}
            >
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
