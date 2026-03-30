# dynamicformdjx-react

基于 **React** 的动态表单及录入。

[Document](https://xczcdjx.github.io/dynamicFormDoc/react/install.html)

[Vue3 版本](https://www.npmjs.com/package/dynamicformdjx)

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2)

## 概述

> 新增综合CRUD模版

`DynamicForm` 一个灵活且动态的表单组件，使用数组，简化模版操作，提供多种hook快速操作表单等。

- 简化节点代码，快速处理表单
- 提供render2函数渲染表单项，使用函数渲染值或自定义Component函数
- 提供多种hooks函数，快速处理数据值

`DynamicInput` 组件是一个灵活且动态的表单输入组件，允许用户添加、修改和删除键值对。它提供了多种自定义选项，如按钮文本、表单布局和输入过滤

- 支持通过 `v-model` 双向绑定任意对象，(包含受控和非受控) 可动态增删字段
- 支持将值解析为：字符串 / 数字 / 数组（字符串数组、数字数组）
- 文案、样式、数组分隔符等均可配置

## 安装

```bash
# 任意一种
npm install dynamicformdjx-react
# or
yarn add dynamicformdjx-react
# or
pnpm add dynamicformdjx-react


```

### 综合CRUD template 新

> 需配合antd v5+ 版本以上

###### zealTable.css

```css
body {
    padding: 15px;
}

.zealCard .ant-card .ant-card-body .ant-table .ant-table-body {
    overflow: auto !important;
}
```

###### zealTable.tsx

```tsx
import React, {useEffect, useRef, useState} from "react";
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
} from "dynamicformdjx-react/antd";
import {Button, message, Modal, Space, Table, type TableProps} from "antd";
import {useDyForm, usePagination, useReactiveForm} from "dynamicformdjx-react";
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
                outPadding={15}
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
```

### 动态表单

#### 与Antd配合

##### 简单表单

> 还有自定义表单，装饰表单请参考文档

```tsx
import {useRef, useState} from "react";
import {Button, Input, Radio} from "antd";
import {AdDynamicForm, type adDynamicFormRef, renderInput} from "dynamicformdjx-react/antd";
import {omitFormCommonKey, OmitValue, useDyForm, useReactiveForm} from "dynamicformdjx-react";
import type {PresetType} from "dynamicformdjx-react/types";
import type {Rule} from "antd/es/form";

type RowProps = {
    username: string
    password: string
    desc: string
    preset: string
}
const SimpleForm = () => {
    const [presetType, setPresetType] = useState<PresetType>('fullRow')
    const [formItems, setFormItems] = useReactiveForm<RowProps, Rule | Rule[]>([
        {
            key: "username",
            label: "用户名",
            value: "",
            allowClear: true,
            rule: [{required: true, message: 'Please input your username!', validateTrigger: 'onBlur'}],
            render2: f => renderInput({}, f),
            span: 12
        },
        {
            key: "password",
            label: "密码",
            required: true,
            value: "",
            render2: (f) => <Input.Password placeholder="请输入密码" {...OmitValue(f, omitFormCommonKey)}/>,
            span: 8,
            offset: 2,
            sort: 0
        },
        {
            key: "preset",
            label: "表格预设",
            value: "fullRow",
            render2: (f) => <Radio.Group
                value={f.value}
                options={[
                    {value: 'fullRow', label: 'row'},
                    {value: 'grid', label: 'grid'},
                ]}
                onChange={(v) => {
                    setPresetType(v.target.value)
                }}
            />,
        }
    ])
    const useForm = useDyForm([formItems, setFormItems])
    const antdFormRef = useRef<adDynamicFormRef>(null)
    const rules: Partial<Record<keyof RowProps, Rule | Rule[]>> = {
        desc: [{required: true, message: '请输入详情'}]
    }
    return (
        <div className='dynamicFormTest'>
            <AdDynamicForm ref={antdFormRef} rules={rules} validateTrigger={null} items={formItems}
                           preset={presetType}/>
            <div className="footer" style={{
                display: 'flex',
                gap: '5px'
            }}>
                <Button color={'green'} variant={'outlined'} onClick={() => {
                    // const res=antdFormRef.current?.getResult?.()
                    const res = useForm.getValues()
                    console.log(res)
                }}>getData</Button>
                <Button color={'orange'} variant={'outlined'} onClick={() => {
                    useForm.setValues({
                        username: 'antd',
                        password: 'I love you'
                    })
                }}>setData</Button>
                <Button color={'blue'} variant={'outlined'} onClick={() => {
                    antdFormRef.current?.validator().then(v => {
                        console.log(v)
                    }).catch(r => {
                        console.log(r)
                    })
                }}>validator</Button>
                <Button color={'red'} variant={'outlined'} onClick={() => {
                    useForm.onReset()
                }}>reset</Button>
                <Button variant={'outlined'} onClick={() => {
                    useForm.setDisabled(true)
                }}>setDisabled</Button>
            </div>
        </div>
    );
};

export default SimpleForm;

```

### 动态录入

> 此录入无需组件库依赖

### 1.单组件

```tsx
import {useState} from "react";
import {DynamicInput, dynamicFormRef} from "dynamicformdjx-react";

function App() {
    const [obj, setObj] = useState<Record<string, any>>({
        a: 'Hello world',
        b: 1314,
        c: [5, 2, 0]
    });
    const dynamicInputRef = useRef<dynamicFormRef>(null)
    return (<div>
        <DynamicInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
        <pre>
            {JSON.stringify(obj, null, 2)}
        </pre>
        <div>
            <button onClick={() => {
                dynamicInputRef.current?.onSet?.({
                    test: 'hello World'
                })
            }}>setData
            </button>
        </div>
    </div>)
}

export default App
```

### 2.级联基本使用

```tsx
import {useState} from "react";
import {DynamicCascadeInput, dynamicCascadeInputRef} from "dynamicformdjx-react";

const App = () => {
    const [obj, setObj] = useState<Record<string, any>>({
        a: {
            b: {
                c: {
                    d: {
                        e: "hello world"
                    }
                }
            }
        },
        aa: [5, 2, 0],
        aaa: 1314
    });
    const dynamicInputRef = useRef<dynamicCascadeInputRef>(null)
    return (<div>
        <DynamicCascadeInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
        <pre>
            {JSON.stringify(obj, null, 2)}
        </pre>
        <div>
            <button onClick={() => {
                dynamicInputRef.current?.onSet?.({
                    test: 'hello world'
                })
            }}>setData
            </button>
        </div>
    </div>)
}
export default App;
```