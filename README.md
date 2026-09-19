# Banco Sub-15 — Futsal

App de registo rápido de jogo para a equipa técnica: convocatórias, golos, cartões,
substituições, minutos jogados e atendimentos a lesionados — tudo em poucos toques,
sem depender de internet durante o jogo.

**App publicada:** https://antunhag.github.io/AAL-NEW/

Faz parte do sistema de gestão do escalão Sub-15, que também inclui:

- **Workbook Excel** ("Gestão Sub-15 — Futsal") — a fonte única de verdade do plantel,
  calendário e estatísticas da época. É este ficheiro que decide quem está no plantel;
  a app importa dele, nunca o contrário.
- **Modelos de convocatória** para WhatsApp, gerados a partir do calendário.

## Como funciona

A app corre inteiramente no telemóvel (HTML/CSS/JS, sem servidor). Os dados de cada
jogo ficam guardados no armazenamento local do telemóvel (`localStorage`) — por isso
funciona sem sinal, mas também por isso **não sincroniza sozinha** entre aparelhos.

Fluxo normal de utilização:

1. **Plantel** — importa a lista de atletas colando as linhas do Excel (Nº, Nome,
   Posição). Não editar o plantel "no ar" — o Excel é que manda.
2. **Pré-Jogo** — escolhe o adversário, os convocados e o cinco inicial.
3. **Jogo** — regista golos, cartões, faltas, substituições e atendimentos com toques
   rápidos. O relógio de cada parte começa do 00:00; as pausas pedem sempre um motivo
   (pedido de tempo).
4. **Resumo** — no fim, copia o resumo e envia para o chat com o Claude para atualizar
   o workbook (folha "Jogo - Registo").

## Como atualizar esta app

Esta pasta (`index.html`, `manifest.json`, `sw.js`, `icons/`) é publicada tal e qual
pelo GitHub Pages. Para publicar uma versão nova:

1. Substitui os ficheiros neste repositório pelos novos (o Claude prepara-os).
2. **Importante:** o `sw.js` tem uma constante `CACHE` (ex.: `"banco-sub15-v2"`) —
   tem de mudar a cada atualização, senão os telemóveis continuam a mostrar a versão
   antiga guardada em cache.
3. Aguarda ~1 minuto pelo GitHub Pages e testa em `https://antunhag.github.io/AAL-NEW/`.

## Instalar no telemóvel

Abre o link acima no Safari (iPhone) ou Chrome (Android) → Partilhar/Menu →
"Adicionar ao Ecrã Principal". A partir daí funciona como uma app instalada.
