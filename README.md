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

### Plantel: `plantel.csv`

O ficheiro `plantel.csv` neste repositório é o plantel oficial que a app lê
automaticamente sempre que abre com rede (e também há um botão para forçar a
sincronização a qualquer momento, na aba Plantel da app).

Para atualizar o plantel (entrada/saída de atleta, mudança de posição):

1. Abre `plantel.csv` neste repositório no GitHub.
2. Clica no lápis de editar (canto superior direito do ficheiro).
3. Edita as linhas — formato `num,nome,posicao`, uma linha por atleta. Posições
   válidas: `Guarda-Redes`, `Fixo`, `Ala`, `Pivô`, `Universal`.
4. **Commit changes** diretamente na branch `main`.
5. Da próxima vez que a app abrir com rede, atualiza-se sozinha (nunca remove
   ninguém automaticamente — só atualiza e acrescenta, para não perder o
   histórico de jogos de quem já saiu).

**Nota:** este CSV é a cópia mínima que a app usa (número, nome, posição). O
workbook Excel continua a ser o registo administrativo completo (contactos,
data de nascimento, ficha médica, etc.) — depois de atualizares o Excel, replica
as mesmas linhas aqui.

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
