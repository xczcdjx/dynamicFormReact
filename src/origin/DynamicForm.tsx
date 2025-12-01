
import {forwardRef, useImperativeHandle} from "react";

type DynamicFormProps = {
    size?: string
}
type dynamicFormRef = ExposeType
const DynamicForm = forwardRef<dynamicFormRef, DynamicFormProps>((props, ref) => {

    useImperativeHandle(ref, () => ({
        getResult(t: "res" | "ori"): DyCFormItem[] | object {
            return {};
        }, onSet(obj: object | undefined): void {

        }
    }))

    return (
        <div className={'dynamicForm'}>
            <div className={'aaa'}>
                aaaaaa
            </div>
        </div>
    );

})
export default DynamicForm;