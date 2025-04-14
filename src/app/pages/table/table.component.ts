import { Component, OnInit, ViewChild } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { BoletaCotaFundo } from '../../interface/boleta-interface';
import { BoletaCotaFundoService } from '../../services/boleta-cota-fundo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClientesService } from '../../services/clientes.service';
import { FundosService } from '../../services/fundos.service';
import { SituacoesService } from '../../services/situacoes.service';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FiltersComponent } from '../filters/filters.component';
import { SortEvent } from 'primeng/api';
import { FiltrosSelecionadosComponent } from '../filtros-selecionados/filtros-selecionados.component';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    FiltersComponent,
    FiltrosSelecionadosComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  boletas: BoletaCotaFundo[] = [];
  initialValue: BoletaCotaFundo[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  drawerVisible: boolean = false; // controle da visibilidade do drawer
  isSorted: boolean | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private boletaService: BoletaCotaFundoService,
    private filtersService: FiltersService
  ) {}

  ngOnInit() {
    this.inicializarFiltros();
  }
  
  inicializarFiltros() {
    this.filtersService.filtros$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filtros) => {
        this.aplicarFiltros(filtros || {});
      });
  
    if (!this.filtersService.obterFiltrosAtual()) {
      this.filtersService.atualizarFiltros({});
    }
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  aplicarFiltros(filtros: any) {
    this.loading = true;
    this.boletaService.pesquisar(filtros).subscribe({
      next: (res) => {
        this.boletas = res.elementos || [];
        this.initialValue = [...res.elementos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar boletas:', err);
        this.loading = false;
      },
    });
  }
  clear(table: any) {
    table.clear();
    this.filtersService.atualizarFiltros({});
  }

  abrirDrawer() {
    this.drawerVisible = true;
  }
  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.boletas = [...this.initialValue];
      this.dt1.reset();
    }
  }

  sortTableData(event: SortEvent) {
    if (!event.field) return;

    event.data!.sort((data1, data2) => {
      const value1 = data1[event.field!];
      const value2 = data2[event.field!];
      let result = 0;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }
}
