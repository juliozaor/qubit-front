import { FormControl, FormGroup } from "@angular/forms";

export function markFormAsDirty(form:FormGroup):void{
    (<any>Object).values(form.controls).forEach((control:FormControl) => {
        control.markAsDirty();
        if (control) {
          control.markAsDirty()
        }
    });
}