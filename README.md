# ACRIO ZIP Builder

Compactador reutilizável de projetos web da ACRIO para importar no MIA.

## Como funciona

1. Coloque os arquivos completos de um jogo dentro de `projetos/NOME-DO-JOGO/`.
2. A página principal deve estar na raiz dessa pasta como `index.html`.
3. Abra **Actions → Gerar ZIP → Run workflow**.
4. Informe o nome da pasta e o nome do ZIP (sem `.zip`).
5. Ao terminar, baixe o arquivo na seção **Artifacts** da execução.

O ZIP é montado com os arquivos do projeto na raiz, sem a pasta externa, para o MIA localizar o `index.html`.

## Projetos incluídos

- `projetos/desafio-logico/`: versão publicada do Desafio Lógico.

## Compatibilidade offline

O compactador apenas reúne os arquivos. Para o jogo funcionar offline, todos os recursos usados pelo jogo precisam estar dentro da pasta do projeto e não depender de serviços externos. O APK gerado pelo MIA deve incluir esses arquivos localmente.

## Privacidade

Este repositório é público. Todo código e arquivo colocado nele poderá ser visto e copiado por qualquer pessoa. Não coloque senhas, chaves, dados pessoais ou conteúdo que não possa ser publicado.
