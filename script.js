// ==================== BANCO DE EXEMPLOS (localStorage) ====================
const STORAGE_KEY = 'ia_detector_exemplos';

function loadExemplos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch(e) { return []; }
}

function saveExemplo(features, rotulo) {
    const exemplos = loadExemplos();
    exemplos.push({ features, rotulo, timestamp: Date.now() });
    if (exemplos.length > 500) exemplos.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exemplos));
}

function resetExemplos() {
    localStorage.removeItem(STORAGE_KEY);
    alert('Aprendizado resetado! Recarregue a página.');
    window.location.reload();
}

// ==================== EXTRAÇÃO DE CARACTERÍSTICAS (robusta) ====================
function extractFeatures(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 10) return null; // mínimo 10 palavras

    // 1. Type-Token Ratio (diversidade lexical)
    const unique = new Set(words);
    const ttr = unique.size / words.length;

    // 2. Tamanho médio das palavras
    const avgWordLen = words.reduce((s, w) => s + w.length, 0) / words.length;

    // 3. Repetição de bigramas
    let bigramCounts = new Map();
    for (let i = 0; i < words.length - 1; i++) {
        const bg = words[i] + ' ' + words[i+1];
        bigramCounts.set(bg, (bigramCounts.get(bg) || 0) + 1);
    }
    let repeated = 0;
    for (let c of bigramCounts.values()) if (c > 1) repeated += (c - 1);
    const bigramRepeat = repeated / Math.max(1, words.length - 1);

    // 4. Desvio padrão do comprimento das palavras
    const variance = words.reduce((s, w) => s + Math.pow(w.length - avgWordLen, 2), 0) / words.length;
    const stdDev = Math.sqrt(variance);

    // 5. Proporção de stopwords (lista reduzida)
    const stopwords = new Set(['a','e','o','de','da','do','que','um','uma','para','com','por','como','mais','mas','se','no','na','os','as','ao','aos','pelo','pela']);
    let stopCount = 0;
    for (let w of words) if (stopwords.has(w)) stopCount++;
    const stopRatio = stopCount / words.length;

    // 6. Coeficiente de variação do comprimento das frases
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let sentLenCV = 0.5;
    if (sentences.length > 1) {
        const lens = sentences.map(s => s.split(/\s+/).length);
        const meanLen = lens.reduce((a,b)=>a+b,0)/lens.length;
        const varLen = lens.reduce((s,l)=>s + Math.pow(l-meanLen,2),0)/lens.length;
        sentLenCV = Math.sqrt(varLen) / (meanLen || 1);
    }

    // Normalização e proteção contra NaN
    return {
        ttr: isNaN(ttr) ? 0.5 : Math.min(1, Math.max(0, ttr)),
        avgWordLen: isNaN(avgWordLen) ? 4.5 : avgWordLen,
        bigramRepeat: isNaN(bigramRepeat) ? 0.1 : Math.min(0.5, bigramRepeat),
        stdDev: isNaN(stdDev) ? 2.0 : stdDev,
        stopRatio: isNaN(stopRatio) ? 0.5 : Math.min(0.9, stopRatio),
        sentLenCV: isNaN(sentLenCV) ? 0.4 : Math.min(1.0, sentLenCV)
    };
}

// ==================== CLASSIFICADOR k-NN (robusto) ====================
function classificarPorKNN(features, k = 5) {
    const exemplos = loadExemplos();
    if (exemplos.length < 3) return null;

    const vetor = [features.ttr, features.avgWordLen, features.bigramRepeat, features.stdDev, features.stopRatio, features.sentLenCV];
    const vizinhos = exemplos.map(ex => {
        const v = [ex.features.ttr, ex.features.avgWordLen, ex.features.bigramRepeat, ex.features.stdDev, ex.features.stopRatio, ex.features.sentLenCV];
        const dist = Math.hypot(...vetor.map((val, i) => val - v[i]));
        return { dist, rotulo: ex.rotulo };
    }).sort((a,b) => a.dist - b.dist).slice(0, k);

    const pesos = { humano: 0, ia: 0 };
    for (let v of vizinhos) {
        const peso = v.dist < 0.0001 ? 1000 : (1 / v.dist);
        pesos[v.rotulo] += peso;
    }
    const total = pesos.humano + pesos.ia;
    if (total === 0 || isNaN(total)) return null;
    const probHumano = (pesos.humano / total) * 100;
    const confianca = Math.abs(probHumano - 50) / 50;
    return {
        humano: Math.min(99, Math.max(1, probHumano)),
        ia: 100 - probHumano,
        confianca: Math.min(0.95, confianca)
    };
}

