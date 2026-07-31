# Changelog — 2026-07-28 (review batch de 27/07)

Tudo abaixo está **em produção** (haus-creative.vercel.app). Lista no formato
do review para o Vitor conferir item a item. PRs: #83 (copy), #86 (tipografia),
#84 (asset MC).

## Textos (deleções pedidas no review)

- ✅ **Bucherer Fine Jewellery** ¶1 — "jewellery" deletado → "…for each collection."
- ✅ **Bucherer Fine Jewellery** ¶2 — "each" e "aspirations" deletados → "…personas, defined by their own lifestyle and attitude."
- ✅ **Bucherer Summer** ¶3 — "marketing communications" removido, "advertising" antes de "retail" → "…across advertising, retail, digital and social media."
- ✅ **YSL** último ¶ — "luxury" deletado → "…cohesive global identity."
- ✅ **BRIDE** ¶1 — "creative" deletado → "…multi-platform business."
- ✅ **Ouronyx** ¶2 — "elevated" deletado → "…audience and positioning."
- ✅ **Marie Claire** créditos — "(Studio Haus)" removido do nome.

## Tipografia / quebras de linha

- ✅ **Marie Claire** (desktop) — "back-to-office" não quebra mais no hífen; desce inteiro pra segunda linha.
- ✅ **Bucherer FJ** (desktop) — "we" desce pra segunda linha do ¶2; "e-commerce" nunca separa do "e-".
- ✅ **Vivara** (mobile) — "The" (¶1) e "I" (¶2) não ficam mais pendurados no fim da linha.
- ✅ **About** — corpo do texto 19px → 16px no desktop (entre o tamanho antigo e o das descrições dos cases); labels acompanham.
- ✅ **Extra (garantia):** as palavras-alvo do review (identity, collection, attitude, media, positioning, business) foram amarradas à palavra anterior — nunca mais ficam sozinhas na última linha, em **qualquer** largura de tela. Verificado medindo as linhas renderizadas em 1600×900 e 390×844.

## Assets

- ✅ **Marie Claire** — novo `MC_MOB_01` (versão 27/07, masthead centralizado) no hero mobile.

## Vídeos

- ✅ **Harrods (e todos os vídeos do site)** — o vídeo do jantar que "não tocava" no desktop: o clipe só começava a baixar quando entrava na tela (7,5 MB na hora = poster parado). Agora todo vídeo pré-carrega **uma tela antes** de aparecer — chega no viewport já com buffer e toca na hora, do frame 0 ([#77](https://github.com/RafaelMurad/haus-creative/issues/77)).

## 2026-07-31

- ✅ **Ouronyx** — os dois vídeos de entrevista (mulher + Daniel Ricciardo) substituídos pelos re-exports do Di: 720×900 com o áudio real da entrevista — botão de som ativo nos dois ([#79](https://github.com/RafaelMurad/haus-creative/issues/79)).

- ✅ **Harrods** — o vídeo do jantar (par de cima) agora toca também no desktop, na mesma caixa da imagem (a foto vira o poster). Era o twin mobile-only da leitura antiga do pin no Figma.

- ✅ **Showreel na home** — o edit de 30/07 (1080p, mix completo) toca no topo da home no desktop, com botão de som. No mobile continua a imagem até chegar o edit vertical ([#81](https://github.com/RafaelMurad/haus-creative/issues/81)).

## Ainda aberto (não entrou neste deploy)
- ⏳ **Domínio** — esperando login do cPanel ([#80](https://github.com/RafaelMurad/haus-creative/issues/80)).
