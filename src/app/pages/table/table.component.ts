import { Component, OnInit } from '@angular/core';
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
import { debounceTime, Subject } from 'rxjs';

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
    CalendarModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  boletas: BoletaCotaFundo[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  tiposOperacao: { label: string; value: string }[] = [
    { label: 'Aplicação', value: 'A' },
    { label: 'Resgate Parcial', value: 'RP' },
    { label: 'Resgate Total', value: 'RT' },
  ];
  
  selectedTiposOperacao: string[] = [];
  clientes: any[] = [];
  fundos: any[] = [];
  situacoes: any[] = [];
  codigoOperacao: number | null = null;
  selectedCliente: number | null = null;
  selectedFundo: number | null = null;
  selectedSituacoes: number[] = [];
  rangeDatas: Date[] = [];
  valorFinanceiroMin: number | null = null;
valorFinanceiroMax: number | null = null;
  valorFinanceiroMin$: Subject<number> = new Subject<number>();
valorFinanceiroMax$: Subject<number> = new Subject<number>();

  constructor(
    private boletaService: BoletaCotaFundoService,
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService
  ) {}

  ngOnInit() {
    this.clientesService.getClientes().subscribe((res) => (this.clientes = res));
    this.fundosService.getFundos().subscribe((res) => (this.fundos = res));
    this.situacoesService.getSituacoes().subscribe((res) => {
      this.situacoes = res;
      console.log(res)
      console.log('Situações carregadas:', this.situacoes);
    });
    this.valorFinanceiroMin$
    .pipe(debounceTime(400))
    .subscribe((val) => {
      this.valorFinanceiroMin = val;
      this.aplicarFiltros();
    });

  this.valorFinanceiroMax$
    .pipe(debounceTime(400))
    .subscribe((val) => {
      this.valorFinanceiroMax = val;
      this.aplicarFiltros();
    });
    this.aplicarFiltros(); // Buscar dados iniciais
  }

  aplicarFiltros() {
    const filtros: any = {
      page: 0,
      size: 50,
    };

    if (this.selectedCliente) {
      console.log(this.selectedCliente)
      filtros['idCliente'] = this.selectedCliente;
    }

    if (this.selectedFundo) {
      filtros['idFundo'] = this.selectedFundo;
    }

    if (this.selectedSituacoes.length > 0) {
      filtros['idsSituacoes'] = this.selectedSituacoes.join(',');
    }
    if (this.codigoOperacao !== null) {
      filtros['idBoletaCotaFundo'] = this.codigoOperacao;
    }
    if (this.selectedTiposOperacao.length > 0) {
      filtros['codigoTipoOperacao'] = this.selectedTiposOperacao.join(',');
    }
    if (this.rangeDatas && this.rangeDatas.length === 2) {
      const [dataInicio, dataFim] = this.rangeDatas;
      if (dataInicio && dataFim) {
        filtros['dataOperacaoDe'] = dataInicio.toISOString().split('T')[0];
        filtros['dataOperacaoAte'] = dataFim.toISOString().split('T')[0];
      }
    }
    if (this.valorFinanceiroMin !== null) {
      filtros['valorFinanceiroDe'] = this.valorFinanceiroMin;
    }
    if (this.valorFinanceiroMax !== null) {
      filtros['valorFinanceiroAte'] = this.valorFinanceiroMax;
    }
    this.loading = true;

    this.boletaService.pesquisar(filtros).subscribe({
      next: (res) => {
        this.boletas = res.elementos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao aplicar filtros:', err);
        this.loading = false;
      },
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.selectedCliente = null;
    this.selectedFundo = null;
    this.selectedSituacoes = [];
    this.aplicarFiltros();
  }
}