# ADR-002: Patrón Saga Orquestado frente a Coreografía Transaccional

## Estado
Aceptado

## Contexto y Planteamiento del Problema
En un sistema distribuido con microservicios cognitivos y almacenes de datos desacoplados, no es viable aplicar transacciones atómicas distribuidas convencionales (Two-Phase Commit - 2PC) debido a la latencia no-determinista de las APIs de LLM y el alto riesgo de bloqueos globales (deadlocks). Se requiere garantizar consistencia eventual (BASE) y reversión determinista ante fallos.

## Decisión de Arquitectura
Implementar el Patrón Saga Orquestado centralizado en un microservicio `SagaCoordinator` apoyado en Redis Enterprise Multi-AZ como máquina de estados en memoria y Apache Kafka como bus asíncrono de eventos.

## Justificación Técnica
1. **Control Determinista y Visibilidad Central:** Permite auditar exactamente en qué etapa se encuentra cada solicitud y conocer el estado del pipeline en tiempo real.
2. **Rollbacks Compensatorios Precisos:** Si un agente de cumplimiento detecta una brecha de seguridad (confianza < 90% o fuga PII), el coordinador emite de inmediato comandos compensatorios en orden inverso para cancelar reservas y registros.
3. **Evita la Complejidad Cíclica:** La coreografía distribuida tiende a generar dependencia en malla difícil de auditar y rastrear ante fallos adversarios.

## Consecuencias
* **Positivas:** Trazabilidad absoluta de transacciones, tiempo de rollback < 200 ms, y aislamiento de fallas en flujos Human-in-the-Loop.
* **Negativas:** `SagaCoordinator` se convierte en un componente crítico, lo que se mitiga desplegándolo con réplicas activas en Kubernetes bajo balanceador de carga.
