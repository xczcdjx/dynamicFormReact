import {
    forwardRef,
    useEffect,
    useMemo,
    useImperativeHandle,
    type ReactNode, useState,
} from "react";
import {Form, Row, Col} from "antd";
import type {FormInstance, FormProps, RowProps, ColProps} from "antd";
import type {Rule} from "antd/es/form";
import type {NamePath} from "antd/es/form/interface";

import type {DyFormItem} from "@/types/form";
import type {ExposeDyFType, PresetType} from "@/types";

type RulesMap = Record<string, Rule | Rule[]>;

type AdDynamicFormProps = {
    header?: () => ReactNode;
    footer?: () => ReactNode;

    items: DyFormItem[];

    preset?: PresetType; // 'fullRow' | 'grid'
    formConfig?: FormProps;
    gridConfig?: RowProps;
    validateTrigger?: string | null
    // 字段级 rules（外部覆盖内部 required 自动规则）
    rules?: RulesMap;
};

// ---------- helpers ----------
function toNamePath(p: any): NamePath {
    if (Array.isArray(p)) return p as NamePath;
    if (typeof p === "string" && p.includes(".")) return p.split(".");
    return p as NamePath;
}

function namePathKey(p: NamePath): string {
    return Array.isArray(p) ? p.join(".") : String(p);
}

function getByNamePath(obj: any, p: NamePath) {
    const pathArr = Array.isArray(p) ? p : [p];
    return pathArr.reduce((acc, k) => (acc == null ? acc : acc[k as any]), obj);
}

function setByNamePath(obj: any, p: NamePath, value: any) {
    const pathArr = Array.isArray(p) ? p : [p];
    let cur = obj;
    for (let i = 0; i < pathArr.length; i++) {
        const key = pathArr[i] as any;
        if (i === pathArr.length - 1) cur[key] = value;
        else {
            if (cur[key] == null || typeof cur[key] !== "object") cur[key] = {};
            cur = cur[key];
        }
    }
}

function buildValuesFromItems(items: DyFormItem[]) {
    const values: any = {};
    items.forEach((it: any) => {
        const np = toNamePath(it?.path ?? it?.key);
        setByNamePath(values, np, it?.value); // ✅ 一层 value
    });
    return values;
}

