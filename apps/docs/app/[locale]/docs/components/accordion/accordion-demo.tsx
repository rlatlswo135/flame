'use client';

import { Accordion } from '@flame/ui';
import { useTranslations } from 'next-intl';

const ITEM_KEYS = ['whatIsFlame', 'gettingStarted', 'components'] as const;

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="text-flame-text-secondary"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AccordionDemo = () => {
  const t = useTranslations('components.accordion.demo');

  return (
    <div className="w-full max-w-md">
      <Accordion single>
        {ITEM_KEYS.map((key, i) => (
          <Accordion.Item key={key}>
            <Accordion.Trigger>
              {({ toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-flame-text bg-flame-bg hover:bg-flame-bg-secondary transition-colors border border-flame-border ${
                    i === 0 ? 'rounded-t-lg' : ''
                  } ${i === ITEM_KEYS.length - 1 ? 'rounded-b-lg' : 'border-b-0'}`}
                >
                  {t(key)}
                  <ChevronIcon />
                </button>
              )}
            </Accordion.Trigger>
            <Accordion.Content
              className={`px-4 py-3 text-sm text-flame-text-secondary bg-flame-bg-secondary border-x border-flame-border ${
                i === ITEM_KEYS.length - 1 ? 'border-b rounded-b-lg' : 'border-b-0'
              }`}
            >
              {t(`${key}Content`)}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export { AccordionDemo };
