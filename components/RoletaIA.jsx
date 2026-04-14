import { useState, useRef } from "react";

const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

function getNumColor(n) {
  if (n === 0) return "green";
  return RED_NUMBERS.has(n) ? "red" : "black";
}

const SYSTEM_PROMPT = `Você é ARIA — Analista de Roleta com Inteligência Artificial. Uma especialista profissional com 20 anos de experiência em cassinos europeus. Você analisa padrões estatísticos, comportamento de mesa e estratégias avançadas para identificar oportunidades de entrada.

## SUAS ESTRATÉGIAS DE ANÁLISE:

### 1. TERMINAIS SIMPLES
Agrupe números pelo dígito final:
- Terminal 0: 0, 10, 20, 30
- Terminal 1: 1, 11, 21, 31
- Terminal 2: 2, 12, 22, 32
- etc.
Quando um terminal aparece 3+ vezes nas últimas 20 jogadas, está "aquecido".

### 2. TERMINAL CAMUFLADO (estratégia principal do usuário)
A bolinha cai nos vizinhos físicos de um terminal na roda, revelando que aquele terminal está sendo "puxado" de forma camuflada.

REGRA: Cada número do terminal tem vizinhos diretos (SINAL FORTE) e segundos vizinhos (SINAL FRACO) na roda europeia.
Se os vizinhos de um mesmo terminal aparecem com CONSTÂNCIA nas últimas 5-10 jogadas = terminal camuflado ativo.

MAPA COMPLETO DE VIZINHOS POR TERMINAL:

TERMINAL 0 (0,10,20,30):
  26—C0—32 | 2nd: 3,15
  11—C30—8 | 2nd: 36,23
  23—C10—5 | 2nd: 8,24
  1—C20—14 | 2nd: 33,31

TERMINAL 1 (1,11,21,31):
  33—C1—20 | 2nd: 16,14
  36—C11—30 | 2nd: 13,8
  4—C21—2 | 2nd: 19,25
  14—C31—9 | 2nd: 20,22

TERMINAL 2 (2,12,22,32):
  0—C32—15 | 2nd: 26,19
  21—C2—25 | 2nd: 4,17
  9—C22—18 | 2nd: 31,29
  28—C12—35 | 2nd: 7,3

TERMINAL 3 (3,13,23,33):
  27—C13—36 | 2nd: 6,11
  8—C23—10 | 2nd: 30,5
  16—C33—1 | 2nd: 24,20
  35—C3—26 | 2nd: 12,0

TERMINAL 4 (4,14,24,34):
  19—C4—21 | 2nd: 15,2
  17—C34—6 | 2nd: 25,27
  5—C24—16 | 2nd: 10,33
  20—C14—31 | 2nd: 1,9

TERMINAL 5 (5,15,25,35):
  32—C15—19 | 2nd: 0,4
  2—C25—17 | 2nd: 21,34
  10—C5—24 | 2nd: 23,16
  12—C35—3 | 2nd: 28,26

TERMINAL 6 (6,16,26,36):
  34—C6—27 | 2nd: 17,13
  13—C36—11 | 2nd: 27,30
  24—C16—33 | 2nd: 5,1
  3—C26—0 | 2nd: 35,32

TERMINAL 7 (7,17,27):
  25—C17—34 | 2nd: 2,6
  6—C27—13 | 2nd: 34,36
  29—C7—28 | 2nd: 18,12

TERMINAL 8 (8,18,28):
  30—C8—23 | 2nd: 11,10
  22—C18—29 | 2nd: 9,7
  7—C28—12 | 2nd: 29,35

TERMINAL 9 (9,19,29):
  15—C19—4 | 2nd: 32,21
  31—C9—22 | 2nd: 14,18
  18—C29—7 | 2nd: 22,28

COMO CALCULAR A FORÇA:
- FORTE: 3+ vizinhos diretos do mesmo terminal nas últimas 10 jogadas
- MÉDIO: 2 vizinhos diretos OU 3+ entre diretos e segundos vizinhos
- FRACO: 1 vizinho direto + 1 ou mais segundos vizinhos do mesmo terminal

IMPORTANTE: Não precisa ser sequencial. Analise a FREQUÊNCIA nas últimas 5-10 jogadas.
Exemplo: histórico tem 19, 2, 4 → todos vizinhos diretos do terminal 1 (C4, C2, C21) → SINAL FORTE terminal 1.

### 3. SETORES DA RODA FÍSICA
- **Voisins du Zero**: 22,18,29,7,28,12,35,3,26,0,32,15,19,4,21,2,25
- **Tiers du Cylindre**: 27,13,36,11,30,8,23,10,5,24,16,33
- **Orphelins**: 17,34,6,1,20,14,31,9
Quando 3+ números de um mesmo setor saem nas últimas 10 jogadas = setor aquecido.

### 4. PADRÕES VISUAIS
- Ciclos: sequências que se repetem (ex: vermelho-preto-vermelho-preto)
- Quebras: quando um padrão longo é interrompido
- Momentum: 3+ números consecutivos da mesma dúzia/cor/paridade
- Ausências: números que não saem há 15+ jogadas (frios)

### 5. DÚZIAS E COLUNAS
- 1ª Dúzia: 1-12 | 2ª Dúzia: 13-24 | 3ª Dúzia: 25-36
- Coluna 1: 1,4,7,10,13,16,19,22,25,28,31,34
- Coluna 2: 2,5,8,11,14,17,20,23,26,29,32,35
- Coluna 3: 3,6,9,12,15,18,21,24,27,30,33,36
Concentração de 4+ em uma dúzia/coluna = sinal relevante.

### 6. PARIDADE E COR
Analise as últimas 10 jogadas. Desvio de 7+ para um lado (ex: 8 vermelhos em 10) = possível reversão ou continuação de tendência forte.


### 7. NÚMEROS QUE SE PUXAM (estratégia base — mais importante)
Esta é a estratégia base que indica se a mesa está em bom momento. Quando um GATILHO cai, ele tende a puxar seus ALVOS nas jogadas seguintes.

REGRAS:
- Verifique se algum dos últimos 3 números caídos é um GATILHO
- Se for, os ALVOS desse gatilho são os candidatos para as próximas jogadas
- Números PRIMÁRIOS (p) = mais prováveis de aparecer após o gatilho
- Números SECUNDÁRIOS (s) = também possíveis mas com menor força
- Se 2+ gatilhos recentes apontam para o MESMO alvo = sinal MUITO FORTE
- Esta estratégia deve ser fundida com todas as outras para máxima acertividade

MAPA COMPLETO (gatilho → alvos):
G0→33[p:16,24,5/s:1,20,14] 15[p:19,4,21/s:32,0,26] 3[p:26,0,32/s:35,12,28]
G1→3[p:26,0,32/s:35,12,28] 36[p:10,8,13/s:27,6]
G2→5[p:10,23,8/s:24,16,33] 22[p:9,31,14/s:18,29,7]
G3→1[p:33,16,24/s:20,14,31] 0[p:15,33,35]
G4→24[p:16,33,1/s:5,10,23] 29[p:18,22,9/s:7,28,12]
G5→25[p:17,34,6/s:2,21,4] 22[p:9,31,14/s:18,29,7]
G6→7[p:29,18,22/s:28,12,35] 9[p:31,14,20/s:22,18,29] 27[p:13,36,11/s:6,34,17] 19[p:4,21,2/s:15,32,0]
G7→27[p:13,36,11/s:6,34,17] 19[p:4,21,2/s:15,32,0] 9[p:31,14,20/s:22,18,29]
G8→11,36,8[p:23,10,5/s:30,11,36]
G9→19[p:4,21,2/s:15,32,0] 7[p:29,18,22/s:28,12,35] 27[p:13,36,11/s:6,34,17]
G10→12[p:28,7,29/s:35,3,26]
G11→30,8,23[p:36,13,27]
G12→17[p:34,6,27/s:25,2,21] 24[p:5,10,23/s:16,33,1] 0[p:32,15,19/s:26,3,35]
G13→33[p:16,24,5/s:1,20,14] 0[p:32,15,19/s:26,3,35]
G14→34[p:6,27,13/s:17,25,2] 9[p:31,14,20/s:22,18,29] 33[p:16,24,5/s:1,20,14]
G15→9[p:31,14,20/s:22,18,29] 33[p:16,24,5/s:1,20,14] 35,3,0
G16→21[p:2,25,17/s:4,19,15]
G17→20[p:1,33,16/s:14,31,9]
G18→21[p:2,25,17/s:4,19,15]
G19→9[p:31,14,20/s:22,18,29] 7[p:29,18,22/s:28,12,35] 27[p:13,36,11/s:6,34,17]
G20→17[p:34,6,27/s:25,2,21]
G21→16[p:24,5,10/s:33,1,20]
G22→2[p:25,17,34/s:21,4,19] 5[p:10,23,8/s:24,16,33]
G23→25[p:17,34,6/s:2,21,4]
G24→19[p:15,32,0/s:4,21,2]
G25→5[p:10,23,8/s:24,16,33] 22[p:9,31,14/s:18,29,7]
G26→33[p:16,24,5/s:1,20,14]
G27→7[p:29,18,22/s:28,12,35] 9[p:31,14,20/s:22,18,29] 19[p:15,32,0/s:4,21,2]
G28→27[p:13,36,11/s:6,34,17]
G29→13[p:36,11,30/s:27,6,34]
G30→11,36,8[p:23,10,5] 33[p:16,24,5/s:1,20,14]
G31→30[p:8,23,10/s:11,36,13]
G32→33[p:16,24,5/s:1,20,14]
G33→0,3,35,15 25[p:17,34,6/s:2,21,4]
G34→14[p:20,1,33/s:31,9,22]
G35→33[p:16,24,5/s:1,20,14] 15,0,3 11[p:30,8,23/s:36,13,27]
G36→36[p:11,30,8/s:13,27,6] 1[p:33,16,24/s:20,14,31]

AO ANALISAR:
1. Identifique os últimos 3 gatilhos no histórico
2. Liste os alvos ativados por esses gatilhos
3. Cruze com terminal simples, camuflado e setores
4. Se múltiplas estratégias apontam para o mesmo número/grupo = GATILHO DE ENTRADA


### COMO INDICAR APOSTAS (OBRIGATÓRIO em toda análise):
Sempre que indicar um número alvo, apresente a aposta com vizinhos na roda:

PADRÃO +3 (usar quando confiança < 80%):
Ex: Número 33 → apostar em: 5 - 24 - 16 - [33] - 1 - 20 - 14
(3 vizinhos à esquerda + número central + 3 vizinhos à direita = 7 números)

PADRÃO +2 (usar quando confiança ≥ 80% — alta convicção):
Ex: Número 33 → apostar em: 24 - 16 - [33] - 1 - 20
(2 vizinhos à esquerda + número central + 2 vizinhos à direita = 5 números)

MAPA DE VIZINHOS ±3 NA RODA (esq-esq-esq | CENTRO | dir-dir-dir):
0: 35-3-26|0|32-15-19    1: 24-16-33|1|20-14-31    2: 19-4-21|2|25-17-34
3: 28-12-35|3|26-0-32    4: 32-15-19|4|21-2-25     5: 8-23-10|5|24-16-33
6: 25-17-34|6|27-13-36   7: 22-18-29|7|28-12-35    8: 36-11-30|8|23-10-5
9: 20-14-31|9|22-18-29   10: 30-8-23|10|5-24-16    11: 27-13-36|11|30-8-23
12: 29-7-28|12|35-3-26   13: 34-6-27|13|36-11-30   14: 33-1-20|14|31-9-22
15: 26-0-32|15|19-4-21   16: 10-5-24|16|33-1-20    17: 21-2-25|17|34-6-27
18: 31-9-22|18|29-7-28   19: 0-32-15|19|4-21-2     20: 16-33-1|20|14-31-9
21: 15-19-4|21|2-25-17   22: 14-31-9|22|18-29-7    23: 11-30-8|23|10-5-24
24: 23-10-5|24|16-33-1   25: 4-21-2|25|17-34-6     26: 12-35-3|26|0-32-15
27: 17-34-6|27|13-36-11  28: 18-29-7|28|12-35-3    29: 9-22-18|29|7-28-12
30: 13-36-11|30|8-23-10  31: 1-20-14|31|9-22-18    32: 3-26-0|32|15-19-4
33: 5-24-16|33|1-20-14   34: 2-25-17|34|6-27-13    35: 7-28-12|35|3-26-0
36: 6-27-13|36|11-30-8

REGRA DE DECISÃO +2 vs +3:
- Confiança ≥ 80% E 3+ estratégias convergindo E gatilho NSP forte → usar +2
- Demais casos → usar +3

LÓGICA DE ENTRADA CORRETA:
1. Gatilho cai → identifica Alvo
2. Verifica primários do Alvo (esses são os candidatos reais)
3. Seleciona o candidato mais confirmado pelas outras estratégias
4. Apresenta a aposta com vizinhos (+2 ou +3)

## REGRAS DE DECISÃO:
- **MESA BOA**: 2+ estratégias convergindo para o mesmo padrão com força MÉDIA ou FORTE
- **AGUARDAR**: 1 estratégia com sinal fraco, ou sinais contraditórios
- **EVITAR**: Padrões caóticos, sem lógica identificável, mesa "louca"
- **CONFIANÇA**: Calcule de 0-100% baseado na quantidade e força dos sinais convergentes

## GATILHO DE ENTRADA:
Só indique gatilho quando confiança ≥ 60%. O gatilho deve ser específico:
- Qual estratégia acionar
- Em quais números/grupos apostar
- Se esperar mais 1 jogada de confirmação ou entrar agora

## GESTÃO DE BANCA (Flat Bet):
- Stop Gain do dia: +20% da banca
- Stop Loss do dia: -10% da banca
- Stop por sequência: pare após 3 perdas consecutivas independente do saldo
- Retome apenas após identificar novo padrão claro

## SE RECEBER UMA IMAGEM:
Leia o histórico de números visível na tela do cassino (geralmente aparecem em bolinhas coloridas). Extraia os números e aplique toda a análise.

## FORMATO DE RESPOSTA (JSON PURO, sem markdown):
{
  "status_mesa": "BOA" | "AGUARDAR" | "EVITAR",
  "confianca": número 0-100,
  "numeros_identificados": [lista de números se vier de imagem, senão null],
  "estrategias": {
    "terminal_simples": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"},
    "terminal_camuflado": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"},
    "setores": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"},
    "padroes": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"},
    "duzias": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"},
    "paridade": {"ativo": bool, "descricao": "texto curto", "forca": "FORTE|MEDIO|FRACO|INATIVO"}
  },
  "analise_completa": "Análise detalhada em português como uma especialista experiente falaria...",
  "gatilho": "Instrução clara de entrada OU null se não houver",
  "apostar_em": "Números ou grupos específicos OU null",
  "alerta": "Aviso importante se houver OU null"
}`;


