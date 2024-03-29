import { ValidationErrors } from "@angular/forms";

export const getValidatorErrorMessage = (validatorName: string, validatorErrors?: ValidationErrors): string|undefined => {
    let args = messages.get(validatorName)?.validatorErrorsKey?.map(name => validatorErrors?.[name])
    return (args) ? stringFormat(messages.get(validatorName)?.message,...args) : messages.get(validatorName)?.message
}

const  messages = new Map<string, {message : string,validatorErrorsKey? : string[]}>([
    ['required',  { message : 'This field is required'} ],
    ['minlength', { message : 'Must be at least {0} characters long' ,   validatorErrorsKey :['requiredLength']}],
    ['maxlength', { message : 'Cannot be more than {0} characters long', validatorErrorsKey :['requiredLength']}],
    ['email',     { message : 'Must be a valid email address'}],
])

function stringFormat(template: string|undefined, ...args: any[]) {
    if(template){
        return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined'
            ? args[index]
            : match;
        })
    }
    return undefined
 }