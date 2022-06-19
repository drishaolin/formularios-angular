import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: '',
    email: '',
    
  }
  usuarioAuxiliarMsg: any = {
    nome: 'Nome é obrigatório!',
    email: 'Email inválido!',
    cep: 'CEP inválido!',
    rua: 'Rua é obrigatório!',
    numero: 'Número é obrigatório!',
    bairro: 'Bairro é obrigatório!',
    cidade: 'Cidade é obrigatório!',
    estado: 'Estado é obrigatório!',
  }

  constructor( private http:HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(formulario: NgForm) {
    //console.log(formulario);

    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value))
    .subscribe(dados => console.log)
    
    
  }

  mostraCampoInvalido (campo: any) {
    return !campo.valid && campo.touched;
  }

  consultaCEP(cep: any, formulario: any ) {
   //Nova variável "cep" somente com dígitos.
   cep = cep.value.replace(/\D/g, '');
    
   //Verifica se campo cep possui valor informado.
   if (cep != "") {
     //Expressão regular para validar o CEP.
     var validacep = /^[0-9]{8}$/;

     //Valida o formato do CEP.
     if(validacep.test(cep)){
      this.http.get(`https://viacep.com.br/ws/${cep}/json`)
      .subscribe(dados => this.populaEnderecoForm(dados, formulario));
     }
   }
  }

  populaEnderecoForm(dados:any, formulario:any) {
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

    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        bairro: dados.bairro ,
        cidade: dados.localidade,
        estado: dados.uf 
      }
    });
  }

  limparFormulario(formulario:any) {
    formulario.form.patchValue({
      nome: '',
      email: '',
      endereco: {
        cep: '',
        numero: '',
        complemento: '',
        rua: '',
        bairro: '' ,
        cidade: '',
        estado: '', 
      }
    });
  }

  

}
