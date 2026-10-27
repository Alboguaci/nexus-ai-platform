# ADR-004: Patrón CQRS con Base de Datos Vectorial Desacoplada (Pinecone / Qdrant)

## Estado
Aceptado

## Contexto y Planteamiento del Problema
Las búsquedas semánticas para recuperación aumentada (RAG) requieren calcular similitudes coseno sobre embeddings de 1536 dimensiones. Ejecutar estas consultas vectoriales sobre bases de datos relacionales tradicionales (PostgreSQL) satura las CPU transaccionales e incrementa la latencia P95 a niveles inaceptables (> 4,500 ms).

## Decisión de Arquitectura
Separar las responsabilidades de lectura y escritura mediante el patrón Command Query Responsibility Segregation (CQRS). Las mutaciones transaccionales se procesan en Aurora PostgreSQL Serverless v2 (Command), mientras que las consultas semánticas y de similitud se ejecutan sobre una base de datos vectorial dedicada (Pinecone / Qdrant) indexada con HNSW (Query).

## Justificación Técnica
1. **Latencia Sub-Segundo:** Consultas vectoriales con tiempos de respuesta < 40 ms para el Agente RAG.
2. **Escalabilidad Asimétrica:** El tráfico de consulta de conocimiento supera al de mutación en un factor de 10:1; CQRS permite escalar los nodos vectoriales sin pagar sobrecostos en base relacional.
3. **Sincronización Asíncrona:** La actualización del índice vectorial se realiza mediante eventos Kafka emitidos por Transactional Outbox.

## Consecuencias
* **Positivas:** Reducción del 65% en latencia de inferencia RAG y optimización del costo por transacción.
* **Negativas:** Consistencia eventual entre el commit transaccional y la disponibilidad en el índice vectorial (ventana de retraso < 250 ms).
