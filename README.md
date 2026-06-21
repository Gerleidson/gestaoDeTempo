# Gestão de Tempo ⏱️

Um sistema web para gestão inteligente do seu tempo, com organização do dia em blocos de horário, cronograma semanal e categorização por áreas da vida. Planeje sua rotina, visualize a distribuição do seu dia e mantenha o equilíbrio entre as diferentes áreas da sua vida.

🔗 **Acesse:** [gestao-de-tempo-jet.vercel.app](https://gestao-de-tempo-jet.vercel.app/)

![Versão](https://img.shields.io/badge/versão-1.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Status](https://img.shields.io/badge/status-Ativo-brightgreen)
![Deploy](https://img.shields.io/badge/deploy-Vercel-black)

---

## 📋 Índice

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Autenticação e Dados](#-autenticação-e-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## ✨ Características

✅ **Autenticação de Usuários** - Cadastro e login com nome, e-mail e senha

✅ **Cronograma Semanal** - Visualize e organize seus blocos de tempo de domingo a sábado

✅ **Blocos de Tempo** - Crie blocos com horário, título, duração, área da vida e descrição

✅ **Áreas da Vida** - Categorize suas atividades por diferentes áreas (trabalho, saúde, estudos, lazer, etc.)

✅ **Distribuição do Dia** - Visualize como seu tempo está distribuído ao longo do dia

✅ **Múltiplas Visualizações** - Alterne entre visão geral, cronograma e áreas da vida

✅ **Interface Responsiva** - Design moderno e adaptável a diferentes tamanhos de tela

---

## 🛠️ Stack Tecnológico

| Tecnologia | Descrição |
|-----------|-----------|
| **React / Next.js** | Construção da interface (ajuste conforme sua stack real) |
| **Firebase Authentication** | Autenticação de usuários (e-mail/senha) |
| **Firebase Firestore / Realtime Database** | Armazenamento e sincronização dos blocos de tempo |
| **Vercel** | Hospedagem e deploy contínuo |

> ℹ️ Ajuste a tabela acima para refletir exatamente o framework e as bibliotecas usadas no seu `package.json`.

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ instalado
- Conta no [Firebase](https://firebase.google.com/) com um projeto criado (caso utilize Firebase)
- Conta na [Vercel](https://vercel.com/) (para deploy)

---

## 🚀 Instalação

### Clone do repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gestao-de-tempo.git

# Acesse o diretório
cd gestao-de-tempo

# Instale as dependências
npm install
```

### Executando localmente

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

---

## 💻 Como Usar

### Primeiros passos

1. **Acesse o site** ou rode localmente
2. **Crie uma conta** com nome completo, e-mail e senha
3. **Faça login** para acessar seu painel pessoal
4. **Crie blocos de tempo** definindo horário, título, duração, área da vida e descrição
5. **Acompanhe seu cronograma semanal** e a distribuição do seu dia

### Fluxo Operacional

```
Gestão de Tempo
├── Visualização → Visão geral da rotina
├── Cronograma → Organização semanal (Dom a Sáb) por blocos de horário
│   └── Novo Bloco → Horário, Título, Duração, Área, Descrição
└── Áreas da Vida → Categorias para classificar os blocos de tempo
```

---

## 📁 Estrutura do Projeto

> Estrutura sugerida — ajuste conforme a organização real do seu projeto.

```
gestao-de-tempo/
├── src/ (ou pages/, app/)
│   ├── components/
│   │   ├── Schedule.jsx          # Componente de cronograma semanal
│   │   ├── BlockModal.jsx        # Modal de criação/edição de bloco
│   │   ├── DayDistribution.jsx   # Visualização da distribuição do dia
│   │   └── LifeAreas.jsx         # Gestão das áreas da vida
│   ├── services/
│   │   └── firebase.js            # Configuração e conexão com Firebase
│   ├── contexts/
│   │   └── AuthContext.jsx        # Contexto de autenticação
│   └── App.jsx
├── public/
├── .env.local                     # Variáveis de ambiente (não versionado)
├── package.json
└── README.md
```

---

## 🎯 Funcionalidades

### Visualização
- Painel geral com resumo da gestão pessoal de tempo

### Cronograma
**Operações:**
- ✅ Criar novo bloco de tempo
- ✅ Editar bloco existente
- ✅ Remover bloco
- ✅ Visualizar distribuição do dia
- ✅ Navegar entre os dias da semana (Dom, Seg, Ter, Qua, Qui, Sex, Sáb)

**Campos do Bloco:**
```
- Horário
- Título
- Duração
- Área (vinculada às Áreas da Vida)
- Descrição
```

### Áreas da Vida
- Categorização das atividades por área (ex: trabalho, saúde, estudos, família, lazer)
- Permite visualizar como o tempo está distribuído entre as diferentes áreas

---

## 🔐 Autenticação e Dados

O sistema utiliza autenticação por e-mail e senha para proteger os dados de cada usuário. Os blocos de tempo e áreas da vida cadastrados ficam vinculados à conta autenticada, permitindo acesso a partir de diferentes dispositivos quando os dados são armazenados na nuvem.

> ℹ️ Atualize esta seção com o método de autenticação/persistência real utilizado (Firebase, Supabase, API própria, etc.).

---

## 🔑 Variáveis de Ambiente

Caso utilize Firebase, crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

> ⚠️ Nunca versione o arquivo `.env.local`. Adicione-o ao `.gitignore`.

---

## ☁️ Deploy

O projeto está hospedado na **Vercel**:

```bash
# Instale a CLI da Vercel (opcional)
npm i -g vercel

# Faça o deploy
vercel
```

Caso utilize variáveis de ambiente, lembre-se de configurá-las também no painel da Vercel (*Project Settings → Environment Variables*).

---

## ❓ Troubleshooting

### "Erro de autenticação ao logar"
**Solução:** Verifique se o método de login (e-mail/senha) está habilitado corretamente no provedor de autenticação

### "Blocos de tempo não aparecem após login"
**Solução:** Confira as regras de segurança do banco de dados e se as variáveis de ambiente estão corretas

### "Erro ao fazer build na Vercel"
**Solução:** Confirme se todas as variáveis de ambiente foram adicionadas no painel da Vercel

### "Página carrega em branco"
**Solução:**
- Abra o DevTools (F12)
- Verifique a aba Console para erros
- Limpe o cache do navegador (Ctrl+Shift+Del)

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

**Passos rápidos:**
1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Gerleidson**

---

<div align="center">

**[⬆ Voltar ao topo](#gestão-de-tempo-)**

</div>
