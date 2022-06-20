import { HttpClient } from '@angular/common/http';
import { BinaryOperatorExpr, compileComponentFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IEstadosBr } from '../models/estados-br';
import { DropdownService } from '../services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados: IEstadosBr[];

  usuarioAuxiliarMsg: any = {
    nome: 'Nome é obrigatório!',
    email: 'Email é obrigatório!',
    emailInvalido: 'Email inválido!',
    cep: 'CEP é obrigatório!',
    cepInvalido: 'CEP inválido!',
    rua: 'Rua é obrigatório!',
    numero: 'Número é obrigatório!',
    bairro: 'Bairro é obrigatório!',
    cidade: 'Cidade é obrigatório!',
    estado: 'Estado é obrigatório!',
  }

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService
    ) { }

  ngOnInit(): void {

    this.dropdownService.getestadosBr()
    .subscribe(dados => {
      this.estados = dados;
      console.log(dados);
    });

    //As duas maneiras de escrever fazem a mesma coisa:
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    //     
    //   endereco: new FormGroup({
    //      cep: new FormControl(null)
    //   })
    // });

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, Validators.pattern("^[0-9]{5}-?[0-9]{3}$"), Validators.minLength(8), Validators.maxLength(9)]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    })
  }

  onSubmit() {
    console.log(this.formulario.value);

    if(this.formulario.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(dados => {
        console.log(dados);
        //this.formulario.reset();
        this.limparFormulario();
      },
      (error: any) => alert('erro!'));
      console.log('%c Formulário enviado!!','color:white; background-color:green');
    } else {
      console.error('form invalido');
      this.verificaValidacoesForm(this.formulario);

      
    }
  }

  limparFormulario() {
    this.formulario.reset();
  }

  //------------------- MÉTODOS DE VALIDAÇÃO: --------------------
  mostraCampoInvalido (campo: string): boolean {
    //ambas sintaxes são corretas:
    // return !this.formulario.controls[campo].valid 
    // && this.formulario.controls[campo].touched;
    return !this.formulario.get(campo)!.valid 
    && this.formulario.get(campo)!.touched;
  }
  verificaEmailInvalido() {
    //retorna true caso exista erro no email e ele foi tocado
    let campoEmail = this.formulario.controls['email'];
    if(campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }
  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.controls[campo];
      controle.markAsTouched();
      //para verificar validações em itens aninhados:
      if(controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      
    })
  }

  //-------------- MÉTODOS PARA CONSULTA CEP -------------
  consultaCEP() {
    let cep = this.formulario.get('endereco.cep')!.value;

    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
     
    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;
 
      //Valida o formato do CEP.
      if(validacep.test(cep)){
       this.http.get(`https://viacep.com.br/ws/${cep}/json`)
       .subscribe(dados => this.populaEnderecoForm(dados));
      }
    }
   }
   populaEnderecoForm(dados:any) {
    //com setValue precisamos modificar todos os atributos, 
    //com patchValue, podemos alterar somente os que nos interessem

    // formulario.setValue({
    //   nome: formulario.value.nome ,
    //   email: formulario.value.email ,
    //   endereco: {
    //     cep: dados.cep ,
    //     numero: '' ,
    //     complemento: '' ,
    //     rua: dados.logradouro,
    //     bairro: dados.bairro ,
    //     cidade: dados.localidade,
    //     estado: dados.uf 
    //   }
    // });

    this.formulario.patchValue({
      endereco: {
        //cep: dados.cep,
        rua: dados.logradouro,
        bairro: dados.bairro ,
        cidade: dados.localidade,
        estado: dados.uf 
      }
    });
  }

}
