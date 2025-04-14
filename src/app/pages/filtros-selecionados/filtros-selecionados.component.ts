import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { FiltersService } from '../../services/filters.service';
import { FundosService } from '../../services/fundos.service';
import { SituacoesService } from '../../services/situacoes.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-filtros-selecionados',
  templateUrl: './filtros-selecionados.component.html',
  styleUrl: './filtros-selecionados.component.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class FiltrosSelecionadosComponent implements OnInit {
  clientes: any[] = [];
  fundos: any[] = [];
  situacoes: any[] = [];
  
  filtros: any = {};
  tiposOperacao = [
    { label: 'Aplicação', value: 'A' },
    { label: 'Resgate Parcial', value: 'RP' },
    { label: 'Resgate Total', value: 'RT' },
  ];

  constructor(
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.filtersService.filtros$.subscribe(f => this.filtros = f || {});
  }

  private carregarDadosIniciais(): void {
    this.clientesService.getClientes().subscribe(clientes => this.clientes = clientes);
    this.fundosService.getFundos().subscribe(fundos => this.fundos = fundos);
    this.situacoesService.getSituacoes().subscribe(situacoes => this.situacoes = situacoes);
  }

  get nomeCliente(): string | null {
    return this.buscarNomePorId(this.clientes, 'idCliente');
  }

  get nomeFundo(): string | null {
    return this.buscarNomePorId(this.fundos, 'idFundo');
  }

  private buscarNomePorId(lista: any[], idCampo: string): string | null {
    const id = this.filtros[idCampo];
    return lista.find(item => item.id === id)?.nome ?? null;
  }

  get nomesSituacoesSelecionadas(): { id: number; nome: string }[] {
    return this.filtros.idsSituacoes
      ? this.situacoes.filter(s => this.filtros.idsSituacoes.includes(s.id))
      : [];
  }

  get nomesTiposOperacaoSelecionadas(): { label: string; value: string }[] {
    const tiposSelecionados = this.formatarValores(this.filtros.codigosTipoOperacao);
    return this.tiposOperacao.filter(t => tiposSelecionados.includes(t.value));
  }

  private formatarValores(raw: any): string[] {
    if (typeof raw === 'string') {
      return raw.split(',');
    }
    return Array.isArray(raw) ? raw : [];
  }

  private atualizarFiltros(parciais: Partial<any>): void {
    const atualizados = { ...this.filtros, ...parciais };
    this.filtersService.atualizarFiltros(atualizados);
  }

  // Métodos de remoção
  removerCampo(campo: string): void {
    this.atualizarFiltros({ [campo]: null });
  }

  removerSituacao(id: number): void {
    this.removerValorArray('idsSituacoes', id);
  }

  removerTipoOperacao(value: string): void {
    this.removerValorArray('codigosTipoOperacao', value);
  }

  private removerValorArray(campo: string, valor: any): void {
    const valores = this.formatarValores(this.filtros[campo]);
    const novosValores = valores.filter(v => v.toString() !== valor.toString());
    this.atualizarFiltros({ [campo]: novosValores.join(',') });
  }
}
