const express = require('express');
const path = require('path');
const app = express();

// Porta definida pelo Railway ou 3000 como fallback
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir todas as páginas HTML
app.get('/*.html', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
