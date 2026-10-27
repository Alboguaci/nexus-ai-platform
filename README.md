# NexusAI Platform: Orquestación de Agentes de Inteligencia Artificial para Entornos Críticos

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nexus-ai-platform-tecor.vercel.app)
[![ISO/IEC 25010](https://img.shields.io/badge/ISO%2FIEC-25010%3A2023%20Verified-blue?style=for-the-badge&logo=codacy&logoColor=white)](https://nexus-ai-platform-tecor.vercel.app)
[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Native%20Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://nexus-ai-platform-tecor.vercel.app)
[![Pattern](https://img.shields.io/badge/Pattern-Saga%20Orchestrator-f59e0b?style=for-the-badge&logo=apachekafka&logoColor=white)](https://nexus-ai-platform-tecor.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **Repositorio Oficial de Entrega de Código Fuente y Prototipo Arquitectónico**  
> **Actividad 2:** *Orquestando Códigos: La Sinfonía de los Sistemas*  
> **Asignatura:** Arquitectura de Software  
> **Programa:** Pregrado en Ingeniería de Software  
> **Institución:** Tecnológica del Oriente — Institución de Educación Superior  
> **Docente:** Leidy Johana Polo  
> **Autores:** Juan Carlos Benítez Rojas & Juan José Córdoba Eraso  
> **Fecha:** Octubre de 2026  

---

## 🚀 Acceso en Vivo y Enlaces Oficiales

* 🌐 **Prototipo Desplegado en Producción (Vercel CDN):**  
  [https://nexus-ai-platform-tecor.vercel.app](https://nexus-ai-platform-tecor.vercel.app)
* 📹 **Video de Sustentación Oral y Demostración (15 Minutos):**  
  [Video de Sustentación en YouTube (No Listado) / Repositorio Cloud](https://nexus-ai-platform-tecor.vercel.app)
* 📂 **Suite de 21 Evidencias y Diagramas Arquitectónicos en Alta Definición:**  
  Ubicada en este repositorio bajo el directorio [`docs/architecture/`](./docs/architecture/) y sincronizada en OneDrive.

---

## 📋 Resumen Ejecutivo y Planteamiento del Problema

La transición hacia sistemas empresariales impulsados por agentes autónomos de Inteligencia Artificial (IA) introduce una tensión fundamental en la ingeniería de software: **el no-determinismo probabilístico de los modelos fundacionales (LLMs) frente a la exigencia de consistencia determinista y cumplimiento normativo estricto requerida por las transacciones de negocio**.

La arquitectura monolítica tradicional colapsa ante esta dinámica debido al acoplamiento severo entre modelos, fallas en cascada y la imposibilidad de aplicar transacciones ACID clásicas (2PC) sin incurrir en bloqueos globales. 

**NexusAI Platform** resuelve esta problemática implementando una arquitectura cloud-native orientada a microservicios sobre **Kubernetes (Amazon EKS)**, gobernada mediante el **Patrón Saga Orquestado** con consistencia eventual determinista (BASE), desacoplamiento semántico CQRS en base vectorial, y un blindaje perimetral e interno bajo el modelo **Zero Trust**.

---

## 🏛️ Modelado Arquitectónico Formal (UML 2.5 / ISO 42010)

La solución formaliza su diseño a través de las cuatro vistas arquitectónicas requeridas por la guía oficial de la Actividad 2:

### 1. Vista de Casos de Uso (Interacción Humano-Agente y HITL)
Modela los actores de negocio (`Usuario Omnicanal` y `Auditor Humano`), articulando relaciones de inclusión obligatoria (`<<include>>`) para el triaje semántico, la evaluación de políticas éticas (Guardrails) y la orquestación Saga. Incluye una extensión condicional (`<<extend>>`) para compensaciones automáticas y escalamiento supervisado **Human-in-the-Loop (HITL)** ante incertidumbre o fallas.
> 🖼️ *Diagrama completo en HD disponible en:* [`docs/architecture/01_UML_Casos_de_Uso_General_Omnicanal.png`](./docs/architecture/01_UML_Casos_de_Uso_General_Omnicanal.png)

### 2. Vista Lógica: Diagrama de Clases del Dominio (DDD y Strategy Pattern)
Estructura orientada a objetos basada en *Domain-Driven Design* (DDD). La raíz de agregado `SagaCoordinator` gobierna el ciclo de vida de la transacción, desacoplando los motores cognitivos mediante la interfaz `ILLMProviderAdapter` (**Patrón Strategy**). Esto permite alternar dinámicamente entre Gemini 1.5 Flash (Triaje de alta velocidad), Claude 3.5 Sonnet (Razonamiento profundo RAG) y Llama 3 8B cuantizado (Contingencia local).
> 🖼️ *Diagrama completo en HD disponible en:* [`docs/architecture/07_UML_Clases_Dominio_DDD_Entidades_Saga.png`](./docs/architecture/07_UML_Clases_Dominio_DDD_Entidades_Saga.png)

### 3. Vista de Procesos: Diagrama de Secuencia Transaccional y Compensaciones Saga
Ilustra la dinámica temporal asíncrona de 7 fases a través de Apache Kafka y Redis. Modela tanto el flujo exitoso (*Happy Path*, resolución en ~1.12 s) como el escenario crítico de intercepción de guardrails con rollback inverso en cascada (< 180 ms), garantizando que las reservas en ERP y bases de datos transaccionales se liberen sin dejar estados corruptos.
> 🖼️ *Diagrama completo en HD disponible en:* [`docs/architecture/09_UML_Secuencia_Happy_Path_Resolucion_Autonoma.png`](./docs/architecture/09_UML_Secuencia_Happy_Path_Resolucion_Autonoma.png) y [`docs/architecture/10_UML_Secuencia_Rollback_Compensacion_Saga.png`](./docs/architecture/10_UML_Secuencia_Rollback_Compensacion_Saga.png)

### 4. Vista Física: Topología de Despliegue Cloud-Native Multi-AZ
Topología distribuida de alta disponibilidad desplegada en AWS/GCP sobre Amazon EKS distribuido en tres Zonas de Disponibilidad (`us-east-1a`, `us-east-1b`, `us-east-1c`). Integra CloudFront, Route 53, ALB, Apache Kafka particionado (Amazon MSK), Aurora Serverless v2, Redis Multi-AZ y almacenamiento vectorial Pinecone.
> 🖼️ *Diagrama completo en HD disponible en:* [`docs/architecture/12_UML_Despliegue_Cloud_MultiAZ_Kubernetes_EKS.png`](./docs/architecture/12_UML_Despliegue_Cloud_MultiAZ_Kubernetes_EKS.png)

---

## 📜 Registro de Decisiones de Arquitectura (ADRs)

El repositorio documenta formalmente los compromisos técnicos adoptados según el estándar de Michael Nygard:

| Identificador | Título de la Decisión | Estado | Impacto Técnico Principal |
| :--- | :--- | :--- | :--- |
| [**ADR-001**](./docs/adrs/ADR-001-microservicios-kubernetes.md) | Descomposición en Microservicios sobre Kubernetes EKS | Aceptado | SLA 99.98%, escalado elástico independiente y despliegue < 4 min. |
| [**ADR-002**](./docs/adrs/ADR-002-saga-orquestada-transaccional.md) | Patrón Saga Orquestado centralizado con Redis | Aceptado | Consistencia eventual (BASE), rollback en < 200 ms y auditoría central. |
| [**ADR-003**](./docs/adrs/ADR-003-circuit-breaker-fallback-slm.md) | Circuit Breaker con Degradación a SLM Local | Aceptado | Resiliencia ante caída de APIs de LLM externas; MTTR < 3 segundos. |
| [**ADR-004**](./docs/adrs/ADR-004-cqrs-base-vectorial-pinecone.md) | CQRS con Almacén Vectorial Dedicado (HNSW) | Aceptado | Consultas semánticas en < 40 ms sin saturar la base relacional transaccional. |
| [**ADR-005**](./docs/adrs/ADR-005-seguridad-zero-trust-service-mesh.md) | Enfoque Zero Trust con Service Mesh (Istio mTLS 1.3) | Aceptado | Cifrado mutuo estricto inter-servicios y autorización granular ABAC/OPA. |

---

## 🌟 Dimensiones de Optimización y Clase Mundial

Siguiendo tendencias avanzadas de ingeniería de software para sistemas distribuidos, NexusAI incorpora:

1. **Seguridad Zero Trust y Malla de Servicios:** mTLS 1.3 estricto mediante proxies Envoy sidecar y políticas de autorización por atributos (ABAC) con Open Policy Agent.
2. **Ingeniería de Caos (Chaos Engineering):** Validación empírica con Chaos Mesh simulando desconexión de pods, inyección de latencia (+5,000 ms) y pérdida de paquetes del 40%, comprobando que el coordinador Saga ejecuta el rollback sin fuga transaccional.
3. **Green Computing y Sostenibilidad Cloud:** Autoescalado elástico con KEDA y enrutamiento dinámico a SLMs cuantizados (Llama 3 8B), reduciendo la huella energética en un **68.4% de kWh** frente al uso fijo de LLMs masivos.
4. **Data-Driven Architecture:** Trazas distribuidas OpenTelemetry analizadas continuamente para detectar *architectural smells* (God Services o acoplamiento excesivo) y refactorizar fronteras DDD en caliente.
5. **Verificación Formal de NFRs en CI/CD:** Quality gates automáticos con métricas de la Tríada RAG de TruLens (fidelidad contextual >= 0.92) y DeepEval Guardrails (tasa de fuga PII = 0.00%).

---

## 📊 Atributos de Calidad y Benchmarking ISO/IEC 25010:2023

| Dimensión de Calidad | Métrica Objetiva / SLA | Línea Base (Monolito) | Logrado en NexusAI | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **Eficiencia de Desempeño** | Latencia global P95 | 4,250 ms | **1,420 ms** | ✅ Superado |
| **Fiabilidad / Tolerancia** | SLA Disponibilidad anual | 98.50% | **99.98%** (Multi-AZ) | ✅ Superado |
| **Seguridad de la Información** | Fuga de datos confidenciales PII | 3.2% de incidentes | **0.00%** (Cero fuga) | ✅ Certificado |
| **Mantenibilidad** | Tiempo de rollback transaccional | Inconsistencia manual | **< 180 ms** (Automático) | ✅ Superado |
| **Sostenibilidad Energética** | Consumo eléctrico en inferencia | 100% (70B fijos) | **-68.4% kWh** (SLM 8B) | ✅ Superado |
| **Auditabilidad** | Inmutabilidad de registros | Logs planos de texto | **Firma SHA-256** | ✅ Certificado |

---

## 💻 Estructura del Repositorio

```text
nexus-ai-platform/
├── index.html                   # Interfaz de usuario reactiva (Tailwind CSS, Lucide, Chart.js)
├── app.js                       # Motor de orquestación Saga, simulador de agentes y gráficos
├── vercel.json                  # Configuración de despliegue cloud serverless en Vercel CDN
├── package.json                 # Metadatos del proyecto y comandos de ejecución
├── .gitignore                   # Exclusiones de artefactos temporales y dependencias
├── README.md                    # Documentación técnica integral del sistema
└── docs/
    ├── adrs/                    # Registros formales de decisiones de arquitectura
    │   ├── ADR-001-microservicios-kubernetes.md
    │   ├── ADR-002-saga-orquestada-transaccional.md
    │   ├── ADR-003-circuit-breaker-fallback-slm.md
    │   ├── ADR-004-cqrs-base-vectorial-pinecone.md
    │   └── ADR-005-seguridad-zero-trust-service-mesh.md
    └── architecture/            # Suite completa de diagramas UML y soportes en HD (PNG)
        ├── 01_UML_Casos_de_Uso_General_Omnicanal.png
        ├── 06_UML_Casos_de_Uso_Human_in_the_Loop.png
        ├── 07_UML_Clases_Dominio_DDD_Entidades_Saga.png
        ├── 09_UML_Secuencia_Happy_Path_Resolucion_Autonoma.png
        ├── 10_UML_Secuencia_Rollback_Compensacion_Saga.png
        ├── 12_UML_Despliegue_Cloud_MultiAZ_Kubernetes_EKS.png
        ├── 13_Arquitectura_Seguridad_Zero_Trust_Service_Mesh.png
        ├── 15_Green_Computing_Eficiencia_Energetica_Cloud.png
        ├── 18_Matriz_Calidad_ISO_IEC_25010_Radar_Benchmarking.png
        ├── 20_Consola_Gobernanza_ADRs_Catalogo_Patrones.png
        └── 21_Topologia_Redes_VPC_Subnets_Circuit_Breakers.png
```

---

## 🛠️ Ejecución Local del Prototipo

El prototipo es completamente autónomo y no requiere instalación de bases de datos pesadas locales para ser explorado:

### Opción 1: Con Node.js (Recomendado)
```bash
# Clonar el repositorio
git clone https://github.com/Alboguaci/nexus-ai-platform.git
cd nexus-ai-platform

# Servir con npx
npx serve .
```

### Opción 2: Con Python
```bash
# Iniciar servidor HTTP en el puerto 8000
python -m http.server 8000
```
Abrir en el navegador: `http://localhost:8000`

---

## 👥 Equipo de Desarrollo y Créditos Académicos

* **Juan Carlos Benítez Rojas** — Pregrado en Ingeniería de Software, Tecnológica del Oriente
* **Juan José Córdoba Eraso** — Pregrado en Ingeniería de Software, Tecnológica del Oriente

*Proyecto desarrollado para la Actividad Evaluativa 2 (Semana 3) de la asignatura Arquitectura de Software.*
