import { useTranslation } from "@/app/i18n/client";

export default function Integrations({ transitionStyles }) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <p className="text-text items-center select-none text-base/6">{t('integrations.noIntegration')}</p>
    </div>
  );
}