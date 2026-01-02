# 🚀 Guia de Deploy - Offline Club

## 📦 Deploy no Railway

### Método 1: Via GitHub (Recomendado)

1. **Faça push das alterações para o GitHub:**
   ```bash
   git add .
   git commit -m "Adiciona configuração para Railway"
   git push origin main
   ```

2. **No Railway:**
   - Acesse: https://railway.app
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `offlineclub`
   - Railway irá detectar automaticamente e fazer deploy

### Método 2: Via Railway CLI

1. **Instale o Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Inicialize e faça deploy:**
   ```bash
   railway init
   railway up
   ```

4. **Gere domínio público:**
   ```bash
   railway domain
   ```

## 🖥️ Rodar Localmente

### Opção 1: Python (Simples)
```bash
python3 -m http.server 8000
```
Acesse: http://localhost:8000

### Opção 2: Node.js (Produção)
```bash
npm install
npm start
```
Acesse: http://localhost:3000

## 📝 Variáveis de Ambiente

Se você usar Firebase em produção, adicione no Railway:
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- Outras configurações do Firebase conforme necessário

## 🔧 Troubleshooting

- **Porta incorreta:** Railway define `PORT` automaticamente
- **Arquivos não carregam:** Verifique paths relativos nos HTMLs
- **Firebase não conecta:** Configure variáveis de ambiente no Railway
