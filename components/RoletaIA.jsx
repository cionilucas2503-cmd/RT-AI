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


### COMO INDICAR APOSTAS (OBRIGATÓRIO):
SEMPRE use o mapa de vizinhos abaixo. NUNCA invente posições.

PADRÃO +3 (confiança < 80%): 3 vizinhos esq + [CENTRO] + 3 vizinhos dir = 7 números
PADRÃO +2 (confiança ≥ 80%): 2 vizinhos esq + [CENTRO] + 2 vizinhos dir = 5 números

FORMATO OBRIGATÓRIO: "A - B - C - [CENTRO] - D - E - F"
O número central SEMPRE entre colchetes. SEMPRE 7 números para +3 ou 5 para +2.
Se houver 2 apostas, separe por linha nova.

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

## REGRAS DE DECISÃO — SEGUIR RIGOROSAMENTE:

### CÁLCULO DE CONFIANÇA (use sempre a mesma metodologia):
- 1 estratégia FORTE: 45%
- 2 estratégias FORTE: 65%
- 3 estratégias FORTE: 75%
- 4+ estratégias FORTE: 85%
- Adicione 5% por cada estratégia MÉDIO extra
- Subtraia 10% se houver estratégias contraditórias

### CLASSIFICAÇÃO (baseada APENAS na confiança calculada):
- **MESA BOA**: confiança ≥ 65% (2+ estratégias convergentes)
- **AGUARDAR**: confiança entre 45% e 64%
- **EVITAR**: confiança < 45% ou sinais fortemente contraditórios

### REGRA DE CONSISTÊNCIA:
Para o mesmo histórico de números, a análise DEVE ser sempre idêntica.
Aplique as regras matematicamente, sem variação.

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
  // Extract ALL numbers 0-36 from the string (including inside brackets)
  const clean = apostarEm.replace(/[\[\]]/g, " ");
  const matches = clean.match(/\b(3[0-6]|[12][0-9]|[0-9])\b/g);
  return matches ? [...new Set(matches.map(Number))].filter(n => n >= 0 && n <= 36) : [];
}

