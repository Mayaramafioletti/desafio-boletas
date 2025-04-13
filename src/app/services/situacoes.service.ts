import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SituacoesService {
  private baseUrl = 'http://3.222.87.163/desafio/v1';
  private http = inject(HttpClient);

  
  getSituacoes() {
    return this.http.get<any[]>(`${this.baseUrl}/situacoes`);
  }
}
