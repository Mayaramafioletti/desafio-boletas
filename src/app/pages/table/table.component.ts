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
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FiltersComponent } from '../filters/filters.component';
import { SortEvent } from 'primeng/api';
import { FiltrosSelecionadosComponent } from '../filtros-selecionados/filtros-selecionados.component';
import { FiltersService } from '../../services/filters.service';
import { PaginatorModule } from 'primeng/paginator';

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
    PaginatorModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  boletas: BoletaCotaFundo[] = [];
  initialValue: BoletaCotaFundo[] = [];
  loading = true;
  searchValue?: string;
  drawerVisible = false;
  isSorted: boolean | null = null;
  numeroPaginas = 5;
  first = 0;
  totalRegistros = 0;
  rows = 10;
  rowsPerPageOptions: number[] = [];
  private destroy$ = new Subject<void>();
  private readonly sortFieldMap: Record<string, string> = {
    id: 'id',
    nomeCliente: 'cliente.nome',
    nomeFundo: 'fundo.nome',
    cnpjFundo: 'fundo.cnpj',
    nomeSituacao: 'situacao.nome',
    tipoOperacao: 'codigoTipoOperacao',
    dataOperacao: 'dataOperacao',
    valor: 'valorFinanceiro',
  };

  constructor(
    private boletaService: BoletaCotaFundoService,
    private filtersService: FiltersService
  ) {}

  ngOnInit() {
    this.inicializarFiltros();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarFiltros() {
    this.filtersService.filtros$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(filtros => this.aplicarFiltros(filtros || {}));

    if (!this.filtersService.obterFiltrosAtual()) {
      this.filtersService.atualizarFiltros({});
    }
  }

  private aplicarFiltros(filtros: any) {
    const filtrosComPaginacao = {
      ...filtros,
      page: filtros.page ?? 0,
      size: filtros.size ?? this.rows,
    };

    this.loading = true;

    this.boletaService.pesquisar(filtrosComPaginacao).subscribe({
      next: (res) => {
        this.boletas = res.elementos || [];
        this.initialValue = [...this.boletas];
        this.totalRegistros = res.totalElementos;
        this.rows = res.tamanhoPagina;
        this.loading = false;
        this.atualizarRowsPerPageOptions();
      },
      error: (err) => {
        console.error('Erro ao buscar boletas:', err);
        this.loading = false;
      },
    });
  }

  private atualizarRowsPerPageOptions() {
    const proximoMultiplo = Math.ceil(this.totalRegistros / 10) * 10;
    this.rowsPerPageOptions = [];

    for (let i = 10; i <= proximoMultiplo; i += 10) {
      this.rowsPerPageOptions.push(i);
    }
  }

  aoMudarPagina(event: any) {
    this.first = event.first;
    this.rows = event.rows;

    const filtrosAtuais = this.filtersService.obterFiltrosAtual() || {};
    const filtrosComPaginacao = {
      ...filtrosAtuais,
      page: event.page,
      size: event.rows,
      sort: filtrosAtuais.sort,
    };

    this.aplicarFiltros(filtrosComPaginacao);
  }

  clear(table: any) {
    table.clear();
    this.filtersService.atualizarFiltros({});
  }

  abrirDrawer() {
    this.drawerVisible = true;
  }

  customSort(event: SortEvent) {
    if (!event.field || event.order === 0) {
      this.resetSort();
      return;
    }

    const fieldApi = this.sortFieldMap[event.field] || event.field;
    const direction = event.order === 1 ? 'asc' : 'desc';
    const sortParam = [`${fieldApi},${direction}`];

    this.atualizarSort(sortParam);
  }

  private resetSort() {
    this.isSorted = null;
    this.boletas = [...this.initialValue];
    this.dt1.reset();

    const filtrosAtuais = this.filtersService.obterFiltrosAtual() || {};
    if (filtrosAtuais.sort) {
      this.filtersService.atualizarFiltros({ ...filtrosAtuais, sort: undefined });
    }
  }

  private atualizarSort(sortParam: string[]) {
    const filtrosAtuais = this.filtersService.obterFiltrosAtual() || {};
    const sortAtual = filtrosAtuais.sort ?? [];

    if (JSON.stringify(sortAtual) === JSON.stringify(sortParam)) return;

    this.isSorted = sortParam[0].endsWith('asc');
    this.filtersService.atualizarFiltros({ ...filtrosAtuais, sort: sortParam });
  }

  sortTableData(event: SortEvent) {
    if (!event.field) return;

    event.data!.sort((data1, data2) => this.compareData(data1, data2, event.field!, event.order!));
  }

  private compareData(data1: any, data2: any, field: string, order: number) {
    const value1 = data1[field];
    const value2 = data2[field];
    let result = 0;

    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === 'string' && typeof value2 === 'string')
      result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return order * result;
  }
}