function RouletteTable({ result }) {
  if (!result) return null;
  const status = result.status_mesa;
  const isEvitar = status === "EVITAR";
  const isAguardar = status === "AGUARDAR";
  const isBoa = status === "BOA";

  const chipNums = isBoa ? parseChipNumbers(result.apostar_em) : [];
  const gatilhoNums = !isBoa ? parseChipNumbers(result.gatilho) : [];

  const isCenter = (n) => {
    if (!result.apostar_em) return false;
    const m = result.apostar_em.match(/\[(\d+)\]/g);
    return m ? m.some(x => parseInt(x.replace(/[\[\]]/g, "")) === n) : false;
  };

  const getBg = (n) => {
    if (isEvitar) return n === 0 ? "#0d2b0d" : "#1a1a1a";
    if (n === 0) return "#1b5e20";
    return RED_NUM.has(n) ? "#8b1010" : "#1a1a1a";
  };

  const getChip = (n) => {
    if (chipNums.includes(n)) return isCenter(n) ? "#1e90ff" : "#f0d060";
    if (gatilhoNums.includes(n)) return "#ffd740";
    return null;
  };

  // SVG dimensions — compact, numbers touching in arc (R=70 → arc spacing ≈ CW)
  const VW = 260, VH = 660;
  const CX = 130, R = 70;
  const TOP_Y = 116, BOT_Y = 560;  // straight section = 444px
  const LX = 60, RX = 200;
  const CW = 36;

  // European roulette wheel split (matches reference image):
  const topArcNums    = [3, 26, 0, 32, 15];
  const rightNums     = [19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11]; // 12 cells
  const bottomArcNums = [30, 8, 23, 10, 5];
  const leftNums      = [35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24]; // 15 cells

  const CH_R = (BOT_Y - TOP_Y) / rightNums.length;  // 444/12 = 37px
  const CH_L = (BOT_Y - TOP_Y) / leftNums.length;   // 444/15 = 29.6px
  const CH_ARC = CH_R;

  // Arc angles: R=70 + 30° spacing → arc distance ≈ CW (cells touching)
  const ARC_ANGLES = [150, 120, 90, 60, 30];

  // All cells upright (rot=0)
  const cells = [];
  topArcNums.forEach((n, i) => {
    const rad = ARC_ANGLES[i] * Math.PI / 180;
    cells.push({ n, x: CX + R * Math.cos(rad), y: TOP_Y - R * Math.sin(rad), rot: 0, ch: CH_ARC, rx: 6 });
  });
  rightNums.forEach((n, i) => {
    cells.push({ n, x: RX, y: TOP_Y + CH_R * (i + 0.5), rot: 0, ch: CH_R, rx: 4 });
  });
  bottomArcNums.forEach((n, i) => {
    const rad = ARC_ANGLES[i] * Math.PI / 180;
    cells.push({ n, x: CX + R * Math.cos(rad), y: BOT_Y + R * Math.sin(rad), rot: 0, ch: CH_ARC, rx: 6 });
  });
  leftNums.forEach((n, i) => {
    cells.push({ n, x: LX, y: TOP_Y + CH_L * (i + 0.5), rot: 0, ch: CH_L, rx: 4 });
  });

  // Divider line endpoints (exact cell boundaries)
  const xr = RX - CW / 2;  // inner edge of right column
  const xl = LX + CW / 2;  // inner edge of left column

  const pillPath = `M ${CX-R} ${TOP_Y} A ${R} ${R} 0 0 1 ${CX+R} ${TOP_Y} L ${CX+R} ${BOT_Y} A ${R} ${R} 0 0 1 ${CX-R} ${BOT_Y} Z`;

  return (
    <div style={{ background: "#0d1118", border: "1px solid #1a2030", borderRadius: 16, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: isEvitar ? "#4a5568" : isAguardar ? "#ffd740" : "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 10 }}>
        {isEvitar ? "🚫 MESA INATIVA" : isAguardar ? "⏭️ AGUARDAR ESTES GATILHOS" : "🎯 COLOQUE AS FICHAS AQUI"}
      </div>

      {isAguardar && result.gatilho && (
        <div style={{ background: "rgba(255,215,64,0.08)", border: "1px solid #ffd74040", borderRadius: 10, padding: "10px 12px", marginBottom: 10, fontSize: 12, color: "#ffd740", lineHeight: 1.6 }}>
          {result.gatilho}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", filter: isEvitar ? "grayscale(0.8) brightness(0.45)" : "none" }}>
        <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ maxWidth: 220 }}>

          {/* Pill background */}
          <path d={pillPath} fill="#080b0f" stroke="#1a1a1a" strokeWidth="1"/>

          {/* Sector dividers — exact cell boundaries, diagonal where sectors misalign */}
          {/* Line 1: Zero / Voisins — between arc and first column cells (3↔35, 15↔19) */}
          <line x1={xr} y1={TOP_Y} x2={xl} y2={TOP_Y} stroke="#333" strokeWidth="0.8"/>
          {/* Line 2: Voisins / Orphelins — right: 25↔17 (row5), left: 22↔9 (row7) */}
          <line x1={xr} y1={TOP_Y + CH_R * 5} x2={xl} y2={TOP_Y + CH_L * 7} stroke="#333" strokeWidth="0.8"/>
          {/* Line 3: Orphelins / Tier — right: 6↔27 (row8), left: 1↔33 (row12) — diagonal */}
          <line x1={xr} y1={TOP_Y + CH_R * 8} x2={xl} y2={TOP_Y + CH_L * 12} stroke="#333" strokeWidth="0.8"/>

          {/* Sector labels — centered in each zone interior */}
          {[
            { label: "Zero",      y: TOP_Y - R / 2 },
            { label: "Voisins",   y: TOP_Y + CH_R * 2.5 },
            { label: "Orphelins", y: TOP_Y + CH_R * 6.5 },
            { label: "Tier",      y: TOP_Y + CH_R * 10 },
          ].map(s => (
            <text key={s.label} x={CX} y={s.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="13" fill="#252535" fontStyle="italic" style={{ fontFamily: "serif" }}>
              {s.label}
            </text>
          ))}

          {/* Number cells */}
          {cells.map(({ n, x, y, rot, ch, rx: cellRx }) => {
            const chip = getChip(n);
            const ctr = isCenter(n);
            const cellH = ch || 28;
            const rxVal = cellRx || 4;
            return (
              <g key={n} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot})`}>
                <rect x={-CW/2} y={-cellH/2} width={CW} height={cellH} rx={rxVal} ry={rxVal}
                  fill={getBg(n)}
                  stroke={chip ? chip : "#222"}
                  strokeWidth={chip ? (ctr ? 2 : 1.5) : 0.5}
                />
                <text x={0} y={0.5} textAnchor="middle" dominantBaseline="middle"
                  fontSize={n >= 10 ? "10" : "11"} fontWeight="800"
                  fill={isEvitar ? "#2a2a2a" : "#fff"}
                  style={{ fontFamily: "monospace" }}>
                  {n}
                </text>
                {chip && (
                  <circle cx={CW/2 - 4} cy={-(cellH/2) + 4} r={ctr ? 5 : 4}
                    fill={chip} stroke="#000" strokeWidth="0.5"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {isBoa && <>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1e90ff" }}/>
            <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>CENTRAL</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f0d060" }}/>
            <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>VIZINHOS</span>
          </div>
        </>}
        {isAguardar && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd740" }}/>
            <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>GATILHO</span>
          </div>
        )}
        {isEvitar && <span style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace" }}>MESA SEM PADRÃO</span>}
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

  function addNumber(autoAnalyze = false) {
    const v = parseInt(inputVal);
    if (isNaN(v) || v < 0 || v > 36) {
      setInputError(true);
      setTimeout(() => setInputError(false), 800);
      return;
    }
    setNumbers(prev => {
      const updated = [...prev, v];
      if (autoAnalyze || result) {
        // Trigger re-analysis with updated numbers
        setTimeout(() => runAnalysis(updated), 100);
      }
      return updated;
    });
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

  async function runAnalysis(updatedNumbers) {
    const nums = updatedNumbers || numbers;
    const isUpdate = !!result && nums.length > 0;
    if (nums.length < 5 && !imageBase64 && !isUpdate) {
      setError("Adicione pelo menos 5 números ou envie um print da mesa.");
      return;
    }
    setError(null);
    setLoading(true);
    if (!isUpdate) setResult(null);

    const allStrategies = [...STRATEGIES, ...customStrategies];
    const activeList = allStrategies.filter(s => activeStrategies.has(s.id));
    const activeNames = activeList.map(s => s.title).join(", ");
    const customBlock = customStrategies.filter(s => activeStrategies.has(s.id)).map(s =>
      `\n### ESTRATÉGIA PERSONALIZADA: ${s.title}\n${s.description}`
    ).join("\n");
    const contextNote = `\n\nESTRATÉGIAS ATIVAS: ${activeNames}.${customBlock ? "\n\nESTRATÉGIAS PERSONALIZADAS:" + customBlock : ""}\nRetorne apenas o JSON.`;

    const userContent = [];

    if (isUpdate) {
      const lastNum = nums[nums.length - 1];
      const prevNums = nums.slice(0, -1);
      userContent.push({ type: "text", text: `ATUALIZAÇÃO DE ANÁLISE.\n\nHistórico completo anterior (${prevNums.length} números, mais antigo primeiro): ${prevNums.join(", ")}.\n\nNOVO número que acabou de cair: ${lastNum}.\n\nHistórico completo agora (${nums.length} números): ${nums.join(", ")}.\n\nAtualize a análise levando em conta TODO o histórico acima incluindo o novo número ${lastNum}. A análise anterior indicou: status=${result?.status_mesa}, confiança=${result?.confianca}%. ${contextNote}` });
    } else if (imageBase64) {
      userContent.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } });
      userContent.push({ type: "text", text: `Analise o print da mesa acima. ${nums.length > 0 ? `Números adicionados: ${nums.join(", ")}.` : ""}${contextNote}` });
    } else {
      userContent.push({ type: "text", text: `Histórico da mesa (mais antiga para mais recente): ${nums.join(", ")}. Total: ${nums.length} números.${contextNote}` });
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
          max_tokens: 1500
        })
      });
      const data = await res.json();

      // Check for API errors
      if (data.error) {
        setError("API: " + (typeof data.error === "string" ? data.error : JSON.stringify(data.error)));
        return;
      }

      const raw = data.content?.map(b => b.text || "").join("") || "";
      if (!raw) {
        setError("Resposta vazia da API. Verifique a API Key.");
        return;
      }

      const clean = raw.replace(/```json|```/g, "").trim();

      // Fix: sanitize control characters inside JSON string values
      // (AI sometimes returns literal newlines inside strings breaking JSON.parse)
      function fixControlChars(str) {
        let result = "";
        let inString = false;
        let escaped = false;
        for (let i = 0; i < str.length; i++) {
          const ch = str[i];
          if (escaped) { result += ch; escaped = false; continue; }
          if (ch === "\\" && inString) { result += ch; escaped = true; continue; }
          if (ch === '"') { inString = !inString; result += ch; continue; }
          if (inString && ch.charCodeAt(0) < 0x20) {
            if (ch === "\n") result += "\\n";
            else if (ch === "\r") result += "\\r";
            else if (ch === "\t") result += "\\t";
            continue;
          }
          result += ch;
        }
        return result;
      }

      const parsed = JSON.parse(fixControlChars(clean));
      setResult(parsed);
      if (parsed.numeros_identificados?.length > 0) {
        setNumbers(parsed.numeros_identificados);
      }
      // After first analysis, clear imageBase64 so updates use full text history
      setImageBase64(null);
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
          <div style={{ fontSize: 9, color: "#2a3040", fontFamily: "monospace", marginTop: 4 }}>v3.0 — ALGORITMO DETERMINÍSTICO</div>
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
              {result ? (<div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>🎲 PRÓXIMO NÚMERO QUE CAIU</div>) : (<div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>🔢 HISTÓRICO DA MESA</div>)}

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

              {result && (
                <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "monospace", marginBottom: 8, textAlign: "center", letterSpacing: 1 }}>
                  ✦ Digite o número que caiu e toque OK — análise atualiza automaticamente
                </div>
              )}
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
            <button onClick={() => runAnalysis()} disabled={loading} style={{
              width: "100%", padding: "18px", background: loading ? "#1a2030" : "linear-gradient(135deg, #b8922a 0%, #f0d060 50%, #c9a84c 100%)",
              border: "none", borderRadius: 14, color: loading ? "#4a5568" : "#000",
              fontFamily: "monospace", fontSize: 16, letterSpacing: 4, fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(201,168,76,0.25)"
            }}>
              {loading ? "⏳ ANALISANDO..." : result ? "🔄 REANALISAR MESA" : "⚡ ANALISAR MESA"}
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

                {/* 1. ANÁLISE GERAL DA MESA */}
                <div style={{
                  background: result.status_mesa === "BOA" ? "rgba(0,230,118,0.07)" : result.status_mesa === "EVITAR" ? "rgba(255,61,87,0.07)" : "rgba(255,215,64,0.07)",
                  border: `3px solid ${statusColor}`, borderRadius: 20, padding: "22px 16px", marginBottom: 14, textAlign: "center"
                }}>
                  <div style={{ fontSize: 9, letterSpacing: 4, color: statusColor, fontFamily: "monospace", marginBottom: 14, opacity: 0.7 }}>
                    ANÁLISE GERAL DA MESA
                  </div>
                  <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>
                    {result.status_mesa === "BOA" ? "✅" : result.status_mesa === "EVITAR" ? "🔴" : "⏳"}
                  </div>
                  <div style={{ fontSize: result.status_mesa === "AGUARDAR" ? 18 : 28, fontWeight: 900, color: statusColor, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6, lineHeight: 1.2 }}>
                    {result.status_mesa === "BOA" ? "MESA PAGANDO" : result.status_mesa === "EVITAR" ? "CORRE!" : "AGUARDAR PRÓXIMAS JOGADAS"}
                  </div>
                  <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "monospace", letterSpacing: 2, marginTop: 8 }}>
                    CONFIANÇA: <span style={{ color: statusColor, fontWeight: 700 }}>{result.confianca}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1a2030", borderRadius: 2, overflow: "hidden", marginTop: 10 }}>
                    <div style={{ height: "100%", width: `${result.confianca}%`, background: statusColor, borderRadius: 2 }} />
                  </div>
                </div>

                {/* 2A. NÚMEROS (quando BOA) */}
                {result.status_mesa === "BOA" && result.apostar_em && (() => {
                  const centerMatches = result.apostar_em.match(/\[(\d+)\]/g) || [];
                  const centerNums = centerMatches.map(m => parseInt(m.replace(/[\[\]]/g, "")));
                  const lines = result.apostar_em.split("\n").filter(Boolean);
                  const labels = lines.filter(l => l.includes("+") || (l.includes("→") && !l.includes("["))).slice(0, centerNums.length);
                  if (centerNums.length === 0) return null;
                  return (
                    <div style={{ background: "#0d1118", border: "1px solid #c9a84c40", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, fontFamily: "monospace", marginBottom: 14 }}>🎰 GATILHO</div>
                      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                        {centerNums.map((num, i) => {
                          const bg = num === 0 ? "#1b5e20" : RED_NUMBERS.has(num) ? "#b71c1c" : "#212121";
                          return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                              <div style={{
                                width: 68, height: 68, borderRadius: "50%",
                                background: bg, border: "3px solid #c9a84c",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "monospace",
                                boxShadow: "0 0 24px rgba(201,168,76,0.7)", flexShrink: 0
                              }}>{num}</div>
                              {labels[i] && <div style={{ fontSize: 9, color: "#4a5568", fontFamily: "monospace", textAlign: "center", maxWidth: 80 }}>{labels[i]}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 2B. JOGADA INDICADA (quando AGUARDAR/EVITAR) */}
                {result.status_mesa !== "BOA" && result.gatilho && (() => {
                  const cm = result.apostar_em ? (result.apostar_em.match(/\[(\d+)\]/g) || []) : [];
                  const cn = cm.map(m => parseInt(m.replace(/[\[\]]/g, "")));
                  return (
                    <div style={{ background: "#0d1118", border: "2px solid #ffd74060", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: "#ffd740", letterSpacing: 3, fontFamily: "monospace", marginBottom: 10 }}>🎯 JOGADA INDICADA</div>
                      <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, fontWeight: 600 }}>{result.gatilho}</div>
                      {cn.length > 0 && (
                        <div style={{ marginTop: 12, borderTop: "1px solid #1a2030", paddingTop: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            {cn.map((num, i) => {
                              const bg = num === 0 ? "#1b5e20" : RED_NUMBERS.has(num) ? "#b71c1c" : "#1a1a1a";
                              return (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  {i > 0 && <span style={{ color: "#4a5568" }}>—</span>}
                                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: "2px solid #ffd740", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>{num}</div>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 11, color: "#ffd740", fontFamily: "monospace", marginTop: 8, opacity: 0.8 }}>
                            Aposte neste número — proteja com 3 fichas para cada lado
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. JOGADA INDICADA (quando BOA) */}
                {result.status_mesa === "BOA" && result.gatilho && (() => {
                  const cm = result.apostar_em ? (result.apostar_em.match(/\[(\d+)\]/g) || []) : [];
                  const cn = cm.map(m => parseInt(m.replace(/[\[\]]/g, "")));
                  return (
                    <div style={{ background: "#0d1118", border: "1px solid #1e90ff40", borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: "#1e90ff", letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>🎯 JOGADA INDICADA</div>
                      <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{result.gatilho}</div>
                      {cn.length > 0 && (
                        <div style={{ marginTop: 10, borderTop: "1px solid #1a2030", paddingTop: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            {cn.map((num, i) => {
                              const bg = num === 0 ? "#1b5e20" : RED_NUMBERS.has(num) ? "#b71c1c" : "#1a1a1a";
                              return (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  {i > 0 && <span style={{ color: "#4a5568" }}>—</span>}
                                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: "2px solid #1e90ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>{num}</div>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 11, color: "#1e90ff", fontFamily: "monospace", marginTop: 8, opacity: 0.8 }}>
                            Aposte neste número — proteja com 3 fichas para cada lado
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

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
