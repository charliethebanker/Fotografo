# 🔧 Configuração do Workflow n8n para Suportar API Keys de Utilizador

Este documento explica como modificar o seu workflow n8n existente para aceitar API keys de utilizadores individuais, permitindo que cada pessoa use a sua própria quota do Google AI Studio.

---

## 📋 Visão Geral

### **O Que Mudou?**

A aplicação frontend agora envia um campo adicional chamado `apiKey` junto com a imagem:

```javascript
FormData:
  - file: [imagem do utilizador]
  - apiKey: "AIzaSy..." (opcional)
```

Se o utilizador não tiver configurado uma API key, o campo `apiKey` **não será enviado** no request, permitindo que o workflow use uma configuração padrão (fallback).

---

## 🛠️ Modificações Necessárias no n8n

### **Passo 1: Receber a API Key no Webhook**

O seu webhook n8n já recebe a imagem. Agora também receberá o campo `apiKey` (quando disponível).

**Acesso ao campo:**
- **FormData**: `{{$json.apiKey}}`
- **JSON**: `{{$json.body.apiKey}}`

---

### **Passo 2: Configurar Lógica Condicional (Recomendado)**

Use um nó **IF** ou **Switch** para decidir qual API key usar:

#### **Opção A: IF Node (Simples)**

```
┌─────────────┐
│   Webhook   │ (recebe file + apiKey)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  IF Node    │ (verifica se apiKey existe)
└──────┬──────┘
       │
       ├─── TRUE ──► Use apiKey do utilizador
       │
       └─── FALSE ─► Use sua API key padrão
```

**Configuração do IF Node:**
- **Condition**: `{{ $json.apiKey }}` **is not empty**
- **TRUE branch**: Usa `{{ $json.apiKey }}`
- **FALSE branch**: Usa sua key hardcoded ou variável de ambiente

---

#### **Opção B: Set Node com Fallback (Mais Limpo)**

Adicione um nó **Set** logo após o Webhook:

```javascript
// Set Node - Campo: finalApiKey
{{ $json.apiKey || $env.GOOGLE_AI_API_KEY }}
```

Isso define:
- Se `apiKey` existir → usa a key do utilizador
- Se `apiKey` for vazio/null → usa `$env.GOOGLE_AI_API_KEY` (sua key padrão)

---

### **Passo 3: Modificar o Nó de Chamada ao Google AI**

Localize o nó onde você chama o Google Gemini Vision API e modifique para usar a API key dinâmica.

#### **Exemplo com HTTP Request Node:**

**Antes:**
```
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyXXXXXX
```

**Depois:**
```
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $('Set').item.json.finalApiKey }}
```

#### **Exemplo com Google Gemini Node (se disponível):**

Se estiver usando um nó nativo do Google Gemini:
- Vá para **Credentials**
- Ative a opção de **usar expressão**
- Cole: `{{ $('Set').item.json.finalApiKey }}`

---

### **Passo 4: Adicionar Tratamento de Erros (Opcional mas Recomendado)**

Adicione um nó **Error Trigger** para capturar erros relacionados à API key inválida:

```
┌─────────────────┐
│ Google AI Call  │
└────────┬────────┘
         │
         ├─── Success ──► Continue workflow
         │
         └─── Error ───► Error Trigger
                          └─► Return JSON:
                              {
                                "error": "API key inválida",
                                "message": "Verifique sua API key nas configurações"
                              }
```

---

## 📊 Exemplo de Workflow Completo

```
┌──────────────────┐
│  Webhook Trigger │ (POST /webhook/fotografo)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Set Node       │ (Define finalApiKey com fallback)
│                  │ finalApiKey = {{ $json.apiKey || $env.GOOGLE_AI_API_KEY }}
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Code Node       │ (Seus prompts e lógica existente)
│  (JavaScript)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  HTTP Request    │ (Chamada ao Google Gemini)
│                  │ URL: .../generateContent?key={{ $('Set').item.json.finalApiKey }}
│                  │ Body: { prompt: "...", image: "..." }
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Process Result  │ (Processar resposta do Gemini)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Return Result   │ { editedImage: "data:image/...", originalImage: "..." }
└──────────────────┘
```

---

