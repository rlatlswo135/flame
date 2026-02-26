'use client';

import { Dialog, Funnel } from '@flame/ui';

export default function Home() {
  return (
    <div className="w-full h-full">
      <Dialog closeOutside>
        <Dialog.Trigger>
          <span>open dialog</span>
        </Dialog.Trigger>
        <Dialog.Content
          style={{
            width: '300px',
            height: '300px',
          }}
        >
          <Funnel>
            <Funnel.Step>
              <h1>step1</h1>
              <Funnel.Next>
                <span>next</span>
              </Funnel.Next>
            </Funnel.Step>

            <Funnel.Step>
              <h1>step2</h1>
              <Funnel.Next>
                <span>next</span>
              </Funnel.Next>
            </Funnel.Step>

            <Funnel.Step>
              <h1>step3</h1>
              <Funnel.Prev>
                <span>prev</span>
              </Funnel.Prev>
            </Funnel.Step>
          </Funnel>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
