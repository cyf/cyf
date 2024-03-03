"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/i18n/client";
import { LngProps } from "@/i18next-lng";
import Link from "next/link";

export default function AgreementDialog({
  showAgreementDialog,
  setShowAgreementDialog,
  setApproved,
  lng,
}: {
  showAgreementDialog: boolean;
  setShowAgreementDialog: Dispatch<SetStateAction<boolean>>;
  setApproved: Dispatch<SetStateAction<boolean>>;
} & LngProps) {
  const { t } = useTranslation(lng, "common");
  const { t: tf } = useTranslation(lng, "footer");
  const { t: tl } = useTranslation(lng, "login");

  return (
    <AlertDialog
      open={showAgreementDialog}
      onOpenChange={setShowAgreementDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tl("confirm-agree")}</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-left text-sm text-gray-500">
              {tl("agree-content")}
              <Link className="text-blue-500" href={`/${lng}/legal/privacy`}>
                {tf("privacy")}
              </Link>
              {tl("and")}
              <Link
                className="text-blue-500"
                href={`/${lng}/legal/terms-of-use`}
              >
                {tf("terms-of-use")}
              </Link>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setApproved(true);
            }}
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useAgreementDialog() {
  const [showAgreementDialog, setShowAgreementDialog] = useState(false);
  const [approved, setApproved] = useState(false);

  const AgreementDialogCallback = useCallback(
    ({ lng }: LngProps) => {
      return (
        <AgreementDialog
          showAgreementDialog={showAgreementDialog}
          setShowAgreementDialog={setShowAgreementDialog}
          setApproved={setApproved}
          lng={lng}
        />
      );
    },
    [showAgreementDialog, setShowAgreementDialog],
  );

  return useMemo(
    () => ({
      setShowAgreementDialog,
      AgreementDialog: AgreementDialogCallback,
      approved,
      setApproved,
    }),
    [setShowAgreementDialog, AgreementDialogCallback, approved, setApproved],
  );
}
