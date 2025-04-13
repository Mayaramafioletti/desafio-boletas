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

  selectedClientes: any[] = [];
  selectedFundos: any[] = [];
  selectedSituacoes: any[] = [];

  constructor(
    private boletaService: BoletaCotaFundoService,
    private clientesService: ClientesService,
    private fundosService: FundosService,
    private situacoesService: SituacoesService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.boletaService.pesquisar({ page: 0, size: 20 }).subscribe({
      next: (res) => {
        this.boletas = res.elementos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar boletas:', err);
        this.loading = false;
      },
    });

    this.clientesService.getClientes().subscribe((res) => (this.clientes = res));
    this.fundosService.getFundos().subscribe((res) => (this.fundos = res));
    this.situacoesService.getSituacoes().subscribe((res) => (this.situacoes = res));
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.selectedClientes = [];
    this.selectedFundos = [];
    this.selectedSituacoes = [];
  }
}
