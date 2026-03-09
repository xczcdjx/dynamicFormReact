import dayjs from "dayjs";
import {DATE_FORMAT} from "../../index";
// function
const datePickerFormat = ({
                              formatStr = DATE_FORMAT
                          }: { formatStr?: string }) => {
    return {
        getValueFromEvent: (_: any, dateString: string | string[]) =>
            Array.isArray(dateString) ? dateString.every(v => !v) ? null : dateString : dateString || null
        ,
        getValueProps: (v: any) =>
            v == null ? null : {
                value: Array.isArray(v)
                    ? v.map((s) => (s ? dayjs(s, formatStr) : null))
                    : dayjs(v, formatStr),

            }
    }
}
export {
    datePickerFormat
}