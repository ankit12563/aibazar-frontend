import { FormControl, ValidationErrors } from "@angular/forms";

export class AiValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { 'notOnlyWhitespace': true }; // Return an error if the value is only whitespace
        } 
        else {
            return {}; // Return null if the value is valid (not only whitespace)
        }
    }
}
