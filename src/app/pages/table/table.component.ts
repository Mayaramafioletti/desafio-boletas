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
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  boletas: BoletaCotaFundo[] = [];
  loading: boolean = true;
  searchValue: string | undefined;

  clientes: any[] = [];
  fundos: any[] = [];
  situacoes: any[] = [];

  selectedCliente: number | null = null;
  selectedFundo: number | null = null;
  selectedSituacoes: number[] = [];

  constructor(
    private boletaService: BoletaCotaFundoService,
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService
  ) {}

  ngOnInit() {
    this.clientesService.getClientes().subscribe((res) => (this.clientes = res));
    this.fundosService.getFundos().subscribe((res) => (this.fundos = res));
    this.situacoesService.getSituacoes().subscribe((res) => (this.situacoes = res));

    this.aplicarFiltros(); // Buscar dados iniciais
  }

  aplicarFiltros() {
    const filtros: any = {
      page: 0,
      size: 20,
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