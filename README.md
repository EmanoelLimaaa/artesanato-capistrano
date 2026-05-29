# Artesanato de Capistrano

> Vitrine digital para valorizar, divulgar e conectar os artesãos de **Capistrano - CE**.

O projeto reúne um **catálogo público** de peças artesanais e um **painel administrativo** para que artesãos possam gerenciar seus produtos, dados do perfil e poder editar.

---

## ✨ Visão Geral

| Área | Descrição |
| --- | --- |
| 🛍️ Catálogo público | Exibe peças artesanais, filtros, busca e detalhes dos produtos |
| 👤 Painel do artesão | Permite cadastrar, editar e remover produtos |
| 🔐 Autenticação | Login e cadastro com Supabase Auth |
| 🖼️ Imagens | Upload de fotos de perfil e produtos via Supabase Storage |
| 📱 Responsividade | Interface adaptada para desktop e mobile |

---

## 🎓 Contexto Universitário & Impacto Social

Este repositório é o resultado prático do meu **Portfólio Individual - Projeto de Extensão II** do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

Projetos de extensão têm como objetivo aproximar o conhecimento acadêmico da comunidade. A proposta aqui foi transformar conceitos estudados em sala em uma solução real, com foco em impacto social, inclusão digital e valorização da cultura local.

### 📌 O Problema

Artesãos e produtores locais de **Capistrano (CE)** não possuíam uma plataforma digital centralizada para divulgar seus trabalhos. Isso limitava o alcance das vendas, a visibilidade dos produtos e a preservação da cultura artesanal da região.

### 💡 A Solução

Foi desenvolvido um ecossistema web com:

- **Catálogo Público** para dar visibilidade às peças artesanais.
- **Painel Administrativo** para facilitar o gerenciamento de produtos e dados dos artesãos.
- **Contato via WhatsApp** para aproximar clientes e produtores.
- **Banco de dados e armazenamento em nuvem** usando Supabase.

## 🚀 Aprendizado Técnico e Contribuição Profissional

Desenvolver este projeto do zero foi muito bom para modelar ainda mais minhas habilidades na jornada como desenvolvedor. Mais do que passar em uma disciplina, o objetivo foi encarar os desafios reais de engenharia que o mercado exige: configurar **autenticação segura**, gerenciar um **banco de dados relacional**, manipular **armazenamento de arquivos (Storage)** e garantir um **pipeline de deploy automatizado**.

Abaixo, destaco como essa experiência moldou minhas habilidades em quatro pilares fundamentais:

### 1. 📐 Git & Commits Semânticos (O Maior Salto)
Como eu não vinha utilizando padrões de escrita semântica no Git em projetos anteriores, decidi consumir conteúdos sobre boas práticas de versionamento para aplicar aqui. O uso estrito do **Conventional Commits** (`feat`, `fix`, `style`, `chore`, `refactor`) mudou completamente minha forma de trabalhar:
* Parei de acumular alterações gigantescas em um único commit.
* Aprendi a isolar os escopos (ex: separar o menu do catálogo do menu do painel).
* O histórico do meu repositório virou um diário técnico limpo, legível e de nível profissional.

### 2. 🗄️ Backend Sem Complicação com Supabase
Interagir com o Supabase me deu uma visão prática a mais de backend e infraestrutura. Tive a experiência de:
* Estruturar tabelas relacionais eficientes no banco de dados.
* Configurar o **Supabase Storage** para lidar com o upload e renderização de imagens dos artesanatos de forma otimizada.
* Compreender o fluxo de requisições e consumo de APIs no ecossistema do React.

### 3. 🏗️ Arquitetura e Organização de Código
Criar duas interfaces distintas (o Catálogo voltado para o cliente e o Painel para o administrador) exigiu maturidade na organização do projeto. 
* Organizei pastas de forma intuitiva, mantendo rotas e serviços do Supabase bem isolados, facilitando manutenções futuras sem quebrar a aplicação.

