import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoletaFiltro, ResultadoConsulta } from '../interface/boleta-interface';

@Injectable({
  providedIn: 'root'
})
export class BoletaCotaFundoService {
  private baseUrl = 'http://3.222.87.163/desafio/v1/boletas-cota-fundo/pesquisar';
  private http = inject(HttpClient);

  pesquisar(filtros: BoletaFiltro): Observable<ResultadoConsulta> {
    let params = new HttpParams();
    console.log(params)

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params = params.append(key, v));
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.http.get<ResultadoConsulta>(this.baseUrl, { params });
  }
 
}
