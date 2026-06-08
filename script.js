// =============================================
// DETECTOR ACADÊMICO DE IA - SCRIPT COMPLETO
// Versão 3.0 - Sistema Avançado de Detecção de Humanidade
// =============================================

// CONFIGURAÇÕES GLOBAIS
let currentAnalysisResult = null;
let analysisHistory = [];

// =============================================
// SISTEMA AVANÇADO DE DETECÇÃO DE "HUMANIDADE"
// =============================================

class AdvancedHumanityDetector {
    constructor() {
        this.thresholds = {
            authenticity: 65,    // Pontuação mínima para ser considerado humano
            consistency: 40,     // Consistência perfeita = suspeito
            personalVoice: 25,   // Voz pessoal mínima
            contextDepth: 30     // Profundidade contextual mínima
        };
    }
    
    // CAMADA 1: ANÁLISE DE AUTENTICIDADE
    analyzeAuthenticity(text, metadata = {}) {
        let score = 50;
        const findings = [];
        
        // 1.1 PRESENÇA DE EXPERIÊNCIAS PESSOAIS CONCRETAS
        const personalMarkers = this.detectPersonalExperience(text);
        score += personalMarkers.score;
        findings.push(...personalMarkers.findings);
        
        // 1.2 REFERÊNCIAS A CONTEXTOS ESPECÍFICOS
        const contextMarkers = this.detectContextSpecificity(text, metadata);
        score += contextMarkers.score;
        findings.push(...contextMarkers.findings);
        
        // 1.3 PROCESSOS DE PENSAMENTO VISÍVEIS
        const thoughtProcess = this.detectThoughtProcess(text);
        score += thoughtProcess.score;
        findings.push(...thoughtProcess.findings);
        
        return {
            score: Math.max(0, Math.min(100, score)),
            findings,
            weight: 0.35
        };
    }
    
    // CAMADA 2: ANÁLISE DE CONSISTÊNCIA (PERFEIÇÃO SUSPEITA)
    analyzeConsistency(text) {
        let score = 50;
        const findings = [];
        
        // 2.1 VARIÂNCIA DE SENTENÇAS
        const sentenceVariance = this.analyzeSentenceVariance(text);
        score += sentenceVariance.score;
        findings.push(...sentenceVariance.findings);
        
        // 2.2 PADRÕES REPETITIVOS DE ESTRUTURA
        const structuralPatterns = this.detectStructuralPatterns(text);
        score += structuralPatterns.score;
        findings.push(...structuralPatterns.findings);
        
        // 2.3 CONSISTÊNCIA VOCABULAR EXCESSIVA
        const vocabularyConsistency = this.analyzeVocabularyConsistency(text);
        score += vocabularyConsistency.score;
        findings.push(...vocabularyConsistency.findings);
        
        return {
            score: Math.max(0, Math.min(100, score)),
            findings,
            weight: 0.30
        };
    }
    
    // CAMADA 3: ANÁLISE DE VOZ PESSOAL
    analyzePersonalVoice(text) {
        let score = 50;
        const findings = [];
        
        // 3.1 MARCADORES DE PRIMEIRA PESSOA AUTÊNTICOS
        const firstPerson = this.analyzeFirstPersonUsage(text);
        score += firstPerson.score;
        findings.push(...firstPerson.findings);
        
        // 3.2 POSICIONAMENTO TEÓRICO PESSOAL
        const theoreticalPosition = this.detectTheoreticalPosition(text);
        score += theoreticalPosition.score;
        findings.push(...theoreticalPosition.findings);
        
        // 3.3 DÚVIDAS E QUESTIONAMENTOS
        const doubts = this.detectDoubtsAndQuestions(text);
        score += doubts.score;
        findings.push(...doubts.findings);
        
        return {
            score: Math.max(0, Math.min(100, score)),
            findings,
            weight: 0.20
        };
    }
    
    // CAMADA 4: ANÁLISE DE PROFUNDIDADE CONTEXTUAL
    analyzeContextDepth(text, metadata = {}) {
        let score = 50;
        const findings = [];
        
        // 4.1 REFERÊNCIAS A EVENTOS ESPECÍFICOS
        const specificReferences = this.detectSpecificReferences(text);
        score += specificReferences.score;
        findings.push(...specificReferences.findings);
        
        // 4.2 MENÇÃO A PROCESSOS METODOLÓGICOS
        const methodologicalProcess = this.detectMethodologicalProcess(text);
        score += methodologicalProcess.score;
        findings.push(...methodologicalProcess.findings);
        
        // 4.3 ADAPTAÇÃO AO CONTEXTO DE ENVIO
        const contextAdaptation = this.analyzeContextAdaptation(text, metadata);
        score += contextAdaptation.score;
        findings.push(...contextAdaptation.findings);
        
        return {
            score: Math.max(0, Math.min(100, score)),
            findings,
            weight: 0.15
        };
    }
    
    // =============================================
    // FUNÇÕES DETALHADAS DE DETECÇÃO
    // =============================================
    
