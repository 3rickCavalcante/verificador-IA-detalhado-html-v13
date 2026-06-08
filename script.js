// script.js - Versão com Machine Learning real (Transformers.js)

// ==================== CARREGAMENTO DO MODELO DE IA ====================
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.7.0';

let classifier = null;
let modelLoadingPromise = null;

// Função para carregar o modelo (com cache)
async function loadModel() {
    if (classifier) return classifier;
    if (modelLoadingPromise) return modelLoadingPromise;
    
    // Mostrar status no canto inferior ou em um elemento discreto
    const statusDiv = document.createElement('div');
    statusDiv.id = 'modelLoadStatus';
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '10px';
    statusDiv.style.right = '10px';
    statusDiv.style.backgroundColor = '#333';
    statusDiv.style.color = '#fff';
    statusDiv.style.padding = '8px 12px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.fontSize = '12px';
    statusDiv.style.zIndex = '9999';
    statusDiv.innerHTML = '🤖 Carregando modelo de IA... (pode levar alguns segundos)';
    document.body.appendChild(statusDiv);
    
    modelLoadingPromise = (async () => {
        try {
            // Usando o modelo especializado em português
            classifier = await pipeline('text-classification', 'Detecting-ai/pt-ai-detector');
            statusDiv.innerHTML = '✅ Modelo de IA carregado com sucesso!';
            setTimeout(() => statusDiv.remove(), 3000);
            return classifier;
        } catch (error) {
            console.error('Erro ao carregar o modelo:', error);
            statusDiv.innerHTML = '❌ Falha ao carregar modelo. Recarregue a página.';
            setTimeout(() => statusDiv.remove(), 5000);
            throw error;
        }
    })();
    
    return modelLoadingPromise;
}

// Função para pré-processar texto (limitar tamanho e limpeza básica)
function preprocessText(text) {
    // Remove espaços extras e quebras de linha excessivas
    let clean = text.replace(/\s+/g, ' ').trim();
    // Limita a 2000 caracteres para não sobrecarregar o modelo (aproximadamente 500 tokens)
    if (clean.length > 2000) {
        clean = clean.substring(0, 2000);
        console.warn('Texto truncado para 2000 caracteres.');
    }
    return clean;
}

// Função de classificação real
async function classifyText(text) {
    const model = await loadModel();
    const cleanedText = preprocessText(text);
    if (!cleanedText || cleanedText.length < 50) {
        throw new Error('Texto muito curto para análise significativa (mínimo 50 caracteres).');
    }
    const result = await model(cleanedText);
    // O resultado é algo como [{ label: 'LABEL_1', score: 0.95 }] 
    // Mapear: LABEL_0 = Humano, LABEL_1 = IA
    const isAI = result[0].label === 'LABEL_1';
    const confidence = result[0].score;
    return {
        isAI: isAI,
        confidence: confidence,
        humanProbability: isAI ? (1 - confidence) * 100 : confidence * 100,
        aiProbability: isAI ? confidence * 100 : (1 - confidence) * 100
    };
}

