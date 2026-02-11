import * as renderers from "./renderForm"
import type {DecorateDyFormItem, Renderers, RenderType} from "@/types";
import type {DyFormItem} from "@/types/form";
import {useEffect, useState} from "react";
import {OmitValue} from "@/utils/tools.ts";

export function createUseDecorateForm(renderers: Renderers<any, any>) {
    return function useDecorateForm<Row extends Record<string, any>, RuleT = any>(
        rawItems: DecorateDyFormItem<Row, RuleT>[],
        isReactive = true
    ) {
        const [items, setItems] = useState<DecorateDyFormItem<Row, RuleT>[]>(() => rawItems);

        useEffect(() => {
            if (isReactive) return;
            setItems(rawItems);
        }, [isReactive, rawItems]);

        const r = renderers as unknown as Renderers<Row, RuleT>

        const map: Record<RenderType, (it: DecorateDyFormItem<Row, RuleT>) => any> = {
            renderInput: (it) => r.renderInput(it.renderProps ?? {}, it),

            renderSelect: (it) =>
                r.renderSelect((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderPopSelect: (it) =>
                r.renderPopSelect((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderTreeSelect: (it) =>
                r.renderTreeSelect((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderRadioGroup: (it) =>
                r.renderRadioGroup((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderRadioButtonGroup: (it) =>
                r.renderRadioButtonGroup((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderCheckboxGroup: (it) =>
                r.renderCheckboxGroup((it.options ?? []) as any, it.renderProps ?? {}, it),

            renderSwitch: (it) => r.renderSwitch(it.renderProps ?? {}, it),

            renderDatePicker: (it) => r.renderDatePicker(it.renderProps ?? {}, it),

            renderTimePicker: (it) => r.renderTimePicker(it.renderProps ?? {}, it),
            renderCheckbox: (it) => r.renderCheckbox(it.renderProps ?? {}, it),
            renderDynamicTags: (it) => r.renderDynamicTags(it.renderProps ?? {}, it),
            renderSlider: (it) => r.renderSlider(it.renderProps ?? {}, it),
            renderInputNumber: (it) => r.renderInputNumber(it.renderProps ?? {}, it),
        }

        const normalized = items.map((raw) => {
            const it = raw as any as DecorateDyFormItem<Row, RuleT>
            // 处理render2
            if (typeof raw.render2 === "function") {
                it.render2 = raw.render2
            } else {
                const key = (raw.renderType ?? "renderInput") as RenderType
                const fn = map[key]
                if (fn) it.render2 = () => fn(OmitValue(it, ['renderType', 'renderProps']) as any)
                else {
                    console.warn(`[useDecorateForm] unknown renderType: ${raw.renderType}`)
                    it.render2 = () => map.renderInput(it)
                }
            }
            // 是否外部状态响应式
            return it
        })

        return [normalized, setItems] as const;
    }
}

export const useDecorateForm = createUseDecorateForm(renderers)