// ==================== HEURÍSTICA DE FALLBACK (calibrada) ====================
function heuristicaFallback(features) {
    if (!features || typeof features.ttr !== 'number') return 50;

    let score = 50;
    const ttr = Math.min(1, Math.max(0, features.ttr));
    if (ttr > 0.55) score += 20;
    else if (ttr > 0.45) score += 5;
    else if (ttr < 0.35) score -= 25;
    else if (ttr < 0.4) score -= 10;

    const avgLen = features.avgWordLen;
    if (avgLen > 5.2) score += 15;
    else if (avgLen > 4.8) score += 5;
    else if (avgLen < 4.2) score -= 20;
    else if (avgLen < 4.5) score -= 8;

    const bigram = Math.min(0.5, features.bigramRepeat);
    if (bigram < 0.03) score += 15;
    else if (bigram < 0.08) score += 5;
    else if (bigram > 0.2) score -= 25;
    else if (bigram > 0.12) score -= 10;

    const sd = features.stdDev;
    if (sd > 2.5) score += 15;
    else if (sd > 2.0) score += 5;
    else if (sd < 1.5) score -= 20;
    else if (sd < 1.8) score -= 8;

    const stop = features.stopRatio;
    if (stop < 0.45) score += 10;
    else if (stop > 0.65) score -= 20;
    else if (stop > 0.58) score -= 8;

    const sentCV = features.sentLenCV;
    if (sentCV > 0.45) score += 10;
    else if (sentCV < 0.25) score -= 15;
    else if (sentCV < 0.3) score -= 5;

    return Math.min(95, Math.max(5, isNaN(score) ? 50 : score));
}

// ==================== CLASSIFICAÇÃO PRINCIPAL ====================
function classifyText(text) {
    const cleaned = text.trim();
    if (cleaned.length < 100) {
        throw new Error('Texto muito curto (mínimo 100 caracteres).');
    }
    const features = extractFeatures(cleaned);
    if (!features) {
        throw new Error('Não foi possível extrair características (texto muito curto ou inválido).');
    }

    let humanProb, confidence;
    const knn = loadExemplos().length >= 3 ? classificarPorKNN(features) : null;
    if (knn && !isNaN(knn.humano)) {
        humanProb = knn.humano;
        confidence = knn.confianca;
    } else {
        humanProb = heuristicaFallback(features);
        confidence = Math.abs(humanProb - 50) / 50;
    }
    if (isNaN(humanProb)) humanProb = 50;
    if (isNaN(confidence)) confidence = 0.5;

    return {
        humanProb: Math.min(99, Math.max(1, humanProb)),
        aiProb: 100 - humanProb,
        confidence: Math.min(0.95, confidence),
        features: features
    };
}

// ==================== DOM ELEMENTOS ====================
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

let currentAnalysis = null;

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

// ==================== BOTÕES DE FEEDBACK ====================
function injectFeedbackButtons() {
    const container = document.getElementById('verdictBox');
    if (!container) return;
    const oldDiv = document.getElementById('feedbackButtons');
    if (oldDiv) oldDiv.remove();

    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'feedbackButtons';
    feedbackDiv.style.marginTop = '15px';
    feedbackDiv.style.display = 'flex';
    feedbackDiv.style.gap = '10px';
    feedbackDiv.style.justifyContent = 'center';
    feedbackDiv.style.flexWrap = 'wrap';
    feedbackDiv.innerHTML = `
        <button id="btnFeedbackHumano" style="background:#27ae60; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">✅ Correto (Humano)</button>
        <button id="btnFeedbackIA" style="background:#e74c3c; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">❌ Errado (É IA)</button>
        <button id="btnResetAprendizado" style="background:#f39c12; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">🔄 Resetar Aprendizado</button>
        <span style="font-size:0.8rem; color:#666;">Ajude o sistema a aprender</span>
    `;
    container.appendChild(feedbackDiv);

    document.getElementById('btnFeedbackHumano')?.addEventListener('click', () => {
        if (currentAnalysis?.features) {
            saveExemplo(currentAnalysis.features, 'humano');
            alert('✅ Obrigado! O detector aprendeu com este texto (classificado como HUMANO).');
            feedbackDiv.style.opacity = '0.5';
        } else {
            alert('Nenhuma análise ativa para feedback.');
        }
    });
    document.getElementById('btnFeedbackIA')?.addEventListener('click', () => {
        if (currentAnalysis?.features) {
            saveExemplo(currentAnalysis.features, 'ia');
            alert('❌ Obrigado! O detector aprendeu com este texto (classificado como IA).');
            feedbackDiv.style.opacity = '0.5';
        } else {
            alert('Nenhuma análise ativa para feedback.');
        }
    });
    document.getElementById('btnResetAprendizado')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar todo o aprendizado? Isso apagará todos os exemplos salvos.')) {
            resetExemplos();
        }
    });
}