    detectPersonalExperience(text) {
        const findings = [];
        let score = 0;
        
        // Padrões de experiência pessoal AUTÊNTICA (não genérica)
        const authenticPatterns = [
            {
                pattern: /\b(?:durante a coleta de dados|ao aplicar o questionário|nas entrevistas realizadas|durante as observações)\s+(?:em|no|na)\s+[A-Z][a-zà-ÿ]{3,20}\b/gi,
                weight: +15,
                description: "Experiência metodológica específica"
            },
            {
                pattern: /\b(?:encontrei dificuldades com|tive que adaptar|precisei reconsiderar|surpreendeu-me o fato de)\b/gi,
                weight: +12,
                description: "Desafios pessoais no processo"
            },
            {
                pattern: /\b(?:inicialmente pensei que|esperava encontrar|imaginava que seria)\b[^.!?]{20,80}\b(?:porém|contudo|no entanto)\b/gi,
                weight: +18,
                description: "Processo de reflexão e revisão"
            },
            {
                pattern: /\b(?:conversando com|orientado pelo|discutindo com)\s+(?:professor|orientador|colegas?)\s+[A-Z][a-zà-ÿ]+\b/gi,
                weight: +10,
                description: "Interações pessoais específicas"
            }
        ];
        
        // Padrões de experiência GENÉRICA (suspeita de IA)
        const genericPatterns = [
            {
                pattern: /\b(?:é importante considerar|convém destacar|cabe ressaltar)\b[^.!?]{0,60}\b(?:a relevância|a importância|o significado)\b/gi,
                weight: -8,
                description: "Formulação genérica de importância"
            },
            {
                pattern: /\b(?:este trabalho|a presente pesquisa|este estudo)\b[^.!?]{0,80}\b(?:objetiva|tem como propósito|busca analisar)\b/gi,
                weight: -6,
                description: "Formulação padrão de objetivos"
            }
        ];
        
        // Analisar padrões autênticos
        authenticPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.min(matches.length * pattern.weight, 30);
                findings.push({
                    type: 'positive',
                    description: pattern.description,
                    count: matches.length,
                    examples: matches.slice(0, 2)
                });
            }
        });
        
        // Analisar padrões genéricos
        genericPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.max(matches.length * pattern.weight, -20);
                findings.push({
                    type: 'negative',
                    description: pattern.description,
                    count: matches.length,
                    examples: matches.slice(0, 2)
                });
            }
        });
        
        return { score, findings };
    }
    
    analyzeSentenceVariance(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length < 5) {
            return { score: 0, findings: [{ type: 'neutral', description: 'Texto muito curto para análise de variância' }] };
        }
        
        const metrics = sentences.map(sentence => {
            const words = sentence.trim().split(/\s+/);
            return {
                length: words.length,
                complexity: words.filter(w => w.length > 8).length / words.length,
                structure: this.analyzeSentenceStructure(sentence)
            };
        });
        
        // Calcular variância
        const lengths = metrics.map(m => m.length);
        const meanLength = lengths.reduce((a, b) => a + b) / lengths.length;
        const variance = lengths.reduce((a, b) => a + Math.pow(b - meanLength, 2), 0) / lengths.length;
        
        const findings = [];
        let score = 0;
        
        // Baixa variância = suspeito (IA tende a manter comprimento consistente)
        if (variance < 20) {
            score -= 15;
            findings.push({
                type: 'negative',
                description: `Baixa variância no comprimento das frases (variância: ${variance.toFixed(1)})`,
                details: `Comprimento médio: ${meanLength.toFixed(1)} palavras`
            });
        } else if (variance > 60) {
            score += 10;
            findings.push({
                type: 'positive',
                description: `Alta variância no comprimento das frases (variância: ${variance.toFixed(1)})`,
                details: 'Indica escrita humana natural'
            });
        }
        
        // Analisar padrões estruturais repetitivos
        const structures = metrics.map(m => m.structure.pattern);
        const uniqueStructures = [...new Set(structures)];
        const structureRepetition = 1 - (uniqueStructures.length / structures.length);
        
        if (structureRepetition > 0.7) {
            score -= 20;
            findings.push({
                type: 'negative',
                description: `Alta repetição de estruturas frasais (${(structureRepetition * 100).toFixed(1)}% similaridade)`,
                details: 'Padrão comum em textos gerados por IA'
            });
        }
        
        return { score, findings };
    }
    
    analyzeSentenceStructure(sentence) {
        // Analisar padrão estrutural da frase
        const words = sentence.trim().split(/\s+/);
        const posTags = this.estimatePOSTags(words);
        
        // Simplificar padrão para análise
        const pattern = posTags.map(tag => tag[0]).join('');
        
        return {
            pattern,
            wordCount: words.length,
            hasSubordinate: pattern.includes('SC'),
            hasCoordinate: pattern.includes('CC')
        };
    }
    
    estimatePOSTags(words) {
        // Estimativa simplificada de classes gramaticais
        return words.map(word => {
            const lowerWord = word.toLowerCase();
            
            if (/^(?:o|a|os|as|um|uma|uns|umas)$/.test(lowerWord)) return 'ART';
            if (/^(?:e|mas|porém|contudo|entretanto|no entanto)$/.test(lowerWord)) return 'CC';
            if (/^(?:que|se|como|quando|onde)$/.test(lowerWord)) return 'SC';
            if (/^(?:é|são|era|foram|ser|estar)$/.test(lowerWord)) return 'V';
            if (/[.!?,;:]$/.test(word)) return 'PU';
            if (/^[A-ZÀ-Ý][a-zà-ý]+$/.test(word)) return 'NP';
            if (/^\d+$/.test(word)) return 'NUM';
            if (word.length > 8) return 'ADJ/ADV';
            
            return 'N';
        });
    }
    
    detectStructuralPatterns(text) {
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
        const findings = [];
        let score = 0;
        
        if (paragraphs.length < 3) {
            return { score: 0, findings };
        }
        
        // Analisar padrões de início de parágrafo
        const starters = paragraphs.map(p => {
            const firstSentence = p.split(/[.!?]+/)[0].trim();
            const firstWords = firstSentence.split(/\s+/).slice(0, 4).join(' ');
            return firstWords.toLowerCase();
        });
        
        const uniqueStarters = [...new Set(starters)];
        const starterRepetition = 1 - (uniqueStarters.length / starters.length);
        
        if (starterRepetition > 0.5) {
            score -= 18;
            findings.push({
                type: 'negative',
                description: `Padrões repetitivos de início de parágrafo (${(starterRepetition * 100).toFixed(1)}% similaridade)`,
                examples: uniqueStarters.slice(0, 3)
            });
        }
        
        // Analisar estrutura de argumentação
        const argumentPatterns = this.detectArgumentationPatterns(text);
        if (argumentPatterns.score < 0) {
            score += argumentPatterns.score;
            findings.push(...argumentPatterns.findings);
        }
        
        return { score, findings };
    }
    
    detectArgumentationPatterns(text) {
        const findings = [];
        let score = 0;
        
        // Padrões de argumentação excessivamente estruturados (típicos de IA)
        const aiArgumentPatterns = [
            {
                pattern: /Primeiramente[^.!?]{30,80}Em segundo lugar[^.!?]{30,80}Por fim/gi,
                weight: -25,
                description: "Estrutura tripartite excessivamente simétrica"
            },
            {
                pattern: /Por um lado[^.!?]{30,80}Por outro lado[^.!?]{30,80}Dessa forma/gi,
                weight: -20,
                description: "Dialética artificialmente balanceada"
            },
            {
                pattern: /Conforme[^.!?]{20,60}Além disso[^.!?]{20,60}Ademais/gi,
                weight: -15,
                description: "Acúmulo de conectivos de adição"
            }
        ];
        
        // Padrões de argumentação mais orgânicos (humanos)
        const humanArgumentPatterns = [
            {
                pattern: /\b(?:Embora|Apesar de)[^.!?]{20,80}\b(?:é importante|convém|vale)\b/gi,
                weight: +12,
                description: "Argumentação concessiva complexa"
            },
            {
                pattern: /\b(?:Surpreendentemente|Curiosamente|Interessantemente)\b[^.!?]{20,80}\b(?:contradiz|questiona|desafia)\b/gi,
                weight: +15,
                description: "Observações reflexivas pessoais"
            }
        ];
        
        aiArgumentPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.max(matches.length * pattern.weight, -40);
                findings.push({
                    type: 'negative',
                    description: pattern.description,
                    count: matches.length,
                    examples: matches.slice(0, 2)
                });
            }
        });
        
        humanArgumentPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.min(matches.length * pattern.weight, 30);
                findings.push({
                    type: 'positive',
                    description: pattern.description,
                    count: matches.length
                });
            }
        });
        
        return { score, findings };
    }
    
    analyzeVocabularyConsistency(text) {
        const words = text.toLowerCase().match(/[a-zà-ÿ]{4,}/g) || [];
        if (words.length < 100) return { score: 0, findings: [] };
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Calcular índice de repetição vocabular
        const totalWords = words.length;
        const uniqueWords = Object.keys(wordFreq).length;
        const repetitionIndex = 1 - (uniqueWords / totalWords);
        
        const findings = [];
        let score = 0;
        
        // Consistência excessiva = suspeita
        if (repetitionIndex > 0.7) {
            score -= 25;
            findings.push({
                type: 'negative',
                description: `Consistência vocabular excessiva (índice: ${(repetitionIndex * 100).toFixed(1)}%)`,
                details: `${uniqueWords} palavras únicas em ${totalWords} palavras totais`
            });
        } else if (repetitionIndex < 0.4) {
            score += 10;
            findings.push({
                type: 'positive',
                description: `Boa diversidade vocabular (índice: ${(repetitionIndex * 100).toFixed(1)}%)`
            });
        }
        
        // Analisar uso de sinônimos
        const synonymUsage = this.analyzeSynonymUsage(text);
        score += synonymUsage.score;
        findings.push(...synonymUsage.findings);
        
        return { score, findings };
    }
    
    analyzeSynonymUsage(text) {
        // Grupos de sinônimos comuns em textos acadêmicos
        const synonymGroups = [
            ['importante', 'relevante', 'significativo', 'fundamental', 'crucial'],
            ['mostrar', 'demonstrar', 'evidenciar', 'indicar', 'revelar'],
            ['analisar', 'examinar', 'investigar', 'estudar', 'pesquisar'],
            ['resultado', 'achado', 'descoberta', 'conclusão', 'constatação']
        ];
        
        const findings = [];
        let score = 0;
        
        synonymGroups.forEach(group => {
            const matches = group.filter(word => 
                new RegExp(`\\b${word}\\b`, 'gi').test(text)
            ).length;
            
            if (matches === 1) {
                // Usa apenas uma palavra do grupo (possível IA)
                score -= 8;
                findings.push({
                    type: 'negative',
                    description: `Uso limitado de sinônimos para "${group[0]}"`,
                    suggestion: `Variar com: ${group.slice(1).join(', ')}`
                });
            } else if (matches >= 3) {
                // Usa múltiplos sinônimos (humano)
                score += 12;
                findings.push({
                    type: 'positive',
                    description: `Boa variação de sinônimos para "${group[0]}"`,
                    details: `${matches} termos diferentes utilizados`
                });
            }
        });
        
        return { score, findings };
    }
    
    detectSpecificReferences(text) {
        const findings = [];
        let score = 0;
        
        // Referências específicas a eventos, datas, locais
        const specificPatterns = [
            {
                pattern: /\b(?:em|no|na)\s+\d{1,2}\s+de\s+[a-zà-ÿ]+\s+de\s+\d{4}\b/gi,
                weight: +10,
                description: "Referência a data específica"
            },
            {
                pattern: /\b(?:na|no)\s+[A-Z][a-zà-ÿ]+\s+(?:Universidade|Escola|Colégio|Faculdade)\b/gi,
                weight: +8,
                description: "Referência a instituição específica"
            },
            {
                pattern: /\b(?:conforme|segundo)\s+(?:o|a)\s+(?:artigo|estudo|pesquisa)\s+"[^"]{10,50}"\b/gi,
                weight: +12,
                description: "Citação específica de trabalho"
            },
            {
                pattern: /\b(?:durante|em)\s+(?:o|a)\s+(?:período|ano|semestre)\s+(?:de\s+)?\d{4}(?:\s*a\s*\d{4})?\b/gi,
                weight: +9,
                description: "Período temporal específico"
            }
        ];
        
        specificPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.min(matches.length * pattern.weight, 30);
                findings.push({
                    type: 'positive',
                    description: pattern.description,
                    count: matches.length,
                    examples: matches.slice(0, 2)
                });
            }
        });
        
        return { score, findings };
    }
    
    detectMethodologicalProcess(text) {
        const findings = [];
        let score = 0;
        
        // Descrições específicas de processo metodológico
        const processPatterns = [
            {
                pattern: /\b(?:os dados foram coletados|a amostra foi selecionada|as entrevistas foram transcritas)\s+(?:utilizando|com|por meio de)\b/gi,
                weight: +15,
                description: "Descrição de procedimento metodológico"
            },
            {
                pattern: /\b(?:após|depois de)\s+(?:a coleta|as entrevistas|as observações)\s+(?:os dados|as informações|o material)\b/gi,
                weight: +10,
                description: "Sequência temporal metodológica"
            },
            {
                pattern: /\b(?:foi necessário|precisamos|tivemos que)\s+(?:adaptar|modificar|alterar)\s+(?:o|a)\s+(?:protocolo|procedimento|instrumento)\b/gi,
                weight: +18,
                description: "Adaptação metodológica durante o processo"
            }
        ];
        
        processPatterns.forEach(pattern => {
            const matches = text.match(pattern.pattern) || [];
            if (matches.length > 0) {
                score += Math.min(matches.length * pattern.weight, 35);
                findings.push({
                    type: 'positive',
                    description: pattern.description,
                    count: matches.length
                });
            }
        });
        
        return { score, findings };
    }
    
    // Métodos auxiliares que precisam ser implementados
    detectContextSpecificity(text, metadata) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    detectThoughtProcess(text) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    analyzeFirstPersonUsage(text) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    detectTheoreticalPosition(text) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    detectDoubtsAndQuestions(text) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    analyzeContextAdaptation(text, metadata) {
        // Implementação simplificada
        return { score: 0, findings: [] };
    }
    
    // =============================================
    // MÉTODO PRINCIPAL DE ANÁLISE
    // =============================================
    
    analyzeText(text, metadata = {}) {
        console.log('Iniciando análise avançada de humanidade...');
        
        // Executar todas as camadas de análise
        const authenticity = this.analyzeAuthenticity(text, metadata);
        const consistency = this.analyzeConsistency(text);
        const personalVoice = this.analyzePersonalVoice(text);
        const contextDepth = this.analyzeContextDepth(text, metadata);
        
        // Calcular score ponderado
        const totalWeight = authenticity.weight + consistency.weight + 
                           personalVoice.weight + contextDepth.weight;
        
        const weightedScore = (
            (authenticity.score * authenticity.weight) +
            (consistency.score * consistency.weight) +
            (personalVoice.score * personalVoice.weight) +
            (contextDepth.score * contextDepth.weight)
        ) / totalWeight;
        
        // Determinar veredito
        const humanProbability = Math.max(0, Math.min(100, weightedScore));
        const verdict = humanProbability >= this.thresholds.authenticity ? 
            'PROVÁVEL AUTORIA HUMANA' : 'SUSPEITA DE IA GENERATIVA';
        
        // Coletar todos os achados
        const allFindings = [
            ...authenticity.findings,
            ...consistency.findings,
            ...personalVoice.findings,
            ...contextDepth.findings
        ];
        
        return {
            humanProbability,
            aiProbability: 100 - humanProbability,
            verdict,
            detailedAnalysis: {
                authenticity: authenticity.score,
                consistency: consistency.score,
                personalVoice: personalVoice.score,
                contextDepth: contextDepth.score,
                weightedScore
            },
            findings: allFindings,
            recommendations: this.generateRecommendations(allFindings, humanProbability)
        };
    }
    
    generateRecommendations(findings, humanProbability) {
        const recommendations = [];
        
        if (humanProbability < 40) {
            recommendations.push({
                severity: 'high',
                message: 'Fortes indícios de texto gerado por IA',
                action: 'Solicitar explicação detalhada do processo de escrita'
            });
        }
        
        // Recomendações baseadas em achados específicos
        const negativeFindings = findings.filter(f => f.type === 'negative');
        const positiveFindings = findings.filter(f => f.type === 'positive');
        
        if (negativeFindings.length > 3) {
            recommendations.push({
                severity: 'medium',
                message: `Múltiplos padrões suspeitos detectados (${negativeFindings.length})`,
                action: 'Verificar consistência com trabalhos anteriores do estudante'
            });
        }
        
        if (positiveFindings.length < 2 && humanProbability < 60) {
            recommendations.push({
                severity: 'medium',
                message: 'Poucos marcadores de autenticidade humana detectados',
                action: 'Questionar sobre aspectos específicos do trabalho'
            });
        }
        
        return recommendations;
    }
}

