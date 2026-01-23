import DynamicInput from './origin/DynamicInput.tsx';
import DynamicCascadeInput from './origin/DynamicCascadeInput.tsx';

import type {ExposeType} from "@/types";

export * from './utils/tools'
export * from './constants'
export * from './hooks/useDyForm'

export type dynamicInputRef = ExposeType
export type dynamicCascadeInputRef = ExposeType
export {DynamicInput, DynamicCascadeInput}
import './index.less'