// ==================== GERAÇÃO DOS RESULTADOS ====================
function displayResults(humanProb, aiProb, confidence, textAnalyzed, features) {
    // Atualiza barras e números
    humanProbabilityBar.style.width = `${humanProb}%`;
    humanProbabilityValue.textContent = `${Math.round(humanProb)}%`;
    aiProbabilityValue.textContent = `${Math.round(aiProb)}%`;
    const marker = document.getElementById('probabilityMarker');
    const markerLabel = document.getElementById('markerLabel');
    let pos = Math.min(95, Math.max(5, humanProb));
    marker.style.left = `${pos}%`;
    markerLabel.textContent = `${Math.round(humanProb)}%`;
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
    
    generateAlerts(humanProb, aiProb, textAnalyzed);
    generateAdvancedMetrics(humanProb, aiProb, textAnalyzed);
    generateDetailedAnalysis(humanProb, aiProb, textAnalyzed);
    generateRecommendations(humanProb);
    injectFeedbackButtons();
}

function generateAlerts(humanProb, aiProb, text) {
    const wordCount = text.split(/\s+/).length;
    const expected = parseInt(expectedLength.value);
    const alerts = [];
    if (Math.abs(wordCount - expected) > expected * 0.3) {
        alerts.push({ icon:'fas fa-ruler', text:`Comprimento (${wordCount} palavras) diferente do esperado (${expected}).`, type:'warning' });
    }
    if (aiProb > 80) {
        alerts.push({ icon:'fas fa-exclamation-triangle', text:'Probabilidade altíssima de IA. Verificação cruzada necessária.', type:'critical' });
    } else if (aiProb > 60) {
        alerts.push({ icon:'fas fa-chart-line', text:'Fortes indícios de automação. Analisar consistência.', type:'warning' });
    } else if (humanProb > 80) {
        alerts.push({ icon:'fas fa-check-circle', text:'Padrões humanos consistentes. Baixa chance de IA.', type:'success' });
    }
    alertsList.innerHTML = alerts.length 
        ? alerts.map(a => `<div class="alert-item alert-${a.type}"><i class="${a.icon}"></i><span>${a.text}</span></div>`).join('')
        : '<div class="alert-item alert-info"><i class="fas fa-check-circle"></i><span>Nenhum alerta significativo.</span></div>';
}

