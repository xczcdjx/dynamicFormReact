import dayjs from "dayjs";
// variable
const omitFormCommonKey = ['value', 'key', 'onChange', 'render2', 'formItemProps'] as const
const omitAllCommonKey = [
    'type',
    'value',
    'key',
    'render2',
    'searchOnLabel',
    'labelField',
    'valueField',
    'childField',
    'formItemProps',
] as const
const DATE_FORMAT = 'YYYY-MM-DD'
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const TIME_FORMAT = 'HH:mm:ss'
// function
const datePickerFormat = ({
                                    formatStr = DATE_FORMAT, isRange
                                }: { formatStr?: string, isRange?: boolean }) => {
    return {
        getValueFromEvent: (_: any, dateString: string) => dateString || null,
        getValueProps: (v: any) => {
            if (!isRange) return {value: v ? dayjs(v, formatStr) : null}
            return {
                value: Array.isArray(v)
                    ? v.map((s) => (s ? dayjs(s, formatStr) : null))
                    : [null, null],
            }
        }
    }
}
export {
    omitFormCommonKey,
    omitAllCommonKey,
    DATE_FORMAT,
    DATETIME_FORMAT,
    TIME_FORMAT,
    datePickerFormat
}