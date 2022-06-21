import { FormControl, FormGroup } from "@angular/forms";

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
    static equalsTo(otherField: string) {
        const validator = (formControl: FormControl) => {
            if(otherField == null) {
                throw new Error('É necessário informar um campo!');
            }

            if(!formControl.root || !(<FormGroup>formControl.root).controls) {
                //retorna nulo caso o formulário ainda não esteja pronto na renderização
                return null;
            }

            //acessar root para assegurar que teremos acesso a todos os campos do formulário:
            //casting de FormGroup para acessar os métodos do tipo:
            const field = (<FormGroup>formControl.root).get(otherField);
            if(!field) {
                throw new Error('É necessário informar um campo válido!')
            }
            if(field.value !== formControl.value) {
                return { equalsTo: otherField };
            }
            return null;
        };
        return validator;
    }
}