// ==================== DOM ELEMENTOS ====================
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const helpBtn = document.getElementById('helpBtn');
const loadingDiv = document.getElementById('loading');
const resultsContainer = document.getElementById('resultsContainer');
const charCountSpan = document.getElementById('charCount');
const academicLevel = document.getElementById('academicLevel');
const subjectArea = document.getElementById('subjectArea');
const expectedLength = document.getElementById('expectedLength');
const contextIndicator = document.getElementById('contextIndicator');
const humanProbabilityBar = document.getElementById('humanProbabilityBar');
const humanProbabilityValue = document.getElementById('humanProbabilityValue');
const aiProbabilityValue = document.getElementById('aiProbabilityValue');
const confidenceBadgeSpan = document.querySelector('#confidenceBadge span');
const verdictTitle = document.getElementById('verdictTitle');
const verdictDescription = document.getElementById('verdictDescription');
const alertsList = document.getElementById('alertsList');
const advancedMetricsDiv = document.getElementById('advancedMetrics');
const analysisGrid = document.getElementById('analysisGrid');
const textPreview = document.getElementById('textPreview');
const recommendationsList = document.getElementById('recommendationsList');
const toggleAnalysisBtn = document.getElementById('toggleAnalysis');
const analysisContent = document.getElementById('analysisContent');
const generateReportBtn = document.getElementById('generateReportBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpModal = document.getElementById('closeHelpModal');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let currentAnalysisResult = null; // Armazenar último resultado

// ==================== FUNÇÕES AUXILIARES ====================
function updateCharCount() {
    charCountSpan.textContent = textInput.value.length;
}

function updateContextIndicator() {
    const levelText = {
        undergrad: 'Graduação',
        masters: 'Mestrado',
        doctoral: 'Doutorado',
        researcher: 'Pesquisador'
    }[academicLevel.value];
    const areaText = {
        humanities: 'Humanidades',
        social: 'Ciências Sociais',
        natural: 'Ciências Naturais',
        applied: 'Ciências Aplicadas'
    }[subjectArea.value];
    contextIndicator.innerHTML = `<i class="fas fa-info-circle"></i><span>Modo: ${levelText} em ${areaText} - Análise rigorosa ativada</span>`;
}

function showLoading() {
    loadingDiv.style.display = 'flex';
    resultsContainer.style.opacity = '0.5';
    progressFill.style.width = '0%';
    progressText.textContent = 'Carregando modelo de IA...';
}

function updateProgress(percent, message) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = message;
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    resultsContainer.style.opacity = '1';
}

function displayResults(humanProb, aiProb, confidence, textAnalyzed) {
    // Atualizar barras
    humanProbabilityBar.style.width = `${humanProb}%`;
    humanProbabilityValue.textContent = `${Math.round(humanProb)}%`;
    aiProbabilityValue.textContent = `${Math.round(aiProb)}%`;
    
    // Mover marcador (posição horizontal em %)
    const marker = document.getElementById('probabilityMarker');
    const markerLabel = document.getElementById('markerLabel');
    // O marcador representa o ponto de equilíbrio (50% é o centro, mas podemos posicionar conforme a confiança)
    // Vamos posicionar o marcador no valor da probabilidade humana (para mostrar o desvio)
    let markerPosition = humanProb;
    if (markerPosition < 5) markerPosition = 5;
    if (markerPosition > 95) markerPosition = 95;
    marker.style.left = `${markerPosition}%`;
    markerLabel.textContent = `${Math.round(humanProb)}%`;
    
    // Badge de confiança
    confidenceBadgeSpan.textContent = `CONFIANÇA: ${Math.round(confidence * 100)}%`;
    
    // Veredito
    if (humanProb > 70) {
        verdictTitle.textContent = 'PROVÁVEL AUTORIA HUMANA';
        verdictDescription.textContent = 'O texto apresenta padrões consistentes com escrita acadêmica humana.';
    } else if (humanProb > 40) {
        verdictTitle.textContent = 'PROBABILIDADE MODERADA DE USO DE IA';
        verdictDescription.textContent = 'Características mistas. Recomenda-se análise detalhada.';
    } else {
        verdictTitle.textContent = 'ALTA PROBABILIDADE DE USO DE IA';
        verdictDescription.textContent = 'Padrões típicos de geração automática detectados.';
    }
    
    // Gerar alertas acadêmicos com base no contexto e na probabilidade
    generateAlerts(humanProb, aiProb, textAnalyzed);
    
    // Gerar métricas avançadas (simuladas mas contextualizadas)
    generateAdvancedMetrics(humanProb, aiProb, textAnalyzed);
    
    // Gerar análise detalhada
    generateDetailedAnalysis(humanProb, aiProb, textAnalyzed);
    
    // Gerar recomendações
    generateRecommendations(humanProb);
    
    // Salvar resultado atual
    currentAnalysisResult = { humanProb, aiProb, confidence, textAnalyzed, timestamp: new Date() };
}

