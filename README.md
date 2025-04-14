# 📊 Desafio Técnico - Tabela de Boletas com Filtros (Angular 19 + PrimeNG)

Este projeto foi desenvolvido como parte de um desafio técnico. Ele apresenta uma aplicação Angular 19 com PrimeNG que exibe uma tabela paginada de **boletas de cotas de fundos**, com suporte a **filtros dinâmicos**, **ordenação** e **consumo de APIs públicas**.

## 🚀 Tecnologias Utilizadas

- [Angular 19](https://angular.io/)
- [PrimeNG](https://primeng.org/)
- [PrimeIcons](https://primefaces.org/primeicons/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 📦 Funcionalidades

- 📄 Tabela com paginação e ordenação
- 🔍 Filtros avançados com sobreposição (_overlay_)
- ⚡ Consumo de APIs públicas para preenchimento de filtros:
  - Cliente
  - Fundo
  - Situação
- 💡 Componente de filtros separado para maior reutilização
- 🧼 Código limpo e componentizado, seguindo boas práticas

## 🛠️ Como Rodar o Projeto
### 1. Pré-requisitos

- Node.js (versão 18+)
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli
```
### 2. Clonando o Repositório

```bash
git clone https://github.com/Mayaramafioletti/desafio-boletas.git 
cd desafio-boletas
```

### 3. Instalando Dependências
```bash
npm install
```

### 4. Rodando o Projeto Localmente
```bash
ng serve
```
A aplicação estará disponível em: http://localhost:4200

## 📌 Observações
- O projeto utiliza filtros dinâmicos com valores preenchidos por APIs externas documentadas via Swagger.
- Todos os campos da tabela são ordenáveis, paginados e filtráveis. 
- O sistema foi projetado com escalabilidade e legibilidade em mente.

💬 Em caso de dúvidas ou sugestões, fique à vontade para entrar em contato.
