## Minecraft: Interacciones y comportamientos emergentes en agentes inteligentes.

En Minecraft, un agente inteligente competente debería saber utilizar un repertorio de conocimiento y habilidades para navegar e interactuar de forma autónoma con el mundo, crear planes para realizar tareas complejas y lograr metas y exhibir comportamientos e interacciones naturales con otros usuarios. El objetivo principal de este proyecto es desarrollar un agente inteligente competente que pueda aprender de sus interacciones con otros usuarios y el mundo para crear, ampliar y corregir su repertorio de conocimiento y habilidades a largo plazo. Al hacerlo, creemos que el agente se convertirá en una herramienta más adaptable y efectiva capaz de desenvolverse y operar dentro de los entornos interactivos y dinámicos de Minecraft.

## Instalación
Este proyecto requiere Node.js ≥20.10.0, una cuenta oficial de Minecraft y un modelo de lenguaje grande (LLM) local instalado en LM Studio. Hemos probado este proyecto en Windows 10 y Windows 11. Después de clonar este repositorio, ejecuta los siguientes comandos:

```bash
npm install
```

Necesitas instalar Minecraft Java Edition y un LLM en LM Studio para probar este proyecto. Después de instalar Minecraft Java Edition y un LLM en LM Studio, sigue los siguientes pasos:
1. Dirígete a LM Studio, carga el LLM que instalaste e inicia un servidor local con la configuración por defecto (en el futuro, nuestro proyecto será compatible con la API de OpenAI y no será necesario instalar una LLM localmente).
2. En el launcher de Minecraft, selecciona la versión 1.18.2 y ejecuta el juego (en el futuro, nuestro proyecto será compatible con más versiones).
3. Entra o crea un mundo de un solo jugador (`Singleplayer`).
4. Presiona `ESC` y selecciona `Open to LAN`.
5. Configura las opciones como desees. Recomendamos seleccionar `Game Mode: Creative` y `Allow Cheats: ON`.
6. Selecciona `Start LAN World`.
7. Verás tu número de puerto `[port]` en el chat del juego. Usa este número para iniciar este proyecto.
8. Dirígete a la carpeta del juego y ejecuta el siguiente comando:
```bash
node index.js -h localhost -p [port]
```
9. Regresa al juego y comienza a interactuar con el agente inteligente.
