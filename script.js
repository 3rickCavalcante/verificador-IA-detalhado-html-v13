// script.js - Detector baseado em heurísticas estatísticas (sem modelos externos)

// ==================== FUNÇÕES DE ANÁLISE ESTATÍSTICA ====================

// Calcula a perplexidade simulada (quanto menor, mais previsível → IA)
function calculatePerplexity(text) {
    const words = text.toLowerCase().split(/\s+/);
    if (words.length < 10) return 0.5;
    
    // 1. Diversidade lexical (quantas palavras diferentes)
    const uniqueWords = new Set(words);
    const lexicalRichness = uniqueWords.size / words.length; // 0-1, valores altos = humano
    
    // 2. Tamanho médio das palavras (IA tende a usar palavras mais curtas e comuns)
    const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    // 3. Repetição de bigramas (IA repete mais padrões)
    let bigrams = new Set();
    let repeatedBigrams = 0;
    for (let i = 0; i < words.length - 1; i++) {
        const bigram = words[i] + ' ' + words[i+1];
        if (bigrams.has(bigram)) repeatedBigrams++;
        else bigrams.add(bigram);
    }
    const repetitionRate = repeatedBigrams / Math.max(1, words.length - 1);
    
    // 4. Desvio padrão do comprimento das palavras (IA tem menos variação)
    const variance = words.reduce((sum, w) => sum + Math.pow(w.length - avgWordLen, 2), 0) / words.length;
    const stdDev = Math.sqrt(variance);
    
    // Pontuação final de "humanidade" (0 a 1)
    let humanScore = 0;
    
    // Lexical richness: >0.6 = humano, <0.4 = IA
    humanScore += Math.min(1, Math.max(0, (lexicalRichness - 0.3) / 0.4)) * 0.35;
    
    // Avg word length: >5 = humano, <4 = IA
    humanScore += Math.min(1, Math.max(0, (avgWordLen - 3.5) / 2)) * 0.25;
    
    // Repetition rate: baixo = humano (inverso)
    humanScore += (1 - Math.min(1, repetitionRate * 2)) * 0.25;
    
    // Std dev: >2.5 = humano, <1.5 = IA
    humanScore += Math.min(1, Math.max(0, (stdDev - 1.2) / 2)) * 0.15;
    
    // Normalizar e converter para probabilidade (0-1)
    let perplexity = 1 - humanScore;
    perplexity = Math.min(0.95, Math.max(0.05, perplexity));
    return perplexity;
}

// Classifica o texto e retorna probabilidades
function classifyText(text) {
    const cleaned = text.trim();
    if (cleaned.length < 100) {
        throw new Error('Texto muito curto para análise (mínimo 100 caracteres).');
    }
    
    const perplexity = calculatePerplexity(cleaned);
    // Mapeia perplexidade para probabilidade humana: 
    // perplexidade baixa (0-0.3) → IA, alta (0.7-1) → humano
    let humanProb;
    if (perplexity < 0.3) humanProb = 10;
    else if (perplexity < 0.5) humanProb = 30;
    else if (perplexity < 0.7) humanProb = 60;
    else humanProb = 85;
    
    // Ajuste fino baseado no tamanho do texto
    const words = cleaned.split(/\s+/);
    if (words.length > 500 && humanProb < 50) humanProb += 10; // textos longos com IA são menos prováveis
    
    humanProb = Math.min(95, Math.max(5, humanProb));
    const aiProb = 100 - humanProb;
    const confidence = Math.abs(50 - humanProb) / 50; // confiança baseada na distância do 50%
    
    return { humanProb, aiProb, confidence: Math.min(0.95, confidence) };
}

// ==================== DOM ELEMENTOS (mesmo do código anterior) ====================
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

let currentAnalysisResult = null;

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
    progressText.textContent = 'Analisando texto...';
}

function updateProgress(percent, msg) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = msg;
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    resultsContainer.style.opacity = '1';
}

function displayResults(humanProb, aiProb, confidence, textAnalyzed) {
    humanProbabilityBar.style.width = `${humanProb}%`;
    humanProbabilityValue.textContent = `${Math.round(humanProb)}%`;
    aiProbabilityValue.textContent = `${Math.round(aiProb)}%`;
    
    const marker = document.getElementById('probabilityMarker');
    const markerLabel = document.getElementById('markerLabel');
    let pos = Math.min(95, Math.max(5, humanProb));
    marker.style.left = `${pos}%`;
    markerLabel.textContent = `${Math.round(humanProb)}%`;
    
    confidenceBadgeSpan.textContent = `CONFIANÇA: ${Math.round(confidence * 100)}%`;
    
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
    
    generateAlerts(humanProb, aiProb, textAnalyzed);
    generateAdvancedMetrics(humanProb, aiProb, textAnalyzed);
    generateDetailedAnalysis(humanProb, aiProb, textAnalyzed);
    generateRecommendations(humanProb);
    
    currentAnalysisResult = { humanProb, aiProb, confidence, textAnalyzed, timestamp: new Date() };
}