const STRATEGIES = [
  {
    id: "terminal_simples",
    icon: "🔢",
    title: "Terminal Simples",
    subtitle: "Análise pelo dígito final",
    color: "#448aff",
    sections: [
      {
        heading: "O que é?",
        text: "O terminal de um número é seu dígito final. Cada terminal agrupa 3 ou 4 números na roleta. Quando um terminal aparece com frequência, a mesa está 'puxando' aquele grupo."
      },
      {
        heading: "Grupos de Terminais",
        table: [
          ["Terminal","Números"],
          ["0","0 — 10 — 20 — 30"],
          ["1","1 — 11 — 21 — 31"],
          ["2","2 — 12 — 22 — 32"],
          ["3","3 — 13 — 23 — 33"],
          ["4","4 — 14 — 24 — 34"],
          ["5","5 — 15 — 25 — 35"],
          ["6","6 — 16 — 26 — 36"],
          ["7","7 — 17 — 27"],
          ["8","8 — 18 — 28"],
          ["9","9 — 19 — 29"],
        ]
      },
      {
        heading: "Força do Sinal",
        bullets: [
          "🟢 FORTE: 3+ ocorrências nas últimas 20 jogadas",
          "🟡 MÉDIO: 2 ocorrências nas últimas 20 jogadas",
          "🔴 FRACO: 1 ocorrência nas últimas 20 jogadas",
        ]
      },
      {
        heading: "Exemplo Prático",
        example: "Histórico: 21, 31, 11, 7, 21, 4, 31\n\nTerminal 1: aparece em 21, 31, 11, 21, 31 = 5x\n→ Sinal FORTE\n→ Apostar em: 1 — 11 — 21 — 31"
      }
    ]
  },
  {
    id: "terminal_camuflado",
    icon: "🎭",
    title: "Terminal Camuflado",
    subtitle: "Estratégia principal — vizinhos físicos da roda",
    color: "#c9a84c",
    sections: [
      {
        heading: "O que é?",
        text: "A bolinha cai nos vizinhos físicos de um terminal na roda europeia, revelando que aquele terminal está sendo puxado de forma camuflada. Não precisa cair no terminal diretamente — cai nas casas ao lado dele."
      },
      {
        heading: "Regra Principal",
        text: "Cada número do terminal possui vizinhos diretos (sinal forte) e segundos vizinhos (sinal fraco) na roda. Se esses vizinhos aparecem com constância nas últimas 5-10 jogadas, o terminal está sendo puxado camuflado.",
        example: "Bolinha cai em: 19 — 31 — 5\n\n19 é vizinho direto do 4 (terminal 4)\n31 é vizinho direto do 14 (terminal 4)\n5 é vizinho direto do 24 (terminal 4)\n\n→ Terminal Camuflado: 4 — SINAL FORTE\n→ Apostar em: 4 — 14 — 24 — 34"
      },
      {
        heading: "Vizinhos do Terminal 1",
        table: [
          ["Número","Viz. Esq.","Viz. Dir.","2º Viz."],
          ["C1","33","20","16, 14"],
          ["C11","36","30","13, 8"],
          ["C21","4","2","19, 25"],
          ["C31","14","9","20, 22"],
        ]
      },
      {
        heading: "Força do Sinal",
        bullets: [
          "🟢 FORTE: 3+ vizinhos diretos do mesmo terminal nas últimas 10 jogadas",
          "🟡 MÉDIO: 2 vizinhos diretos OU 3+ entre diretos e segundos vizinhos",
          "🔴 FRACO: 1 vizinho direto + 1 ou mais segundos vizinhos do mesmo terminal",
        ]
      },
      {
        heading: "Importante",
        text: "Não precisa ser em sequência. A ARIA analisa a frequência total nas últimas 5-10 jogadas. Quanto mais vizinhos do mesmo terminal aparecerem, mais forte o sinal — mesmo que intercalados com outros números."
      }
    ]
  },
  {
    id: "setores",
    icon: "🎡",
    title: "Setores da Roda",
    subtitle: "Posição física na roda europeia",
    color: "#00e676",
    sections: [
      {
        heading: "O que é?",
        text: "Considera a posição física dos números na roda. Quando vários números de um mesmo setor saem em sequência, sugere que a bola está descrevendo trajetória concentrada naquela região física."
      },
      {
        heading: "Voisins du Zero (Vizinhos do Zero)",
        text: "O maior setor. Cobre os números próximos ao zero na roda.",
        example: "0, 2, 3, 4, 7, 12, 15, 18,\n19, 21, 22, 25, 26, 28, 29, 32, 35\n\n17 números — maior cobertura"
      },
      {
        heading: "Tiers du Cylindre (Terço do Cilindro)",
        text: "Lado oposto ao zero na roda, cobrindo aprox. 1/3 do cilindro.",
        example: "5, 8, 10, 11, 13, 16,\n23, 24, 27, 30, 33, 36\n\n12 números"
      },
      {
        heading: "Orphelins (Órfãos)",
        text: "Números entre os dois setores anteriores, em duas pequenas regiões.",
        example: "1, 6, 9, 14, 17, 20, 31, 34\n\n8 números — menor setor"
      },
      {
        heading: "Força do Sinal",
        bullets: [
          "🟢 FORTE: 4+ números do mesmo setor nas últimas 10 jogadas",
          "🟡 MÉDIO: 3 números do mesmo setor nas últimas 10 jogadas",
          "🔴 FRACO: 2 números do mesmo setor nas últimas 10 jogadas",
        ]
      }
    ]
  },
  {
    id: "padroes",
    icon: "📈",
    title: "Padrões Visuais",
    subtitle: "Ciclos, momentum e quebras",
    color: "#ff9800",
    sections: [
      {
        heading: "O que é?",
        text: "Analisa o comportamento macro da mesa — ciclos, sequências e quebras de padrão que indicam o momento atual. É a estratégia mais voltada para o timing da entrada."
      },
      {
        heading: "Momentum Direcional",
        text: "Quando 3+ resultados consecutivos seguem a mesma característica (cor, paridade, dúzia), a mesa tem momentum ativo.",
        example: "V P V P V P V P (8 alternâncias)\n→ Ciclo vermelho-preto ativo\n→ Próximo esperado: Vermelho"
      },
      {
        heading: "Quebra de Padrão",
        text: "Quando um padrão de 5+ jogadas é interrompido abruptamente, sinaliza mudança de comportamento. A ARIA aguarda 1-2 jogadas de confirmação.",
        example: "V V V V V P (quebra após 5 vermelhos)\n→ Possível inversão de tendência\n→ Aguardar 1 rodada de confirmação"
      },
      {
        heading: "Números Frios",
        text: "Números que não saem há 15+ jogadas. Monitorados como candidatos por ausência prolongada.",
      },
      {
        heading: "Números Quentes",
        text: "Números que saíram 2+ vezes nas últimas 20 jogadas. Desvio acima do esperado estatisticamente.",
      },
      {
        heading: "Força do Sinal",
        bullets: [
          "🟢 FORTE: Ciclo ou momentum de 5+ jogadas com padrão claro",
          "🟡 MÉDIO: Padrão de 3-4 jogadas com consistência moderada",
          "🔴 FRACO: Sinal inicial, aguardando confirmação",
        ]
      }
    ]
  },
  {
    id: "duzias",
    icon: "📊",
    title: "Dúzias e Colunas",
    subtitle: "Concentração por região numérica",
    color: "#e040fb",
    sections: [
      {
        heading: "O que é?",
        text: "Identifica concentrações de resultados em regiões numéricas específicas. Uma das análises mais rápidas para avaliar onde a mesa está 'gravitando'."
      },
      {
        heading: "As Três Dúzias",
        table: [
          ["Dúzia","Números"],
          ["1ª Dúzia","1 ao 12"],
          ["2ª Dúzia","13 ao 24"],
          ["3ª Dúzia","25 ao 36"],
        ]
      },
      {
        heading: "As Três Colunas",
        table: [
          ["Coluna","Números"],
          ["Coluna 1","1,4,7,10,13,16,19,22,25,28,31,34"],
          ["Coluna 2","2,5,8,11,14,17,20,23,26,29,32,35"],
          ["Coluna 3","3,6,9,12,15,18,21,24,27,30,33,36"],
        ]
      },
      {
        heading: "Força do Sinal",
        bullets: [
          "🟢 FORTE: 5+ números na mesma região em 15 jogadas",
          "🟡 MÉDIO: 4 números na mesma região em 15 jogadas",
          "🔴 FRACO: 3 números na mesma região em 15 jogadas",
        ]
      }
    ]
  },
  {
    id: "paridade",
    icon: "⚖️",
    title: "Paridade e Cor",
    subtitle: "Par/Ímpar e Vermelho/Preto",
    color: "#ff3d57",
    sections: [
      {
        heading: "O que é?",
        text: "Analisa desvios estatísticos em par/ímpar e vermelho/preto. Quando há desvio relevante de 7+ para um lado em 10 jogadas, a ARIA ativa o sinal."
      },
      {
        heading: "Distribuição Base",
        table: [
          ["Grupo","Proporção"],
          ["Vermelhos (18 núm.)","48,6%"],
          ["Pretos (18 núm.)","48,6%"],
          ["Pares (18 núm.)","48,6%"],
          ["Ímpares (18 núm.)","48,6%"],
          ["Zero","2,7%"],
        ]
      },
      {
        heading: "Interpretação do Desvio",
        bullets: [
          "🟢 FORTE: 8+ iguais em 10 jogadas",
          "🟡 MÉDIO: 7 iguais em 10 jogadas",
          "🔴 FRACO: 6 iguais em 10 jogadas",
        ]
      },
      {
        heading: "Dois Cenários Possíveis",
        text: "A ARIA interpreta o desvio de duas formas dependendo do histórico:",
        bullets: [
          "📈 Continuação: desvio crescendo → seguir a tendência",
          "🔄 Reversão: desvio muito alto (9-10) desacelerando → mudança próxima",
        ]
      },
      {
        heading: "Exemplo",
        example: "Últimas 10: P P P V P P P P V P\n(8 pretos de 10)\n\n→ Sinal FORTE — Desvio de Pretos\n→ Verificar se está crescendo (continuar)\n   ou desacelerando (reversão próxima)"
      }
    ]
  },
  {
    id: "numeros_puxam",
    icon: "🧲",
    title: "Números que se Puxam",
    subtitle: "Estratégia base — gatilhos e alvos",
    color: "#ff6b35",
    sections: [
      {
        heading: "O que é?",
        text: "É a estratégia base do sistema. Cada número da roleta é um GATILHO que tende a puxar números ALVOS específicos nas jogadas seguintes. Quando um gatilho cai, os alvos mapeados têm maior probabilidade de aparecer."
      },
      {
        heading: "Como funciona",
        bullets: [
          "1. Observe os últimos 3 números que caíram — esses são os gatilhos ativos",
          "2. Cada gatilho aponta para alvos específicos com números primários e secundários",
          "3. Números PRIMÁRIOS = maior probabilidade de sair após o gatilho",
          "4. Números SECUNDÁRIOS = possíveis, mas com força menor",
          "5. Se 2+ gatilhos apontam para o mesmo alvo = sinal MUITO FORTE"
        ]
      },
      {
        heading: "Exemplo — Gatilho 26",
        example: "Cai o número 26 (gatilho)\n\nAlvo ativado: 33\nPrimários do alvo 33: 16, 24, 5\nSecundários: 1, 20, 14\n\nAposta +3 no alvo 33:\n5 - 24 - 16 - [33] - 1 - 20 - 14\n(7 números cobertos na roda)"
      },
      {
        heading: "Padrão de Aposta",
        bullets: [
          "📌 +3: 3 vizinhos à esquerda + número central + 3 à direita (7 números) — padrão",
          "📌 +2: 2 vizinhos à esquerda + número central + 2 à direita (5 números) — alta convicção",
          "🔴 MUITO FORTE: 2+ gatilhos recentes apontam para o mesmo alvo",
          "🟢 FORTE: 1 gatilho + confirmação de outra estratégia",
          "🟡 MÉDIO: 1 gatilho sem confirmação adicional"
        ]
      },
      {
        heading: "Base para todas as estratégias",
        text: "Esta estratégia define SE a mesa está boa para jogar. Combine com Terminal Camuflado, Setores e Terminal Simples para máxima acertividade. Quanto mais estratégias confirmarem o mesmo alvo, mais certeira a entrada."
      }
    ]
  }
];

const WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

function getWheelBet(num, sides) {
  const idx = WHEEL.indexOf(num);
  const n = WHEEL.length;
  const left = Array.from({length: sides}, (_,i) => WHEEL[(idx - sides + i + n) % n]);
  const right = Array.from({length: sides}, (_,i) => WHEEL[(idx + 1 + i) % n]);
  return { left, center: num, right, all: [...left, num, ...right] };
}

const NUMEROS_QUE_SE_PUXAM = {
  0:  [{alvo:"33",  p:[16,24,5],  s:[1,20,14]}, {alvo:"15", p:[19,4,21],  s:[32,0,26]},  {alvo:"3",  p:[26,0,32],  s:[35,12,28]}],
  1:  [{alvo:"3",   p:[26,0,32],  s:[35,12,28]},{alvo:"36", p:[10,8,13],  s:[27,6]}],
  2:  [{alvo:"5",   p:[10,23,8],  s:[24,16,33]},{alvo:"22", p:[9,31,14],  s:[18,29,7]}],
  3:  [{alvo:"1",   p:[33,16,24], s:[20,14,31]},{alvo:"0",  p:[15,33,35], s:[]}],
  4:  [{alvo:"24",  p:[16,33,1],  s:[5,10,23]}, {alvo:"29", p:[18,22,9],  s:[7,28,12]}],
  5:  [{alvo:"25",  p:[17,34,6],  s:[2,21,4]},  {alvo:"22", p:[9,31,14],  s:[18,29,7]}],
  6:  [{alvo:"7",   p:[29,18,22], s:[28,12,35]},{alvo:"9",  p:[31,14,20], s:[22,18,29]},{alvo:"27", p:[13,36,11], s:[6,34,17]},{alvo:"19", p:[4,21,2], s:[15,32,0]}],
  7:  [{alvo:"27",  p:[13,36,11], s:[6,34,17]}, {alvo:"19", p:[4,21,2],   s:[15,32,0]}, {alvo:"9",  p:[31,14,20], s:[22,18,29]}],
  8:  [{alvo:"11,36,8", p:[23,10,5], s:[30,11,36]}],
  9:  [{alvo:"19",  p:[4,21,2],   s:[15,32,0]}, {alvo:"7",  p:[29,18,22], s:[28,12,35]},{alvo:"27", p:[13,36,11], s:[6,34,17]}],
  10: [{alvo:"12",  p:[28,7,29],  s:[35,3,26]}],
  11: [{alvo:"30,8,23", p:[36,13,27], s:[]}],
  12: [{alvo:"17",  p:[34,6,27],  s:[25,2,21]}, {alvo:"24", p:[5,10,23],  s:[16,33,1]}, {alvo:"0",  p:[32,15,19], s:[26,3,35]}],
  13: [{alvo:"33",  p:[16,24,5],  s:[1,20,14]}, {alvo:"0",  p:[32,15,19], s:[26,3,35]}],
  14: [{alvo:"34",  p:[6,27,13],  s:[17,25,2]}, {alvo:"9",  p:[31,14,20], s:[22,18,29]},{alvo:"33", p:[16,24,5],  s:[1,20,14]}],
  15: [{alvo:"9",   p:[31,14,20], s:[22,18,29]},{alvo:"33", p:[16,24,5],  s:[1,20,14]}, {alvo:"35,3,0", p:[], s:[]}],
  16: [{alvo:"21",  p:[2,25,17],  s:[4,19,15]}],
  17: [{alvo:"20",  p:[1,33,16],  s:[14,31,9]}],
  18: [{alvo:"21",  p:[2,25,17],  s:[4,19,15]}],
  19: [{alvo:"9",   p:[31,14,20], s:[22,18,29]},{alvo:"7",  p:[29,18,22], s:[28,12,35]},{alvo:"27", p:[13,36,11], s:[6,34,17]}],
  20: [{alvo:"17",  p:[34,6,27],  s:[25,2,21]}],
  21: [{alvo:"16",  p:[24,5,10],  s:[33,1,20]}],
  22: [{alvo:"2",   p:[25,17,34], s:[21,4,19]}, {alvo:"5",  p:[10,23,8],  s:[24,16,33]}],
  23: [{alvo:"25",  p:[17,34,6],  s:[2,21,4]}],
  24: [{alvo:"19",  p:[15,32,0],  s:[4,21,2]}],
  25: [{alvo:"5",   p:[10,23,8],  s:[24,16,33]},{alvo:"22", p:[9,31,14],  s:[18,29,7]}],
  26: [{alvo:"33",  p:[16,24,5],  s:[1,20,14]}],
  27: [{alvo:"7",   p:[29,18,22], s:[28,12,35]},{alvo:"9",  p:[31,14,20], s:[22,18,29]},{alvo:"19", p:[15,32,0],  s:[4,21,2]}],
  28: [{alvo:"27",  p:[13,36,11], s:[6,34,17]}],
  29: [{alvo:"13",  p:[36,11,30], s:[27,6,34]}],
  30: [{alvo:"11,36,8", p:[23,10,5], s:[]},     {alvo:"33", p:[16,24,5],  s:[1,20,14]}],
  31: [{alvo:"30",  p:[8,23,10],  s:[11,36,13]}],
  32: [{alvo:"33",  p:[16,24,5],  s:[1,20,14]}],
  33: [{alvo:"0,3,35,15", p:[], s:[]},           {alvo:"25", p:[17,34,6],  s:[2,21,4]}],
  34: [{alvo:"14",  p:[20,1,33],  s:[31,9,22]}],
  35: [{alvo:"33",  p:[16,24,5],  s:[1,20,14]}, {alvo:"15,0,3", p:[], s:[]},{alvo:"11", p:[30,8,23], s:[36,13,27]}],
  36: [{alvo:"36",  p:[11,30,8],  s:[13,27,6]}, {alvo:"1",  p:[33,16,24], s:[20,14,31]}],
};

