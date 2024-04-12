---
author: Google Gemini
pubDatetime: 2024-04-12T04:13:00Z
modDatetime: 2024-04-12T04:13:00Z
title: Mi primera aplicación Angular
slug: my-first-angular-app
featured: false
draft: false
tags:
  - angular
description: Crea tu primera aplicación Angular con este tutorial paso a paso.
---

## ¡Manos a la obra! Creando tu primera aplicación Angular

¡Hola y bienvenido al mundo de Angular! En este tutorial, te guiaremos paso a paso en la creación de tu primera aplicación Angular, una base sólida para tus futuros proyectos web dinámicos e interactivos.

**Requisitos previos:**

* Tener Node.js instalado en tu sistema. Puedes descargarlo desde [https://nodejs.org/en/download](https://nodejs.org/en/download).
* Familiaridad básica con HTML, CSS y JavaScript.

**Empezando:**

1. **Instalación de la Angular CLI:**

   Abre tu terminal o símbolo del sistema y ejecuta el siguiente comando:

   ```bash
   npm install -g @angular/cli
   ```

   Este comando instala la Angular CLI (Command Line Interface), una herramienta fundamental para crear y gestionar proyectos Angular.

2. **Creación del proyecto:**

   Navega hasta la ubicación donde deseas crear tu proyecto y ejecuta el siguiente comando:

   ```bash
   ng new mi-primera-app
   ```

   Remplaza "mi-primera-app" con el nombre que prefieras para tu proyecto. La CLI te guiará a través de algunas opciones de configuración básica.

3. **Explorando la estructura del proyecto:**

   Al ingresar a la carpeta de tu proyecto, observarás una estructura organizada:

   * `node_modules`: Dependencias de terceros instaladas por la aplicación.
   * `src`: Carpeta principal del código fuente, donde se encuentran los componentes, servicios y otros elementos clave de Angular.
    * `angular.json`: Archivo de configuración de Angular, que define la estructura del proyecto y las opciones de compilación.
   * `package.json`: Archivo de configuración del proyecto, con las dependencias y scripts necesarios.
   * `tsconfig.json`: Archivo de configuración del compilador TypeScript.

4. **Ejecutando la aplicación:**

   Para visualizar tu aplicación en ejecución, utiliza el siguiente comando:

   ```bash
   ng serve
   ```

   Tu aplicación correrá en http://localhost:4200.

5. **Editando el componente principal:**

   El template principal de tu aplicación es `src/app/app.component.html`. Abre este archivo y modifica el contenido HTML para personalizar el aspecto de tu aplicación. Por ejemplo, puedes agregar un título y un párrafo de bienvenida.

6. **Comprobando los cambios:**

   Guarda los cambios realizados en el archivo HTML y observa cómo se reflejan instantáneamente en el navegador web. ¡Así de fácil es ver los resultados de tu trabajo!

**Recursos adicionales:**

* **Documentación oficial de Angular:** [https://angular.io/docs](https://angular.io/docs)
* **Futura documentación de Angular:** [https://angular.dev/overview](https://angular.dev/overview)
* **Tutorial de Angular para principiantes:** [https://www.freecodecamp.org/news/angular-for-beginners-course/](https://www.freecodecamp.org/news/angular-for-beginners-course/)
* **Video: CURSO de ANGULAR desde CERO con Nicobytes:** [https://www.youtube.com/watch?v=sS90VVmBPcg](https://www.youtube.com/watch?v=sS90VVmBPcg)

**¡Felicitaciones!** Has creado tu primera aplicación Angular. Este es solo el comienzo de un emocionante viaje en el desarrollo web. Con dedicación y exploración, podrás crear aplicaciones web cada vez más complejas y sorprendentes.

