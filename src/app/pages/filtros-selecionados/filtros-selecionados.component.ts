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

  constructor(
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(clientes => this.clientes = clientes);
    this.fundosService.getFundos().subscribe(fundos => this.fundos = fundos);
    this.situacoesService.getSituacoes().subscribe(situacoes => this.situacoes = situacoes);
    this.filtersService.filtros$.subscribe(f => this.filtros = f || {});
  }

  get nomeCliente(): string | null {
    return this.clientes.find(c => c.id === this.filtros.idCliente)?.nome ?? null;
  }

  get nomeFundo(): string | null {
    return this.fundos.find(f => f.id === this.filtros.idFundo)?.nome ?? null;
  }

  get nomesSituacoesSelecionadas(): { id: number; nome: string }[] {
    return this.situacoes
      .filter(s => this.filtros.idsSituacoes?.includes(s.id))
      .map(s => ({ id: s.id, nome: s.nome }));
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
    const raw = this.filtros.idsSituacoes;
  
    // Converte string "2,6" para [2, 6]
    const ids = typeof raw === 'string'
      ? raw.split(',').map(Number)
      : Array.isArray(raw)
        ? [...raw]
        : [];
  
    const novasSituacoes = ids.filter((s: number) => s !== id);
  
    // Envia de volta no mesmo formato original: string separada por vírgula
    this.atualizarFiltros({ idsSituacoes: novasSituacoes.join(',') });
  }
  
}
