import './index.less'
import {Button, Card, Flex, message, Modal, Pagination, Space, Table, type TableProps, Tag} from "antd";
import {AdDynamicForm, type adDynamicFormRef, renderInput, renderSelect} from "@/antd";
import {useDyForm, useReactiveForm} from "@/index";
import {useEffect, useMemo, useRef, useState} from "react";

interface RowData {
    key: number
    name: string
    age: number
    address: string
    tags: string[]
}

type PageModal = {
    pageSize: number
    pageNo: number
}
const data: RowData[] = [
    {
        key: 0,
        name: 'John Brown',
        age: 1,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer']
    },
    {
        key: 1,
        name: 'Jim Green',
        age: 2,
        address: 'London No. 1 Lake Park',
        tags: ['wow']
    },
    {
        key: 2,
        name: 'Joe Black',
        age: 3,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher']
    },
]
const tagsSelection = ['yarn', 'yell', 'cool', 'teacher', 'wow', 'nice', 'developer'].map(it => ({
    label: it,
    value: it
}))
const Zeal = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [searchFormItems] = useReactiveForm<RowData, any>([
        {
            key: "name",
            label: "Name",
            value: null,
            allowClear: true,
            render2: f => renderInput({}, f),
            span: 12
        },
        {
            key: "age",
            label: "Age",
            value: null,
            allowClear: true,
            render2: f => renderInput({}, f),
            span: 12
        },
    ])
    const [handleFormItems, setHandleFormItems] = useReactiveForm<RowData>([
        {
            key: "name",
            label: "Name",
            value: null,
            required: true,
            render2: f => renderInput({}, f),
        },
        {
            key: "age",
            label: "Age",
            value: null,
            allowClear: true,
            render2: f => renderInput({}, f),
        },
        {
            key: "address",
            label: "Address",
            value: null,
            allowClear: true,
            type: 'textarea',
            rows: 2,
            render2: f => renderInput({}, f),
        },
        {
            key: "tags",
            label: "Tags",
            value: [],
            allowClear: true,
            mode: 'multiple',
            render2: f => renderSelect(tagsSelection, {}, f),
        },
    ])
    const useHandleForm = useDyForm([handleFormItems, setHandleFormItems])
    const searchFormItemRef = useRef<adDynamicFormRef<RowData>>(null)
    const handleRef = useRef<adDynamicFormRef<RowData>>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableData, setTableData] = useState<RowData[]>([])
    const [pageModal, setPageModal] = useState<PageModal>({
        pageNo: 1, pageSize: 10
    })
    const [renderId, setRenderId] = useState(-1)
    const pagedData = useMemo(() => {
        const {pageNo, pageSize} = pageModal
        const start = (pageNo - 1) * pageSize
        return tableData.slice(start, start + pageSize)
    }, [pageModal, tableData])
    const columns: TableProps<RowData>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
                <Flex gap="small" align="center" wrap>
                    {tags.map((tag) =>
                        <Tag color={tag.length > 5 ? 'geekblue' : 'green'} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    )}
                </Flex>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button size='small' color='orange' variant={'dashed'} onClick={() => {
                        setRenderId(record.key)
                        useHandleForm.setValues(record)
                        setIsModalOpen(true)
                    }}>Update</Button>
                    <Button size='small' color='red' variant={'dashed'} onClick={() => {
                        setTableData(p=>p.filter(it=>it.key!==record.key))
                        messageApi.success('删除成功')
                    }}>Delete</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        setTableData(data);
    }, [])
    return (
        <div className='zeal'>
            {contextHolder}
            <Card title={
                <>
                    <div className='title'>
                        Antd Form Table Test
                    </div>
                    <AdDynamicForm<RowData> ref={searchFormItemRef} items={searchFormItems}
                                            preset='grid'/>
                    <div className='search'>
                        <div className="searchBtn">
                            <Button variant={'dashed'} size='small' onClick={() => {
                                searchFormItemRef.current?.reset?.()
                                setTableData(data)
                                pageModal.pageNo = 1
                            }}>Reset</Button>
                            <Button color={'blue'} variant={'dashed'} size='small' onClick={() => {
                                const params = searchFormItemRef.current?.getResult?.()
                                messageApi.info(JSON.stringify(params, null, 2));
                                setTableData(tableData.filter(it => (!params?.name || it.name.includes(params.name)) && (params?.age == null || it.age === Number(params.age))))
                                pageModal.pageNo = 1
                            }}>Search</Button>
                        </div>
                    </div>
                    <div className="controlBtn">
                        <Button color={'green'} variant={'dashed'} size='small' onClick={() => {
                            setRenderId(-1)
                            useHandleForm.onReset()
                            setIsModalOpen(true)
                        }}>Add</Button>
                    </div>
                </>
            } actions={[
                <div className='footer'>
                    <Pagination total={tableData.length} showSizeChanger pageSize={pageModal.pageSize}
                                current={pageModal.pageNo}
                                showTotal={(total) => `Total ${total}`}
                                onChange={(page, size) => {
                                    setPageModal(prev => ({
                                        pageNo: size !== prev.pageSize ? 1 : page,
                                        pageSize: size,
                                    }))
                                }}
                    />
                </div>
            ]}>
                <Table
                    dataSource={pagedData}
                    columns={columns}
                    pagination={false}
                    style={{

                    }}
                />
            </Card>
            <div className="update">
                <Modal
                    title={(renderId === -1 ? 'Add' : 'Update') + ' item'}
                    open={isModalOpen}
                    onOk={() => {
                        handleRef.current?.validator().then(values => {
                            let msg = ''
                            if (renderId === -1) {
                                setTableData(p => [...p, {...values, key: Date.now()}])
                                msg = '添加成功'
                            } else {
                                setTableData(p => p.map(it => (it.key === renderId ? {...it, ...values} : it)))
                                msg = '修改成功'
                            }
                            messageApi.success(msg)
                            setIsModalOpen(false)
                        }).catch(console.error)
                        /*let msg=''
                        const values=useHandleForm.getValues() as RowData
                        if (renderId===-1) {
                            const d=[...tableData]
                            d.push({...values,key:Date.now(),})
                            setTableData(d)
                            msg='添加成功'
                        }else {
                            setTableData(tableData.map(it=>{
                                if (it.key===renderId) return {...values,key:renderId}
                                return it
                            }))
                            msg='修改成功'
                        }
                        messageApi.success(msg)
                        setIsModalOpen(false)*/
                    }}
                    onCancel={() => {
                        setIsModalOpen(false)
                    }}
                >
                    <AdDynamicForm<RowData> items={handleFormItems} ref={handleRef}/>
                </Modal>
            </div>
        </div>
    )
}
export default Zeal;