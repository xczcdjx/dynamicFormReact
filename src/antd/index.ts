import AdDynamicForm from "./AdDynamicForm";
import AdPopupModal from "./AdPopupModal";
import AdZealCard from "./AdZealCard";
import {AdZealTableSearch,AdZealTablePaginationControl} from "./AdZealTableTool";
import {useDecorateForm} from './hooks/decorateForm'
import type {ExposeDyFType} from "@/types";

type adDynamicFormRef<T extends Record<string, any> = any> = ExposeDyFType<T>
type adPopupModalRef = {
    toggle: (f?: boolean) => void;
}
export * from './hooks/renderForm'
export * from './utils'
export * from './types'
export type {
    adDynamicFormRef, adPopupModalRef
}
export {
    AdDynamicForm,
    AdPopupModal,
    AdZealCard,
    AdZealTableSearch,
    AdZealTablePaginationControl,
    useDecorateForm
}