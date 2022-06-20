import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEstadosBr } from '../models/estados-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getestadosBr() {
    return this.http.get<IEstadosBr[]>('assets/dados/estadosBr.json');
  }

}
