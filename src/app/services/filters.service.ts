import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filtrosSubject = new BehaviorSubject<any>(null);
  filtros$ = this.filtrosSubject.asObservable();

  atualizarFiltros(filtros: any) {
    console.log(filtros)
    this.filtrosSubject.next(filtros);
  }

  obterFiltrosAtual() {
    return this.filtrosSubject.getValue();
  }
}
