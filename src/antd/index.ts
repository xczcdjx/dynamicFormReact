import AdDynamicForm from "./AdDynamicForm";
import {useDecorateForm} from './hooks/decorateForm'
import type {ExposeDyFType} from "@/types";

type adDynamicFormRef = ExposeDyFType
export * from './hooks/renderForm'
export type {
    adDynamicFormRef
}
export {
    AdDynamicForm,useDecorateForm
}