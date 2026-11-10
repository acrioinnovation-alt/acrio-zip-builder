# ACRIO ZIP Builder

Ferramenta reutilizável da ACRIO para compactar projetos web para o MIA.

## Regra de segurança para os próximos projetos

**Não envie o código dos jogos ou aplicativos para este repositório público.**

O projeto que será compactado deve permanecer no repositório privado dele. Este repositório público contém apenas o workflow genérico que faz a compactação. O ZIP e o artefato da execução ficam no repositório que chamou o workflow — portanto, mantenha esse repositório privado.

## Como usar em um repositório privado

No repositório privado do jogo/aplicativo, crie o arquivo:

`.github/workflows/gerar-zip.yml`

Use este conteúdo como modelo e ajuste apenas a pasta e o nome do ZIP:

```yaml
name: Gerar ZIP para MIA

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  gerar:
    uses: acrioinnovation-alt/acrio-zip-builder/.github/workflows/gerar-zip.yml@main
    with:
      pasta_origem: "CAMINHO/DA/PASTA/DO/PROJETO"
      nome_zip: "nome-do-projeto"
```

Exemplo: se o `index.html` estiver em `app/src/main/assets/www/`, informe esse caminho em `pasta_origem`.

Depois, no repositório privado, abra **Actions → Gerar ZIP para MIA → Run workflow**. Baixe o ZIP em **Artifacts** dessa execução. Como a execução acontece no repositório privado que chamou a ferramenta, o artefato segue as permissões desse repositório.

## Requisitos do projeto

- A pasta indicada deve conter um `index.html` na raiz.
- Todos os arquivos necessários ao jogo devem estar dentro dessa pasta.
- O ZIP será montado com o conteúdo dessa pasta na raiz, sem a pasta externa.
- Para funcionar offline, o jogo não pode depender de arquivos hospedados apenas em serviços externos.

## Atenção

Não coloque senhas, tokens ou chaves no código. Nunca torne público um repositório que contenha código proprietário. Antes de cada novo projeto, confirme que o repositório de origem está privado e que a execução do workflow foi iniciada nele.
