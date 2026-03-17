import React, { useRef } from "react";
import {Button, Input, Table} from "antd";
import { type adPopupModalRef,AdPopupModal} from "@/antd";
import AntZealCard from "@/antd/AdZealCard.tsx";
function PopupModal() {
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
export default function ToolTest() {
    return <AntZealCard
        title="用户列表"
        searchForm={() => <Input placeholder="请输入关键词" style={{ width: 220 }} />}
        footer={({ isMobile }) => <div>当前是否移动端：{String(isMobile)}</div>}
        controlBtn={() => <a>导出</a>}
        toolBtn={() => <a>更多</a>}
    >
        {({ tableHeight }) => (
            <Table
                scroll={{ y: tableHeight }}
                dataSource={[]}
                columns={[]}
                pagination={false}
            />
        )}
    </AntZealCard>
}