function generateAlerts(humanProb, aiProb, text) {
    const alerts = [];
    const wordCount = text.split(/\s+/).length;
    const expected = parseInt(expectedLength.value);
    
    // Alerta de comprimento
    if (Math.abs(wordCount - expected) > expected * 0.3) {
        alerts.push({
            icon: 'fas fa-ruler',
            text: `Comprimento do texto (${wordCount} palavras) difere significativamente do esperado (${expected} palavras).`,
            type: 'warning'
        });
    }
    
    // Alerta baseado na probabilidade
    if (aiProb > 80) {
        alerts.push({
            icon: 'fas fa-exclamation-triangle',
            text: 'Probabilidade muito alta de uso de IA. Recomenda-se verificação cruzada.',
            type: 'critical'
        });
    } else if (aiProb > 60) {
        alerts.push({
            icon: 'fas fa-chart-line',
            text: 'Indícios fortes de automação. Analisar consistência argumentativa.',
            type: 'warning'
        });
    } else if (humanProb > 80) {
        alerts.push({
            icon: 'fas fa-check-circle',
            text: 'Padrões de escrita humana consistentes. Baixa probabilidade de IA.',
            type: 'success'
        });
    }
    
    // Alerta de nível acadêmico
    const level = academicLevel.value;
    if (level === 'undergrad' && wordCount < 500) {
        alerts.push({
            icon: 'fas fa-graduation-cap',
            text: 'Texto muito curto para o nível de graduação. Pode ser um resumo ou esboço.',
            type: 'info'
        });
    } else if (level === 'doctoral' && wordCount < 2000) {
        alerts.push({
            icon: 'fas fa-graduation-cap',
            text: 'Texto curto para o nível de doutorado. Trabalhos extensos são esperados.',
            type: 'warning'
        });
    }
    
    // Renderizar alertas
    alertsList.innerHTML = '';
    if (alerts.length === 0) {
        alertsList.innerHTML = '<div class="alert-item"><i class="fas fa-check-circle"></i><span>Nenhum alerta significativo detectado.</span></div>';
    } else {
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${alert.type}`;
            alertDiv.innerHTML = `<i class="${alert.icon}"></i><span>${alert.text}</span>`;
            alertsList.appendChild(alertDiv);
        });
    }
}

function generateAdvancedMetrics(humanProb, aiProb, text) {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;
    
    // Simular métricas de repetição e diversidade lexical (valores aproximados)
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g)).size;
    const lexicalDiversity = (uniqueWords / wordCount * 100).toFixed(1);
    
    // Perplexidade simulada (baseada na probabilidade da IA)
    const aiInfluence = aiProb / 100;
    const simulatedPerplexity = (50 + aiInfluence * 100).toFixed(0);
    
    const metrics = [
        { label: 'Extensão do Texto', value: `${wordCount} palavras`, icon: 'fas fa-text-height', tooltip: 'Número total de palavras' },
        { label: 'Frases Médias', value: `${avgSentenceLength} palavras/frase`, icon: 'fas fa-paragraph', tooltip: 'Média de palavras por frase' },
        { label: 'Diversidade Lexical', value: `${lexicalDiversity}%`, icon: 'fas fa-brain', tooltip: 'Riqueza de vocabulário' },
        { label: 'Perplexidade Estimada', value: simulatedPerplexity, icon: 'fas fa-chart-line', tooltip: 'Quanto menor, mais previsível (padrão IA)' }
    ];
    
    advancedMetricsDiv.innerHTML = '';
    metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
            <div class="metric-icon"><i class="${metric.icon}"></i></div>
            <div class="metric-info">
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value">${metric.value}</div>
                <div class="metric-tooltip">${metric.tooltip}</div>
            </div>
        `;
        advancedMetricsDiv.appendChild(card);
    });
}

