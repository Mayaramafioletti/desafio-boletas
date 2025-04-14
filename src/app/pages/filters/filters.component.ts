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
import { MessageModule } from 'primeng/message';

import { ClientesService } from '../../services/clientes.service';
import { FundosService } from '../../services/fundos.service';
import { SituacoesService } from '../../services/situacoes.service';
import { FiltersService } from '../../services/filters.service';
import { DatePickerModule } from 'primeng/datepicker';
type FiltrosKeys =
  | 'selectedCliente'
  | 'selectedFundo'
  | 'selectedSituacoes'
  | 'selectedTiposOperacao'
  | 'codigoOperacao'
  | 'dataInicio'
  | 'dataFim'
  | 'valorFinanceiroMin'
  | 'valorFinanceiroMax';
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
    DatePickerModule ,
    InputTextModule,
    MessageModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  // Inputs e Outputs
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  // Listas para os selects
  tiposOperacao = [
    { label: 'Aplicação', value: 'A' },
    { label: 'Resgate Parcial', value: 'RP' },
    { label: 'Resgate Total', value: 'RT' },
  ];
  clientes: any[] = [];
  fundos: any[] = [];
  situacoes: any[] = [];

  // Valores selecionados
  selectedCliente: number | null = null;
  selectedFundo: number | null = null;
  selectedSituacoes: number[] = [];
  selectedTiposOperacao: string[] = [];
  codigoOperacao: number | null = null;
  dataInicio: Date | null = null;
  dataFim: Date | null = null;
  valorFinanceiroMin: number | null = null;
  valorFinanceiroMax: number | null = null;

  // Mensagens de validação
  mensagemData = '';
  mensagemValor = '';

  constructor(
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    this.carregarFiltrosIniciais();
    this.subscreverFiltros();
  }

  private carregarFiltrosIniciais(): void {
    this.clientesService
      .getClientes()
      .subscribe((res) => (this.clientes = res));
    this.fundosService.getFundos().subscribe((res) => (this.fundos = res));
    this.situacoesService
      .getSituacoes()
      .subscribe((res) => (this.situacoes = res));
  }

  private subscreverFiltros(): void {
    this.filtersService.filtros$.subscribe((filtros) => {
      if (!filtros) return;

      this.selectedCliente = filtros.idCliente ?? null;
      this.selectedFundo = filtros.idFundo ?? null;

      this.selectedSituacoes = filtros.idsSituacoes
        ? Array.isArray(filtros.idsSituacoes)
          ? filtros.idsSituacoes
          : filtros.idsSituacoes.split(',').map((id: string) => +id)
        : [];

      this.selectedTiposOperacao =
        filtros.codigosTipoOperacao?.split(',') ?? [];
      this.codigoOperacao = filtros.idBoletaCotaFundo ?? null;
      this.dataInicio = filtros.dataOperacaoDe
        ? new Date(filtros.dataOperacaoDe)
        : null;
      this.dataFim = filtros.dataOperacaoAte
        ? new Date(filtros.dataOperacaoAte)
        : null;
      this.valorFinanceiroMin = filtros.valorFinanceiroDe ?? null;
      this.valorFinanceiroMax = filtros.valorFinanceiroAte ?? null;
    });
  }

  emitirFiltros(): void {
    if (this.dataInicio && this.dataFim && this.dataFim < this.dataInicio) {
      this.mensagemData = 'Data final não pode ser anterior à data inicial.';
      return;
    }

    if (
      this.valorFinanceiroMin !== null &&
      this.valorFinanceiroMax !== null &&
      this.valorFinanceiroMax < this.valorFinanceiroMin
    ) {
      this.mensagemValor = 'Valor máximo não pode ser menor que o valor mínimo';
      return;
    }

    const filtros = {
      idCliente: this.selectedCliente ?? undefined,
      idFundo: this.selectedFundo ?? undefined,
      idsSituacoes: this.selectedSituacoes.length
        ? this.selectedSituacoes.join(',')
        : undefined,
      idBoletaCotaFundo: this.codigoOperacao ?? undefined,
      codigosTipoOperacao: this.selectedTiposOperacao.length
        ? this.selectedTiposOperacao.join(',')
        : undefined,
      dataOperacaoDe: this.dataInicio?.toISOString().split('T')[0],
      dataOperacaoAte: this.dataFim?.toISOString().split('T')[0],
      valorFinanceiroDe: this.valorFinanceiroMin ?? undefined,
      valorFinanceiroAte: this.valorFinanceiroMax ?? undefined,
    };

    this.filtersService.atualizarFiltros(filtros);
  }

  fecharDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Métodos para limpar filtros individualmente
  limparCampo(campo: FiltrosKeys): void {
    const valorAtual = this[campo];
    if (Array.isArray(valorAtual)) {
      this[campo] = [] as any;
    } else {
      this[campo] = null as any;
    }
    this.emitirFiltros();
  }
}