// =============================================
// PADRÕES CRÍTICOS DE DETECÇÃO
// =============================================

// Padrões CRÍTICOS (alto peso negativo)
const criticalAIPatterns = [
    // PERFEIÇÃO ESTRUTURAL EXCESSIVA
    {
        pattern: /^(?:#{1,3}\s+)?(?:INTRODUÇÃO|DESENVOLVIMENTO|CONCLUSÃO)(?:\s+#{1,3})?$/gmi,
        weight: -40,
        description: "Estrutura excessivamente formal e perfeita"
    },
    
    // TRANSICÕES PERFEITAMENTE ENCADEADAS
    {
        pattern: /\.\s+(?:Portanto|Assim|Logo|Consequentemente)\b[^.!?]{20,60}\.\s+(?:Além disso|Ademais|Outrossim)\b[^.!?]{20,60}\.\s+(?:Dessa forma|Desse modo|Por conseguinte)\b/gi,
        weight: -35,
        description: "Encadeamento perfeito de transições lógicas"
    },
    
    // CITAÇÕES EM BLOCO PERFEITAS
    {
        pattern: /"[^"]{50,150}"\s*\([^)]{10,50}\)\.\s*(?:Conforme|Segundo|De acordo com)[^.]{20,80}\."[^"]{50,150}"/gi,
        weight: -30,
        description: "Blocos de citação perfeitamente formatados"
    },
    
    // EQUILÍBRIO ARTIFICIAL DE SEÇÕES
    {
        pattern: /(?:^|\n)(\d+\.\d+[^.\n]{30,80})\.\s*\n(\d+\.\d+[^.\n]{30,80})\.\s*\n(\d+\.\d+[^.\n]{30,80})\./gmi,
        weight: -25,
        description: "Seções com comprimento artificialmente similar"
    },
    
    // VOCABULÁRIO CONSISTENTE DEMAIS
    {
        pattern: /\b(\w{8,})\b[^.]{100,200}\b\1\b[^.]{100,200}\b\1\b[^.]{100,200}\b\1\b/gi,
        weight: -45,
        description: "Repetição vocabular perfeita ao longo do texto"
    },
    
    // METALINGUAGEM ACADÊMICA GENÉRICA
    {
        pattern: /\b(?:O presente trabalho|A presente pesquisa|Este estudo)\b[^.]{50,150}\b(?:tem como objetivo|busca analisar|objetiva investigar)\b/gi,
        weight: -20,
        description: "Formulações acadêmicas excessivamente genéricas"
    }
];

// Padrões de HUMANIDADE (alto peso positivo)
const humanityPatterns = [
    // REVISÕES E CORREÇÕES
    {
        pattern: /(?:\(sic\)|\[grifo nosso\]|\[itálico do autor\]|nota do autor:)/gi,
        weight: +50,
        description: "Marcas de revisão e edição humana"
    },
    
    // EXPERIÊNCIAS PESSOAIS ESPECÍFICAS
    {
        pattern: /\b(?:durante minha|em minha experiência|na minha prática|ao trabalhar com)\s+(?:estágio|pesquisa|projeto|disciplina)\s+(?:em|no|na)\s+[A-Z][a-zà-ÿ]{3,}\b/gi,
        weight: +45,
        description: "Experiências pessoais contextualizadas"
    },
    
    // DÚVIDAS E INCERTEZAS
    {
        pattern: /\b(?:não tenho certeza|pergunto-me|questiono se|fico em dúvida|parece-me que)\b/gi,
        weight: +40,
        description: "Expressões de dúvida e incerteza genuínas"
    },
    
    // REFERÊNCIAS A EVENTOS ESPECÍFICOS
    {
        pattern: /\b(?:na aula do dia|durante o seminário|no congresso de|na reunião com)\s+\d{1,2}\/\d{1,2}\/\d{4}\b/gi,
        weight: +55,
        description: "Referências a eventos específicos com datas"
    },
    
    // PROCESSOS DE PENSAMENTO
    {
        pattern: /\b(?:inicialmente pensei|comecei por|primeiro considerei|depois percebi|então compreendi)\b/gi,
        weight: +35,
        description: "Processos de pensamento explícitos"
    }
];

// =============================================
// FUNÇÕES DE ANÁLISE AVANÇADA
// =============================================

async function analyzeAcademicTextAdvanced(text, academicLevel, subjectArea) {
    console.log('Analisando com detector avançado de humanidade...');
    
    // Inicializar detector
    const detector = new AdvancedHumanityDetector();
    
    // Preparar metadados
    const metadata = {
        academicLevel,
        subjectArea,
        timestamp: new Date().toISOString(),
        expectedLength: text.split(/\s+/).length
    };
    
    // Executar análise avançada
    const advancedAnalysis = detector.analyzeText(text, metadata);
    
    // Métricas básicas para compatibilidade
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const paragraphCount = text.split(/\n\s*\n/).length;
    
    // Análise tradicional (para comparação)
    const traditionalAnalysis = await analyzeAcademicTextTraditional(text, academicLevel, subjectArea);
    
    // Combinar resultados
    const finalHumanProbability = Math.min(
        advancedAnalysis.humanProbability,
        traditionalAnalysis.humanProbability * 0.7 // Reduz peso da análise tradicional
    );
    
    return {
        humanProbability: finalHumanProbability,
        aiProbability: 100 - finalHumanProbability,
        confidence: calculateAdvancedConfidence(advancedAnalysis, traditionalAnalysis),
        analyzedText: text,
        academicLevel,
        subjectArea,
        wordCount,
        sentenceCount,
        paragraphCount,
        advancedAnalysis: advancedAnalysis.detailedAnalysis,
        findings: advancedAnalysis.findings,
        recommendations: advancedAnalysis.recommendations,
        traditionalAnalysis: {
            humanProbability: traditionalAnalysis.humanProbability,
            aiProbability: traditionalAnalysis.aiProbability
        },
        metadata: {
            analysisMethod: 'advanced_humanity_detector',
            detectorVersion: '2.0',
            timestamp: new Date().toISOString()
        }
    };
}

async function analyzeAcademicTextTraditional(text, academicLevel, subjectArea) {
    // Manter análise tradicional para compatibilidade
    const wordCount = text.split(/\s+/).length;
    const citationDensity = calculateCitationDensity(text);
    const personalVoiceScore = analyzePersonalVoice(text);
    
    // Cálculo simplificado
    let humanProbability = 70;
    
    // Ajustes básicos
    if (citationDensity > 10) humanProbability -= 15;
    if (personalVoiceScore < 20) humanProbability -= 10;
    
    return {
        humanProbability: Math.max(30, Math.min(90, humanProbability)),
        aiProbability: 100 - humanProbability
    };
}

function calculateAdvancedConfidence(advancedAnalysis, traditionalAnalysis) {
    let confidence = 75;
    
    // Aumentar confiança se análises convergirem
    const diff = Math.abs(advancedAnalysis.humanProbability - traditionalAnalysis.humanProbability);
    if (diff < 20) confidence += 10;
    
    // Aumentar confiança baseado na quantidade de achados
    if (advancedAnalysis.findings && advancedAnalysis.findings.length > 5) {
        confidence += 5;
    }
    
    return Math.min(95, confidence);
}

// =============================================
// FUNÇÕES DE ANÁLISE ACADÊMICA (ORIGINAIS)
// =============================================

// PADRÕES ESPECÍFICOS PARA DETECÇÃO ACADÊMICA
const academicAIPatterns = [
    // 1. SOBREPOSIÇÃO DE REFERÊNCIAS EXCESSIVA
    {
        pattern: /(?:[A-ZÀ-ÿ][a-zà-ÿ]+(?: et al\.|, [A-ZÀ-ÿ]\.){1,3}(?:\s*\(\d{4}\)[^;]{0,50}){3,})/g,
        weight: 30,
        description: "Acúmulo excessivo de citações em sequência"
    },
    
    // 2. METALINGUAGEM ACADÊMICA GENÉRICA
    {
        pattern: /\b(?:importante ressaltar|cabe destacar|vale mencionar|convém observar)\b[^.!?]{0,100}\b(?:que|o fato de|a importância)\b/gi,
        weight: 25,
        description: "Fórmulas retóricas vazias típicas de IA"
    },
    
    // 3. TRANSICÕES PERFEITAS DEMASIADO
    {
        pattern: /\.\s*(?:Ademais|Além disso|Por outro lado|Contudo|Todavia)\b[^.!?]{20,80}\.\s*(?:No entanto|Entretanto|Assim sendo)\b/gi,
        weight: 28,
        description: "Encadeamento excessivamente lógico"
    },
    
    // 4. EQUILÍBRIO ARTIFICIAL DE ARGUMENTOS
    {
        pattern: /Por um lado[^.!?]{50,150}Por outro lado[^.!?]{50,150}Dessa forma/gi,
        weight: 32,
        description: "Estrutura dialética artificialmente balanceada"
    },
    
    // 5. CITAÇÕES SEM CONTEXTUALIZAÇÃO
    {
        pattern: /"[^"]{20,100}"\s*(?:\([^)]{10,50}\)\.)(?:\s*[A-ZÀ-ÿ]){1,3}[^.!?]{50,150}\."[^"]{20,100}"/g,
        weight: 35,
        description: "Citações encadeadas sem análise pessoal"
    },
    
    // 6. LINGUAGEM PERFEITAMENTE CONSISTENTE
    {
        pattern: /\b(\w{8,})\b[^.!?]{100,300}\b\1\b[^.!?]{100,300}\b\1\b/gi,
        weight: -40,
        description: "Repetição vocabular (indica humano)"
    },
    
    // 7. MARCAS DE REVISÃO HUMANA
    {
        pattern: /(?:\(sic\)|\[grifo nosso\]|\[itálico do autor\]|nota do autor:|como veremos mais adiante)/gi,
        weight: -50,
        description: "Marcas editoriais humanas"
    },
    
    // 8. INCONSISTÊNCIAS DE FORMATAÇÃO
    {
        pattern: /(?:\(\w+,\s*\d{4}[a-z]?\)|\(\w+\s+\d{4}\))/g,
        weight: -25,
        description: "Variações na formatação (humano)"
    },
    
    // 9. EXPERIÊNCIAS PESSOAIS
    {
        pattern: /\b(?:em minha experiência|na prática docente|observamos em sala|durante a pesquisa)/gi,
        weight: -60,
        description: "Experiências pessoais - forte indicador humano"
    },
    
    // 10. DÚVIDAS E INCERTEZAS
    {
        pattern: /\b(?:talvez|provavelmente|possivelmente|parece que|aparentemente|não está claro)/gi,
        weight: -30,
        description: "Expressões de incerteza acadêmica"
    }
];

function calculateCitationDensity(text) {
    const words = text.split(/\s+/).length;
    const citations = (text.match(/\([A-ZÀ-ÿ][^)]*\d{4}[^)]*\)/g) || []).length;
    return words > 0 ? (citations / (words / 1000)) : 0;
}

