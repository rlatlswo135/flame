'use client';

import { Popover } from '@flame/ui';

export default function Home() {
  return (
    <Popover>
      <Popover.Trigger>
        <button type="button">Open Popover</button>
      </Popover.Trigger>
      <Popover.Content className="bg-white rounded-md p-4 shadow-md">
        <div>Popover Content</div>
      </Popover.Content>
    </Popover>
  );
}
