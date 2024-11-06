"use client";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";

export default function AccessNotAllowed({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(lng, "common");

  return (
    <div className="flex h-auto w-full max-w-screen-xl flex-1 px-5 xl:px-0">
      <section className="mx-auto self-center">
        <div className="container mx-auto flex min-h-screen items-center">
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <p className="rounded-full bg-blue-50 p-3 text-sm font-medium text-blue-500 dark:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
              {t("access-not-allowed")}
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {t("access-not-allowed-description")}
            </p>

            <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
              <Link
                href={`/${lng}`}
                className="w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
              >
                {t("return-to-home")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
