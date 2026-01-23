import {
    forwardRef,
    useEffect,
    useMemo,
    useImperativeHandle,
    type ReactNode,
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
    validateTrigger?: string | string[]
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

    const preset: PresetType = props.preset ?? "fullRow";
    const validateTrigger = props.validateTrigger ?? 'onBlur'

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
                    validateTrigger,
                } satisfies Rule;
            }

            if (rule) inner[k] = rule;
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
            const namePaths = visibleItems.map((it: any) => toNamePath(it?.path ?? it?.key));
            const values = await form.validateFields(namePaths);

            // 再同步一遍，确保 items 与 form 完全一致
            const all = form.getFieldsValue(true);
            visibleItems.forEach((it: any) => {
                const np = toNamePath(it?.path ?? it?.key);
                it.value = getByNamePath(all, np);
            });

            return values;
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

        const colProps: ColProps = it?.colProps ?? {span: it?.span ?? 24, offset: it?.offset ?? 0};
        const formItemProps = it?.formItemProps ?? {};

        const node = (
            <Form.Item key={k} name={np} validateTrigger={validateTrigger} label={it?.label}
                       rules={rules} {...formItemProps}>
                {renderItem(it, form)}
            </Form.Item>
        );

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

export default AdDynamicForm;
