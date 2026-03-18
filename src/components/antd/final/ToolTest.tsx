import React, {useRef} from "react";
import {Button, Input, Radio, Table} from "antd";
import {
    type adPopupModalRef,
    AdPopupModal,
    AdZealTableSearch,
    renderInput,
    AdZealTablePaginationControl,
    AdZealCard
} from "@/antd";
import {useReactiveForm} from "@/index";
import type {Rule} from "antd/es/form";
import {usePagination} from "@/hooks/zealForm";

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

type RowProps = {
    username: string
    password: string
    desc: string
    preset: string
}
export default function ToolTest() {
    const paginationModal = usePagination((pn, ps) => {

        console.log("page change", pn, ps);
    });

    React.useEffect(() => {
        paginationModal.setTotal(300);
    }, []);

    const [formItems, setFormItems] = useReactiveForm<RowProps, Rule | Rule[]>([
        {
            key: "username",
            label: "用户名",
            value: "",
            // rule: [{required: true, message: 'Please input your username!', validateTrigger: 'onBlur'}],
            render2: f => renderInput({}, f),
            span: 12
        },
        {
            key: "password",
            label: "密码",
            value: "",
            render2: (f) => renderInput({}, {...f, type: 'password'}),
            span: 12
        },
    ])
    return <AdZealCard
        title="用户列表"
        searchForm={() => <Input placeholder="请输入关键词" style={{width: 220}}/>}
        footer={({isMobile}) => <AdZealTablePaginationControl
            prefix={({total}) => <span>Total {total}</span>}
            isMobile={isMobile}
            paginationModal={paginationModal}
            onChange={(pn, ps) => {
                console.log(pn, ps)
            }}
        />}
        controlBtn={() => <a>导出</a>}
        toolBtn={() => <a>更多</a>}
        header={({isMobile}) =>
            <AdZealTableSearch<RowProps, Rule | Rule[]>
                title={'zealSearchTest'}
                isMobile={isMobile}
                searchItemsState={[formItems, setFormItems]}
                onSearch={(v) => {
                    console.log(v)
                }}
            />
        }
    >
        {({tableHeight}) => (
            <Table
                scroll={{y: tableHeight}}
                dataSource={[]}
                columns={[]}
                pagination={false}
            />
        )}
    </AdZealCard>
}