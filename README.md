# 📧 Email Automation - Gerador de Templates HTML

Aplicação Next.js para geração automática de templates de email em HTML usando IA (Groq/Llama).

## ✨ Funcionalidades

- 🤖 Geração de emails em HTML com IA (Groq - **100% gratuito**)
- 💬 Chat interativo com contexto de conversa
- 🎨 Preview em tempo real do email
- 📋 Copiar HTML gerado
- 🔒 Sanitização de HTML para prevenir XSS e injection
- 📱 Interface totalmente responsiva

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

- Node.js 18+ ou [Bun](https://bun.sh)
- Conta gratuita no [Groq](https://console.groq.com)

### 2. Obter a Chave da API (Groq - Gratuito)

1. Acesse [https://console.groq.com](https://console.groq.com)
2. Faça login ou crie uma conta (gratuita)
3. Vá em **API Keys** no menu lateral
4. Clique em **Create API Key**
5. Copie a chave gerada (formato: `gsk_...`)

> **⚡ Por que Groq?** É 100% gratuito, extremamente rápido e compatível com o SDK da OpenAI!

### 3. Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd email-automation

# Instale as dependências
bun install
# ou
npm install
```

### 4. Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```env
GROQ_API_KEY=sua_chave_aqui
```

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env.local` no Git!

### 5. Executar

```bash
# Modo desenvolvimento
bun dev
# ou
npm run dev
```

Acesse [http://localhost:3000/v1/email](http://localhost:3000/v1/email) no navegador.

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Groq API** - IA para geração de conteúdo (Llama 3.3)
- **DOMPurify** - Sanitização de HTML
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Sonner** - Notificações toast

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/generate-email/    # API Route com streaming
│   └── v1/email/               # Página principal
├── components/
│   ├── chat.tsx                # Interface de chat
│   └── code-preview.tsx        # Preview e código HTML
├── hooks/
│   └── use-generate-email.ts   # Hook customizado
├── lib/
│   └── utils.ts                # Utilitários
└── config/
    └── env.ts                  # Validação de env vars
```

## 🔒 Segurança

O projeto implementa múltiplas camadas de segurança:

- ✅ API Key no servidor (nunca exposta no cliente)
- ✅ Sanitização de input do usuário
- ✅ DOMPurify para HTML gerado
- ✅ Iframe com sandbox
- ✅ Validação de mensagens

## 📝 Como Usar

1. Digite a descrição do email desejado no chat
   - Exemplo: "Email promocional de desconto de 50% em tênis"
2. Aguarde a geração em tempo real
3. Visualize o preview ao vivo
4. Copie o HTML gerado
5. Faça ajustes conversando com a IA (mantém contexto!)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