function analyzePersonalVoice(text) {
    let score = 0;
    
    const firstPerson = (text.match(/\b(?:eu|nós|minha|nossa|meu|nosso)\b/gi) || []).length;
    score += Math.min(firstPerson * 3, 30);
    
    const personalExp = (text.match(/\b(?:experiência|prática|observação|pesquisa|estudo)\s+(?:pessoal|própria|realizada)/gi) || []).length;
    score += personalExp * 8;
    
    const reflections = (text.match(/\b(?:questiono|pergunto|refiro|parece-me|ao meu ver)\b/gi) || []).length;
    score += reflections * 5;
    
    return Math.min(score, 100);
}

function calculatePerfectionScore(text) {
    let score = 0;
    
    const sections = text.split(/\n\s*\n/);
    if (sections.length >= 5) {
        const headingPattern = /^(?:[0-9]+\.\s+|[A-Z][A-Z\s]{5,})/gm;
        const headings = text.match(headingPattern) || [];
        if (headings.length / sections.length > 0.7) {
            score += 20;
        }
    }
    
    const transitions = text.match(/\b(?:portanto|assim|logo|pois|contudo|entretanto|no entanto)\b/gi) || [];
    if (transitions.length > (text.length / 500)) {
        score += 15;
    }
    
    const complexWords = text.match(/\b[a-zA-ZÀ-ÿ]{10,}\b/g) || [];
    const totalWords = text.split(/\s+/).length;
    if (complexWords.length / totalWords > 0.15) {
        score += 25;
    }
    
    return score;
}

function detectAcademicAIPatterns(text) {
    let totalScore = 0;
    
    academicAIPatterns.forEach(patternObj => {
        try {
            const matches = text.match(patternObj.pattern) || [];
            if (matches.length > 0) {
                const score = patternObj.weight < 0 ? 
                    Math.max(-100, matches.length * patternObj.weight) : 
                    Math.min(matches.length * patternObj.weight, 100);
                
                totalScore += score;
            }
        } catch (error) {
            console.warn('Erro ao processar padrão:', error);
        }
    });
    
    return Math.min(100, Math.max(-100, totalScore / 3));
}

function calculateComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    let totalWords = 0;
    let complexWords = 0;
    
    sentences.forEach(sentence => {
        const words = sentence.split(/\s+/);
        totalWords += words.length;
        
        words.forEach(word => {
            if (word.length >= 8 && /[a-zA-ZÀ-ÿ]/.test(word)) {
                complexWords++;
            }
        });
    });
    
    return totalWords > 0 ? Math.round((complexWords / totalWords) * 100) : 0;
}

// ALGORITMO PRINCIPAL DE ANÁLISE ACADÊMICA (ORIGINAL)
async function analyzeAcademicText(text, academicLevel, subjectArea) {
    console.log('Iniciando análise acadêmica para nível:', academicLevel);
    
    // Configurações por nível
    const levelConfig = {
        undergrad: {
            maxCitationDensity: 3,
            expectedComplexity: 40,
            personalVoiceWeight: 1.2,
            perfectionThreshold: 30
        },
        masters: {
            maxCitationDensity: 5,
            expectedComplexity: 60,
            personalVoiceWeight: 1.0,
            perfectionThreshold: 40
        },
        doctoral: {
            maxCitationDensity: 8,
            expectedComplexity: 80,
            personalVoiceWeight: 0.8,
            perfectionThreshold: 50
        },
        researcher: {
            maxCitationDensity: 10,
            expectedComplexity: 90,
            personalVoiceWeight: 0.6,
            perfectionThreshold: 60
        }
    };
    
    const config = levelConfig[academicLevel] || levelConfig.masters;
    
    try {
        // Cálculo de métricas básicas
        const wordCount = text.split(/\s+/).length;
        const sentenceCount = text.split(/[.!?]+/).length - 1;
        const paragraphCount = text.split(/\n\s*\n/).length;
        
        // Métricas avançadas
        const citationDensity = calculateCitationDensity(text);
        const personalVoiceScore = analyzePersonalVoice(text);
        const complexityScore = calculateComplexity(text);
        const perfectionScore = calculatePerfectionScore(text);
        const aiPatternScore = detectAcademicAIPatterns(text);
        
        // Cálculo da probabilidade (base acadêmica)
        let humanProbability = 70; // Base mais alta para benefício da dúvida
        
        // Ajustes baseados em métricas
        const citationDeviation = Math.max(0, citationDensity - config.maxCitationDensity);
        humanProbability -= citationDeviation * 5;
        
        const complexityDeviation = Math.abs(complexityScore - config.expectedComplexity);
        humanProbability -= complexityDeviation * 0.7;
        
        humanProbability += (personalVoiceScore * config.personalVoiceWeight * 0.3);
        
        humanProbability -= (aiPatternScore > 0 ? aiPatternScore * 0.8 : 0);
        
        const perfectionPenalty = Math.max(0, perfectionScore - config.perfectionThreshold);
        humanProbability -= perfectionPenalty * 0.6;
        
        // Limites finais
        humanProbability = Math.max(10, Math.min(95, humanProbability));
        const aiProbability = 100 - humanProbability;
        
        // Cálculo de confiança
        const confidence = calculateAcademicConfidence(
            humanProbability,
            citationDensity,
            personalVoiceScore,
            complexityDeviation,
            aiPatternScore
        );
        
        // Gerar alertas acadêmicos
        const academicAlerts = generateAcademicAlerts(
            text,
            academicLevel,
            config,
            citationDensity,
            complexityScore,
            personalVoiceScore,
            perfectionScore,
            aiPatternScore
        );
        
        // Gerar métricas para display
        const advancedMetrics = generateAdvancedMetrics({
            citationDensity,
            personalVoiceScore,
            complexityScore,
            perfectionScore,
            aiPatternScore,
            wordCount,
            sentenceCount,
            paragraphCount
        });
        
        // Gerar recomendações
        const recommendations = generateRecommendations(
            humanProbability,
            academicAlerts,
            academicLevel
        );
        
        return {
            humanProbability,
            aiProbability,
            confidence,
            analyzedText: text,
            academicLevel,
            subjectArea,
            wordCount,
            sentenceCount,
            paragraphCount,
            advancedMetrics,
            academicAlerts,
            recommendations,
            detailedAnalysis: {
                citationDensity,
                personalVoiceScore,
                complexityScore,
                perfectionScore,
                aiPatternScore,
                citationDeviation,
                complexityDeviation
            }
        };
        
    } catch (error) {
        console.error('Erro na análise acadêmica:', error);
        throw new Error(`Falha na análise: ${error.message}`);
    }
}

