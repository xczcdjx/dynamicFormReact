import React, {useEffect, useRef, useState} from "react";
import {usePagination} from "@/hooks/zealForm.ts";
import {useReactiveForm} from "@/hooks/useDyForm.ts";
import type {Rule} from "antd/es/form";
import {
    AdZealCard,
    AdZealTablePaginationControl,
    AdZealTableSearch, type adZealTableSearchRef,
    renderInput,
    renderInputNumber,
    useDecorateForm
} from "@/antd";
import {Button, Input, message, Space, Table, type TableProps} from "antd";
import {useDyForm} from "@/index";

interface SongType {
    no: number | string
    title: string
    length: string
}

const ZealTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const {pagination, pageModalRef, setTotal} = usePagination(fetchData);
    const searchFormItems = useDecorateForm<SongType>([
        {
            key: "no",
            label: "No",
            renderType: 'renderInputNumber',
            value: null,
            span: 8
        },
        {
            key: "title",
            label: "Title",
            allowClear: true,
            renderType: 'renderInput',
            value: null,
            span: 8
        },
        {
            key: "length",
            label: "Length",
            allowClear: true,
            renderType: 'renderInput',
            value: null,
            span: 8
        },
    ])
    const [formItems, setFormItems] = useReactiveForm<SongType, Rule | Rule[]>([
        {
            key: "no",
            label: "No",
            allowClear: true,
            value: null,
            render2: (f) => renderInputNumber({}, f)
        },
        {
            key: "title",
            label: "Title",
            value: null,
            allowClear: true,
            render2: (f) => renderInput({}, f),
        },
        {
            key: "length",
            label: "Length",
            value: null,
            allowClear: true,
            render2: (f) => renderInput({}, f),
        },
    ])
    const [zealData] = useState<SongType[]>([
        {no: 3, title: 'Wonderwall', length: '4:18'},
        {no: 4, title: 'Don\'t Look Back in Anger', length: '4:48'},
        {no: 12, title: 'Champagne Supernova', length: '7:27'},
        ...Array.from({length: 50}).map((_, i) => ({no: i + 13, title: `test Data ${i + 1}`, length: `${i * i}`}))
    ])
    const [tableData, setTableData] = useState<SongType[]>([])
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const useForm = useDyForm([formItems, setFormItems])
    const adZealTableSearchRef = useRef<adZealTableSearchRef<SongType>>(null)
    const columns: TableProps<SongType>['columns'] = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'np',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Length',
            dataIndex: 'length',
            key: 'length',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button size='small' color='orange' variant={'dashed'} onClick={() => {

                    }}>Update</Button>
                    <Button size='small' color='red' variant={'dashed'} onClick={() => {

                        messageApi.success('删除成功')
                    }}>Delete</Button>
                </Space>
            ),
        },
    ];

    async function fetchData(pn?: number, ps?: number) {
        setTableLoading(true)
        // console.log(pn,ps) // new value
        // const {pageNo, pageSize} = pagination // old value
        const {pageNo, pageSize} = pageModalRef.current // correspond new value
        const params = adZealTableSearchRef.current?.getParams()!
        const r = await new Promise<{ data: SongType[], total: number }>((resolve, reject) => {
            setTimeout(() => {
                const start = (pageNo - 1) * pageSize
                const {length, no, title} = params!
                const data = zealData.filter(it => (!length || it.length.includes(length)) && (!title || it.title.includes(title)) && (!no || it.no === parseInt(no as string)))
                resolve({
                    data: data.slice(start, start + pageSize),
                    total: data.length
                })
            }, 1500)
        })
        setTableData(r.data)
        setTotal(r.total)
        setTableLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <>
            {contextHolder}
            <AdZealCard
                title="zeal test"
                footer={({isMobile}) => <AdZealTablePaginationControl
                    prefix={({total}) => <span>Total {total}</span>}
                    isMobile={isMobile}
                    pagination={pagination}
                    onChange={(pn, ps) => {
                        console.log(pn, ps)
                    }}
                />}
                controlBtn={() => <a>{pagination.pageNo}</a>}
                toolBtn={() => <a>更多</a>}
                header={({isMobile}) =>
                    <AdZealTableSearch<SongType>
                        ref={adZealTableSearchRef}
                        isMobile={isMobile}
                        searchItemsState={searchFormItems}
                        onSearch={(v) => {
                            console.log(v)
                        }}
                    />
                }
            >
                {({tableHeight}) => (
                    <>
                        <Table
                            loading={tableLoading}
                            scroll={{y: tableHeight}}
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                            rowKey={(d) => d.no}
                        />
                    </>
                )}
            </AdZealCard>
        </>)
}
export default ZealTable;