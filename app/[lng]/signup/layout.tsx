import { useTranslation } from "@/i18n";
import { languages } from "@/i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, "login");
  return {
    title: t("signup"),
    description: t("login"),
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return children;
}
