import { Toast, toast } from '@flame/ui';
import { ComponentDemo } from '../component-demo';

const toastStyle =
  'px-4 py-3 rounded-lg border border-flame-border bg-flame-bg-secondary shadow-lg pointer-events-auto min-w-[260px]';

function ToastDemo({ t }: { t: Record<string, string> }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
        onClick={() =>
          toast(
            <Toast className={toastStyle}>
              <Toast.Title className="font-semibold text-sm">{t.successTitle}</Toast.Title>
              <Toast.Description className="text-sm text-flame-text-secondary mt-1">
                {t.successDescription}
              </Toast.Description>
            </Toast>,
          )
        }
      >
        {t.showSuccess}
      </button>
      <button
        type="button"
        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-flame-bg-tertiary text-flame-text-secondary hover:text-flame-text transition-colors"
        onClick={() =>
          toast(
            <Toast className={toastStyle}>
              <Toast.Title className="font-semibold text-sm">{t.infoTitle}</Toast.Title>
              <Toast.Description className="text-sm text-flame-text-secondary mt-1">
                {t.infoDescription}
              </Toast.Description>
            </Toast>,
            { timeout: 5000 },
          )
        }
      >
        {t.showInfo}
      </button>
    </div>
  );
}

function ToastSection({
  t,
  code,
  codeHtml,
}: {
  t: Record<string, string>;
  code: string;
  codeHtml: string;
}) {
  return (
    <ComponentDemo code={code} codeHtml={codeHtml}>
      <ToastDemo t={t} />
    </ComponentDemo>
  );
}

export { ToastSection };
