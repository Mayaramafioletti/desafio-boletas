import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BoletaFiltro } from '../interface/boleta-interface';
import { isEqual } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filtrosSubject = new BehaviorSubject<any>(null);
  filtros$ = this.filtrosSubject.asObservable();

 
atualizarFiltros(novosFiltros: BoletaFiltro) {
  const filtrosAtuais = this.filtrosSubject.getValue();
  if (!isEqual(filtrosAtuais, novosFiltros)) {
    this.filtrosSubject.next(novosFiltros);
  }
}

obterFiltrosAtual(): BoletaFiltro | null {
  return this.filtrosSubject.getValue();
}
}
