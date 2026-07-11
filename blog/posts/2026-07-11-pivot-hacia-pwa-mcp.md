---
title: "Por qué dejamos WhatsApp: el cambio de arquitectura de Quelecompramos"
date: "2026-07-11"
excerpt: "Meta cobrará por mensaje para todos los mensajes de servicio de WhatsApp Business desde el 1ro de octubre. El costo y el riesgo para nosotros es tan grande, que decidimos migrar a una app propia (PWA) y sumar un servidor MCP para agentes de IA."
tags: ["pivot", "whatsapp", "pwa", "mcp"]
---

Desde el día uno, Quelecompramos estaba ideado para funcionar enteramente en WhatsApp: sin apps para descargar, sin registro, solo mensajes. De hecho, las pruebas con familia y amigos arrancó súper bien por esta vía con muy buen feedback.

Ya habíamos leído en algunos posteos esporádicos de algunos cambios de nuestros amigos de Meta...hasta que paramos la pelota para entender lo que se venía y cómo podría impactarnos ese cambio.

En resumen, Meta anunció el fin del servicio gratuito de mensajes de servicio en su API de WhatsApp Business a partir del 1° de octubre de 2026. Hasta ahora, cada mensaje que el agente respondía no tenía costo directo para nosotros. A partir de esa fecha, cada uno lo va a tener. Acá pueden ver [el link exacto](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) con la política de Meta.

Hicimos los números con las estimaciones informales que circulan para Argentina y el resultado no fue nada alentador: con nuestro modelo actual —gratis para siempre, con límites de uso— necesitaríamos convertir a plan pago a más del 20% de los usuarios gratuitos solo para cubrir el costo de mensajería. Un riesgo muy grande de asumir ahora.

Evaluamos varias formas de optimizar el flujo actual sobre WhatsApp, pero ninguna cambiaba el problema de fondo: mientras cada interacción dependa de un mensaje facturado por un tercero, el riesgo financiero crece con cada usuario nuevo, pagué o no.

Así que tomamos una decisión más de fondo: dejar de depender de WhatsApp Business API como el corazón de Quelecompramos.

**Se preguntarán ¿Y entonces?**

- **Una app propia (PWA):** instalable desde el navegador, sin descargas de tienda de aplicaciones, pensada para que registrar personas y anotar ideas de regalo sea igual de simple que hoy — pero sin costo de mensajería por cada interacción.

La idea extra que vamos a explorar:

- **Un servidor MCP:** para quienes ya usan un asistente de IA (como Claude o ChatGPT), Quelecompramos intentará estar disponible como una herramienta que ese asistente puede usar directamente. Imaginamos, si es que ya no está en curso, que los agentes serán la puerta de entrada para todas estas interacciones.

Por último, vamos a intentar documentar cada etapa de esta migración acá, en este blog, como una bitácora de nuestro camino. Seguimos!