### 4. 🚀 Resolução de Problemas no Mundo Real (Deploy)
Enfrentar erros de deploy na Vercel (como o comportamento de rotas que quebravam ao mudar a página) me forçou a entender como servidores de hospedagem estática funcionam na prática. A resolução inteligente usando o `vercel.json` me deu autonomia para diagnosticar e fixar bugs de ambiente de produção sozinho.

---

### 🎯 Objetivos Conquistados

- 🌱 Incentivo à economia criativa local.
- 🤝 Apoio à inclusão digital de artesãos.
- 🧭 Valorização da cultura e identidade regional.
- 🛠️ Aplicação prática de React, Vite, Tailwind CSS e Supabase.
- 🚀 Domínio de versionamento profissional com Conventional Commits e deploy automatizado na Vercel.

---

## 🚀 Funcionalidades

- 🔎 Busca por peça, artesão, descrição, técnica ou categoria.
- 🧺 Filtros por materiais como argila, tecido, madeira, palha e outros.
- 📦 Modal com detalhes do produto, preço estimado e dados do artesão.
- 💬 Contato direto com o artesão pelo WhatsApp.
- 📝 Cadastro e login de artesãos.
- 🧑‍🎨 Painel privado para edição de perfil.
- ➕ Publicação de novas peças artesanais.
- 🗑️ Remoção de produtos cadastrados.
- 📷 Upload de imagens de produtos e foto de perfil.
- 📱 Layout responsivo para diferentes tamanhos de tela.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
| --- | --- |
| React 18 | Construção da interface |
| Vite | Ambiente de desenvolvimento e build |
| Tailwind CSS | Estilização responsiva |
| React Router DOM | Rotas da aplicação |
| Supabase Auth | Cadastro e login |
| Supabase Database | Armazenamento dos dados |
| Supabase Storage | Upload e exibição de imagens |
| Lucide React | Ícones da interface |
| ESLint | Padronização e análise do código |

---

## 🧭 Rotas da Aplicação

| Rota | Descrição |
| --- | --- |
| `/catalogo` | Catálogo público com produtos dos artesãos |
| `/cadastro` | Cadastro de novos artesãos |
| `/login` | Login dos artesãos cadastrados |
| `/painel` | Painel privado para gerenciar perfil e produtos |
| `/` | Redireciona para `/catalogo` |

---

## ⚙️ Como Executar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd artesanato-capistrano
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Inicie o projeto

```bash
npm run dev
```

Depois, acesse o endereço exibido no terminal.

---

## 📁 Estrutura Principal

```text
src/
  assets/             # Imagens e arquivos estáticos
  lib/
    supabase.js       # Configuração do cliente Supabase
  pages/
    Cadastro.jsx      # Tela de cadastro
    Catalogo.jsx      # Catálogo público
    Login.jsx         # Tela de login
    Painel.jsx        # Painel do artesão
  services/
    authService.js    # Funções de autenticação
    ProductService.js # Funções auxiliares de produtos/upload
  App.jsx             # Rotas da aplicação
  main.jsx            # Entrada da aplicação
```

---

## 🗄️ Configuração Esperada no Supabase

A aplicação espera um projeto Supabase com autenticação por e-mail/senha, tabelas para artesãos e produtos, além de buckets para armazenamento de imagens.

### Tabela `artesaos`

- `id`
- `nome`
- `especialidade`
- `biografia`
- `whatsapp`
- `telefone`
- `email`
- `foto_perfil`

### Tabela `produtos`

- `id`
- `artesao_id`
- `nome`
- `descricao`
- `categoria`
- `preco`
- `preco_sugerido`
- `imagem`

### Buckets de Storage

| Bucket | Uso |
| --- | --- |
| `produtos` | Imagens das peças cadastradas |
| `imagens` | Fotos de perfil dos artesãos |

---

## ☁️ Deploy

O projeto possui configuração para deploy na **Vercel**.

Antes de publicar, cadastre no painel da Vercel as mesmas variáveis usadas no `.env.local`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🌵 Objetivo Final

Promover uma vitrine acessível para o artesanato de Capistrano, aproximando produtores locais de pessoas interessadas em peças únicas, cultura regional e comércio direto.

> Tecnologia também pode ser ponte entre tradição, comunidade e oportunidade.