const RED_NUM = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

function parseChipNumbers(apostarEm) {
  if (!apostarEm) return [];
  const matches = apostarEm.match(/\b([0-9]|[12][0-9]|3[0-6])\b/g);
  return matches ? [...new Set(matches.map(Number))] : [];
}

function RouletteTable({ result }) {
  if (!result) return null;
  const status = result.status_mesa;
  const isEvitar = status === "EVITAR";
  const isAguardar = status === "AGUARDAR";
  const isBoa = status === "BOA";

  const chipNums = isBoa ? parseChipNumbers(result.apostar_em) : [];
  // For aguardar, parse gatilho numbers
  const gatilhoNums = !isBoa ? parseChipNumbers(result.gatilho) : [];

  // Table rows: top=row0, mid=row1, bot=row2
  const rows = [
    [3,6,9,12,15,18,21,24,27,30,33,36],
    [2,5,8,11,14,17,20,23,26,29,32,35],
    [1,4,7,10,13,16,19,22,25,28,31,34]
  ];

  const getCellBg = (n) => {
    if (isEvitar) return "#1a1a1a";
    if (RED_NUM.has(n)) return "#b71c1c";
    return "#1a1a1a";
  };

  const getCellBorder = (n) => {
    if (isEvitar) return "1px solid #222";
    if (chipNums.includes(n)) return "2px solid #c9a84c";
    if (gatilhoNums.includes(n)) return "2px solid #ffd740";
    return "1px solid #2a2a2a";
  };

  const isCenter = (n) => {
    // Find the central number (between brackets) in apostar_em
    if (!result.apostar_em) return false;
    const matches = result.apostar_em.match(/\[([0-9]+)\]/g);
    if (!matches) return false;
    return matches.some(m => parseInt(m.replace(/[\[\]]/g,"")) === n);
  };

  const cellSize = 26;

  return (
    <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: isEvitar ? "#4a5568" : isAguardar ? "#ffd740" : "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>
        {isEvitar ? "🚫 MESA INATIVA" : isAguardar ? "⏭️ AGUARDAR ESTES GATILHOS" : "🎯 COLOQUE AS FICHAS AQUI"}
      </div>

      {/* Gatilho hint when aguardar */}
      {isAguardar && result.gatilho && (
        <div style={{ background: "rgba(255,215,64,0.08)", border: "1px solid #ffd74040", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#ffd740", lineHeight: 1.6 }}>
          {result.gatilho}
        </div>
      )}

      {/* Roulette table */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 2, minWidth: "fit-content" }}>

          {/* Zero */}
          <div style={{
            width: cellSize, minHeight: cellSize * 3 + 4,
            background: isEvitar ? "#0a1a0a" : "#1b5e20",
            border: chipNums.includes(0) ? "2px solid #c9a84c" : "1px solid #2a2a2a",
            borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: isEvitar ? "#333" : "#fff", fontFamily: "monospace",
            position: "relative", flexShrink: 0
          }}>
            0
            {chipNums.includes(0) && (
              <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "#c9a84c", top: 2, right: 2 }} />
            )}
          </div>

          {/* Number grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 2 }}>
                {row.map(n => {
                  const haChip = chipNums.includes(n);
                  const isGatilho = gatilhoNums.includes(n);
                  const isCtr = isCenter(n);
                  return (
                    <div key={n} style={{
                      width: cellSize, height: cellSize,
                      background: getCellBg(n),
                      border: getCellBorder(n),
                      borderRadius: 3,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700,
                      color: isEvitar ? "#333" : "#fff",
                      fontFamily: "monospace", position: "relative",
                      flexShrink: 0,
                      boxShadow: isCtr ? "0 0 8px rgba(201,168,76,0.8)" : haChip ? "0 0 4px rgba(201,168,76,0.4)" : "none"
                    }}>
                      {n}
                      {haChip && (
                        <div style={{
                          position: "absolute", top: -4, right: -4,
                          width: isCtr ? 10 : 8, height: isCtr ? 10 : 8,
                          borderRadius: "50%",
                          background: isCtr ? "#c9a84c" : "#f0d060",
                          border: "1px solid #000",
                          boxShadow: isCtr ? "0 0 6px #c9a84c" : "none"
                        }} />
                      )}
                      {isGatilho && !haChip && (
                        <div style={{
                          position: "absolute", top: -4, right: -4,
                          width: 8, height: 8, borderRadius: "50%",
                          background: "#ffd740", border: "1px solid #000"
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        {isBoa && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a84c", border: "1px solid #000" }} />
              <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>NÚMERO CENTRAL</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f0d060", border: "1px solid #000" }} />
              <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>VIZINHOS (+2/+3)</span>
            </div>
          </>
        )}
        {isAguardar && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd740", border: "1px solid #000" }} />
            <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>GATILHO A AGUARDAR</span>
          </div>
        )}
        {isEvitar && (
          <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>MESA SEM PADRÃO — NÃO JOGAR</span>
        )}
      </div>
    </div>
  );
}


export default function RoletaIA() {
  const [tab, setTab] = useState("analisar");
  const [numbers, setNumbers] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bancaInicial, setBancaInicial] = useState("");
  const [bancaAtual, setBancaAtual] = useState("");
  const [inputError, setInputError] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [activeStrategies, setActiveStrategies] = useState(new Set(["terminal_simples","terminal_camuflado","setores","padroes","duzias","paridade","numeros_puxam"]));
  const [customStrategies, setCustomStrategies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStratName, setNewStratName] = useState("");
  const [newStratDesc, setNewStratDesc] = useState("");
  const fileRef = useRef();

  // Banca calculations
  const bI = parseFloat(bancaInicial) || 0;
  const bA = parseFloat(bancaAtual) || 0;
  const metaGain = bI > 0 ? (bI * 1.20).toFixed(2) : null;
  const metaLoss = bI > 0 ? (bI * 0.90).toFixed(2) : null;
  const plHoje = bI > 0 && bA > 0 ? (bA - bI).toFixed(2) : null;
  const flatBet = bI > 0 ? (bI * 0.02).toFixed(2) : null;

  let bancaStatus = null;
  if (bI > 0 && bA > 0) {
    if (bA >= bI * 1.20) bancaStatus = "gain";
    else if (bA <= bI * 0.90) bancaStatus = "loss";
    else bancaStatus = "ok";
  }

  const progressPct = bI > 0 && bA > 0
    ? Math.min(100, Math.max(0, ((bA - bI * 0.90) / (bI * 0.30)) * 100))
    : 0;

  function padNum(n) {
    setInputVal(prev => {
      if (prev.length >= 2) return prev;
      const next = prev + n;
      const num = parseInt(next);
      if (num > 36) return prev;
      return next;
    });
    setInputError(false);
  }

  function padDel() {
    setInputVal(prev => prev.slice(0, -1));
    setInputError(false);
  }

  function addNumber() {
    const v = parseInt(inputVal);
    if (isNaN(v) || v < 0 || v > 36) {
      setInputError(true);
      setTimeout(() => setInputError(false), 800);
      return;
    }
    setNumbers(prev => [...prev, v]);
    setInputVal("");
    setInputError(false);
    setError(null);
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (numbers.length < 5 && !imageBase64) {
      setError("Adicione pelo menos 5 números ou envie um print da mesa.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    const allStrategies = [...STRATEGIES, ...customStrategies];
    const activeList = allStrategies.filter(s => activeStrategies.has(s.id));
    const activeNames = activeList.map(s => s.title).join(", ");
    const customBlock = customStrategies.filter(s => activeStrategies.has(s.id)).map(s =>
      `\n### ESTRATÉGIA PERSONALIZADA: ${s.title}\n${s.description}`
    ).join("\n");
    const contextNote = `\n\nESTRATÉGIAS ATIVAS PARA ESTA ANÁLISE: ${activeNames}.${customBlock ? "\n\nESTRATÉGIAS PERSONALIZADAS DO USUÁRIO:" + customBlock : ""}\nAnalise APENAS as estratégias ativas listadas acima. Retorne apenas o JSON.`;

    const userContent = [];

    if (imageBase64) {
      userContent.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } });
      userContent.push({ type: "text", text: `Analise o print da mesa acima. ${numbers.length > 0 ? `Números adicionados manualmente: ${numbers.join(", ")}.` : ""}${contextNote}` });
    } else {
      userContent.push({ type: "text", text: `Histórico da mesa (da mais antiga para a mais recente): ${numbers.join(", ")}. Total: ${numbers.length} números.${contextNote}` });
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userContent }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      if (parsed.numeros_identificados?.length > 0) {
        setNumbers(parsed.numeros_identificados);
      }
    } catch (err) {
      setError("Erro: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  const statusColor = result ? (result.status_mesa === "BOA" ? "#00e676" : result.status_mesa === "EVITAR" ? "#ff3d57" : "#ffd740") : null;
  const statusBg = result ? (result.status_mesa === "BOA" ? "rgba(0,230,118,0.1)" : result.status_mesa === "EVITAR" ? "rgba(255,61,87,0.1)" : "rgba(255,215,64,0.1)") : null;

  const forcaColor = (f) => f === "FORTE" ? "#00e676" : f === "MEDIO" ? "#ffd740" : f === "FRACO" ? "#ff9800" : "#4a5568";

  return (
    <div style={{ background: "#07090e", minHeight: "100vh", fontFamily: "'Georgia', serif", maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden" }}>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(180,140,50,0.07) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, paddingBottom: 100 }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "28px 20px 18px", borderBottom: "1px solid #1a2030" }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#7a6a3a", fontFamily: "monospace", marginBottom: 6 }}>SISTEMA DE ANÁLISE</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 6, background: "linear-gradient(135deg, #b8922a 0%, #f0d060 45%, #c9a84c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ARIA
          </div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#4a5568", fontFamily: "monospace", marginTop: 2 }}>ANALISTA DE ROLETA IA</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", margin: "16px 16px 0", background: "#0d1118", borderRadius: 12, padding: 4, border: "1px solid #1a2030", gap: 4 }}>
          {["analisar","banca","estratégias","histórico"].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedStrategy(null); }} style={{
              flex: 1, padding: "10px 4px", borderRadius: 9, border: tab === t ? "1px solid #2a3040" : "1px solid transparent",
              background: tab === t ? "#161c28" : "transparent", color: tab === t ? "#c9a84c" : "#4a5568",
              fontSize: 9, fontFamily: "monospace", letterSpacing: 0, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s"
            }}>{t}</button>
          ))}
        </div>

        {/* ── ANALISAR TAB ── */}
        {tab === "analisar" && (
          <div style={{ padding: "16px 16px 0" }}>

            {/* Upload area */}
            <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>📸 PRINT DA MESA</div>

              {imagePreview ? (
                <div style={{ position: "relative" }}>
                  <img src={imagePreview} style={{ width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "contain", background: "#161c28" }} />
                  <button onClick={() => { setImagePreview(null); setImageBase64(null); }} style={{
                    position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)", border: "1px solid #333",
                    borderRadius: "50%", width: 28, height: 28, color: "#ff3d57", cursor: "pointer", fontSize: 14
                  }}>✕</button>
                </div>
              ) : (
                <label htmlFor="imgUpload" style={{
                  display: "block", border: "2px dashed #c9a84c55", borderRadius: 12,
                  padding: "28px 16px", textAlign: "center", cursor: "pointer",
                  background: "rgba(201,168,76,0.03)"
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 14, color: "#c9a84c", fontWeight: 700, marginBottom: 4 }}>Toque aqui para enviar o print</div>
                  <div style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace" }}>A IA vai ler o histórico automaticamente</div>
                </label>
              )}
              <input
                id="imgUpload"
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />
            </div>

            {/* Manual numbers */}
            <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>🔢 NÚMEROS MANUAIS</div>

              <div style={{ marginBottom: 12, width: "100%" }}>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={inputVal}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 36)) {
                      setInputVal(val);
                      setInputError(false);
                    }
                  }}
                  onKeyDown={e => e.key === "Enter" && addNumber()}
                  placeholder="0–36"
                  style={{
                    width: "100%", boxSizing: "border-box", background: inputError ? "rgba(255,61,87,0.1)" : "#161c28",
                    border: `1px solid ${inputError ? "#ff3d57" : "#1a2030"}`, borderRadius: 10,
                    color: "#e2e8f0", fontSize: 28, textAlign: "center", padding: "12px 6px",
                    fontFamily: "monospace", outline: "none", transition: "border-color 0.2s"
                  }}
                />
              </div>

              {/* Numpad */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {["1","2","3","4","5","6","7","8","9","0","⌫","OK"].map(k => (
                  <button key={k} onClick={() => {
                    if (k === "⌫") padDel();
                    else if (k === "OK") addNumber();
                    else padNum(k);
                  }} style={{
                    padding: "13px 4px", borderRadius: 8, cursor: "pointer", fontSize: 17,
                    fontFamily: "monospace", transition: "all 0.1s", textAlign: "center",
                    border: k === "OK" ? "none" : "1px solid #1a2030",
                    background: k === "OK" ? "#c9a84c" : k === "⌫" ? "rgba(255,61,87,0.12)" : "#161c28",
                    color: k === "OK" ? "#000" : k === "⌫" ? "#ff3d57" : "#e2e8f0",
                    fontWeight: k === "OK" ? 900 : 400
                  }}>{k}</button>
                ))}
              </div>
              <div style={{ margin: "12px 0 6px", borderTop: "1px solid #1a2030", paddingTop: 12, display: "flex", flexWrap: "wrap", gap: 6, minHeight: 40 }}>
                {numbers.length === 0
                  ? <span style={{ fontSize: 12, color: "#4a5568", fontFamily: "monospace", padding: "8px 0" }}>Nenhum número ainda — adicione pelo menos 5</span>
                  : numbers.slice().reverse().map((n, i) => {
                    const c = getNumColor(n);
                    const isLatest = i === 0;
                    return (
                      <div key={i} onClick={() => setNumbers(prev => { const a = [...prev]; a.splice(numbers.length-1-i,1); return a; })}
                        style={{
                          width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          background: c === "red" ? "#b71c1c" : c === "green" ? "#1b5e20" : "#1a1a1a",
                          border: isLatest ? "2px solid #c9a84c" : c === "black" ? "1px solid #333" : "none",
                          fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#fff",
                          cursor: "pointer", boxShadow: isLatest ? "0 0 8px rgba(201,168,76,0.4)" : "none"
                        }}>
                        {n}
                      </div>
                    );
                  })}
              </div>

              {numbers.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace" }}>{numbers.length} número{numbers.length !== 1 ? "s" : ""}</span>
                  <button onClick={() => { setNumbers([]); setResult(null); }} style={{
                    background: "transparent", border: "1px solid #1a2030", borderRadius: 8,
                    color: "#4a5568", fontSize: 11, fontFamily: "monospace", padding: "6px 12px", cursor: "pointer"
                  }}>Limpar</button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: "#ff3d57" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Analyze button */}
            <button onClick={analyze} disabled={loading} style={{
              width: "100%", padding: "18px", background: loading ? "#1a2030" : "linear-gradient(135deg, #b8922a 0%, #f0d060 50%, #c9a84c 100%)",
              border: "none", borderRadius: 14, color: loading ? "#4a5568" : "#000",
              fontFamily: "monospace", fontSize: 16, letterSpacing: 4, fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(201,168,76,0.25)"
            }}>
              {loading ? "⏳ ANALISANDO..." : "⚡ ANALISAR MESA"}
            </button>

            {/* Loading state */}
            {loading && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#c9a84c", fontSize: 13, fontFamily: "monospace", letterSpacing: 1 }}>
                <div style={{ marginBottom: 8 }}>🎰 ARIA está lendo a mesa...</div>
                <div style={{ fontSize: 11, color: "#4a5568" }}>Analisando padrões e estratégias</div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{ marginTop: 16 }}>

                {/* 1. DECISÃO RÁPIDA */}
                <div style={{
                  background: result.status_mesa === "BOA" ? "rgba(0,230,118,0.07)" : result.status_mesa === "EVITAR" ? "rgba(255,61,87,0.07)" : "rgba(255,215,64,0.07)",
                  border: `3px solid ${statusColor}`, borderRadius: 20, padding: "22px 16px", marginBottom: 14, textAlign: "center"
                }}>
                  <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>
                    {result.status_mesa === "BOA" ? "✅" : result.status_mesa === "EVITAR" ? "🚫" : "⏳"}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: statusColor, fontFamily: "monospace", letterSpacing: 4, marginBottom: 6 }}>
                    {result.status_mesa === "BOA" ? "ENTRAR" : result.status_mesa === "EVITAR" ? "NÃO ENTRAR" : "AGUARDAR"}
                  </div>
                  <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2 }}>
                    CONFIANÇA: <span style={{ color: statusColor, fontWeight: 700 }}>{result.confianca}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1a2030", borderRadius: 2, overflow: "hidden", marginTop: 10 }}>
                    <div style={{ height: "100%", width: `${result.confianca}%`, background: statusColor, borderRadius: 2 }} />
                  </div>
                </div>

                {/* 2A. NÚMEROS (quando BOA) */}
                {result.status_mesa === "BOA" && result.apostar_em && (() => {
                  const blocos = result.apostar_em.split("\n\n").filter(Boolean);
                  return (
                    <div style={{ background: "#0d1118", border: "1px solid #c9a84c40", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 14 }}>🎯 APOSTAR AGORA</div>
                      {blocos.map((bloco, bi) => {
                        const linhas = bloco.split("\n").filter(Boolean);
                        const label = linhas.find(l => l.includes("+") || l.includes("→") || l.includes(":")) || "";
                        const numLinha = linhas.find(l => /\d/.test(l) && !l.includes(":") && !l.includes("+"));
                        if (!numLinha) return null;
                        const tokens = numLinha.trim().split(/\s+/).filter(Boolean);
                        return (
                          <div key={bi} style={{ marginBottom: bi < blocos.length - 1 ? 20 : 0 }}>
                            {label && <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "monospace", marginBottom: 10 }}>{label}</div>}
                            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                              {tokens.map((t, ti) => {
                                const isCtr = t.startsWith("[");
                                const n = t.replace(/[\[\]]/g, "");
                                const num = parseInt(n);
                                const bg = n === "0" ? "#1b5e20" : RED_NUMBERS.has(num) ? "#b71c1c" : "#1e293b";
                                return (
                                  <div key={ti} style={{
                                    width: isCtr ? 58 : 44, height: isCtr ? 58 : 44, borderRadius: "50%",
                                    background: bg, border: isCtr ? "3px solid #c9a84c" : "1px solid #334155",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: isCtr ? 19 : 14, fontWeight: 900, color: "#fff", fontFamily: "monospace",
                                    boxShadow: isCtr ? "0 0 20px rgba(201,168,76,0.6)" : "none", flexShrink: 0
                                  }}>{n}</div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* 2B. GATILHO A ESPERAR (quando AGUARDAR/EVITAR) */}
                {result.status_mesa !== "BOA" && result.gatilho && (
                  <div style={{ background: "#0d1118", border: "2px solid #ffd74060", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#ffd740", letterSpacing: 3, fontFamily: "monospace", marginBottom: 10 }}>⏭️ AGUARDAR ESTE GATILHO</div>
                    <div style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.8, fontWeight: 600 }}>{result.gatilho}</div>
                  </div>
                )}

                {/* 3. PRÓXIMO GATILHO (quando BOA) */}
                {result.status_mesa === "BOA" && result.gatilho && (
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 3, fontFamily: "monospace", marginBottom: 6 }}>⏭️ PRÓXIMO GATILHO</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{result.gatilho}</div>
                  </div>
                )}

                {/* 4. ALERTA */}
                {result.alerta && (
                  <div style={{ background: "rgba(255,61,87,0.08)", border: "1px solid rgba(255,61,87,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#ff6b7a", lineHeight: 1.6 }}>
                    ⚠️ {result.alerta}
                  </div>
                )}

                {/* 5. MESA VISUAL */}
                <RouletteTable result={result} />

                {/* 6. DETALHES */}
                <details style={{ marginBottom: 14 }}>
                  <summary style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 12, padding: "12px 16px", fontSize: 11, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                    <span>📊 VER ANÁLISE DETALHADA</span><span>›</span>
                  </summary>
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: "0 0 12px 12px", padding: 16, borderTop: "none" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {Object.entries(result.estrategias || {}).map(([key, val]) => {
                        const labels = { terminal_simples: "Terminal", terminal_camuflado: "Camuflado", setores: "Setores", padroes: "Padrões", duzias: "Dúzias", paridade: "Paridade", numeros_puxam: "N.Puxam" };
                        if (val.forca === "INATIVO") return null;
                        return (
                          <div key={key} style={{ background: "#161c28", borderRadius: 10, padding: "10px 12px", border: "1px solid #1a2030" }}>
                            <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: 1, fontFamily: "monospace", marginBottom: 4 }}>{labels[key] || key}</div>
                            <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: forcaColor(val.forca) }}>{val.forca}</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, lineHeight: 1.4 }}>{val.descricao}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, borderLeft: "2px solid #c9a84c33", paddingLeft: 12 }}>
                      {result.analise_completa}
                    </div>
                  </div>
                </details>

              </div>
            )}
          </div>
        )}

        {/* ── BANCA TAB ── */}
        {tab === "banca" && (
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 14 }}>💰 GESTÃO DE BANCA</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>BANCA INICIAL</div>
                  <input type="number" value={bancaInicial} onChange={e => setBancaInicial(e.target.value)} placeholder="R$ 0,00"
                    style={{ width: "100%", background: "#161c28", border: "1px solid #1a2030", borderRadius: 10, color: "#e2e8f0", fontSize: 16, padding: "10px 12px", fontFamily: "monospace", outline: "none" }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>BANCA ATUAL</div>
                  <input type="number" value={bancaAtual} onChange={e => setBancaAtual(e.target.value)} placeholder="R$ 0,00"
                    style={{ width: "100%", background: "#161c28", border: "1px solid #1a2030", borderRadius: 10, color: "#e2e8f0", fontSize: 16, padding: "10px 12px", fontFamily: "monospace", outline: "none" }} />
                </div>
              </div>
            </div>

            {bI > 0 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>META GAIN</div>
                    <div style={{ fontSize: 15, fontFamily: "monospace", fontWeight: 700, color: "#00e676" }}>R${metaGain}</div>
                    <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", marginTop: 2 }}>+20%</div>
                  </div>
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>STOP LOSS</div>
                    <div style={{ fontSize: 15, fontFamily: "monospace", fontWeight: 700, color: "#ff3d57" }}>R${metaLoss}</div>
                    <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", marginTop: 2 }}>-10%</div>
                  </div>
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>P&L HOJE</div>
                    <div style={{ fontSize: 15, fontFamily: "monospace", fontWeight: 700, color: plHoje >= 0 ? "#00e676" : "#ff3d57" }}>
                      {plHoje !== null ? `${plHoje >= 0 ? "+" : ""}R$${plHoje}` : "—"}
                    </div>
                  </div>
                </div>

                {bA > 0 && (
                  <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2 }}>PROGRESSO DO DIA</span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: bancaStatus === "gain" ? "#00e676" : bancaStatus === "loss" ? "#ff3d57" : "#c9a84c" }}>
                        {bancaStatus === "gain" ? "🏆 META ATINGIDA" : bancaStatus === "loss" ? "🚫 STOP LOSS" : "📈 EM ANDAMENTO"}
                      </span>
                    </div>
                    <div style={{ height: 8, background: "#1a2030", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progressPct}%`, background: bancaStatus === "loss" ? "#ff3d57" : "linear-gradient(90deg, #b8922a, #f0d060)", borderRadius: 4, transition: "width 0.5s" }} />
                    </div>
                  </div>
                )}

                <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>📐 FLAT BET RECOMENDADO</div>
                  <div style={{ fontSize: 28, fontFamily: "monospace", fontWeight: 900, color: "#f0d060", marginBottom: 8 }}>R$ {flatBet}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                    2% da banca por entrada. Com este valor você tem <strong style={{ color: "#c9a84c" }}>50 entradas</strong> antes de atingir o stop loss de 10%.
                  </div>
                </div>

                <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#c9a84c", fontFamily: "monospace", marginBottom: 8 }}>⚡ REGRAS DO DIA</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 2 }}>
                    ✅ Pare ao atingir R${metaGain} (+20%)<br/>
                    🚫 Pare ao chegar em R${metaLoss} (-10%)<br/>
                    ⛔ Pare após 3 perdas consecutivas<br/>
                    🔄 Retome só com novo padrão identificado
                  </div>
                </div>
              </>
            )}

            {!bI && (
              <div style={{ textAlign: "center", padding: "30px 20px", color: "#4a5568", fontSize: 13, fontFamily: "monospace" }}>
                Preencha a banca inicial para ver as métricas
              </div>
            )}
          </div>
        )}

        {/* ── HISTÓRICO TAB ── */}
        {tab === "histórico" && (
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 14 }}>📊 HISTÓRICO DE NÚMEROS</div>
              {numbers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#4a5568", fontSize: 12, fontFamily: "monospace" }}>
                  Nenhum número na sessão atual
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {numbers.map((n, i) => {
                      const c = getNumColor(n);
                      return (
                        <div key={i} style={{
                          width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          background: c === "red" ? "#b71c1c" : c === "green" ? "#1b5e20" : "#1a1a1a",
                          border: c === "black" ? "1px solid #333" : "none",
                          fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: "#fff",
                          position: "relative"
                        }}>
                          {n}
                          <span style={{ position: "absolute", top: -6, right: -6, fontSize: 8, color: "#4a5568", fontFamily: "monospace" }}>{i+1}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Vermelhos", val: numbers.filter(n => RED_NUMBERS.has(n)).length, color: "#b71c1c" },
                      { label: "Pretos", val: numbers.filter(n => n !== 0 && !RED_NUMBERS.has(n)).length, color: "#4a4a4a" },
                      { label: "Zero", val: numbers.filter(n => n === 0).length, color: "#1b5e20" },
                    ].map(s => (
                      <div key={s.label} style={{ background: "#161c28", borderRadius: 10, padding: "10px", textAlign: "center", border: "1px solid #1a2030" }}>
                        <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontFamily: "monospace", fontWeight: 700, color: s.color === "#4a4a4a" ? "#e2e8f0" : s.color, marginTop: 4 }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {result && (
              <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>🕐 ÚLTIMA ANÁLISE</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>Status: <strong style={{ color: statusColor }}>{result.status_mesa}</strong></span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>Confiança: <strong style={{ color: statusColor }}>{result.confianca}%</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ESTRATÉGIAS TAB ── */}
        {tab === "estratégias" && (
          <div style={{ padding: "16px 16px 0" }}>

            {!selectedStrategy ? (
              <>
                <div style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>
                  SELECIONE UMA ESTRATÉGIA PARA ESTUDAR
                </div>
                {/* Active count */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace" }}>
                    {activeStrategies.size} de {STRATEGIES.length + customStrategies.length} ativas
                  </span>
                  <button onClick={() => {
                    const all = [...STRATEGIES, ...customStrategies].map(s => s.id);
                    if (activeStrategies.size === all.length) setActiveStrategies(new Set());
                    else setActiveStrategies(new Set(all));
                  }} style={{
                    background: "transparent", border: "1px solid #1a2030", borderRadius: 8,
                    color: "#c9a84c", fontSize: 11, fontFamily: "monospace", padding: "5px 12px", cursor: "pointer"
                  }}>
                    {activeStrategies.size === STRATEGIES.length + customStrategies.length ? "Desmarcar todas" : "Selecionar todas"}
                  </button>
                </div>

                {/* Built-in strategies */}
                {STRATEGIES.map(s => {
                  const isActive = activeStrategies.has(s.id);
                  return (
                    <div key={s.id} style={{
                      background: "#0d1118", border: `1px solid ${isActive ? s.color + "40" : "#1a2030"}`,
                      borderRadius: 16, padding: "14px 16px", marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 12,
                      borderLeft: `3px solid ${isActive ? s.color : "#1a2030"}`
                    }}>
                      {/* Selection circle */}
                      <div onClick={() => {
                        setActiveStrategies(prev => {
                          const next = new Set(prev);
                          if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                          return next;
                        });
                      }} style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                        border: `2px solid ${isActive ? s.color : "#2a3040"}`,
                        background: isActive ? s.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s"
                      }}>
                        {isActive && <span style={{ fontSize: 12, color: "#000", fontWeight: 900 }}>✓</span>}
                      </div>
                      {/* Icon + text — tap to open detail */}
                      <div onClick={() => setSelectedStrategy(s)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" }}>
                        <div style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? "#e2e8f0" : "#4a5568", marginBottom: 2 }}>{s.title}</div>
                          <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "monospace" }}>{s.subtitle}</div>
                        </div>
                        <div style={{ fontSize: 16, color: "#2a3040" }}>›</div>
                      </div>
                    </div>
                  );
                })}

                {/* Custom strategies */}
                {customStrategies.map((s, ci) => {
                  const isActive = activeStrategies.has(s.id);
                  return (
                    <div key={s.id} style={{
                      background: "#0d1118", border: `1px solid ${isActive ? "#c9a84c40" : "#1a2030"}`,
                      borderRadius: 16, padding: "14px 16px", marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 12,
                      borderLeft: `3px solid ${isActive ? "#c9a84c" : "#1a2030"}`
                    }}>
                      <div onClick={() => {
                        setActiveStrategies(prev => {
                          const next = new Set(prev);
                          if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                          return next;
                        });
                      }} style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                        border: `2px solid ${isActive ? "#c9a84c" : "#2a3040"}`,
                        background: isActive ? "#c9a84c" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
                      }}>
                        {isActive && <span style={{ fontSize: 12, color: "#000", fontWeight: 900 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? "#e2e8f0" : "#4a5568" }}>✨ {s.title}</span>
                          <span style={{ fontSize: 9, color: "#c9a84c", fontFamily: "monospace", background: "rgba(201,168,76,0.1)", padding: "2px 6px", borderRadius: 4 }}>CUSTOM</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#4a5568", marginTop: 3, lineHeight: 1.5 }}>{s.description.slice(0, 80)}{s.description.length > 80 ? "..." : ""}</div>
                      </div>
                      <button onClick={() => {
                        setCustomStrategies(prev => prev.filter((_,i) => i !== ci));
                        setActiveStrategies(prev => { const next = new Set(prev); next.delete(s.id); return next; });
                      }} style={{
                        background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.2)",
                        borderRadius: 8, color: "#ff3d57", fontSize: 16, cursor: "pointer",
                        width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>✕</button>
                    </div>
                  );
                })}

                {/* Add strategy button / form */}
                {!showAddForm ? (
                  <button onClick={() => setShowAddForm(true)} style={{
                    width: "100%", padding: "14px", background: "transparent",
                    border: "2px dashed #1a2030", borderRadius: 14, color: "#c9a84c",
                    fontFamily: "monospace", fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "border-color 0.2s", marginTop: 4
                  }}>
                    ＋ ADICIONAR ESTRATÉGIA
                  </button>
                ) : (
                  <div style={{ background: "#0d1118", border: "1px solid #c9a84c40", borderRadius: 16, padding: 16, marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 14 }}>✨ NOVA ESTRATÉGIA</div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>NOME DA ESTRATÉGIA</div>
                      <input
                        value={newStratName}
                        onChange={e => setNewStratName(e.target.value)}
                        placeholder="Ex: Estratégia dos Espelhos"
                        style={{
                          width: "100%", boxSizing: "border-box", background: "#161c28",
                          border: "1px solid #1a2030", borderRadius: 10, color: "#e2e8f0",
                          fontSize: 14, padding: "10px 12px", fontFamily: "monospace", outline: "none"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>COMO FUNCIONA — ENSINE A IA</div>
                      <textarea
                        value={newStratDesc}
                        onChange={e => setNewStratDesc(e.target.value)}
                        placeholder="Descreva a estratégia em detalhes. Quanto mais detalhado, mais precisa a IA vai ser. Ex: Quando caem 3 números pares seguidos, o próximo tende a ser ímpar. Apostar nos ímpares 1, 3, 5, 7, 9..."
                        rows={5}
                        style={{
                          width: "100%", boxSizing: "border-box", background: "#161c28",
                          border: "1px solid #1a2030", borderRadius: 10, color: "#e2e8f0",
                          fontSize: 13, padding: "10px 12px", fontFamily: "monospace",
                          outline: "none", resize: "vertical", lineHeight: 1.6
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setShowAddForm(false); setNewStratName(""); setNewStratDesc(""); }} style={{
                        flex: 1, padding: "12px", background: "transparent", border: "1px solid #1a2030",
                        borderRadius: 10, color: "#4a5568", fontFamily: "monospace", fontSize: 13, cursor: "pointer"
                      }}>Cancelar</button>
                      <button onClick={() => {
                        if (!newStratName.trim() || !newStratDesc.trim()) return;
                        const id = "custom_" + Date.now();
                        const newS = { id, title: newStratName.trim(), description: newStratDesc.trim() };
                        setCustomStrategies(prev => [...prev, newS]);
                        setActiveStrategies(prev => new Set([...prev, id]));
                        setNewStratName(""); setNewStratDesc(""); setShowAddForm(false);
                      }} style={{
                        flex: 2, padding: "12px", background: "linear-gradient(135deg, #b8922a, #f0d060)",
                        border: "none", borderRadius: 10, color: "#000",
                        fontFamily: "monospace", fontSize: 13, fontWeight: 900, cursor: "pointer",
                        letterSpacing: 2
                      }}>SALVAR ESTRATÉGIA</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                {/* Back button */}
                <button onClick={() => setSelectedStrategy(null)} style={{
                  background: "transparent", border: "1px solid #1a2030", borderRadius: 10,
                  color: "#c9a84c", fontFamily: "monospace", fontSize: 12, padding: "8px 16px",
                  cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6
                }}>
                  ← Voltar
                </button>

                {/* Strategy header */}
                <div style={{
                  background: "#0d1118", border: `1px solid ${selectedStrategy.color}40`,
                  borderRadius: 16, padding: 18, marginBottom: 14,
                  borderLeft: `4px solid ${selectedStrategy.color}`
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{selectedStrategy.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#e2e8f0", marginBottom: 4 }}>{selectedStrategy.title}</div>
                  <div style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2 }}>{selectedStrategy.subtitle.toUpperCase()}</div>
                </div>

                {/* Sections */}
                {selectedStrategy.sections.map((sec, i) => (
                  <div key={i} style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: selectedStrategy.color, letterSpacing: 2, fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase" }}>
                      {sec.heading}
                    </div>

                    {sec.text && (
                      <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8, marginBottom: sec.example || sec.bullets || sec.table ? 12 : 0 }}>
                        {sec.text}
                      </div>
                    )}

                    {sec.table && (
                      <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1a2030" }}>
                        {sec.table.map((row, ri) => (
                          <div key={ri} style={{
                            display: "flex", background: ri === 0 ? "#161c28" : ri % 2 === 0 ? "#0d1118" : "#111520",
                            borderBottom: ri < sec.table.length - 1 ? "1px solid #1a2030" : "none"
                          }}>
                            {row.map((cell, ci) => (
                              <div key={ci} style={{
                                flex: ci === 0 ? "0 0 110px" : 1,
                                padding: "10px 12px", fontSize: 12, fontFamily: "monospace",
                                fontWeight: ri === 0 ? 700 : 400,
                                color: ri === 0 ? selectedStrategy.color : ci === 0 ? "#e2e8f0" : "#94a3b8"
                              }}>{cell}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.bullets && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sec.bullets.map((b, bi) => (
                          <div key={bi} style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, padding: "6px 10px", background: "#161c28", borderRadius: 8 }}>{b}</div>
                        ))}
                      </div>
                    )}

                    {sec.example && (
                      <div style={{ background: "#0a0c12", border: `1px solid ${selectedStrategy.color}30`, borderRadius: 10, padding: "14px", marginTop: sec.text ? 0 : 0 }}>
                        <div style={{ fontSize: 9, color: selectedStrategy.color, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>EXEMPLO</div>
                        <pre style={{ fontSize: 12, color: "#f0d060", fontFamily: "monospace", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{sec.example}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(7,9,14,0.95)", borderTop: "1px solid #1a2030", padding: "8px 16px", textAlign: "center", backdropFilter: "blur(10px)" }}>
        <div style={{ fontSize: 9, color: "#2a3040", fontFamily: "monospace", letterSpacing: 2 }}>ARIA • ANÁLISE PROFISSIONAL DE ROLETA • USE COM RESPONSABILIDADE</div>
      </div>
    </div>
  );
}