function calculateAcademicConfidence(humanProb, citationDensity, personalVoice, complexityDev, aiPatternScore) {
    let confidence = 70;
    
    if (citationDensity > 10 || personalVoice > 50) confidence += 10;
    if (complexityDev < 20) confidence += 8;
    if (aiPatternScore > 30) confidence += 12;
    if (humanProb > 80 || humanProb < 30) confidence += 5;
    
    return Math.min(95, Math.max(50, confidence));
}

function generateAcademicAlerts(text, level, config, citationDensity, complexity, personalVoice, perfection, aiPatterns) {
    const alerts = [];
    
    // Alertas de citação
    if (citationDensity > config.maxCitationDensity * 1.5) {
        alerts.push({
            type: 'warning',
            icon: 'fa-quote-right',
            title: 'Densidade de Citações Elevada',
            message: `${citationDensity.toFixed(1)} citações por 1000 palavras (esperado: ${config.maxCitationDensity})`,
            severity: citationDensity > config.maxCitationDensity * 2 ? 'high' : 'medium'
        });
    }
    
    // Alertas de complexidade
    if (complexity > config.expectedComplexity + 25) {
        alerts.push({
            type: 'warning',
            icon: 'fa-brain',
            title: 'Complexidade Incompatível',
            message: `Complexidade lexical: ${complexity}% (esperado: ${config.expectedComplexity}%)`,
            severity: 'high'
        });
    } else if (complexity < config.expectedComplexity - 20) {
        alerts.push({
            type: 'info',
            icon: 'fa-brain',
            title: 'Complexidade Abaixo do Esperado',
            message: `Complexidade lexical: ${complexity}% (esperado: ${config.expectedComplexity}%)`,
            severity: 'low'
        });
    }
    
    // Alertas de voz pessoal
    if (personalVoice < 20 && level === 'undergrad') {
        alerts.push({
            type: 'warning',
            icon: 'fa-user',
            title: 'Pouca Voz Pessoal',
            message: `Voz pessoal: ${personalVoice}% (espera-se mais posicionamento próprio)`,
            severity: 'medium'
        });
    }
    
    // Alertas de perfeição
    if (perfection > config.perfectionThreshold + 20) {
        alerts.push({
            type: 'danger',
            icon: 'fa-star',
            title: 'Estrutura Excessivamente Perfeita',
            message: 'Padrão comum em textos gerados por IA',
            severity: 'high'
        });
    }
    
    // Alertas de padrões de IA
    if (aiPatterns > 40) {
        alerts.push({
            type: 'danger',
            icon: 'fa-robot',
            title: 'Padrões de IA Detectados',
            message: 'Múltiplos padrões característicos de textos gerados por IA',
            severity: 'high'
        });
    }
    
    // Bônus para características humanas
    if (personalVoice > 60) {
        alerts.push({
            type: 'success',
            icon: 'fa-user-check',
            title: 'Forte Voz Pessoal Detectada',
            message: 'Bom indicador de autoria humana',
            severity: 'low'
        });
    }
    
    return alerts;
}

function generateAdvancedMetrics(data) {
    return [
        {
            title: 'Densidade de Citações',
            value: `${data.citationDensity.toFixed(1)}/1000`,
            type: data.citationDensity > 8 ? 'danger' : data.citationDensity > 5 ? 'warning' : 'good',
            label: data.citationDensity > 8 ? 'Alta' : data.citationDensity > 5 ? 'Moderada' : 'Normal'
        },
        {
            title: 'Voz Pessoal',
            value: `${data.personalVoiceScore}%`,
            type: data.personalVoiceScore > 60 ? 'good' : data.personalVoiceScore > 30 ? 'warning' : 'danger',
            label: data.personalVoiceScore > 60 ? 'Forte' : data.personalVoiceScore > 30 ? 'Moderada' : 'Fraca'
        },
        {
            title: 'Complexidade',
            value: `${data.complexityScore}%`,
            type: data.complexityScore > 80 ? 'danger' : data.complexityScore > 50 ? 'warning' : 'good',
            label: data.complexityScore > 80 ? 'Alta' : data.complexityScore > 50 ? 'Média' : 'Baixa'
        },
        {
            title: 'Perfeição Estrutural',
            value: `${data.perfectionScore}%`,
            type: data.perfectionScore > 60 ? 'danger' : data.perfectionScore > 40 ? 'warning' : 'good',
            label: data.perfectionScore > 60 ? 'Alta' : data.perfectionScore > 40 ? 'Média' : 'Normal'
        },
        {
            title: 'Padrões de IA',
            value: `${Math.max(0, data.aiPatternScore)}%`,
            type: data.aiPatternScore > 40 ? 'danger' : data.aiPatternScore > 20 ? 'warning' : 'good',
            label: data.aiPatternScore > 40 ? 'Fortes' : data.aiPatternScore > 20 ? 'Moderados' : 'Fracos'
        },
        {
            title: 'Estatísticas',
            value: `${data.wordCount}`,
            type: 'info',
            label: `${data.sentenceCount} sent, ${data.paragraphCount} parág`
        }
    ];
}

function generateRecommendations(humanProb, alerts, academicLevel) {
    const recommendations = [];
    
    if (humanProb >= 70) {
        recommendations.push({
            icon: 'fa-thumbs-up',
            text: 'Alta probabilidade de autoria estudantil',
            type: 'success'
        });
    } else if (humanProb >= 40) {
        recommendations.push({
            icon: 'fa-balance-scale',
            text: 'Características mistas - análise cuidadosa recomendada',
            type: 'warning'
        });
    } else {
        recommendations.push({
            icon: 'fa-exclamation-triangle',
            text: 'Fortes indícios de uso de IA - ação recomendada',
            type: 'danger'
        });
    }
    
    const highSeverityAlerts = alerts.filter(a => a.severity === 'high');
    if (highSeverityAlerts.length > 0) {
        recommendations.push({
            icon: 'fa-comment',
            text: `${highSeverityAlerts.length} alertas críticos - considere conversa com estudante`,
            type: 'danger'
        });
    }
    
    if (academicLevel === 'undergrad' && humanProb < 50) {
        recommendations.push({
            icon: 'fa-user-graduate',
            text: 'Para graduação: verificar consistência com habilidades anteriores',
            type: 'info'
        });
    }
    
    recommendations.push({
        icon: 'fa-file-signature',
        text: 'Solicite que o estudante explique pontos-chave do trabalho',
        type: 'info'
    });
    
    return recommendations;
}

// =============================================
// FUNÇÕES DE EXIBIÇÃO (ATUALIZADAS)
// =============================================

function displayResults(result) {
    if (!result) {
        showAlert('Erro: Resultado da análise não disponível', 'error');
        return;
    }
    
    try {
        // Atualizar probabilidade
        updateProbabilityDisplay(result);
        
        // Atualizar alertas
        updateAcademicAlerts(result.academicAlerts);
        
        // Atualizar métricas
        updateAdvancedMetricsDisplay(result.advancedMetrics);
        
        // Atualizar recomendações
        updateRecommendationsDisplay(result.recommendations);
        
        // Atualizar análise detalhada
        updateDetailedAnalysis(result);
        
        // Atualizar prévia do texto
        updateTextPreview(result.analyzedText);
        
        // Mostrar resultados avançados
        displayAdvancedFindings(result);
        
        // Mostrar resultados
        document.getElementById('resultsContainer').style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao exibir resultados:', error);
        showAlert('Erro ao exibir resultados', 'error');
    }
}

function updateProbabilityDisplay(result) {
    const humanProb = result.humanProbability || 50;
    const aiProb = result.aiProbability || 50;
    const confidence = result.confidence || 70;
    
    // Atualizar barra
    const humanProbBar = document.getElementById('humanProbabilityBar');
    const markerLabel = document.getElementById('markerLabel');
    
    if (humanProbBar) {
        humanProbBar.style.width = `${humanProb}%`;
    }
    if (markerLabel) {
        markerLabel.textContent = `${humanProb}%`;
    }
    
    // Atualizar valores
    const humanValue = document.getElementById('humanProbabilityValue');
    const aiValue = document.getElementById('aiProbabilityValue');
    const confidenceBadge = document.getElementById('confidenceBadge');
    
    if (humanValue) humanValue.textContent = `${humanProb}%`;
    if (aiValue) aiValue.textContent = `${aiProb}%`;
    if (confidenceBadge) {
        confidenceBadge.innerHTML = `<i class="fas fa-shield-alt"></i><span>CONFIANÇA: ${confidence}%</span>`;
    }
    
    // Atualizar veredito
    const verdictTitle = document.getElementById('verdictTitle');
    const verdictDescription = document.getElementById('verdictDescription');
    
    let verdict = '';
    let description = '';
    let color = '';
    
    if (humanProb >= 70) {
        verdict = 'PROVÁVEL AUTORIA ESTUDANTIL';
        description = 'O trabalho apresenta características consistentes com autoria humana';
        color = '#27ae60';
    } else if (humanProb >= 40) {
        verdict = 'CARACTERÍSTICAS MISTAS';
        description = 'Recomenda-se análise cuidadosa e diálogo com o estudante';
        color = '#f39c12';
    } else {
        verdict = 'FORTES INDÍCIOS DE USO DE IA';
        description = 'Múltiplos indicadores sugerem uso de inteligência artificial';
        color = '#e74c3c';
    }
    
    if (verdictTitle) {
        verdictTitle.textContent = verdict;
        verdictTitle.style.color = color;
    }
    if (verdictDescription) {
        verdictDescription.textContent = description;
    }
}

