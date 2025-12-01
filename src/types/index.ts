export type ExposeType = {
    onSet?: (obj?: object) => void
    getResult?: (t: 'res' | 'ori') => DyCFormItem[] | object
}