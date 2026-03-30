import React, {useEffect, useRef, useState} from "react";
import {usePagination} from "@/hooks/zealForm.ts";
import {useReactiveForm} from "@/hooks/useDyForm.ts";
import type {Rule} from "antd/es/form";
import {
    AdDynamicForm, type adDynamicFormRef,
    AdPopupModal, type adPopupModalRef,
    AdZealCard,
    AdZealTablePaginationControl,
    AdZealTableSearch, type adZealTableSearchRef,
    renderInput,
    renderInputNumber,
    useDecorateForm
} from "@/antd";
import {Button, message, Modal, Space, Table, type TableProps} from "antd";
import {useDyForm} from "@/index";
import './zealTable.css'

interface SongType {
    id: string
    no: number
    title: string
    length: string
}

const ZealTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [modal, contextModalHolder] = Modal.useModal();
    const {pagination, pageModalRef, setTotal, setPageNo} = usePagination(fetchData);
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
            value: null,
            required: true,
            render2: (f) => renderInputNumber({}, f)
        },
        {
            key: "title",
            label: "Title",
            value: null,
            allowClear: true,
            required: true,
            requiredHint: (l) => `${l} is not empty`,
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
    ].map(it => ({...it, id: React.useId()})))
    const [referId, setReferId] = useState<string | number>(-1);
    const [selRowKeys, setSelRowKeys] = useState<React.Key[]>([]);
    const [tableData, setTableData] = useState<SongType[]>([])
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const useForm = useDyForm([formItems, setFormItems])
    const adZealTableSearchRef = useRef<adZealTableSearchRef<SongType>>(null)
    const addFormRef = useRef<adDynamicFormRef<SongType>>(null)
    const upModalRef = useRef<adPopupModalRef>(null)
    const columns: TableProps<SongType>['columns'] = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 80
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
            fixed: 'right',
            width: 160,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size='small' color='orange' variant={'dashed'}
                            onClick={() => upItem(record)}>Update</Button>
                    <Button size='small' color='red' variant={'dashed'} onClick={() => delItem(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    // function
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
                const data = zealData.filter(it => (!length || it.length.includes(length)) && (!title || it.title.includes(title)) && (!no || it.no === no))
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

    const addItem = () => {
        setReferId(-1)
        upModalRef.current?.toggle()
        useForm.onReset()
    }

    function upItem(r: SongType) {
        setReferId(r.id)
        upModalRef.current?.toggle()
        useForm.setValues(r)
    }

    function delItem(r: SongType) {
        setTableData(p => p.filter(it => r.id !== it.id))
        messageApi.success('Delete Successful')
    }

    const delSelect = async () => {
        const confirmed = await modal.confirm({
            title: `Delete?`,
            content: (<>
                <p>Confirm {selRowKeys.toString()} items</p>
            </>)
        })
        if (confirmed) {
            setTableData(p => p.filter(it => !selRowKeys.includes(it.id)))
            message.success(`delete ${selRowKeys} successful`)
            setSelRowKeys([])
        }
    }
    const popSubmit = () => new Promise<boolean>(resolve => {
        addFormRef.current?.validator().then(v => {
            let msg = ''
            if (referId === -1) {
                msg = 'add successful'
                setTableData(p => [...p, {...v, id: Date.now().toString()}])
            } else {
                msg = 'update successful'
                setTableData(p => p.map(it => {
                    if (it.id === referId) return {...it, ...v}
                    return it
                }))
            }
            message.success(msg)
            resolve(true)
            // fetchData()
        }).catch(e => {
            message.error(e?.message || '验证不通过')
            resolve(false)
        })
    })
    useEffect(() => {
        fetchData()
    }, []);
    return (
        <>
            {contextHolder}
            {contextModalHolder}
            <AdZealCard
                outPadding={20}
                footer={({isMobile}) => <AdZealTablePaginationControl
                    prefix={({total}) => <span>Total {total}</span>}
                    isMobile={isMobile}
                    pagination={pagination}
                    onChange={(pn, ps) => {
                        console.log(pn, ps)
                    }}
                />}
                controlBtn={() => <>
                    <Button color={'green'} variant={'dashed'} size='small' onClick={addItem}>Add</Button>
                    <Button color={'red'} variant={'dashed'} size='small' disabled={!selRowKeys.length}
                            onClick={delSelect}>Del</Button>
                </>}
                toolBtn={() => <Button variant={'dashed'} size='small'>Tools...</Button>}
                header={({isMobile}) =>
                    <AdZealTableSearch<SongType>
                        title="zeal test"
                        ref={adZealTableSearchRef}
                        isMobile={isMobile}
                        searchItemsState={searchFormItems}
                        onSearch={(v) => {
                            setPageNo(1)
                            fetchData()
                        }}
                        onReset={() => {
                            setPageNo(1)
                            fetchData()
                        }}
                    />
                }
                rest={() => <AdPopupModal draggable title={referId === -1 ? 'Add item' : 'Update item'} ref={upModalRef}
                                          onSubmit={popSubmit}>
                    <AdDynamicForm items={formItems} ref={addFormRef}/>
                </AdPopupModal>}
            >
                {({tableHeight, footerH}) => (
                    <>
                        <Table
                            loading={tableLoading}
                            scroll={{y: tableHeight - footerH, x: 800}}
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                            rowKey={(d) => d.id}
                            rowSelection={{
                                onChange: (selectedRowKeys: React.Key[], selectedRows: SongType[]) => {
                                    setSelRowKeys(selectedRowKeys)
                                }
                            }}
                        />
                    </>
                )}
            </AdZealCard>
        </>)
}
export default ZealTable;