# Habitta Mobile

Este projeto utiliza variáveis de ambiente para configuração do backend e integração com o banco de dados. Para garantir segurança e facilitar o setup para novos desenvolvedores, siga as instruções abaixo:

## 1. Configuração do arquivo `.env`

- O arquivo `.env` **NÃO** deve ser versionado no repositório.
- Um arquivo de exemplo chamado `.env.example` está disponível no projeto. Copie-o e renomeie para `.env`.
- Preencha as variáveis com seus dados reais de acesso ao banco e configurações locais.

Exemplo de `.env.example`:

```
DATABASE_URL=postgres://usuario:senha@host:porta/db
PORT=3001
```

## 2. Inicialização do backend

O backend (API Node.js/Express) **não fica rodando o tempo todo**. Sempre que for desenvolver ou testar funcionalidades que dependem do banco de dados, execute:

```bash
cd backend
npm install # (apenas na primeira vez ou quando houver novas dependências)
npm start
```

O backend será iniciado na porta definida no `.env` (padrão: 3001).