function generateAlerts(humanProb, aiProb, text) {
    const wordCount = text.split(/\s+/).length;
    const expected = parseInt(expectedLength.value);
    const alerts = [];
    
    if (Math.abs(wordCount - expected) > expected * 0.3) {
        alerts.push({ icon: 'fas fa-ruler', text: `Comprimento (${wordCount} palavras) muito diferente do esperado (${expected}).`, type: 'warning' });
    }
    if (aiProb > 80) {
        alerts.push({ icon: 'fas fa-exclamation-triangle', text: 'Probabilidade altíssima de IA. Verificação cruzada necessária.', type: 'critical' });
    } else if (aiProb > 60) {
        alerts.push({ icon: 'fas fa-chart-line', text: 'Fortes indícios de automação. Analisar consistência.', type: 'warning' });
    } else if (humanProb > 80) {
        alerts.push({ icon: 'fas fa-check-circle', text: 'Padrões humanos consistentes. Baixa chance de IA.', type: 'success' });
    }
    
    alertsList.innerHTML = alerts.length ? 
        alerts.map(a => `<div class="alert-item alert-${a.type}"><i class="${a.icon}"></i><span>${a.text}</span></div>`).join('') : 
        '<div class="alert-item alert-info"><i class="fas fa-check-circle"></i><span>Nenhum alerta significativo.</span></div>';
}

function generateAdvancedMetrics(humanProb, aiProb, text) {
    const words = text.split(/\s+/);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLen = sentences.length ? (wordCount / sentences.length).toFixed(1) : 0;
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = (uniqueWords / wordCount * 100).toFixed(1);
    const avgWordLen = (words.reduce((s, w) => s + w.length, 0) / wordCount).toFixed(1);
    const repetitionRate = (1 - uniqueWords / wordCount) * 100;
    
    const metrics = [
        { label: 'Extensão do Texto', value: `${wordCount} palavras`, icon: 'fas fa-text-height', tooltip: 'Total de palavras' },
        { label: 'Tamanho Médio da Palavra', value: `${avgWordLen} caracteres`, icon: 'fas fa-font', tooltip: 'Média de caracteres por palavra' },
        { label: 'Diversidade Lexical', value: `${lexicalDiversity}%`, icon: 'fas fa-brain', tooltip: 'Quanto maior, mais humano' },
        { label: 'Taxa de Repetição', value: `${repetitionRate.toFixed(1)}%`, icon: 'fas fa-repeat', tooltip: 'Repetição de palavras (IA tende a repetir mais)' }
    ];
    
    advancedMetricsDiv.innerHTML = metrics.map(m => `
        <div class="metric-card">
            <div class="metric-icon"><i class="${m.icon}"></i></div>
            <div class="metric-info">
                <div class="metric-label">${m.label}</div>
                <div class="metric-value">${m.value}</div>
                <div class="metric-tooltip">${m.tooltip}</div>
            </div>
        </div>
    `).join('');
}

function generateDetailedAnalysis(humanProb, aiProb, text) {
    const words = text.split(/\s+/);
    const avgWordLen = (words.reduce((s, w) => s + w.length, 0) / words.length).toFixed(1);
    const uniqueRatio = new Set(words.map(w => w.toLowerCase())).size / words.length;
    
    const items = [
        { icon: 'fas fa-language', title: 'Variedade de Vocabulário', desc: uniqueRatio > 0.6 ? 'Alta diversidade, típico de humano.' : (uniqueRatio < 0.4 ? 'Muito repetitivo, suspeito de IA.' : 'Diversidade moderada.') },
        { icon: 'fas fa-chart-line', title: 'Comprimento de Palavras', desc: avgWordLen > 5 ? 'Palavras longas e variadas (mais humano).' : 'Palavras curtas e comuns (padrão IA).' },
        { icon: 'fas fa-repeat', title: 'Estruturas Repetitivas', desc: humanProb < 40 ? 'Frases e construções repetitivas detectadas.' : 'Boa variação estrutural.' },
        { icon: 'fas fa-graduation-cap', title: 'Adequação ao Nível', desc: academicLevel.value === 'doctoral' && words.length < 1500 ? 'Texto aquém do esperado para doutorado.' : 'Extensão adequada ao nível.' }
    ];
    
    analysisGrid.innerHTML = items.map(i => `
        <div class="analysis-item">
            <div class="analysis-icon"><i class="${i.icon}"></i></div>
            <div class="analysis-text">
                <strong>${i.title}</strong><br>
                <span>${i.desc}</span>
            </div>
        </div>
    `).join('');
    
    const preview = text.length > 500 ? text.substring(0, 500) + '...' : text;
    textPreview.innerHTML = `<p>${preview.replace(/\n/g, '<br>')}</p>`;
}