// ---------- component ----------
const AdDynamicForm = forwardRef<ExposeDyFType, AdDynamicFormProps>((props, ref) => {
    const [form] = Form.useForm();
    const validateTrigger = props.validateTrigger ?? 'onBlur'
    const validatorObj = props.validateTrigger === null ? undefined : validateTrigger
    const preset: PresetType = props.preset ?? "fullRow";

    const [customFeed, setCustomFeed] = useState<Record<string, {
        status?: "" | "success" | "warning" | "error" | "validating";
        help?: string;
    }>>({});

    const visibleItems = useMemo(
        () => (props.items ?? []).filter((it: any) => !it?.hidden),
        [props.items]
    );

    const sortedVisibleItems = useMemo(() => {
        return [...visibleItems].sort((a: any, b: any) => {
            const as = a?.sort ?? Infinity;
            const bs = b?.sort ?? Infinity;
            return Number(as) - Number(bs);
        });
    }, [visibleItems]);

    const mergedRulesMap = useMemo<RulesMap>(() => {
        const inner: RulesMap = {};
        visibleItems.forEach((it: any) => {
            const np = toNamePath(it?.path ?? it?.key);
            const k = namePathKey(np);

            let rule: any = it?.rule;

            if (it?.required && !it?.rule) {
                const labelStr = typeof it?.label === "string" ? it.label : "";
                rule = {
                    required: true,
                    message: it?.requiredHint?.(labelStr) ?? `${labelStr || it?.key}不能为空`,
                    validateTrigger: validatorObj
                } satisfies Rule;
            }

            if (rule) {
                inner[k] = rule;
                if (it.isCustom) {
                    const rules = Array.isArray(rule) ? rule : [rule]
                    console.log(rules[1]?.validator)
                    setCustomFeed(p => ({
                        ...p,
                        [np]: {
                            status: false,
                            help: rules.map(it => it.message).filter(Boolean).join(','),
                        }
                    }))
                }
            }
        });

        return {...inner, ...(props.rules ?? {})}; // 外部覆盖
    }, [visibleItems, props.rules]);

    // 初始化/同步：items -> form
    useEffect(() => {
        form.setFieldsValue(buildValuesFromItems(visibleItems));
    }, [form, visibleItems]);

    // form -> items（保持 items.value 实时更新）
    const onValuesChange = (_: any, allValues: any) => {
        visibleItems.forEach((it: any) => {
            const np = toNamePath(it?.path ?? it?.key);
            it.value = getByNamePath(allValues, np); // ✅ 一层 value
        });
    };

    useImperativeHandle(ref, () => ({
        reset: (v: any = null) => {
            visibleItems.forEach((it: any) => (it.value = v));
            form.setFieldsValue(buildValuesFromItems(visibleItems));
        },
        validator: async () => {
            const namePaths = visibleItems.filter(it => !it.isCustom)
                .map((it: any) => toNamePath(it?.path ?? it?.key));
            const values = await form.validateFields(namePaths);
            let customValues: any = {}
            // 2) 自定义字段手动校验（含外部 rules 覆盖）
            const customItems = visibleItems.filter(it => it.isCustom);
            const errorFields: { name: string; errors: string[] }[] = [];

            for (const it of customItems) {
                const np = toNamePath(it?.path ?? it?.key);
                const k = namePathKey(np);
                const r = mergedRulesMap[k]; // ✅ 外部 rules 覆盖后的最终规则
                const rules = Array.isArray(r) ? r : r ? [r] : [];

                setCustomFeed(p => ({...p, [k]: {status: "validating", help: ""}}));
                customValues = {...customValues, [k]: it.value}
                try {
                    await runRules(it.value, rules);
                    setCustomFeed(p => ({...p, [k]: {status: "success", help: ""}}));
                } catch (e: any) {
                    const msg = e?.message || rules.map(x => (x as any).message).filter(Boolean).join(",");
                    setCustomFeed(p => ({...p, [k]: {status: "error", help: msg}}));
                    errorFields.push({name: k, errors: [msg]});
                }
            }

            if (errorFields.length) {
                // 让外部 .catch 能拿到
                return Promise.reject({errorFields, outOfDate: false});
            }
            // 再同步一遍，确保 items 与 form 完全一致
            /*const all = form.getFieldsValue(true);
            visibleItems.forEach((it: any) => {
                const np = toNamePath(it?.path ?? it?.key);
                it.value = getByNamePath(all, np);
            });*/

            return {...values, ...customValues};
        },
        getResult: (t: "res" | "ori" = "res") => {
            return t === "ori" ? visibleItems : buildValuesFromItems(visibleItems);
        },
        form,
    }) as any);

    const renderItem = (it: any, formIns: FormInstance) => {
        if (typeof it?.render2 === "function") {
            return it.render2.length >= 2 ? it.render2(it, formIns) : it.render2(it);
        }
        return null;
    };

    const renderFormItem = (it: any) => {
        const np = toNamePath(it?.path ?? it?.key);
        const k = namePathKey(np);
        const r = mergedRulesMap[k];
        const rules = Array.isArray(r) ? r : r ? [r] : undefined;
        let validateTriggerObj = rules?.map((ru: any) => ru.validateTrigger)?.filter(Boolean) ?? []
        if (validatorObj) validateTriggerObj = validateTriggerObj.concat(validateTrigger)
        const colProps: ColProps = it?.colProps ?? {span: it?.span ?? 24, offset: it?.offset ?? 0};
        const formItemProps = it?.formItemProps ?? {};
        const {status, help} = customFeed[k] ?? {status: undefined, help: undefined}
        const node = it.isCustom ? (
            <Form.Item
                key={k}
                name={undefined}
                label={it?.label}
                required={!!it?.required||customFeed[k]}
                validateStatus={status}
                help={status === 'error' ? help : undefined}
                {...formItemProps}
            >
                {renderItem(it, form)}
            </Form.Item>
        ) : (
            <Form.Item
                key={k}
                name={np}
                label={it?.label}
                rules={rules}
                validateTrigger={validateTriggerObj}
                {...formItemProps}
            >
                {renderItem(it, form)}
            </Form.Item>);

        return preset === "grid" ? (
            <Col key={k} {...colProps}>
                {node}
            </Col>
        ) : (
            node
        );
    };

    return (
        <div className="dynamicForm">
            {props.header && <div className="header">{props.header()}</div>}

            <Form form={form} onValuesChange={onValuesChange} {...props.formConfig}>
                {preset === "grid" ? (
                    <Row gutter={props.gridConfig?.gutter ?? 10} {...props.gridConfig}>
                        {sortedVisibleItems.map(renderFormItem)}
                    </Row>
                ) : (
                    sortedVisibleItems.map(renderFormItem)
                )}
            </Form>

            {props.footer && <div className="footer">{props.footer()}</div>}
        </div>
    );
});

function isEmpty(v: any) {
    if (v === undefined || v === null || v === "") return true;
    if (Array.isArray(v) && v.length === 0) return true;
    // 空对象也认为空（适用于 json）
    if (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0) return true;
    return false;
}

/**
 * 只执行外部传入的 rules：required + validator
 * 约定：validator 失败必须 throw/reject(Error)
 */
async function runRules(value: any, rules: Rule[]) {
    for (const r of rules) {
        const rr: any = r;

        // required
        if (rr?.required && isEmpty(value)) {
            throw new Error(rr?.message || "必填");
        }

        // validator（完全按 antd 规范）
        if (typeof rr?.validator === "function") {
            await rr.validator(rr, value);
        }
    }
}


export default AdDynamicForm;