function updateAcademicAlerts(alerts) {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    if (!alerts || alerts.length === 0) {
        alertsList.innerHTML = `
            <div class="alert-item alert-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Nenhum alerta crítico</strong>
                    <p>O trabalho não apresentou desvios significativos</p>
                </div>
            </div>
        `;
        return;
    }
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <i class="fas ${alert.icon}"></i>
            <div>
                <strong>${alert.title}</strong>
                <p>${alert.message}</p>
            </div>
        </div>
    `).join('');
}

function updateAdvancedMetricsDisplay(metrics) {
    const metricsContainer = document.getElementById('advancedMetrics');
    if (!metricsContainer || !metrics) return;
    
    metricsContainer.innerHTML = metrics.map(metric => `
        <div class="metric-card metric-${metric.type}">
            <div class="metric-title">${metric.title}</div>
            <div class="metric-value">${metric.value}</div>
            <div class="metric-label">${metric.label}</div>
        </div>
    `).join('');
}

function updateRecommendationsDisplay(recommendations) {
    const recList = document.getElementById('recommendationsList');
    if (!recList || !recommendations) return;
    
    recList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item recommendation-${rec.type}">
            <i class="fas ${rec.icon}"></i>
            <span>${rec.text}</span>
        </div>
    `).join('');
}

function updateDetailedAnalysis(result) {
    const analysisGrid = document.getElementById('analysisGrid');
    if (!analysisGrid) return;
    
    const details = result.detailedAnalysis || {};
    
    analysisGrid.innerHTML = `
        <div class="analysis-item">
            <div class="analysis-label">Nível Analisado</div>
            <div class="analysis-value">${result.academicLevel.toUpperCase()}</div>
        </div>
        <div class="analysis-item">
            <div class="analysis-label">Área do Conhecimento</div>
            <div class="analysis-value">${result.subjectArea}</div>
        </div>
        <div class="analysis-item">
            <div class="analysis-label">Densidade de Citações</div>
            <div class="analysis-value">${details.citationDensity?.toFixed(1) || 0}/1000 palavras</div>
        </div>
        <div class="analysis-item">
            <div class="analysis-label">Voz Pessoal</div>
            <div class="analysis-value">${details.personalVoiceScore || 0}%</div>
        </div>
        <div class="analysis-item">
            <div class="analysis-label">Complexidade Lexical</div>
            <div class="analysis-value">${details.complexityScore || 0}%</div>
        </div>
        <div class="analysis-item">
            <div class="analysis-label">Padrões de IA Detectados</div>
            <div class="analysis-value">${Math.max(0, details.aiPatternScore || 0)}%</div>
        </div>
    `;
}

function updateTextPreview(text) {
    const preview = document.getElementById('textPreview');
    if (!preview) return;
    
    if (!text || text.trim().length === 0) {
        preview.innerHTML = `
            <div class="placeholder-text">
                <i class="fas fa-file"></i>
                <p>Nenhum texto para exibir. Faça uma análise primeiro.</p>
            </div>
        `;
        return;
    }
    
    // Limitar e formatar texto
    let displayText = text.length > 2000 ? text.substring(0, 2000) + '... [texto truncado para exibição]' : text;
    
    // Adicionar destaques básicos
    displayText = displayText.replace(/\n/g, '<br>');
    
    preview.innerHTML = `<div class="text-content">${displayText}</div>`;
}

// =============================================
// FUNÇÃO DE EXIBIÇÃO DE ACHADOS AVANÇADOS
// =============================================

