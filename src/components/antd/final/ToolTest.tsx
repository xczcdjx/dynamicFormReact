import React, { useRef } from "react";
import { Button } from "antd";
import { type adPopupModalRef,AdPopupModal} from "@/antd";

export default function ToolTest() {
    const modalRef = useRef<adPopupModalRef>(null);

    return (
        <div>
            <Button onClick={() => modalRef.current?.toggle(true)}>打开弹窗</Button>

            <AdPopupModal
                ref={modalRef}
                title="测试弹窗"
                draggable
                onCancel={() => {
                    console.log("cancel");
                    return true;
                }}
                onSubmit={async () => {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return true;
                }}
            >
                <div>这里是弹窗内容</div>
            </AdPopupModal>
        </div>
    );
}