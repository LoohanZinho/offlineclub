# 🔔 Guia de Notificação para IAs (Cursor, Lovable, v0, Antigravity, etc.)

Este documento contém as instruções técnicas para que qualquer IA com acesso à internet possa enviar notificações push diretamente para o seu celular Android/iPhone.

## 🚀 Como me notificar?

Sempre que você terminar uma tarefa importante ou precisar do meu feedback, execute um comando `curl` para o endpoint abaixo.

### 📋 Dados de Acesso
- **Endpoint:** `https://khzparswbsatflobnuim.supabase.co/functions/v1/notify`
- **Método:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoenBhcnN3YnNhdGZsb2JudWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDc3MDIsImV4cCI6MjA4MjA4MzcwMn0.94YfSrr7o7gLc6SSox9QYtTt6Jp0Of7Wda0SAJHNOWU`

### 📱 Token do Dispositivo (@Loohansb)
`c-h6cuonQOS7cMSajWy4QO:APA91bFAa_DfDD5Bs4rLMyjrFAKbRAPEEVay8aWIuiC78k1ZQ_F8Q9IZTaPn7r2NBKr_O9U-qWXDzP_RVpGJuwrTI5awgPorAVZ07SM-gLx4LmpKASjRzDs`

---

## 📝 Formato Correto do JSON

```bash
curl -X POST "https://khzparswbsatflobnuim.supabase.co/functions/v1/notify" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoenBhcnN3YnNhdGZsb2JudWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDc3MDIsImV4cCI6MjA4MjA4MzcwMn0.94YfSrr7o7gLc6SSox9QYtTt6Jp0Of7Wda0SAJHNOWU" \
  -d '{
    "device_token": "c-h6cuonQOS7cMSajWy4QO:APA91bFAa_DfDD5Bs4rLMyjrFAKbRAPEEVay8aWIuiC78k1ZQ_F8Q9IZTaPn7r2NBKr_O9U-qWXDzP_RVpGJuwrTI5awgPorAVZ07SM-gLx4LmpKASjRzDs",
    "content": {
      "title": "✅ Título da Notificação",
      "body": "Mensagem detalhada aqui. Máx ~400 caracteres para boa visualização."
    }
  }'
```

---

## ⚠️ Regras Importantes
1. **Resumo Visual (Fechada)**: O `body` corta em torno de **45-50 caracteres**. Seja direto no início.
2. **Visão Expandida**: O Android mostra até **8 linhas** (aprox. **400-500 caracteres**). 
3. **Emoji no Título**: Use emojis para facilitar identificação (ex: ✅ Sucesso, ❌ Erro, 🚀 Deploy, 🔧 Fix).
4. **Estrutura do JSON**: Use `device_token` e `content: { title, body }` - exatamente como no exemplo acima.

---

## ✅ Exemplos de Uso

### Deploy Concluído
```json
{
  "device_token": "...",
  "content": {
    "title": "🚀 Deploy Concluído - Projeto X",
    "body": "Build bem-sucedido! Alterações: 3 arquivos, 250 linhas. URL: https://exemplo.com"
  }
}
```

### Erro Encontrado
```json
{
  "device_token": "...",
  "content": {
    "title": "❌ Erro no Build - Projeto X",
    "body": "Falha na compilação. Erro: syntax error na linha 42 de app.js. Favor revisar."
  }
}
```

### Tarefa Concluída
```json
{
  "device_token": "...",
  "content": {
    "title": "✅ Tarefa Finalizada",
    "body": "Implementação do tracking completa: 17 botões rastreados, Firebase+GA4 integrados, admin corrigido!"
  }
}
```

---

## 🧪 Testado e Funcionando

✅ **Status:** Funcionando perfeitamente!  
✅ **Última atualização:** 2026-01-01  
✅ **Teste realizado:** Notificação enviada com sucesso via Antigravity