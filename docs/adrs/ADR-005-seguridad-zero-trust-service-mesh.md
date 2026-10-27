# ADR-005: Enfoque Zero Trust y Malla de Servicios (Service Mesh con Istio / Envoy)

## Estado
Aceptado

## Contexto y Planteamiento del Problema
En arquitecturas distribuidas con agentes autónomos que manejan información confidencial de clientes (PII) y autorizaciones financieras, asumir que la red interna de Kubernetes es "segura y confiable" (seguridad perimetral tradicional) es una vulnerabilidad crítica ante movimientos laterales o inyecciones de código malicioso.

## Decisión de Arquitectura
Adoptar el modelo de seguridad Zero Trust mediante la implementación de una Service Mesh (Istio con proxies Envoy como Sidecars). Todo el tráfico inter-servicios se autentica y encripta con Mutual TLS (mTLS 1.3 estricto) y las políticas de autorización se validan mediante Open Policy Agent (OPA) bajo esquemas ABAC (Attribute-Based Access Control).

## Justificación Técnica
1. **Encriptación de Extremo a Extremo:** Ningún paquete viaja en texto plano dentro del clúster de Kubernetes.
2. **Identidad Criptográfica de Servicios:** Cada microservicio obtiene un certificado X.509 de vida corta gestionado por SPIFFE/SPIRE.
3. **Control de Acceso Fino (ABAC):** El Agente de Triaje solo puede enviar tareas a colas autorizadas y no puede invocar directamente endpoints de mutación contable.

## Consecuencias
* **Positivas:** Cumplimiento de estándares bancarios e ISO/IEC 27001, mitigación completa de ataques Man-in-the-Middle y spoofing interno.
* **Negativas:** Sobrecarga computacional mínima (+2.5 ms por salto de red debido al handshake criptográfico mTLS), compensada con creces por la seguridad sistémica obtenida.
