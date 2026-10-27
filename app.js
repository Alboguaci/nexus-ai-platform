// NexusAI Enterprise Cloud Platform - Main Application Logic
// Authors: Juan Carlos Benítez Rojas & Juan José Córdoba Eraso

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initTasksTable();
    initCharts();
    renderUmlView('use-case');
    setupModalListeners();
});

// Sample Initial Tasks Database
let tasksData = [
    {
        id: "NX-8921",
        channel: "WhatsApp Business",
        channelIcon: "message-circle",
        prompt: "Solicitud urgente de autorización de crédito especial para cliente corporativo con score de riesgo 720.",
        agents: ["Triaje LLM", "RAG Financiero", "Compliance Guard", "Saga Coordinator"],
        latency: "1.12 s",
        status: "RESOLVED",
        statusLabel: "Resuelto por IA",
        statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        timestamp: "Hace 2 min"
    },
    {
        id: "NX-8920",
        channel: "Portal Web",
        channelIcon: "globe",
        prompt: "Reprogramación de despacho logístico con validación de cobertura en bodega regional.",
        agents: ["Triaje LLM", "RAG Logístico", "Saga Coordinator"],
        latency: "1.45 s",
        status: "RESOLVED",
        statusLabel: "Resuelto por IA",
        statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        timestamp: "Hace 5 min"
    },
    {
        id: "NX-8919",
        channel: "Email Corporativo",
        channelIcon: "mail",
        prompt: "Reclamo por cobro duplicado en pasarela bancaria externa. Monto excede umbral de tolerancia.",
        agents: ["Triaje LLM", "Compliance Guard", "Human-in-the-Loop"],
        latency: "2.80 s",
        status: "REVIEW",
        statusLabel: "Revisión Humana Requerida",
        statusClass: "bg-amber-50 text-amber-700 border-amber-200",
        timestamp: "Hace 12 min"
    },
    {
        id: "NX-8918",
        channel: "Integración ERP",
        channelIcon: "database",
        prompt: "Sincronización masiva de inventario con motor de conciliación y actualización de catálogo.",
        agents: ["Triaje LLM", "Saga Coordinator", "MariaDB Connector"],
        latency: "0.89 s",
        status: "RESOLVED",
        statusLabel: "Resuelto por IA",
        statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        timestamp: "Hace 25 min"
    },
    {
        id: "NX-8917",
        channel: "Portal Web",
        channelIcon: "globe",
        prompt: "Intento de mutación de límite operativo durante ventana de mantenimiento no autorizada.",
        agents: ["Triaje LLM", "Saga Coordinator", "Circuit Breaker"],
        latency: "0.42 s",
        status: "COMPENSATED",
        statusLabel: "Compensado por Falla (Rollback)",
        statusClass: "bg-red-50 text-red-700 border-red-200",
        timestamp: "Hace 40 min"
    }
];

function initTasksTable() {
    renderTasks(tasksData);
}

