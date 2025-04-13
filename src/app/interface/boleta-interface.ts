export interface BoletaFiltro {
    idBoletaCotaFundo?: number;
    idCliente?: number;
    idFundo?: number;
    idsSituacoes?: string; // exemplo: '1,3,4'
    codigoTipoOperacao?: string;
    dataOperacaoDe?: string; // formato 'yyyy-MM-dd'
    dataOperacaoAte?: string;
    valorFinanceiroDe?: number;
    valorFinanceiroAte?: number;
    page?: number;
    size?: number;
    sort?: string[]; // exemplo: ['dataOperacao,desc']
  }
  
  export interface BoletaCotaFundo {
    id: number;
    idCliente: number;
    nomeCliente: string;
    cpfCnpjCliente: string;
    idFundo: number;
    nomeFundo: string;
    cnpjFundo: string;
    idSituacao: number;
    nomeSituacao: string;
    codigoTipoOperacao: string;
    descricaoTipoOperacao: string;
    dataOperacao: string;
    valorFinanceiro: number;
  }
  
  export interface ResultadoConsulta {
    elementos: BoletaCotaFundo[];
    totalElementos: number;
    totalPaginas: number;
    tamanhoPagina: number;
    numeroPagina: number;
  }