## 🔐 Segurança e Boas Práticas

### ✅ **Recomendações**

1. **Nunca logue a API key completa** nos logs do n8n:
   ```javascript
   // ❌ Errado
   console.log('API Key:', apiKey);

   // ✅ Correto
   console.log('API Key configurada:', apiKey ? 'Sim (utilizador)' : 'Sim (padrão)');
   ```

2. **Valide a API key antes de usar**:
   ```javascript
   if (apiKey && !apiKey.startsWith('AIza')) {
     return {
       error: 'Formato de API key inválido'
     };
   }
   ```

3. **Implemente rate limiting** (opcional):
   - Use um nó **Redis** ou **Database** para rastrear uso por API key
   - Previne abuso de keys roubadas

4. **Configure timeout adequado**:
   - Google AI pode demorar 30-60 segundos para imagens grandes
   - Certifique-se que o timeout do webhook está em **120 segundos** (como no frontend)

---

## 🧪 Como Testar

### **Teste 1: Com API Key do Utilizador**

1. Configure uma API key válida na aplicação web
2. Faça upload de uma imagem
3. Verifique nos logs do n8n:
   ```
   ✅ API key do utilizador detectada
   ```

### **Teste 2: Sem API Key (Fallback)**

1. Remova a API key nas configurações da aplicação
2. Faça upload de uma imagem
3. Verifique nos logs do n8n:
   ```
   ⚠️ Usando API key padrão (fallback)
   ```

### **Teste 3: API Key Inválida**

1. Configure uma API key inválida (ex: `AIzaINVALID123`)
2. Faça upload de uma imagem
3. Deve retornar erro:
   ```json
   {
     "error": "API key inválida ou sem permissões"
   }
   ```

---

## 🐛 Troubleshooting

### **Problema: n8n não recebe o campo `apiKey`**

**Solução:**
1. Verifique se o webhook está configurado para aceitar **FormData** ou **JSON**
2. Adicione um nó **Code** logo após o webhook para debugar:
   ```javascript
   console.log('Dados recebidos:', $input.all());
   return $input.all();
   ```

---

### **Problema: Google AI retorna 403 (Forbidden)**

**Causas possíveis:**
1. API key inválida ou expirada
2. Quota excedida
3. Projeto do Google Cloud sem permissões para Gemini API

**Solução:**
- Valide a key no [Google AI Studio](https://aistudio.google.com/)
- Verifique quotas em [Google Cloud Console](https://console.cloud.google.com/)

---

### **Problema: Timeout (120 segundos)**

**Solução:**
1. Aumente o timeout no webhook n8n
2. Otimize o tamanho das imagens antes de enviar ao Google AI
3. Use Gemini 1.5 Flash (mais rápido) em vez de Pro

---

## 📝 Variáveis de Ambiente Recomendadas

Configure no n8n:

```bash
# Sua API key padrão (fallback)
GOOGLE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX

# Modelo a usar (opcional)
GEMINI_MODEL=gemini-1.5-flash

# Timeout para chamadas ao Google AI (ms)
GOOGLE_AI_TIMEOUT=60000
```

---

## ✅ Checklist de Implementação

- [ ] Webhook recebe campo `apiKey`
- [ ] Nó Set/IF implementa lógica de fallback
- [ ] Chamada ao Google AI usa API key dinâmica
- [ ] Tratamento de erros implementado
- [ ] Logs não expõem API keys completas
- [ ] Testado com API key do utilizador
- [ ] Testado com fallback (sem API key)
- [ ] Testado com API key inválida
- [ ] Timeout configurado (120s)
- [ ] Documentação interna atualizada

---

## 🎯 Próximos Passos (Opcional)

1. **Analytics**: Rastreie quantos utilizadores usam API key própria vs. padrão
2. **Quota Management**: Implemente sistema de limite de uso
3. **Multi-modelo**: Permita utilizador escolher entre Gemini Flash/Pro
4. **Cache**: Cache resultados para imagens repetidas

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do n8n em tempo real
2. Teste os endpoints manualmente com Postman/Insomnia
3. Valide a API key diretamente no [Google AI Studio](https://aistudio.google.com/)

**Boa sorte com a implementação! 🚀**
