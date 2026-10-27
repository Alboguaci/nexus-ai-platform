# ADR-003: Patrón Circuit Breaker con Degradación Graciosa a Modelos Ligeros (SLMs) Locales

## Estado
Aceptado

## Contexto y Planteamiento del Problema
Las dependencias externas de APIs de modelos fundacionales (Vertex AI, Anthropic) están sujetas a cuotas de tasa (HTTP 429), latencias anómalas por congestión o caídas imprevistas de proveedores. Si el sistema bloquea hilos esperando respuestas, se produce un colapso en cascada de toda la plataforma.

## Decisión de Arquitectura
Incorporar el patrón Circuit Breaker en los adaptadores de inferencia (vía resilience4j / Envoy proxy) con 3 estados (Cerrado, Abierto, Semi-abierto). Ante un 25% de fallos consecutivos o latencia > 3,000 ms, el circuito se abre y conmuta a un modelo de lenguaje ligero (SLM Llama 3 8B cuantizado) alojado localmente en pods con vLLM.

## Justificación Técnica
1. **Resiliencia Extrema:** Mantiene la operación del negocio aún ante la caída total del proveedor cloud primario.
2. **Protección de Presupuesto:** Evita reintentos masivos que consumen saldo de API sin éxito.
3. **Continuidad del Servicio:** El usuario recibe una resolución semántica válida, preservando la experiencia de usuario.

## Consecuencias
* **Positivas:** Tolerancia a desastres, tiempo medio de recuperación (MTTR) < 3 segundos, cero tiempo de inactividad total.
* **Negativas:** La inferencia degradada del SLM local puede tener menor riqueza de vocabulario en prompts altamente creativos, aunque es suficiente para el 95% de trámites transaccionales.
