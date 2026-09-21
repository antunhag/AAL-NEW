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

### ⚠️ Cópia de segurança — importante

Um novo deploy dos ficheiros nesta pasta **nunca apaga** o que está guardado no
telemóvel (plantel, jogo em curso, histórico) — deploy e armazenamento local são
coisas completamente separadas. O que apaga os dados é:

- Remover o ícone da app do ecrã principal e adicionar de novo (o iOS trata isso
  como uma instalação nova, com armazenamento vazio).
- O telemóvel limpar "dados de navegação/site" (manualmente, ou automaticamente
  ao fim de várias semanas sem abrir a app).
- Trocar de telemóvel.

Por isso a aba **Plantel** tem um botão **"📤 Descarregar backup"** — usa-o depois
de cada jogo (ou sempre que quiseres testar uma app nova). O ficheiro `.json`
descarregado pode ser restaurado a qualquer momento com **"📥 Restaurar backup"**,
mesmo numa instalação completamente nova.

### Descarregar jogos/backups no iPhone

A partir da versão `v8`, os botões "Descarregar" (jogo, histórico, backup) tentam
primeiro abrir a folha de Partilha do sistema (Partilhar / Guardar em Ficheiros),
com o nome do ficheiro correto (ex.: `jogo_AdversarioX.txt`). Antes disto, no
Safari em modo de app instalada, o telemóvel por vezes ignorava o nome pedido e
guardava a própria página da app como `Banco Sub-15.html` — isso ficou corrigido.
Em computador/Android continua a descarregar normalmente pelo navegador.

### Plantel: `plantel.csv`

O ficheiro `plantel.csv` neste repositório é o plantel oficial que a app lê
automaticamente sempre que abre com rede (e também há um botão para forçar a
sincronização a qualquer momento, na aba Plantel da app).

**Atenção aos números repetidos:** cada atleta precisa de um número diferente
no ficheiro. A partir da versão `v9`, se dois atletas tiverem o mesmo número
por engano, a app já não apaga nenhum deles silenciosamente — cria os dois
(pode ficar um duplicado a mais por engano de nome, mas nunca perde ninguém) e
mostra um aviso "⚠️ nº repetido" no ecrã. Ainda assim, o correto é corrigir o
número no `plantel.csv` assim que possível.

### Novidades da versão `v10`

- **Duração de cada parte + validação de minutos.** Ao carregar em "Fim da Parte",
  a app grava a duração real dessa parte e os minutos jogados por cada atleta
  *só nessa parte*, e mostra logo uma linha de validação (soma de minutos-jogador
  vs. 5 × duração da parte) — se não bater certo, sinal de que alguém ficou
  esquecido de entrar/sair na hora certa.
- **Jogadores em quadra também nos golos sofridos.** Antes só golos marcados
  por nós registavam quem estava em quadra; agora golos sofridos também.
- **Tipo de jogada em qualquer golo.** Depois de registar um golo (nosso ou
  sofrido) a app pergunta o tipo — Organização ofensiva, Transição, Livre,
  Penálti, Canto ou Própria baliza — opcional (dá para saltar). Isto já vem
  pronto a cruzar com as colunas "Tipo" da folha de estatísticas em Excel.

### Novidades da versão `v11`

- **Zona do golo.** Depois de escolher o tipo de jogada, a app pergunta em
  que zona do campo aconteceu o golo — uma grelha numerada de 1 a 12 (3
  colunas × 4 linhas de profundidade), também opcional (dá para saltar).
  Fica registada junto do golo (nosso ou sofrido) e aparece no resumo e nas
  correções, tal como o tipo. **Jogos já arquivados antes desta versão não
  ganham este campo retroativamente** — só golos registados a partir de
  agora (ao vivo ou por correção) podem ter zona.

### Novidades da versão `v12`

- **Botão "🗓️ Gerar timeline"** na aba Resumo (jogo em curso) e em cada jogo
  do histórico. Descarrega uma página HTML à parte — sem depender da app —
  com uma linha do tempo visual por atleta: uma barra a mostrar exatamente
  quando esteve em campo em cada parte, com os golos (⚽, com tipo e zona),
  cartões e faltas marcados no minuto exato. É calculada sozinha a partir do
  registo cronológico do jogo (substituições, cartões, faltas, golos) —
  nada de preencher grelha de minutos à mão. Abre em qualquer navegador e
  pode ser partilhada como ficheiro.

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
2. **Importante:** o `sw.js` tem uma constante `CACHE` (ex.: `"banco-sub15-v12"`) —
   tem de mudar a cada atualização.
3. Aguarda ~1 minuto pelo GitHub Pages e testa em `https://antunhag.github.io/AAL-NEW/`.

**Se a app abrir e parecer "antiga" logo a seguir a um deploy:** a partir da versão
`v7`, a app abre sempre a versão mais recente sempre que há rede (só usa a cópia
guardada no telemóvel quando está mesmo offline) — por isso isto já não devia
acontecer. Se ainda assim acontecer, é sinal de rede fraca nesse instante; fecha e
volta a abrir passado uns segundos. (Em versões anteriores a `v7`, a app mostrava
sempre a cópia em cache primeiro, mesmo com rede — por isso podia parecer "presa"
numa versão antiga durante algum tempo depois de um deploy. Isso ficou corrigido.)

## Instalar no telemóvel

Abre o link acima no Safari (iPhone) ou Chrome (Android) → Partilhar/Menu →
"Adicionar ao Ecrã Principal". A partir daí funciona como uma app instalada.
