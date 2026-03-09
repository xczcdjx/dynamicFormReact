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
export {
    omitFormCommonKey,
    omitAllCommonKey,
    DATE_FORMAT,
    DATETIME_FORMAT,
    TIME_FORMAT,
}