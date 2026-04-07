'use client';

import { Select } from '@flame/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const FRUIT_KEYS = ['apple', 'banana', 'cherry', 'grape'] as const;

const SelectDemo = () => {
  const [value, setValue] = useState('');
  const t = useTranslations('components.select.demo');

  const selectedLabel = value ? t(value as (typeof FRUIT_KEYS)[number]) : undefined;

  return (
    <Select value={value} onChange={setValue} transition>
      <Select.Trigger>
        <button
          type="button"
          className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-flame-border bg-flame-bg text-flame-text hover:bg-flame-bg-secondary transition-colors min-w-[180px]"
        >
          <span className={selectedLabel ? '' : 'text-flame-text-secondary'}>
            {selectedLabel || t('placeholder')}
          </span>
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
        </button>
      </Select.Trigger>
      <Select.Options className="rounded-lg border border-flame-border shadow-lg bg-flame-bg py-1 min-w-[180px]">
        {FRUIT_KEYS.map((key) => (
          <Select.Option
            key={key}
            value={key}
            className={`px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-flame-bg-secondary ${
              value === key ? 'text-flame-accent font-medium' : 'text-flame-text'
            }`}
          >
            {t(key)}
          </Select.Option>
        ))}
      </Select.Options>
    </Select>
  );
};

export { SelectDemo };