function displayAdvancedFindings(result) {
    // Criar ou encontrar container para achados avançados
    let findingsContainer = document.getElementById('advancedFindings');
    
    if (!findingsContainer) {
        // Criar container se não existir
        findingsContainer = document.createElement('div');
        findingsContainer.id = 'advancedFindings';
        findingsContainer.className = 'advanced-findings';
        
        // Inserir após a seção de métricas avançadas
        const advancedMetrics = document.querySelector('.advanced-metrics');
        if (advancedMetrics) {
            advancedMetrics.parentNode.insertBefore(findingsContainer, advancedMetrics.nextSibling);
        } else {
            // Fallback: inserir antes das recomendações
            const recommendations = document.querySelector('.recommendations');
            if (recommendations) {
                recommendations.parentNode.insertBefore(findingsContainer, recommendations);
            }
        }
    }
    
    if (!result.findings || result.findings.length === 0) {
        findingsContainer.style.display = 'none';
        return;
    }
    
    // Separar achados por tipo
    const positiveFindings = result.findings.filter(f => f.type === 'positive');
    const negativeFindings = result.findings.filter(f => f.type === 'negative');
    const warningFindings = result.findings.filter(f => f.type === 'warning');
    
    let html = `
        <div class="findings-summary">
            <h4><i class="fas fa-search"></i> ANÁLISE DETALHADA DE HUMANIDADE</h4>
            <div class="findings-stats">
                <span class="stat-positive">
                    <i class="fas fa-check-circle"></i> ${positiveFindings.length} marcadores humanos
                </span>
                <span class="stat-negative">
                    <i class="fas fa-exclamation-circle"></i> ${negativeFindings.length} padrões suspeitos
                </span>
                <span class="stat-warning">
                    <i class="fas fa-exclamation-triangle"></i> ${warningFindings.length} alertas
                </span>
            </div>
        </div>
    `;
    
    // Achados negativos (críticos)
    if (negativeFindings.length > 0) {
        html += `
            <div class="findings-section findings-negative">
                <h5><i class="fas fa-robot"></i> PADRÕES SUSPEITOS DETECTADOS</h5>
                <div class="findings-list">
        `;
        
        negativeFindings.slice(0, 5).forEach(finding => {
            html += `
                <div class="finding-item">
                    <div class="finding-description">${finding.description}</div>
                    ${finding.examples ? `
                        <div class="finding-examples">
                            <small>Exemplos: ${finding.examples.slice(0, 2).map(e => 
                                `<code>${e.substring(0, 80)}${e.length > 80 ? '...' : ''}</code>`
                            ).join(', ')}</small>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    // Achados positivos
    if (positiveFindings.length > 0) {
        html += `
            <div class="findings-section findings-positive">
                <h5><i class="fas fa-user-check"></i> MARCADORES HUMANOS DETECTADOS</h5>
                <div class="findings-list">
        `;
        
        positiveFindings.slice(0, 5).forEach(finding => {
            html += `
                <div class="finding-item">
                    <div class="finding-description">${finding.description}</div>
                    ${finding.details ? `
                        <div class="finding-details"><small>${finding.details}</small></div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    // Análise comparativa
    if (result.traditionalAnalysis) {
        const diff = Math.abs(result.humanProbability - result.traditionalAnalysis.humanProbability);
        
        html += `
            <div class="findings-section findings-comparative">
                <h5><i class="fas fa-balance-scale"></i> ANÁLISE COMPARATIVA</h5>
                <div class="comparison-grid">
                    <div class="comparison-item">
                        <div class="comparison-label">Detector Avançado</div>
                        <div class="comparison-value ${result.humanProbability < 40 ? 'value-low' : result.humanProbability < 60 ? 'value-medium' : 'value-high'}">
                            ${result.humanProbability}% humano
                        </div>
                    </div>
                    <div class="comparison-item">
                        <div class="comparison-label">Análise Tradicional</div>
                        <div class="comparison-value">
                            ${result.traditionalAnalysis.humanProbability}% humano
                        </div>
                    </div>
                    <div class="comparison-item">
                        <div class="comparison-label">Discrepância</div>
                        <div class="comparison-value ${diff > 30 ? 'value-warning' : ''}">
                            ${diff.toFixed(1)} pontos
                        </div>
                    </div>
                </div>
                ${diff > 30 ? `
                    <div class="comparison-alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Grande discrepância detectada - análise manual recomendada</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    findingsContainer.innerHTML = html;
    findingsContainer.style.display = 'block';
    
    // Adicionar estilos CSS dinâmicos
    addAdvancedFindingsStyles();
}

function addAdvancedFindingsStyles() {
    if (!document.getElementById('advanced-findings-styles')) {
        const style = document.createElement('style');
        style.id = 'advanced-findings-styles';
        style.textContent = `
            .advanced-findings {
                background: white;
                border-radius: var(--border-radius);
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: var(--box-shadow-sm);
            }
            
            .findings-summary {
                margin-bottom: 20px;
            }
            
            .findings-summary h4 {
                color: var(--primary-color);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .findings-stats {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .findings-stats span {
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .stat-positive {
                background: rgba(39, 174, 96, 0.1);
                color: var(--success-color);
            }
            
            .stat-negative {
                background: rgba(231, 76, 60, 0.1);
                color: var(--danger-color);
            }
            
            .stat-warning {
                background: rgba(243, 156, 18, 0.1);
                color: var(--warning-color);
            }
            
            .findings-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color);
            }
            
            .findings-section h5 {
                color: var(--primary-color);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1em;
            }
            
            .findings-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .finding-item {
                padding: 12px 15px;
                border-radius: var(--border-radius-sm);
                background: var(--light-color);
            }
            
            .findings-negative .finding-item {
                border-left: 4px solid var(--danger-color);
            }
            
            .findings-positive .finding-item {
                border-left: 4px solid var(--success-color);
            }
            
            .finding-description {
                color: var(--primary-color);
                font-weight: 500;
                margin-bottom: 5px;
            }
            
            .finding-examples, .finding-details {
                color: var(--gray-color);
                font-size: 0.9em;
            }
            
            .finding-examples code {
                background: rgba(0,0,0,0.05);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.9em;
            }
            
            .comparison-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 15px;
            }
            
            @media (max-width: 768px) {
                .comparison-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .comparison-item {
                text-align: center;
                padding: 15px;
                background: var(--light-color);
                border-radius: var(--border-radius-sm);
            }
            
            .comparison-label {
                font-size: 0.9em;
                color: var(--gray-color);
                margin-bottom: 8px;
            }
            
            .comparison-value {
                font-size: 1.3em;
                font-weight: 700;
            }
            
            .value-high {
                color: var(--success-color);
            }
            
            .value-medium {
                color: var(--warning-color);
            }
            
            .value-low {
                color: var(--danger-color);
            }
            
            .value-warning {
                color: var(--danger-color);
                animation: pulse 2s infinite;
            }
            
            .comparison-alert {
                background: rgba(231, 76, 60, 0.1);
                border: 1px solid var(--danger-color);
                padding: 12px 15px;
                border-radius: var(--border-radius-sm);
                color: var(--danger-color);
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// =============================================
// FUNÇÕES DE MANIPULAÇÃO DE ARQUIVOS
// =============================================

async function extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        reader.onload = async function(e) {
            try {
                let text = '';
                
                switch (fileExtension) {
                    case 'txt':
                        text = e.target.result;
                        break;
                        
                    case 'pdf':
                        if (typeof pdfjsLib === 'undefined') {
                            throw new Error('Biblioteca PDF.js não disponível');
                        }
                        text = await extractTextFromPDF(e.target.result);
                        break;
                        
                    case 'docx':
                    case 'doc':
                        if (typeof mammoth === 'undefined') {
                            throw new Error('Biblioteca Mammoth não disponível');
                        }
                        text = await extractTextFromDOCX(e.target.result);
                        break;
                        
                    default:
                        reject(new Error(`Formato ${fileExtension} não suportado`));
                        return;
                }
                
                resolve(text);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        
        if (fileExtension === 'pdf') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsBinaryString(file);
        }
    });
}

async function extractTextFromPDF(arrayBuffer) {
    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    } catch (error) {
        throw new Error(`Erro ao processar PDF: ${error.message}`);
    }
}

async function extractTextFromDOCX(arrayBuffer) {
    try {
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        return result.value;
    } catch (error) {
        throw new Error(`Erro ao processar documento: ${error.message}`);
    }
}

// =============================================
// FUNÇÕES DE ALERTA
// =============================================

function showAlert(message, type = 'info', duration = 5000) {
    try {
        // Remover alertas anteriores
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) existingAlert.remove();
        
        // Criar alerta
        const alert = document.createElement('div');
        alert.className = `alert-message alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Estilos
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-family: 'Inter', sans-serif;
        `;
        
        // Botão de fechar
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        });
        
        document.body.appendChild(alert);
        
        // Auto-remover
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, duration);
        
    } catch (error) {
        console.error('Erro ao mostrar alerta:', error);
    }
}

// =============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Detector Acadêmico de IA Versão 3.0 iniciado');
    
    // ELEMENTOS PRINCIPAIS
    const elements = {
        uploadArea: document.getElementById('uploadArea'),
        fileInput: document.getElementById('fileInput'),
        textInput: document.getElementById('textInput'),
        analyzeBtn: document.getElementById('analyzeBtn'),
        clearBtn: document.getElementById('clearBtn'),
        loading: document.getElementById('loading'),
        resultsContainer: document.getElementById('resultsContainer'),
        academicLevel: document.getElementById('academicLevel'),
        subjectArea: document.getElementById('subjectArea'),
        expectedLength: document.getElementById('expectedLength'),
        contextIndicator: document.getElementById('contextIndicator'),
        charCount: document.getElementById('charCount'),
        helpBtn: document.getElementById('helpBtn'),
        closeHelpModal: document.getElementById('closeHelpModal'),
        helpModal: document.getElementById('helpModal'),
        generateReportBtn: document.getElementById('generateReportBtn'),
        toggleAnalysis: document.getElementById('toggleAnalysis'),
        analysisContent: document.getElementById('analysisContent')
    };
    
    // INICIALIZAR
    initializeApp();
    
    function initializeApp() {
        setupEventListeners();
        updateContextIndicator();
        setupTextInputListener();
        
        // Adicionar animações CSS
        addAlertAnimations();
        
        console.log('Aplicação inicializada com sucesso');
    }
    
    function setupEventListeners() {
        // Upload
        elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
        elements.uploadArea.addEventListener('dragover', handleDragOver);
        elements.uploadArea.addEventListener('drop', handleFileDrop);
        
        // Input de arquivo
        elements.fileInput.addEventListener('change', handleFileInputChange);
        
        // Contexto acadêmico
        elements.academicLevel.addEventListener('change', updateContextIndicator);
        elements.subjectArea.addEventListener('change', updateContextIndicator);
        
        // Botões principais
        elements.analyzeBtn.addEventListener('click', startAnalysis);
        elements.clearBtn.addEventListener('click', clearAll);
        elements.helpBtn.addEventListener('click', () => elements.helpModal.style.display = 'block');
        elements.closeHelpModal.addEventListener('click', () => elements.helpModal.style.display = 'none');
        
        // Botões de relatório
        elements.generateReportBtn.addEventListener('click', generateReport);
        elements.toggleAnalysis.addEventListener('click', toggleAnalysisView);
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === elements.helpModal) {
                elements.helpModal.style.display = 'none';
            }
        });
    }
    
    function setupTextInputListener() {
        elements.textInput.addEventListener('input', function() {
            const count = this.value.length;
            elements.charCount.textContent = count.toLocaleString();
            
            // Auto-expand
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    function updateContextIndicator() {
        if (!elements.contextIndicator) return;
        
        const levelNames = {
            undergrad: 'Graduação',
            masters: 'Mestrado',
            doctoral: 'Doutorado',
            researcher: 'Pesquisador'
        };
        
        const areaNames = {
            humanities: 'Humanidades',
            social: 'Ciências Sociais',
            natural: 'Ciências Naturais',
            applied: 'Ciências Aplicadas'
        };
        
        const level = elements.academicLevel.value;
        const area = elements.subjectArea.value;
        
        elements.contextIndicator.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Modo: ${levelNames[level]} em ${areaNames[area]} - Análise contextual ativada</span>
        `;
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        elements.uploadArea.style.background = 'linear-gradient(135deg, #e0e7ff, #d6e0ff)';
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        elements.uploadArea.style.background = 'linear-gradient(135deg, #f8f9ff, #eef2ff)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            elements.fileInput.files = files;
            handleFileSelection(files[0]);
        }
    }
    
    function handleFileInputChange(e) {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    }
    
    function handleFileSelection(file) {
        try {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            
            // Validar
            const validExtensions = ['pdf', 'docx', 'doc', 'txt'];
            if (!validExtensions.includes(fileExtension)) {
                showAlert('Formato não suportado. Use PDF, DOCX, DOC ou TXT.', 'error');
                return;
            }
            
            // Limpar textarea
            elements.textInput.value = '';
            elements.charCount.textContent = '0';
            
            // Atualizar interface
            elements.uploadArea.innerHTML = `
                <div class="upload-icon" style="color: #27ae60;">
                    <i class="fas fa-file-check"></i>
                </div>
                <h3>Arquivo selecionado</h3>
                <p class="upload-subtitle"><strong>${fileName}</strong></p>
                <div class="file-types">
                    <span class="file-type-badge">${fileExtension.toUpperCase()}</span>
                </div>
                <p class="upload-note">${formatFileSize(file.size)}</p>
                <input type="file" id="fileInput" class="file-input" accept=".pdf,.docx,.doc,.txt">
            `;
            
            showAlert(`Arquivo "${fileName}" pronto para análise`, 'success');
            
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            showAlert('Erro ao processar arquivo', 'error');
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // =============================================
    // FUNÇÃO PRINCIPAL DE ANÁLISE (ATUALIZADA)
    // =============================================
    
    async function startAnalysis() {
        const file = elements.fileInput?.files[0];
        const text = elements.textInput?.value.trim() || '';
        const academicLevel = elements.academicLevel.value;
        const subjectArea = elements.subjectArea.value;
        
        console.log('Iniciando análise acadêmica avançada...', { academicLevel, subjectArea });
        
        // Validação
        if (!file && !text) {
            showAlert('Selecione um arquivo ou cole o texto do trabalho', 'error');
            return;
        }
        
        if (text && text.length < 200) {
            showAlert('Texto muito curto. Mínimo recomendado: 200 caracteres', 'warning');
            return;
        }
        
        // Mostrar loading
        elements.loading.style.display = 'block';
        elements.resultsContainer.style.display = 'none';
        
        // Atualizar progresso
        updateProgress(0, 'Inicializando análise...');
        
        try {
            let content = '';
            
            // Extrair conteúdo
            if (file) {
                updateProgress(20, `Processando arquivo: ${file.name}...`);
                showAlert(`Processando ${file.name}...`, 'info');
                content = await extractTextFromFile(file);
            } else {
                content = text;
            }
            
            updateProgress(40, 'Extraindo conteúdo do texto...');
            
            // Validar conteúdo
            if (!content || content.trim().length < 200) {
                throw new Error('Conteúdo insuficiente para análise. Mínimo: 200 caracteres.');
            }
            
            updateProgress(60, 'Executando detector avançado de humanidade...');
            
            // USAR DETECTOR AVANÇADO
            showAlert('Analisando com algoritmo especializado...', 'info');
            const analysisResult = await analyzeAcademicTextAdvanced(
                content, 
                academicLevel, 
                subjectArea
            );
            
            // VALIDAÇÃO RIGOROSA
            if (analysisResult.humanProbability > 70 && analysisResult.traditionalAnalysis.humanProbability < 40) {
                // Discrepância suspeita - análise mais profunda
                console.warn('Discrepância detectada entre análises:', {
                    advanced: analysisResult.humanProbability,
                    traditional: analysisResult.traditionalAnalysis.humanProbability
                });
                
                // Aplicar penalidade por discrepância
                analysisResult.humanProbability = Math.min(
                    analysisResult.humanProbability,
                    analysisResult.traditionalAnalysis.humanProbability + 20
                );
                analysisResult.aiProbability = 100 - analysisResult.humanProbability;
                
                analysisResult.findings.push({
                    type: 'warning',
                    description: 'Discrepância detectada entre diferentes métodos de análise',
                    details: 'Sugere possível sofisticação no uso de IA'
                });
            }
            
            updateProgress(90, 'Preparando resultados...');
            
            // Validar resultado
            if (!analysisResult || typeof analysisResult.humanProbability === 'undefined') {
                throw new Error('A análise não retornou resultados válidos.');
            }
            
            // Armazenar e exibir
            currentAnalysisResult = analysisResult;
            analysisHistory.push({
                ...analysisResult,
                timestamp: new Date().toISOString(),
                fileName: file ? file.name : 'Texto colado'
            });
            
            updateProgress(100, 'Análise concluída!');
            
            setTimeout(() => {
                elements.loading.style.display = 'none';
                displayResults(analysisResult);
                showAlert('Análise acadêmica concluída com sucesso!', 'success');
            }, 500);
            
        } catch (error) {
            console.error('Erro na análise:', error);
            showAlert(`Erro na análise: ${error.message}`, 'error');
            
            // Mostrar fallback
            const fallbackResult = {
                humanProbability: 50,
                aiProbability: 50,
                confidence: 50,
                analyzedText: text || 'Texto não disponível',
                academicLevel,
                subjectArea,
                wordCount: text.split(/\s+/).length,
                sentenceCount: text.split(/[.!?]+/).length - 1,
                paragraphCount: text.split(/\n\s*\n/).length,
                academicAlerts: [{
                    type: 'warning',
                    icon: 'fa-exclamation-triangle',
                    title: 'Análise Limitada',
                    message: 'Use um texto mais extenso para análise completa',
                    severity: 'low'
                }],
                recommendations: [{
                    icon: 'fa-info-circle',
                    text: 'Análise básica devido a limitações técnicas',
                    type: 'warning'
                }]
            };
            
            elements.loading.style.display = 'none';
            displayResults(fallbackResult);
            
        } finally {
            // Resetar progresso
            setTimeout(() => {
                const progressFill = document.getElementById('progressFill');
                const progressText = document.getElementById('progressText');
                if (progressFill) progressFill.style.width = '0%';
                if (progressText) progressText.textContent = 'Inicializando análise...';
            }, 1000);
        }
    }
    
    function updateProgress(percent, message) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
            progressFill.style.transition = 'width 0.3s ease';
        }
        
        if (progressText) {
            progressText.textContent = message;
        }
    }
    
    function clearAll() {
        console.log('Limpando análise...');
        
        try {
            // Resetar inputs
            elements.fileInput.value = '';
            elements.textInput.value = '';
            elements.textInput.style.height = 'auto';
            elements.charCount.textContent = '0';
            
            // Resetar upload area
            elements.uploadArea.innerHTML = `
                <div class="upload-icon">
                    <i class="fas fa-file-upload"></i>
                </div>
                <h3>Arraste e solte o arquivo aqui</h3>
                <p class="upload-subtitle">ou clique para selecionar</p>
                <div class="file-types">
                    <span class="file-type-badge">PDF</span>
                    <span class="file-type-badge">DOCX</span>
                    <span class="file-type-badge">DOC</span>
                    <span class="file-type-badge">TXT</span>
                </div>
                <p class="upload-note">Tamanho máximo: 10MB</p>
                <input type="file" id="fileInput" class="file-input" accept=".pdf,.docx,.doc,.txt">
            `;
            
            // Resetar resultados
            elements.resultsContainer.style.display = 'none';
            elements.loading.style.display = 'none';
            
            // Remover container de achados avançados
            const advancedFindings = document.getElementById('advancedFindings');
            if (advancedFindings) {
                advancedFindings.style.display = 'none';
            }
            
            // Resetar probabilidade
            const humanProbBar = document.getElementById('humanProbabilityBar');
            const markerLabel = document.getElementById('markerLabel');
            const humanValue = document.getElementById('humanProbabilityValue');
            const aiValue = document.getElementById('aiProbabilityValue');
            
            if (humanProbBar) humanProbBar.style.width = '50%';
            if (markerLabel) markerLabel.textContent = '50%';
            if (humanValue) humanValue.textContent = '0%';
            if (aiValue) aiValue.textContent = '0%';
            
            // Resetar veredito
            const verdictTitle = document.getElementById('verdictTitle');
            const verdictDescription = document.getElementById('verdictDescription');
            
            if (verdictTitle) {
                verdictTitle.textContent = 'ANÁLISE NÃO REALIZADA';
                verdictTitle.style.color = '';
            }
            if (verdictDescription) {
                verdictDescription.textContent = 'Envie um trabalho para análise';
            }
            
            // Resetar métricas
            const metricsContainer = document.getElementById('advancedMetrics');
            const alertsList = document.getElementById('alertsList');
            const recommendationsList = document.getElementById('recommendationsList');
            const analysisGrid = document.getElementById('analysisGrid');
            const textPreview = document.getElementById('textPreview');
            
            if (metricsContainer) metricsContainer.innerHTML = '';
            if (alertsList) alertsList.innerHTML = '';
            if (recommendationsList) recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <i class="fas fa-info-circle"></i>
                    <span>Analise o trabalho completo antes de tomar decisões</span>
                </div>
            `;
            if (analysisGrid) analysisGrid.innerHTML = '';
            if (textPreview) {
                textPreview.innerHTML = `
                    <div class="placeholder-text">
                        <i class="fas fa-file"></i>
                        <p>Nenhum texto para exibir. Faça uma análise primeiro.</p>
                    </div>
                `;
            }
            
            // Resetar resultado atual
            currentAnalysisResult = null;
            
            showAlert('Tudo limpo! Pronto para nova análise.', 'success');
            
        } catch (error) {
            console.error('Erro ao limpar:', error);
            showAlert('Erro ao limpar a análise', 'error');
        }
    }
    
    function toggleAnalysisView() {
        const content = elements.analysisContent;
        const toggleBtn = elements.toggleAnalysis;
        
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Recolher';
            toggleBtn.classList.add('active');
        } else {
            content.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Expandir';
            toggleBtn.classList.remove('active');
        }
    }
    
    function generateReport() {
        if (!currentAnalysisResult) {
            showAlert('Nenhum resultado disponível para gerar relatório', 'error');
            return;
        }
        
        try {
            if (typeof jsPDF !== 'undefined') {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Configurações
                const margin = 20;
                let yPos = margin;
                
                // Cabeçalho
                doc.setFontSize(16);
                doc.setTextColor(44, 62, 80);
                doc.text('RELATÓRIO DE ANÁLISE ACADÊMICA', margin, yPos);
                yPos += 10;
                
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos);
                yPos += 5;
                doc.text(`Nível: ${currentAnalysisResult.academicLevel.toUpperCase()}`, margin, yPos);
                yPos += 5;
                doc.text(`Área: ${currentAnalysisResult.subjectArea}`, margin, yPos);
                yPos += 10;
                
                // Probabilidade
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('PROBABILIDADE DE AUTORIA:', margin, yPos);
                yPos += 8;
                
                doc.setFontSize(14);
                const humanProb = currentAnalysisResult.humanProbability;
                const aiProb = currentAnalysisResult.aiProbability;
                
                if (humanProb >= 70) {
                    doc.setTextColor(39, 174, 96);
                } else if (humanProb >= 40) {
                    doc.setTextColor(243, 156, 18);
                } else {
                    doc.setTextColor(231, 76, 60);
                }
                
                doc.text(`Autoria Humana: ${humanProb}%`, margin, yPos);
                yPos += 7;
                doc.setTextColor(231, 76, 60);
                doc.text(`Uso de IA: ${aiProb}%`, margin, yPos);
                yPos += 12;
                
                // Métricas
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('MÉTRICAS ANALISADAS:', margin, yPos);
                yPos += 8;
                
                doc.setFontSize(10);
                currentAnalysisResult.advancedMetrics?.forEach((metric, index) => {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = margin;
                    }
                    
                    doc.text(`${metric.title}: ${metric.value} (${metric.label})`, margin, yPos);
                    yPos += 5;
                });
                
                // Salvar
                const fileName = `analise-academica-${Date.now()}.pdf`;
                doc.save(fileName);
                
                showAlert(`Relatório "${fileName}" gerado com sucesso!`, 'success');
                
            } else {
                showAlert('Biblioteca PDF não disponível', 'error');
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            showAlert('Erro ao gerar relatório PDF', 'error');
        }
    }
    
    function addAlertAnimations() {
        if (!document.getElementById('alert-animations')) {
            const style = document.createElement('style');
            style.id = 'alert-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .alert-message {
                    animation: slideIn 0.3s ease;
                }
                .alert-message.slide-out {
                    animation: slideOut 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
});
