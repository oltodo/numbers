/// <reference types="react-scripts" />

module "written-number" {
    interface Options {
        lang: string
    }

    declare const writtenNumber = (number: number, options?: Options) => string
    
    export default writtenNumber
}