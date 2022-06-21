import { FormControl } from "@angular/forms";

export class FormValidations {
    static cepValidator(control: FormControl) {
        const cep:string = control.value;
        if(cep && cep !== '') {
            const validacep = /^[0-9]{5}-?[0-9]{3}$/;
            //se o cep for válido retorna null, se não retorna o erro:
            return validacep.test(cep) ? null : { cepInvalido: true };
        }
        return null;
    }
}