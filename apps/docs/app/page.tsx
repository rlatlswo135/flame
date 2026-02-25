"use client";
import { Dialog } from "@flame/ui";

export default function Home() {
  return (
    <div className="w-full h-full">
      모달 테스트
      <Dialog>
        <Dialog.Trigger>
          <div>custom trigger</div>
        </Dialog.Trigger>
        <Dialog.Content>
          <div>안녕하세요 저는 content입니다</div>
          <Dialog.Closer>
            <span>close2</span>
          </Dialog.Closer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
