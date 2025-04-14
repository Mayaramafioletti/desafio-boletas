import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Subject, debounceTime } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';
import { FundosService } from '../../services/fundos.service';
import { SituacoesService } from '../../services/situacoes.service';
import { FiltersService } from '../../services/filters.service';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    DrawerModule,
    ButtonModule,
    SelectModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    MessageModule 
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  tiposOperacao = [
    { label: 'Aplicação', value: 'A' },
    { label: 'Resgate Parcial', value: 'RP' },
    { label: 'Resgate Total', value: 'RT' },
  ];

  clientes: any[] = [];
  fundos: any[] = [];
  situacoes: any[] = [];

  selectedCliente: number | null = null;
  selectedFundo: number | null = null;
  selectedSituacoes: number[] = [];
  selectedTiposOperacao: string[] = [];

  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  codigoOperacao: number | null = null;
  valorFinanceiroMin: number | null = null;
  valorFinanceiroMax: number | null = null;

  valorFinanceiroMin$ = new Subject<number>();
  valorFinanceiroMax$ = new Subject<number>();

  mensagemData: string = '';
  mensagemValor: string = '';
  constructor(
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService,
    private filtersService: FiltersService,
  ) {}

  ngOnInit(): void {
    this.clientesService
      .getClientes()
      .subscribe((res) => (this.clientes = res));
    this.fundosService.getFundos().subscribe((res) => (this.fundos = res));
    this.situacoesService
      .getSituacoes()
      .subscribe((res) => (this.situacoes = res));

    this.valorFinanceiroMin$.pipe(debounceTime(400)).subscribe((val) => {
      this.valorFinanceiroMin = val;
      this.emitirFiltros();
    });

    this.valorFinanceiroMax$.pipe(debounceTime(400)).subscribe((val) => {
      this.valorFinanceiroMax = val;
      this.emitirFiltros();
    });

    // 🔄 Escuta e sincroniza os filtros do serviço
    this.filtersService.filtros$.subscribe((filtros) => {
      if (filtros) {
        this.selectedCliente = filtros.idCliente ?? null;
        this.selectedFundo = filtros.idFundo ?? null;
        this.selectedSituacoes = filtros.idsSituacoes
          ? Array.isArray(filtros.idsSituacoes)
            ? filtros.idsSituacoes
            : filtros.idsSituacoes.split(',').map((id: string) => +id)
          : [];

        this.selectedTiposOperacao = filtros.codigoTipoOperacao
          ? filtros.codigoTipoOperacao.split(',')
          : [];

        this.codigoOperacao = filtros.idBoletaCotaFundo ?? null;
        this.dataInicio = filtros.dataOperacaoDe
          ? new Date(filtros.dataOperacaoDe)
          : null;
        this.dataFim = filtros.dataOperacaoAte
          ? new Date(filtros.dataOperacaoAte)
          : null;
        this.valorFinanceiroMin = filtros.valorFinanceiroDe ?? null;
        this.valorFinanceiroMax = filtros.valorFinanceiroAte ?? null;
      }
    });
  }

  emitirFiltros(): void {
    // Validação de datas
    if (this.dataInicio && this.dataFim && this.dataFim < this.dataInicio) {
      this.mensagemData = 'Data final não pode ser anterior à data inicial.';
      return;
    }

    // Validação de valores financeiros
    if (
      this.valorFinanceiroMin !== null &&
      this.valorFinanceiroMax !== null &&
      this.valorFinanceiroMax < this.valorFinanceiroMin
    ) {

      this.mensagemValor= 'Valor máximo não pode ser menor que o valor mínimo';
      return;
    }

    const filtros = {
      idCliente: this.selectedCliente,
      idFundo: this.selectedFundo,
      idsSituacoes: this.selectedSituacoes.length
        ? this.selectedSituacoes.join(',')
        : null,
      idBoletaCotaFundo: this.codigoOperacao,
      codigoTipoOperacao: this.selectedTiposOperacao.length
        ? this.selectedTiposOperacao.join(',')
        : null,
      dataOperacaoDe: this.dataInicio
        ? this.dataInicio.toISOString().split('T')[0]
        : null,
      dataOperacaoAte: this.dataFim
        ? this.dataFim.toISOString().split('T')[0]
        : null,
      valorFinanceiroDe: this.valorFinanceiroMin,
      valorFinanceiroAte: this.valorFinanceiroMax,
    };

    this.filtersService.atualizarFiltros(filtros);
  }

  fecharDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  limparCodigoOperacao() {
    this.codigoOperacao = null;
    this.emitirFiltros();
  }

  limparCliente() {
    this.selectedCliente = null;
    this.emitirFiltros();
  }

  limparFundo() {
    this.selectedFundo = null;
    this.emitirFiltros();
  }

  limparSituacoes() {
    this.selectedSituacoes = [];
    this.emitirFiltros();
  }

  limparTiposOperacao() {
    this.selectedTiposOperacao = [];
    this.emitirFiltros();
  }

  limparDatas() {
    this.dataInicio = null;
    this.dataFim = null;
    this.emitirFiltros();
  }

  limparValores() {
    this.valorFinanceiroMin = null;
    this.valorFinanceiroMax = null;
    this.emitirFiltros();
  }
}
