import DynamicInput from './origin/DynamicInput.tsx';
import DynamicCascadeInput from './origin/DynamicCascadeInput.tsx';

import type {ExposeType} from "@/types";

export * from './utils/tools'
export * from './hooks/useDyForm'
export * from './hooks/useTool'
export * from './hooks/zealForm'
export * from './constants'

export type dynamicInputRef = ExposeType
export type dynamicCascadeInputRef = ExposeType
export {DynamicInput, DynamicCascadeInput}
import './index.less'