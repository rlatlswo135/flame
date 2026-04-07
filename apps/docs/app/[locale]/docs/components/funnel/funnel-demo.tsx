'use client';

import { Funnel } from '@flame/ui';
import { useTranslations } from 'next-intl';

const STEP_KEYS = ['enterInfo', 'confirm', 'complete'] as const;

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-2 mb-4">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={`step-${i + 1}`}
        className={`h-2 flex-1 rounded-full transition-colors ${
          i <= current ? 'bg-flame-accent' : 'bg-flame-border'
        }`}
      />
    ))}
    <span className="text-xs text-flame-text-secondary ml-2">
      {current + 1}/{total}
    </span>
  </div>
);

const FunnelDemo = () => {
  const t = useTranslations('components.funnel.demo');

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-flame-border bg-flame-bg p-6">
        <Funnel>
          {STEP_KEYS.map((key, i) => (
            <Funnel.Step key={key}>
              {({ jump }) => (
                <div>
                  <StepIndicator current={i} total={STEP_KEYS.length} />
                  <h3 className="text-lg font-semibold text-flame-text mb-1">{t(key)}</h3>
                  <p className="text-sm text-flame-text-secondary mb-6">{t(`${key}Description`)}</p>
                  <div className="flex gap-3">
                    {i > 0 && (
                      <Funnel.Prev>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-flame-bg-tertiary text-flame-text-secondary hover:text-flame-text transition-colors"
                        >
                          {t('back')}
                        </button>
                      </Funnel.Prev>
                    )}
                    {i < STEP_KEYS.length - 1 ? (
                      <Funnel.Next>
                        <button
                          type="button"
                          className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
                        >
                          {t('next')}
                        </button>
                      </Funnel.Next>
                    ) : (
                      <button
                        type="button"
                        onClick={() => jump(0)}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-flame-accent hover:bg-flame-accent-hover transition-colors"
                      >
                        {t('startOver')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Funnel.Step>
          ))}
        </Funnel>
      </div>
    </div>
  );
};

export { FunnelDemo };
