# ARIA — Analista de Roleta IA

## Deploy na Vercel

### 1. Suba para o GitHub
- Crie um repositório no GitHub chamado `aria-roleta`
- Faça upload de todos estes arquivos mantendo a estrutura de pastas

### 2. Conecte ao Vercel
- Acesse vercel.com e clique em "Add New Project"
- Importe o repositório do GitHub
- Clique em "Deploy"

### 3. Configure a API Key
- No painel da Vercel, vá em Settings → Environment Variables
- Adicione: `ANTHROPIC_API_KEY` = sua chave `sk-ant-...`
- Clique em Save e faça Redeploy

### Estrutura de arquivos
```
aria-roleta/
├── components/
│   └── RoletaIA.jsx      ← Componente principal
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── api/
│       └── analyze.js    ← Proxy da API (protege sua chave)
├── styles/
│   └── globals.css
├── next.config.js
└── package.json
```