function generateAdvancedMetrics(humanProb, aiProb, text) {
    const words = text.split(/\s+/);
    const unique = new Set(words.map(w => w.toLowerCase()));
    const ttr = (unique.size / words.length) * 100;
    const avgWordLen = (words.reduce((s,w) => s + w.length, 0) / words.length).toFixed(1);
    const metrics = [
        { label:'Extensão do Texto', value:`${words.length} palavras`, icon:'fas fa-text-height', tooltip:'Total de palavras' },
        { label:'Diversidade Lexical', value:`${ttr.toFixed(1)}%`, icon:'fas fa-brain', tooltip:'Quanto maior, mais rico em vocabulário (típico de humano)' },
        { label:'Tamanho Médio', value:`${avgWordLen} caracteres`, icon:'fas fa-font', tooltip:'Palavras mais longas são mais comuns em textos humanos' }
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
    const avgLen = (words.reduce((s,w) => s + w.length, 0) / words.length).toFixed(1);
    const uniqueRatio = new Set(words.map(w => w.toLowerCase())).size / words.length;
    const analysisItems = [
        { icon:'fas fa-language', title:'Variedade de Vocabulário', desc: uniqueRatio > 0.55 ? 'Alta diversidade, típico de humano.' : (uniqueRatio < 0.4 ? 'Muito repetitivo, suspeito de IA.' : 'Diversidade moderada.') },
        { icon:'fas fa-chart-line', title:'Comprimento de Palavras', desc: avgLen > 5.0 ? 'Palavras longas e variadas (mais humano).' : 'Palavras curtas e comuns (padrão IA).' },
        { icon:'fas fa-repeat', title:'Estruturas Repetitivas', desc: humanProb < 35 ? 'Frases e construções repetitivas detectadas.' : 'Boa variação estrutural.' }
    ];
    analysisGrid.innerHTML = analysisItems.map(i => `
        <div class="analysis-item">
            <div class="analysis-icon"><i class="${i.icon}"></i></div>
            <div class="analysis-text"><strong>${i.title}</strong><br><span>${i.desc}</span></div>
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

// ==================== ANÁLISE PRINCIPAL ====================
async function performAnalysis() {
    let text = textInput.value.trim();
    if (!text) {
        alert('Insira um texto ou faça upload de um arquivo.');
        return;
    }
    if (text.length < 100) {
        alert('Texto muito curto (mínimo 100 caracteres).');
        return;
    }
    showLoading();
    updateProgress(10, 'Pré-processando...');
    setTimeout(() => {
        try {
            updateProgress(50, 'Extraindo características...');
            const result = classifyText(text);
            updateProgress(80, 'Gerando resultados...');
            displayResults(result.humanProb, result.aiProb, result.confidence, text, result.features);
            currentAnalysis = {
                text: text.substring(0, 500),
                features: result.features,
                humanProb: result.humanProb
            };
            updateProgress(100, 'Concluído!');
            setTimeout(hideLoading, 500);
        } catch (err) {
            console.error(err);
            hideLoading();
            alert(`Erro na análise: ${err.message}`);
        }
    }, 100);
}

// ==================== INICIALIZAÇÃO E EVENTOS ====================
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
        window.location.reload();
    });
    helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
    closeHelpModal.addEventListener('click', () => helpModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.style.display = 'none';
    });
    toggleAnalysisBtn.addEventListener('click', () => {
        const isVisible = analysisContent.style.display !== 'none';
        analysisContent.style.display = isVisible ? 'none' : 'block';
        toggleAnalysisBtn.innerHTML = isVisible ? '<i class="fas fa-chevron-down"></i> Expandir' : '<i class="fas fa-chevron-up"></i> Recolher';
    });
    analysisContent.style.display = 'block';

    // Upload de arquivos
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', async e => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) await processFile(file);
    });
    fileInput.addEventListener('change', async e => {
        if (e.target.files.length) await processFile(e.target.files[0]);
    });

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
                const txt = await page.getTextContent();
                full += txt.items.map(t => t.str).join(' ') + '\n';
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

    // Relatórios e exportação
    generateReportBtn.addEventListener('click', () => {
        if (!currentAnalysis) {
            alert('Nenhuma análise realizada.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Relatório de Detecção de IA', 20, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleString()}`, 20, 30);
        doc.text(`Probabilidade Humana: ${Math.round(currentAnalysis.humanProb)}%`, 20, 40);
        doc.text(`Probabilidade IA: ${Math.round(100 - currentAnalysis.humanProb)}%`, 20, 50);
        doc.text('Prévia do texto:', 20, 60);
        const preview = (currentAnalysis.text || '').substring(0, 400);
        doc.text(preview, 20, 70, { maxWidth: 170 });
        doc.save(`relatorio_ia_${Date.now()}.pdf`);
    });

    exportDataBtn.addEventListener('click', () => {
        if (!currentAnalysis) {
            alert('Nenhuma análise para exportar.');
            return;
        }
        const data = {
            timestamp: new Date().toISOString(),
            humanProbability: currentAnalysis.humanProb,
            textPreview: currentAnalysis.text,
            features: currentAnalysis.features
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
        if (!currentAnalysis) {
            alert('Nada para salvar.');
            return;
        }
        const history = JSON.parse(localStorage.getItem('ia_detector_history') || '[]');
        history.push({
            ...currentAnalysis,
            timestamp: Date.now()
        });
        if (history.length > 100) history.shift();
        localStorage.setItem('ia_detector_history', JSON.stringify(history));
        alert('Análise salva no histórico local.');
    });
}

// Inicializar após carregamento da página
window.addEventListener('DOMContentLoaded', init);
