import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { FunnelDemo } from './funnel-demo';

const demoCode = `import { Funnel } from '@flame/ui';

function FunnelExample() {
  return (
    <Funnel>
      <Funnel.Step>
        {({ jump }) => (
          <div>
            <h3>Step 1: Enter Info</h3>
            <p>Fill in your information.</p>
            <Funnel.Next><button>Next</button></Funnel.Next>
          </div>
        )}
      </Funnel.Step>
      <Funnel.Step>
        {({ jump }) => (
          <div>
            <h3>Step 2: Confirm</h3>
            <p>Review your information.</p>
            <Funnel.Prev><button>Back</button></Funnel.Prev>
            <Funnel.Next><button>Next</button></Funnel.Next>
          </div>
        )}
      </Funnel.Step>
      <Funnel.Step>
        {({ jump }) => (
          <div>
            <h3>Step 3: Complete</h3>
            <p>All done!</p>
            <button onClick={() => jump(0)}>Start Over</button>
          </div>
        )}
      </Funnel.Step>
    </Funnel>
  );
}`;

export default async function FunnelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.funnel' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const funnelProps: PropDef[] = [
    { name: 'children', type: 'ReactNode', description: t('props.children') },
  ];

  const stepProps: PropDef[] = [
    {
      name: 'children',
      type: '((props: { jump }) => ReactNode)',
      description: t('props.stepChildren'),
    },
  ];

  const nextProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { next }) => ReactNode)',
      description: t('props.nextChildren'),
    },
  ];

  const prevProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { prev }) => ReactNode)',
      description: t('props.prevChildren'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <FunnelDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Funnel" props={funnelProps} />
        <PropsTable title="Funnel.Step" props={stepProps} />
        <PropsTable title="Funnel.Next" props={nextProps} />
        <PropsTable title="Funnel.Prev" props={prevProps} />
      </section>
    </div>
  );
}