function renderTasks(data) {
    const tbody = document.getElementById('task-table-body');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400 text-xs">No se encontraron operaciones registradas con este filtro.</td></tr>`;
        return;
    }

    data.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition-colors border-b border-slate-100";

        const agentsHtml = task.agents.map(a => `<span class="inline-block bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1 mb-0.5 border border-slate-200">${a}</span>`).join('');

        tr.innerHTML = `
            <td class="py-3 px-4 font-mono text-xs font-semibold text-indigo-600">${task.id}</td>
            <td class="py-3 px-4 text-xs font-medium text-slate-800 flex items-center space-x-1.5">
                <i data-lucide="${task.channelIcon}" class="w-3.5 h-3.5 text-slate-400"></i>
                <span>${task.channel}</span>
            </td>
            <td class="py-3 px-4 text-xs text-slate-700 max-w-xs truncate" title="${task.prompt}">${task.prompt}</td>
            <td class="py-3 px-4">${agentsHtml}</td>
            <td class="py-3 px-4 font-mono text-xs text-slate-600">${task.latency}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${task.statusClass}">
                    ${task.statusLabel}
                </span>
            </td>
            <td class="py-3 px-4 text-right">
                <button onclick="viewTaskDetail('${task.id}')" class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center space-x-1">
                    <span>Detalles</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function filterTasks() {
    const filter = document.getElementById('filter-status').value;
    if (filter === 'ALL') {
        renderTasks(tasksData);
    } else {
        const filtered = tasksData.filter(t => t.status === filter);
        renderTasks(filtered);
    }
}

function refreshTaskData() {
    filterTasks();
}

function viewTaskDetail(taskId) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;
    alert(`Detalle de Operación Transaccional:\nID: ${task.id}\nCanal: ${task.channel}\nPrompt: ${task.prompt}\nAgentes Involucrados: ${task.agents.join(', ')}\nEstado: ${task.statusLabel}\nLatencia E2E: ${task.latency}`);
}

// Navigation Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-slate-500');
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.remove('hidden');

    const activeBtn = document.getElementById('tab-btn-' + tabId.replace('tab-', ''));
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-slate-500');
        activeBtn.classList.add('border-indigo-600', 'text-indigo-600');
    }

    lucide.createIcons();
}

// Modal Simulation & Saga Execution
function setupModalListeners() {
    const modal = document.getElementById('modal-new-task');
    const openBtn = document.getElementById('btn-open-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel');
    const runBtn = document.getElementById('btn-run-flow');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.getElementById('live-pipeline').classList.add('hidden');
        document.getElementById('live-pipeline').innerHTML = '';
        document.getElementById('input-prompt').value = "Cliente corporativo solicita validación de crédito de contingencia por USD 45,000 con aprobación automática condicionada.";
    });

    const closeModal = () => modal.classList.add('hidden');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    runBtn.addEventListener('click', () => {
        const prompt = document.getElementById('input-prompt').value.trim();
        const channel = document.getElementById('input-channel').value;
        const mode = document.querySelector('input[name="sim-mode"]:checked').value;

        if (!prompt) {
            alert("Por favor ingresa una solicitud o prompt de negocio.");
            return;
        }

        executeMultiAgentPipeline(channel, prompt, mode);
    });
}

function executeMultiAgentPipeline(channel, prompt, mode) {
    const pipelineBox = document.getElementById('live-pipeline');
    pipelineBox.classList.remove('hidden');
    pipelineBox.innerHTML = '';
    const runBtn = document.getElementById('btn-run-flow');
    runBtn.disabled = true;
    runBtn.classList.add('opacity-50');

    const addLog = (text, color = "text-slate-300") => {
        const p = document.createElement('div');
        p.className = `flex items-center space-x-2 ${color}`;
        p.innerHTML = `<span class="text-indigo-400 font-bold">[${new Date().toLocaleTimeString()}]</span> <span>${text}</span>`;
        pipelineBox.appendChild(p);
        pipelineBox.scrollTop = pipelineBox.scrollHeight;
    };

    addLog(`🚀 [API Gateway] Ingesta de petición entrante vía ${channel}...`, 'text-indigo-300');

    setTimeout(() => {
        addLog(`⚡ [Triage Agent] Análisis de semántica e intención con Gemini 1.5 Flash (Latencia: 84 ms)...`, 'text-emerald-300');
    }, 400);

    setTimeout(() => {
        addLog(`🧠 [RAG Resolution Agent] Búsqueda vectorial en Pinecone y evaluación de reglas de negocio...`, 'text-blue-300');
    }, 900);

    setTimeout(() => {
        if (mode === 'SUCCESS') {
            addLog(`🛡️ [Compliance Guard] Validación de guardrails de seguridad y PII (Confianza: 98.4%)...`, 'text-purple-300');
            
            setTimeout(() => {
                addLog(`⚙️ [Saga Coordinator] Transacción distribuida confirmada en MariaDB & Kafka emitido exitosamente.`, 'text-emerald-400 font-bold');
                addLog(`✅ Flujo completado en 1.34s. Estado final: RESOLVED.`, 'text-emerald-300 font-bold');

                // Add to table
                const newId = "NX-" + Math.floor(8922 + Math.random() * 50);
                tasksData.unshift({
                    id: newId,
                    channel: channel,
                    channelIcon: channel.includes('Web') ? 'globe' : channel.includes('WhatsApp') ? 'message-circle' : channel.includes('Email') ? 'mail' : 'database',
                    prompt: prompt,
                    agents: ["Triaje LLM", "RAG Resolution", "Compliance Guard", "Saga Coordinator"],
                    latency: "1.34 s",
                    status: "RESOLVED",
                    statusLabel: "Resuelto por IA",
                    statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    timestamp: "Justo ahora"
                });
                renderTasks(tasksData);
                document.getElementById('kpi-total-tasks').innerText = (14820 + tasksData.length - 5).toLocaleString();

                runBtn.disabled = false;
                runBtn.classList.remove('opacity-50');
                setTimeout(() => {
                    document.getElementById('modal-new-task').classList.add('hidden');
                }, 1200);
            }, 800);
        } else {
            addLog(`⚠️ [Circuit Breaker] Fallo crítico detectado en servicio externo de scoring (503 Service Unavailable).`, 'text-amber-400 font-bold');
            
            setTimeout(() => {
                addLog(`🔄 [Saga Coordinator] Activando protocolo de compensación (Rollback automático transaccional)...`, 'text-red-400 font-bold');
                addLog(`❌ Mutación revertida en almacenamiento. Sin inconsistencias de datos.`, 'text-red-300 font-bold');

                const newId = "NX-" + Math.floor(8922 + Math.random() * 50);
                tasksData.unshift({
                    id: newId,
                    channel: channel,
                    channelIcon: channel.includes('Web') ? 'globe' : channel.includes('WhatsApp') ? 'message-circle' : channel.includes('Email') ? 'mail' : 'database',
                    prompt: prompt,
                    agents: ["Triaje LLM", "Circuit Breaker", "Saga Coordinator"],
                    latency: "0.58 s",
                    status: "COMPENSATED",
                    statusLabel: "Compensado por Falla (Rollback)",
                    statusClass: "bg-red-50 text-red-700 border-red-200",
                    timestamp: "Justo ahora"
                });
                renderTasks(tasksData);

                runBtn.disabled = false;
                runBtn.classList.remove('opacity-50');
                setTimeout(() => {
                    document.getElementById('modal-new-task').classList.add('hidden');
                }, 1500);
            }, 800);
        }
    }, 1500);
}

// UML Views Rendering (Clean, Modern, Vectorial SVGs)
function renderUmlView(viewKey) {
    document.querySelectorAll('.uml-selector-btn').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50', 'text-indigo-700', 'border-2');
        btn.classList.add('border', 'border-slate-200', 'bg-white', 'text-slate-700');
    });

    const activeBtn = document.getElementById('uml-btn-' + viewKey);
    if (activeBtn) {
        activeBtn.classList.remove('border', 'border-slate-200', 'bg-white', 'text-slate-700');
        activeBtn.classList.add('border-2', 'border-indigo-600', 'bg-indigo-50', 'text-indigo-700');
    }

    const container = document.getElementById('uml-svg-container');
    const titleEl = document.getElementById('uml-title');
    const descEl = document.getElementById('uml-desc');

    if (viewKey === 'use-case') {
        titleEl.innerText = "Vista 1: Diagrama de Casos de Uso (Interacción Humano-Agente)";
        descEl.innerText = "Modelado UML 2.5 que representa actores de negocio, relaciones <<include>> de guardrails y <<extend>> de compensación.";
        container.innerHTML = `
        <svg viewBox="0 0 850 360" class="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Background & Boundary -->
            <rect x="180" y="20" width="500" height="320" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="430" y="45" fill="#94a3b8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">BOUNDARY: NexusAI Multi-Agent Mesh</text>

            <!-- Actor 1: Cliente / Usuario -->
            <circle cx="80" cy="90" r="14" fill="#6366f1"/>
            <line x1="80" y1="104" x2="80" y2="140" stroke="#6366f1" stroke-width="3"/>
            <line x1="60" y1="115" x2="100" y2="115" stroke="#6366f1" stroke-width="3"/>
            <line x1="80" y1="140" x2="65" y2="170" stroke="#6366f1" stroke-width="3"/>
            <line x1="80" y1="140" x2="95" y2="170" stroke="#6366f1" stroke-width="3"/>
            <text x="80" y="195" fill="#f8fafc" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">Usuario / Cliente</text>

            <!-- Actor 2: Supervisor Humano -->
            <circle cx="770" cy="220" r="14" fill="#a855f7"/>
            <line x1="770" y1="234" x2="770" y2="270" stroke="#a855f7" stroke-width="3"/>
            <line x1="750" y1="245" x2="790" y2="245" stroke="#a855f7" stroke-width="3"/>
            <line x1="770" y1="270" x2="755" y2="300" stroke="#a855f7" stroke-width="3"/>
            <line x1="770" y1="270" x2="785" y2="300" stroke="#a855f7" stroke-width="3"/>
            <text x="770" y="325" fill="#f8fafc" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">Auditor Humano</text>

            <!-- Use Cases -->
            <!-- UC 1 -->
            <ellipse cx="300" cy="90" rx="95" ry="24" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
            <text x="300" y="94" fill="#f8fafc" font-size="10" font-family="sans-serif" text-anchor="middle">UC-01: Solicitar Tarea Omnicanal</text>

            <!-- UC 2 -->
            <ellipse cx="540" cy="90" rx="95" ry="24" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="540" y="94" fill="#f8fafc" font-size="10" font-family="sans-serif" text-anchor="middle">UC-02: Triaje y Extracción Intención</text>

            <!-- UC 3 -->
            <ellipse cx="430" cy="180" rx="100" ry="26" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
            <text x="430" y="184" fill="#f8fafc" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">UC-03: Orquestación Saga Cognitiva</text>

            <!-- UC 4 (Include) -->
            <ellipse cx="280" cy="270" rx="90" ry="24" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <text x="280" y="274" fill="#f8fafc" font-size="10" font-family="sans-serif" text-anchor="middle">UC-04: Validar Compliance (Guardrail)</text>

            <!-- UC 5 (Extend) -->
            <ellipse cx="560" cy="270" rx="95" ry="24" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
            <text x="560" y="274" fill="#f8fafc" font-size="10" font-family="sans-serif" text-anchor="middle">UC-05: Compensación Saga por Falla</text>

            <!-- Connections -->
            <line x1="120" y1="100" x2="205" y2="90" stroke="#6366f1" stroke-width="2"/>
            
            <!-- UC1 to UC2 -->
            <line x1="395" y1="90" x2="445" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="420" y="82" fill="#94a3b8" font-size="8" text-anchor="middle">&lt;&lt;include&gt;&gt;</text>

            <!-- UC2 to UC3 -->
            <line x1="510" y1="114" x2="460" y2="155" stroke="#94a3b8" stroke-width="1.5"/>

            <!-- UC3 to UC4 (include) -->
            <line x1="375" y1="205" x2="310" y2="248" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="325" y="222" fill="#a855f7" font-size="8" text-anchor="middle">&lt;&lt;include&gt;&gt;</text>

            <!-- UC3 to UC5 (extend) -->
            <line x1="485" y1="205" x2="530" y2="248" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="525" y="222" fill="#ef4444" font-size="8" text-anchor="middle">&lt;&lt;extend&gt;&gt;</text>

            <!-- Human Auditor connection -->
            <line x1="740" y1="230" x2="655" y2="270" stroke="#a855f7" stroke-width="2"/>
        </svg>`;
    } else if (viewKey === 'classes') {
        titleEl.innerText = "Vista 2: Diagrama de Clases del Dominio Multi-Agente (DDD)";
        descEl.innerText = "Estructura estática orientada a objetos que desacopla la coordinación Saga, el motor LLM y los Guardrails.";
        container.innerHTML = `
        <svg viewBox="0 0 850 360" class="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Class 1: SagaCoordinator -->
            <g transform="translate(40, 40)">
                <rect width="220" height="130" rx="6" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
                <rect width="220" height="28" rx="6" fill="#6366f1"/>
                <text x="110" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">SagaCoordinator</text>
                <text x="10" y="45" fill="#94a3b8" font-size="9" font-family="monospace">- sagaId: UUID</text>
                <text x="10" y="60" fill="#94a3b8" font-size="9" font-family="monospace">- state: SagaState</text>
                <text x="10" y="75" fill="#94a3b8" font-size="9" font-family="monospace">- context: ExecutionContext</text>
                <line x1="0" y1="82" x2="220" y2="82" stroke="#334155" stroke-width="1"/>
                <text x="10" y="98" fill="#f8fafc" font-size="9" font-family="monospace">+ executeStep(step: Step)</text>
                <text x="10" y="113" fill="#f8fafc" font-size="9" font-family="monospace">+ rollbackCompensation()</text>
            </g>

            <!-- Class 2: AgentContext (Aggregate Root) -->
            <g transform="translate(320, 40)">
                <rect width="220" height="130" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
                <rect width="220" height="28" rx="6" fill="#10b981"/>
                <text x="110" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">&lt;&lt;Aggregate&gt;&gt; AgentTask</text>
                <text x="10" y="45" fill="#94a3b8" font-size="9" font-family="monospace">- taskId: UUID</text>
                <text x="10" y="60" fill="#94a3b8" font-size="9" font-family="monospace">- intent: IntentType</text>
                <text x="10" y="75" fill="#94a3b8" font-size="9" font-family="monospace">- confidenceScore: Float</text>
                <line x1="0" y1="82" x2="220" y2="82" stroke="#334155" stroke-width="1"/>
                <text x="10" y="98" fill="#f8fafc" font-size="9" font-family="monospace">+ assignAgent(agent: IAgent)</text>
                <text x="10" y="113" fill="#f8fafc" font-size="9" font-family="monospace">+ markResolved(solution)</text>
            </g>

            <!-- Interface: IAgent -->
            <g transform="translate(600, 40)">
                <rect width="200" height="110" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <rect width="200" height="28" rx="6" fill="#0284c7"/>
                <text x="100" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">&lt;&lt;interface&gt;&gt; IAgent</text>
                <text x="10" y="48" fill="#f8fafc" font-size="9" font-family="monospace">+ process(input: TaskContext)</text>
                <text x="10" y="66" fill="#f8fafc" font-size="9" font-family="monospace">+ evaluateHealth(): Boolean</text>
                <text x="10" y="84" fill="#f8fafc" font-size="9" font-family="monospace">+ getTelemetry(): Metrics</text>
            </g>

            <!-- Class 3: CircuitBreaker -->
            <g transform="translate(180, 210)">
                <rect width="210" height="110" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
                <rect width="210" height="28" rx="6" fill="#d97706"/>
                <text x="105" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">CircuitBreaker</text>
                <text x="10" y="45" fill="#94a3b8" font-size="9" font-family="monospace">- failureThreshold: Int = 5</text>
                <text x="10" y="60" fill="#94a3b8" font-size="9" font-family="monospace">- state: CircuitState</text>
                <line x1="0" y1="68" x2="210" y2="68" stroke="#334155" stroke-width="1"/>
                <text x="10" y="84" fill="#f8fafc" font-size="9" font-family="monospace">+ recordSuccess()</text>
                <text x="10" y="99" fill="#f8fafc" font-size="9" font-family="monospace">+ recordFailure(): Fallback</text>
            </g>

            <!-- Class 4: SafetyGuardrail -->
            <g transform="translate(470, 210)">
                <rect width="220" height="110" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
                <rect width="220" height="28" rx="6" fill="#7e22ce"/>
                <text x="110" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">ComplianceGuardrail</text>
                <text x="10" y="45" fill="#94a3b8" font-size="9" font-family="monospace">- piiFilterRegex: Pattern</text>
                <text x="10" y="60" fill="#94a3b8" font-size="9" font-family="monospace">- confidenceLimit: 0.90</text>
                <line x1="0" y1="68" x2="220" y2="68" stroke="#334155" stroke-width="1"/>
                <text x="10" y="84" fill="#f8fafc" font-size="9" font-family="monospace">+ sanitizeInput(prompt): Text</text>
                <text x="10" y="99" fill="#f8fafc" font-size="9" font-family="monospace">+ verifyAuditPolicy(): Bool</text>
            </g>

            <!-- Relationships -->
            <line x1="260" y1="105" x2="320" y2="105" stroke="#94a3b8" stroke-width="2"/>
            <polygon points="315,100 325,105 315,110" fill="#94a3b8"/>

            <line x1="540" y1="105" x2="600" y2="105" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>
            <polygon points="595,100 605,105 595,110" fill="#38bdf8"/>

            <line x1="150" y1="170" x2="230" y2="210" stroke="#f59e0b" stroke-width="1.5"/>
            <line x1="430" y1="170" x2="520" y2="210" stroke="#a855f7" stroke-width="1.5"/>
        </svg>`;
    } else if (viewKey === 'sequence') {
        titleEl.innerText = "Vista 3: Diagrama de Secuencia Transaccional (Saga Multi-Agente)";
        descEl.innerText = "Cronología de interacciones asíncronas entre el cliente, el API Gateway, los agentes cognitivos y la persistencia.";
        container.innerHTML = `
        <svg viewBox="0 0 850 360" class="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Lifeline Headers -->
            <rect x="40" y="20" width="110" height="30" rx="4" fill="#6366f1"/>
            <text x="95" y="40" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Cliente / Web</text>
            <line x1="95" y1="50" x2="95" y2="340" stroke="#475569" stroke-dasharray="4,4"/>

            <rect x="190" y="20" width="110" height="30" rx="4" fill="#0284c7"/>
            <text x="245" y="40" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">API Gateway Edge</text>
            <line x1="245" y1="50" x2="245" y2="340" stroke="#475569" stroke-dasharray="4,4"/>

            <rect x="340" y="20" width="120" height="30" rx="4" fill="#10b981"/>
            <text x="400" y="40" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Saga Orchestrator</text>
            <line x1="400" y1="50" x2="400" y2="340" stroke="#475569" stroke-dasharray="4,4"/>

            <rect x="500" y="20" width="120" height="30" rx="4" fill="#8b5cf6"/>
            <text x="560" y="40" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Agentes IA (RAG)</text>
            <line x1="560" y1="50" x2="560" y2="340" stroke="#475569" stroke-dasharray="4,4"/>

            <rect x="660" y="20" width="120" height="30" rx="4" fill="#f59e0b"/>
            <text x="720" y="40" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Redis / Kafka Bus</text>
            <line x1="720" y1="50" x2="720" y2="340" stroke="#475569" stroke-dasharray="4,4"/>

            <!-- Sequence Steps -->
            <!-- Step 1 -->
            <line x1="95" y1="75" x2="245" y2="75" stroke="#38bdf8" stroke-width="2"/>
            <polygon points="240,71 248,75 240,79" fill="#38bdf8"/>
            <text x="170" y="68" fill="#94a3b8" font-size="9" text-anchor="middle">1. POST /api/v1/tasks (JWT)</text>

            <!-- Step 2 -->
            <line x1="245" y1="110" x2="400" y2="110" stroke="#38bdf8" stroke-width="2"/>
            <polygon points="395,106 403,110 395,114" fill="#38bdf8"/>
            <text x="320" y="103" fill="#94a3b8" font-size="9" text-anchor="middle">2. startSagaTransaction()</text>

            <!-- Step 3 -->
            <line x1="400" y1="145" x2="720" y2="145" stroke="#10b981" stroke-width="1.5"/>
            <polygon points="715,141 723,145 715,149" fill="#10b981"/>
            <text x="560" y="138" fill="#10b981" font-size="9" text-anchor="middle">3. persistInitialState(Redis, TTL: 300s)</text>

            <!-- Step 4 -->
            <line x1="400" y1="185" x2="560" y2="185" stroke="#a855f7" stroke-width="2"/>
            <polygon points="555,181 563,185 555,189" fill="#a855f7"/>
            <text x="480" y="178" fill="#a855f7" font-size="9" text-anchor="middle">4. executePipeline(Triage & RAG)</text>

            <!-- Step 5 (AI Processing loop) -->
            <rect x="550" y="195" width="20" height="35" rx="3" fill="#6d28d9"/>
            <text x="580" y="215" fill="#c084fc" font-size="8">Inferencia LLM (1.1s)</text>

            <!-- Step 6 -->
            <line x1="560" y1="240" x2="400" y2="240" stroke="#34d399" stroke-width="2"/>
            <polygon points="405,236 397,240 405,244" fill="#34d399"/>
            <text x="480" y="233" fill="#34d399" font-size="9" text-anchor="middle">5. pipelineResult(Confidence: 98.4%)</text>

            <!-- Step 7 -->
            <line x1="400" y1="275" x2="720" y2="275" stroke="#f59e0b" stroke-width="2"/>
            <polygon points="715,271 723,275 715,279" fill="#f59e0b"/>
            <text x="560" y="268" fill="#f59e0b" font-size="9" text-anchor="middle">6. publishEvent("task.resolved.v1", Kafka)</text>

            <!-- Step 8 -->
            <line x1="400" y1="310" x2="95" y2="310" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>
            <polygon points="102,306 94,310 102,314" fill="#38bdf8"/>
            <text x="245" y="303" fill="#38bdf8" font-size="9" text-anchor="middle">7. HTTP 200 OK (Task Payload + Telemetry)</text>
        </svg>`;
    } else if (viewKey === 'deployment') {
        titleEl.innerText = "Vista 4: Diagrama de Despliegue Cloud Multi-AZ (Topología Físcia y Lógica)";
        descEl.innerText = "Infraestructura cloud-native que combina Vercel Edge con clústeres AWS ECS Fargate, Kafka y bases vectoriales.";
        container.innerHTML = `
        <svg viewBox="0 0 850 360" class="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Vercel Edge Box -->
            <g transform="translate(30, 30)">
                <rect width="210" height="300" rx="10" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
                <text x="105" y="30" fill="#818cf8" font-size="12" font-weight="bold" text-anchor="middle">Vercel Edge Network</text>
                <text x="105" y="48" fill="#64748b" font-size="8" text-anchor="middle">Anycast CDN & Global Edge</text>
                
                <rect x="25" y="75" width="160" height="60" rx="6" fill="#1e293b" stroke="#38bdf8"/>
                <text x="105" y="100" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">&lt;&lt;device&gt;&gt; SPA Frontend</text>
                <text x="105" y="118" fill="#94a3b8" font-size="8" text-anchor="middle">HTML5 / Tailwind / Chart.js</text>

                <rect x="25" y="160" width="160" height="65" rx="6" fill="#1e293b" stroke="#10b981"/>
                <text x="105" y="185" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">&lt;&lt;execution&gt;&gt; Edge API</text>
                <text x="105" y="202" fill="#94a3b8" font-size="8" text-anchor="middle">Reverse Proxy / Rate Limit</text>
            </g>

            <!-- AWS VPC Cloud Box -->
            <g transform="translate(280, 30)">
                <rect width="530" height="300" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
                <text x="265" y="25" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Amazon Web Services (AWS us-east-1 VPC)</text>
                <text x="265" y="40" fill="#64748b" font-size="8" text-anchor="middle">Multi-Availability Zone High Availability</text>

                <!-- Zone A -->
                <rect x="20" y="55" width="235" height="230" rx="6" fill="#1e293b" stroke="#334155" stroke-dasharray="3,3"/>
                <text x="137" y="75" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="bold">Availability Zone us-east-1a</text>

                <rect x="35" y="90" width="205" height="45" rx="4" fill="#0f172a" stroke="#6366f1"/>
                <text x="137" y="112" fill="#f8fafc" font-size="9" text-anchor="middle">ECS Fargate: Saga Supervisor</text>
                <text x="137" y="125" fill="#64748b" font-size="7" text-anchor="middle">Docker Container Pod (Autoscale)</text>

                <rect x="35" y="145" width="205" height="45" rx="4" fill="#0f172a" stroke="#8b5cf6"/>
                <text x="137" y="167" fill="#f8fafc" font-size="9" text-anchor="middle">ECS Fargate: Triage & RAG Pod</text>
                <text x="137" y="180" fill="#64748b" font-size="7" text-anchor="middle">GPU Inf2 Instance Accelerated</text>

                <rect x="35" y="200" width="205" height="40" rx="4" fill="#0f172a" stroke="#10b981"/>
                <text x="137" y="222" fill="#f8fafc" font-size="9" text-anchor="middle">Amazon MSK (Kafka Primary)</text>

                <!-- Zone B -->
                <rect x="275" y="55" width="235" height="230" rx="6" fill="#1e293b" stroke="#334155" stroke-dasharray="3,3"/>
                <text x="392" y="75" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="bold">Availability Zone us-east-1b (Replica)</text>

                <rect x="290" y="90" width="205" height="45" rx="4" fill="#0f172a" stroke="#6366f1"/>
                <text x="392" y="112" fill="#f8fafc" font-size="9" text-anchor="middle">ECS Fargate: Saga Supervisor (Standby)</text>

                <rect x="290" y="145" width="205" height="45" rx="4" fill="#0f172a" stroke="#8b5cf6"/>
                <text x="392" y="167" fill="#f8fafc" font-size="9" text-anchor="middle">ECS Fargate: Compliance Guard</text>

                <rect x="290" y="200" width="205" height="40" rx="4" fill="#0f172a" stroke="#10b981"/>
                <text x="392" y="222" fill="#f8fafc" font-size="9" text-anchor="middle">Amazon MSK (Kafka Replica B)</text>
            </g>

            <!-- Secure Pipe Connection -->
            <line x1="240" y1="192" x2="280" y2="192" stroke="#38bdf8" stroke-width="3"/>
            <polygon points="275,188 285,192 275,196" fill="#38bdf8"/>
            <text x="260" y="180" fill="#38bdf8" font-size="8" text-anchor="middle">mTLS 1.3</text>
        </svg>`;
    }
}

// Chart.js Metrics Initialization
function initCharts() {
    // 1. Latency Distribution Chart
    const ctxLatency = document.getElementById('chart-latency');
    if (ctxLatency) {
        new Chart(ctxLatency, {
            type: 'bar',
            data: {
                labels: ['Ingesta API Gateway', 'Triaje Semántico', 'Búsqueda RAG', 'Inferencia LLM', 'Guardrails Safety', 'Saga Commit'],
                datasets: [{
                    label: 'Latencia p95 (ms)',
                    data: [18, 84, 120, 850, 95, 42],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(14, 165, 233, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(168, 85, 247, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)'
                    ],
                    borderColor: [
                        '#6366f1', '#0ea5e9', '#10b981', '#a855f7', '#f59e0b', '#ef4444'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        title: { display: true, text: 'Milisegundos (ms)', font: { size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 9 } }
                    }
                }
            }
        });
    }

    // 2. Radar Chart ISO/IEC 25010
    const ctxRadar = document.getElementById('chart-radar');
    if (ctxRadar) {
        new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: [
                    'Adecuación Funcional',
                    'Eficiencia de Desempeño',
                    'Compatibilidad',
                    'Usabilidad',
                    'Fiabilidad / Resiliencia',
                    'Seguridad / Guardrails',
                    'Mantenibilidad',
                    'Escalabilidad Nube'
                ],
                datasets: [
                    {
                        label: 'NexusAI Multi-Agent (Cloud-Native)',
                        data: [98, 95, 94, 96, 99, 98, 95, 97],
                        backgroundColor: 'rgba(99, 102, 241, 0.25)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        pointBackgroundColor: '#6366f1'
                    },
                    {
                        label: 'Monolito Tradicional (Línea Base)',
                        data: [65, 45, 50, 60, 48, 55, 40, 35],
                        backgroundColor: 'rgba(148, 163, 184, 0.15)',
                        borderColor: '#94a3b8',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        pointBackgroundColor: '#94a3b8'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(226, 232, 240, 0.8)' },
                        grid: { color: 'rgba(226, 232, 240, 0.8)' },
                        pointLabels: { font: { size: 9, weight: 'bold' } },
                        suggestedMin: 20,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 10 } }
                    }
                }
            }
        });
    }
}
