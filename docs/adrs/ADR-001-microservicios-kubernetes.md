# ADR-001: Descomposición en Microservicios sobre Kubernetes (Amazon EKS) frente a Monolito Tradicional

## Estado
Aceptado

## Contexto y Planteamiento del Problema
NexusAI Platform gestiona operaciones críticas empresariales (financieras, comerciales, auditorías) que requieren la colaboración asíncrona de múltiples modelos y agentes de IA. La arquitectura monolítica previa sufría de escalado ineficiente de GPUs/vCPUs, acoplamiento severo entre modelos, fallas en cascada y tiempos de despliegue excesivos (> 45 minutos).

## Decisión de Arquitectura
Adoptar una arquitectura basada en microservicios desacoplados desplegados en contenedores Docker y orquestados mediante Kubernetes (Amazon EKS) distribuido en 3 Zonas de Disponibilidad (Multi-AZ).

## Justificación Técnica
1. **Escalabilidad Elástica e Independiente:** Los agentes de alto consumo computacional (RAG Agent) escalan independientemente de los agentes de triaje rápido (Triage Agent).
2. **Aislamiento de Fallos (Bulkhead):** El colapso de un pod o servicio no detiene la operación de los demás microservicios.
3. **Despliegues Continuos:** Habilita estrategias Blue/Green y Canary releases sin tiempo de inactividad (Zero Downtime).

## Consecuencias
* **Positivas:** SLA de disponibilidad operativa del 99.98%, reducción del tiempo de despliegue a menos de 4 minutos, y utilización eficiente de recursos cloud.
* **Negativas:** Mayor complejidad operacional de red y necesidad de observabilidad distribuida (resuelto mediante OpenTelemetry y Service Mesh).