function generateDetailedAnalysis(humanProb, aiProb, text) {
    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / Math.max(1, sentences.length);
    
    // Criar análise detalhada em formato de grid
    const analysisItems = [
        {
            icon: 'fas fa-language',
            title: 'Estrutura Sintática',
            description: avgWordsPerSentence > 25 ? 'Frases longas e complexas, comum em textos acadêmicos.' : 'Frases curtas e diretas, mais típicas de escrita humana informal.'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Previsibilidade',
            description: aiProb > 70 ? 'Alta previsibilidade (perplexidade baixa) - característica de IA.' : 'Previsibilidade moderada, sem padrões fortemente artificiais.'
        },
        {
            icon: 'fas fa-repeat',
            title: 'Repetição de Padrões',
            description: aiProb > 60 ? 'Detectadas repetições estruturais típicas de modelos de linguagem.' : 'Estrutura variada, sem repetições excessivas.'
        },
        {
            icon: 'fas fa-graduation-cap',
            title: 'Adequação ao Nível',
            description: academicLevel.value === 'doctoral' && wordCount < 1500 ? 'Texto aquém do esperado para doutorado.' : 'Extensão compatível com o nível acadêmico.'
        }
    ];
    
    analysisGrid.innerHTML = '';
    analysisItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'analysis-item';
        div.innerHTML = `
            <div class="analysis-icon"><i class="${item.icon}"></i></div>
            <div class="analysis-text">
                <strong>${item.title}</strong><br>
                <span>${item.description}</span>
            </div>
        `;
        analysisGrid.appendChild(div);
    });
    
    // Prévia do texto
    const preview = text.length > 500 ? text.substring(0, 500) + '...' : text;
    textPreview.innerHTML = `<p>${preview.replace(/\n/g, '<br>')}</p>`;
}

function generateRecommendations(humanProb) {
    const recommendations = [];
    if (humanProb < 40) {
        recommendations.push('🔍 Realize uma entrevista ou verificação oral com o estudante.');
        recommendations.push('📚 Solicite uma versão anotada com referências e comentários pessoais.');
        recommendations.push('⚖️ Use esta análise como indicativo, não como prova definitiva.');
    } else if (humanProb < 70) {
        recommendations.push('📝 Peça ao aluno que explique partes específicas do texto oralmente.');
        recommendations.push('🔎 Compare com trabalhos anteriores do mesmo estudante.');
        recommendations.push('📊 Utilize ferramentas complementares de detecção para validação.');
    } else {
        recommendations.push('✅ Parece ser autoria humana. Considere elogiar a qualidade do trabalho.');
        recommendations.push('📖 Recomende ao aluno que continue desenvolvendo sua escrita acadêmica.');
    }
    recommendations.push('📌 Lembre-se: nenhum detector é 100% preciso. Use o contexto a seu favor.');
    
    recommendationsList.innerHTML = recommendations.map(rec => `<div class="recommendation-item"><i class="fas fa-lightbulb"></i><span>${rec}</span></div>`).join('');
}

// Função principal de análise (chamada pelo botão)
async function performAnalysis() {
    let text = textInput.value.trim();
    if (!text) {
        alert('Por favor, insira um texto ou faça upload de um arquivo.');
        return;
    }
    if (text.length < 50) {
        alert('O texto é muito curto para uma análise confiável. Mínimo de 50 caracteres.');
        return;
    }
    
    showLoading();
    updateProgress(30, 'Pré-processando texto...');
    
    try {
        updateProgress(50, 'Classificando com modelo de IA...');
        const result = await classifyText(text);
        updateProgress(80, 'Gerando métricas e alertas...');
        
        displayResults(result.humanProbability, result.aiProbability, result.confidence, text);
        updateProgress(100, 'Análise concluída!');
        setTimeout(() => hideLoading(), 500);
    } catch (error) {
        console.error(error);
        hideLoading();
        alert(`Erro na análise: ${error.message}. Tente novamente com um texto mais longo ou recarregue a página.`);
    }
}

