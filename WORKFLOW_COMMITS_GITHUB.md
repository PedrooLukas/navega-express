# Workflow Profissional de Commits no GitHub

Este guia define um fluxo simples e auditável para manter o histórico de mudanças limpo, rastreável e profissional.

## 1. Atualizar a base local

```bash
git checkout main
git pull origin main
```

## 2. Criar uma branch por tarefa

Use uma branch dedicada para cada mudança:

- `feat/nome-curto-da-feature`
- `fix/nome-curto-do-bug`
- `chore/nome-da-tarefa-tecnica`

Exemplos:

- `feat/login-google`
- `fix/token-expirado`

## 3. Fazer mudanças pequenas e coesas

- Cada commit deve representar uma intenção clara.
- Evite commits gigantes com vários assuntos misturados.

## 4. Usar padrão de commit (Conventional Commits)

Formato:

```text
tipo(escopo): resumo curto
```

Tipos recomendados:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `refactor`: melhoria interna sem mudar comportamento externo
- `test`: testes
- `chore`: tarefas de manutenção

Exemplos:

- `feat(auth): adiciona login com Google`
- `fix(api): corrige tratamento de token expirado`
- `docs(readme): atualiza instruções de setup`

## 5. Commitar de forma consistente

```bash
git add .
git commit -m "feat(pagamento): adiciona validação de cartão"
```

Quando necessário, adicione corpo no commit explicando:

- o que mudou
- por que mudou
- impacto esperado

## 6. Publicar a branch

```bash
git push -u origin nome-da-branch
```

## 7. Abrir Pull Request (PR)

A descrição do PR deve conter:

- contexto do problema
- principais alterações realizadas
- como testar
- evidências (prints, logs, vídeos), se aplicável

Sempre relacione issue/ticket:

```text
Closes #123
```

### Exemplo prático de PR

Título do PR:

```text
feat(auth): adiciona login com Google
```

Descrição do PR:

```markdown
## Contexto
Usuários precisavam de uma forma mais rápida de autenticação sem criar senha local.

## O que foi alterado
- adicionada integração com OAuth do Google no backend
- criado botão "Entrar com Google" na tela de login
- ajustado fluxo de criação de usuário no primeiro acesso

## Como testar
1. Acesse a tela de login
2. Clique em "Entrar com Google"
3. Conclua autenticação com uma conta válida
4. Verifique redirecionamento para dashboard

## Evidências
- print da tela de login com botão Google
- log de autenticação bem-sucedida

Closes #123
```

## 8. Passar por code review

- Ter ao menos 1 aprovação.
- Responder e aplicar feedbacks.
- Manter discussão e decisões registradas no PR.

## 9. Exigir checks automáticos (CI)

Antes do merge:

- lint
- testes
- build

Merge somente com checks verdes.

## 10. Fazer merge com padrão definido

Recomendação comum: **Squash and Merge** para manter o histórico da `main` limpo.

## 11. Versionar releases quando necessário

- Seguir versionamento semântico (`v1.4.0`, `v1.4.1`).
- Publicar release notes no GitHub.

---

## Checklist rápido antes do merge

- [ ] Branch atualizada com `main`
- [ ] Commits com padrão e mensagens claras
- [ ] PR preenchido com contexto e teste
- [ ] Code review aprovado
- [ ] CI verde (lint/test/build)
- [ ] Merge seguindo padrão do time
