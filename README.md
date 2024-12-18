# 🍴 recipeCost

O **recipeCost** é uma aplicação projetada para ajudar na precificação de receitas culinárias. Com base na quantidade e no preço de cada ingrediente, o sistema calcula o custo total, tornando mais fácil precificar produtos para venda.

## 🚀 Tecnologias utilizadas

Atualmente, o projeto possui apenas o backend finalizado utilizando as seguintes tecnologias:
- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite
- Zod

## 🛠 Funcionalidades

- Criação de receitas
- Remoção de receitas
- Cadastro de ingredientes em receitas
- Remoção de ingredientes de receitas
- Cálculo automático do custo total a partir de operações de CRUD sobre ingredientes

## 📂 Estrutura do projeto

```
recipeCost/server/ 
├── src/ 
│ ├── controllers/ # Controladores responsáveis pela lógica principal da aplicação. 
│ ├── middleware/ # Middlewares para validação de requisições e para erros. 
│ ├── models/ # Modelos representando as entidades do banco de dados. 
│ ├── routes/ # Definição das rotas da aplicação. 
│ ├── schemas/ # Esquemas para validação de dados (Zod). 
│ ├── services/ # Serviços com lógica reutilizável e de integração. 
│ └── utils/ # Funções auxiliares e utilitárias. 
│ └── server.ts # Configuração principal do servidor. 
├── prisma/ 
│ └── schema.prisma # Definição do esquema do banco de dados. 
└── README.md 
```

## 📝 Como Executar o Projeto  

### Pré-requisitos  

- [Node.js](https://nodejs.org/) instalado  
- Banco de dados SQLite configurado  
- Gerenciador de pacotes **npm** ou **yarn**

### Passo a Passo  

1. Clone o repositório:  

   ```bash
   git clone https://github.com/albert-rafa/recipeCost.git
   cd recipeCost/server
   ```  

2. Instale as dependências:  

   ```bash
   npm install
   # ou
   yarn install
   ```  

3. Configure as variáveis de ambiente:  

   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes informações:  
   ```env
   DATABASE_URL=seu_url_do_banco_de_dados
   ```  

4. Configure o banco de dados:  

   ```bash
   npx prisma migrate dev
   ```  

5. Inicie o servidor:  

   ```bash
   npm run dev
   # ou
   yarn dev
   ```  

6. Acesse a aplicação:  

   O servidor estará rodando em `http://localhost:3333`. 

## 📄 Licença  

Este projeto está sob a licença [MIT](LICENSE).  