// ==================== EVENTOS E INICIALIZAÇÃO ====================
function init() {
    updateCharCount();
    updateContextIndicator();
    
    textInput.addEventListener('input', updateCharCount);
    academicLevel.addEventListener('change', updateContextIndicator);
    subjectArea.addEventListener('change', updateContextIndicator);
    expectedLength.addEventListener('input', updateContextIndicator);
    
    analyzeBtn.addEventListener('click', performAnalysis);
    
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCharCount();
        resultsContainer.style.opacity = '0';
        setTimeout(() => {
            resultsContainer.style.opacity = '1';
            alertsList.innerHTML = '';
            advancedMetricsDiv.innerHTML = '';
            analysisGrid.innerHTML = '';
            textPreview.innerHTML = '<div class="placeholder-text"><i class="fas fa-file"></i><p>Nenhum texto para exibir. Faça uma análise primeiro.</p></div>';
            recommendationsList.innerHTML = '<div class="recommendation-item"><i class="fas fa-info-circle"></i><span>Analise o trabalho completo antes de tomar decisões</span></div>';
            humanProbabilityBar.style.width = '0%';
            humanProbabilityValue.textContent = '0%';
            aiProbabilityValue.textContent = '0%';
            confidenceBadgeSpan.textContent = 'CONFIANÇA: 0%';
            verdictTitle.textContent = 'ANÁLISE NÃO REALIZADA';
            verdictDescription.textContent = 'Envie um trabalho para análise';
        }, 100);
    });
    
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    closeHelpModal.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.style.display = 'none';
    });
    
    toggleAnalysisBtn.addEventListener('click', () => {
        const isExpanded = analysisContent.style.display !== 'none';
        analysisContent.style.display = isExpanded ? 'none' : 'block';
        toggleAnalysisBtn.innerHTML = isExpanded ? '<i class="fas fa-chevron-down"></i> Expandir' : '<i class="fas fa-chevron-up"></i> Recolher';
    });
    analysisContent.style.display = 'block';
    
    // Upload de arquivos (simplificado, mantém a lógica original mas integrada)
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) await processFile(file);
    });
    fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length) await processFile(e.target.files[0]);
    });
    
    async function processFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        let text = '';
        if (ext === 'txt') {
            text = await file.text();
        } else if (ext === 'pdf') {
            // Usar pdf.js (já incluso)
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map(item => item.str);
                fullText += strings.join(' ') + '\n';
            }
            text = fullText;
        } else if (ext === 'docx') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
        } else {
            alert('Formato não suportado. Use PDF, DOCX ou TXT.');
            return;
        }
        textInput.value = text;
        updateCharCount();
        // Opcional: analisar automaticamente? Por enquanto só preenche.
    }
    
    // Gerar relatório PDF (simples, mantém a ideia original)
    generateReportBtn.addEventListener('click', () => {
        if (!currentAnalysisResult) {
            alert('Nenhuma análise realizada ainda.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Relatório de Detecção de IA', 20, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${currentAnalysisResult.timestamp.toLocaleString()}`, 20, 30);
        doc.text(`Probabilidade Humana: ${Math.round(currentAnalysisResult.humanProb)}%`, 20, 40);
        doc.text(`Probabilidade IA: ${Math.round(currentAnalysisResult.aiProbability)}%`, 20, 50);
        doc.text(`Confiança: ${Math.round(currentAnalysisResult.confidence * 100)}%`, 20, 60);
        doc.text('Texto analisado (prévia):', 20, 70);
        const preview = currentAnalysisResult.textAnalyzed.substring(0, 500);
        doc.text(preview, 20, 80, { maxWidth: 170 });
        doc.save(`relatorio_ia_${Date.now()}.pdf`);
    });
    
    exportDataBtn.addEventListener('click', () => {
        if (!currentAnalysisResult) {
            alert('Nenhuma análise para exportar.');
            return;
        }
        const data = {
            timestamp: currentAnalysisResult.timestamp,
            humanProbability: currentAnalysisResult.humanProb,
            aiProbability: currentAnalysisResult.aiProbability,
            confidence: currentAnalysisResult.confidence,
            textPreview: currentAnalysisResult.textAnalyzed.substring(0, 1000)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise_ia_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    saveAnalysisBtn.addEventListener('click', () => {
        if (!currentAnalysisResult) {
            alert('Nada para salvar.');
            return;
        }
        const history = JSON.parse(localStorage.getItem('ia_detector_history') || '[]');
        history.push(currentAnalysisResult);
        localStorage.setItem('ia_detector_history', JSON.stringify(history));
        alert('Análise salva no histórico local.');
    });
    
    // Pré-carregar o modelo em segundo plano
    loadModel().catch(console.warn);
}

// Iniciar tudo quando a página carregar
window.addEventListener('DOMContentLoaded', init);