function generateRecommendations(humanProb) {
    let recs = [];
    if (humanProb < 40) {
        recs = ['🔍 Realize uma entrevista oral sobre o conteúdo.', '📚 Solicite uma versão anotada com comentários pessoais.', '⚖️ Use esta análise como indicativo, não como prova definitiva.'];
    } else if (humanProb < 70) {
        recs = ['📝 Peça ao aluno que explique partes específicas do texto.', '🔎 Compare com trabalhos anteriores do mesmo estudante.', '📊 Utilize outras ferramentas complementares.'];
    } else {
        recs = ['✅ Parece ser autoria humana. Considere elogiar a qualidade.', '📖 Recomende que continue desenvolvendo sua escrita acadêmica.'];
    }
    recs.push('📌 Nenhum detector é 100% preciso. Use sempre o contexto.');
    recommendationsList.innerHTML = recs.map(r => `<div class="recommendation-item"><i class="fas fa-lightbulb"></i><span>${r}</span></div>`).join('');
}

async function performAnalysis() {
    let text = textInput.value.trim();
    if (!text) {
        alert('Por favor, insira um texto ou faça upload de um arquivo.');
        return;
    }
    if (text.length < 100) {
        alert('Texto muito curto para análise confiável (mínimo 100 caracteres).');
        return;
    }
    
    showLoading();
    updateProgress(10, 'Pré-processando texto...');
    
    // Pequeno atraso para simular processamento (opcional)
    setTimeout(() => {
        try {
            updateProgress(50, 'Analisando padrões linguísticos...');
            const result = classifyText(text);
            updateProgress(80, 'Gerando métricas e alertas...');
            displayResults(result.humanProb, result.aiProb, result.confidence, text);
            updateProgress(100, 'Análise concluída!');
            setTimeout(hideLoading, 500);
        } catch (err) {
            console.error(err);
            hideLoading();
            alert(`Erro na análise: ${err.message}`);
        }
    }, 100);
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
        // Recarrega a página para limpar resultados (opcional)
        window.location.reload(); 
    });
    helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
    closeHelpModal.addEventListener('click', () => helpModal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === helpModal) helpModal.style.display = 'none'; });
    toggleAnalysisBtn.addEventListener('click', () => {
        const isVisible = analysisContent.style.display !== 'none';
        analysisContent.style.display = isVisible ? 'none' : 'block';
        toggleAnalysisBtn.innerHTML = isVisible ? '<i class="fas fa-chevron-down"></i> Expandir' : '<i class="fas fa-chevron-up"></i> Recolher';
    });
    analysisContent.style.display = 'block';
    
    // Upload de arquivos (mesmo código anterior)
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) await processFile(file);
    });
    fileInput.addEventListener('change', async (e) => { if (e.target.files.length) await processFile(e.target.files[0]); });
    
    async function processFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        let content = '';
        if (ext === 'txt') {
            content = await file.text();
        } else if (ext === 'pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let full = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                full += textContent.items.map(t => t.str).join(' ') + '\n';
            }
            content = full;
        } else if (ext === 'docx') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            content = result.value;
        } else {
            alert('Formato não suportado. Use PDF, DOCX ou TXT.');
            return;
        }
        textInput.value = content;
        updateCharCount();
    }
    
    // Gerar relatório PDF
    generateReportBtn.addEventListener('click', () => {
        if (!currentAnalysisResult) {
            alert('Nenhuma análise realizada.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Relatório de Detecção de IA', 20, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${currentAnalysisResult.timestamp.toLocaleString()}`, 20, 30);
        doc.text(`Probabilidade Humana: ${Math.round(currentAnalysisResult.humanProb)}%`, 20, 40);
        doc.text(`Probabilidade IA: ${Math.round(currentAnalysisResult.aiProb)}%`, 20, 50);
        doc.text(`Confiança: ${Math.round(currentAnalysisResult.confidence * 100)}%`, 20, 60);
        doc.text('Prévia do texto analisado:', 20, 70);
        const preview = currentAnalysisResult.textAnalyzed.substring(0, 400);
        doc.text(preview, 20, 80, { maxWidth: 170 });
        doc.save(`relatorio_ia_${Date.now()}.pdf`);
    });
    
    exportDataBtn.addEventListener('click', () => {
        if (!currentAnalysisResult) {
            alert('Nenhuma análise para exportar.');
            return;
        }
        const data = { ...currentAnalysisResult, textPreview: currentAnalysisResult.textAnalyzed.substring(0, 1000) };
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
}

window.addEventListener('DOMContentLoaded', init);
