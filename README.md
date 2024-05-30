## Minecraft: Interacciones y comportamientos emergentes en agentes inteligentes.

En Minecraft, un agente inteligente competente debería saber utilizar un repertorio de conocimiento y habilidades para navegar e interactuar de forma autónoma con el mundo, crear planes para realizar tareas complejas y lograr metas y exhibir comportamientos e interacciones naturales con otros usuarios. El objetivo principal de este proyecto es desarrollar un agente inteligente competente que pueda aprender de sus interacciones con otros usuarios y el mundo para crear, ampliar y corregir su repertorio de conocimiento y habilidades a largo plazo. Al hacerlo, creemos que el agente se convertirá en una herramienta más adaptable y efectiva capaz de desenvolverse y operar dentro de los entornos interactivos y dinámicos de Minecraft.

## Instalación

Este proyecto requiere Node.js ≥20.10.0, Python ≥3.12.0, una cuenta oficial de Minecraft y una API key de OpenAI o bien un modelo de lenguaje grande (LLM) local instalado mediante LM Studio . Hemos probado este proyecto en Windows 10 y Windows 11. Después de clonar este repositorio, ejecuta los siguientes comandos:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install chromadb
```

```bash
npm install
```

Necesitas instalar Minecraft Java Edition para probar este proyecto. Después de instalar Minecraft Java Edition, sigue los siguientes pasos para probar el proyecto por primera vez:

1. Inicia un [servidor local de LM Studio](https://lmstudio.ai/docs/local-server), o bien, [configura tu llave para la API de OpenAI] (https://platform.openai.com/docs/quickstart/step-2-set-up-your-api-key).
2. En el launcher de Minecraft, selecciona una versión (recomendamos la 1.18.2) y ejecuta el juego.
3. Entra o crea un mundo de un solo jugador (`Singleplayer`).
4. Presiona `ESC` y selecciona `Open to LAN`.
5. Configura las opciones como desees. Recomendamos seleccionar `Game Mode: Creative` y `Allow Cheats: ON`.
6. Selecciona `Start LAN World`.
7. Verás tu número de puerto `[port]` en el chat del juego. Usa este número para iniciar este proyecto.
8. Dirígete a la carpeta del juego, abre una terminal en el ambiente virutal de Python y ejecuta el siguiente comando:
```bash
chroma run
```
9. Abre una nueva terminal de NodeJS, y ejecuta el siguiente comando:
```bash
node index.js -h localhost -p [port]
```
10. Regresa al juego y comienza a interactuar con el agente inteligente.
