import AdDynamicForm from "./AdDynamicForm";
import AdPopupModal from "./AdPopupModal";
import {useDecorateForm} from './hooks/decorateForm'
import type {ExposeDyFType} from "@/types";

type adDynamicFormRef = ExposeDyFType
type adPopupModalRef = {
    toggle: (f?: boolean) => void;
}
export * from './hooks/renderForm'
export * from './utils'
export type {
    adDynamicFormRef, adPopupModalRef
}
export {
    AdDynamicForm,
    AdPopupModal,
    useDecorateForm
}