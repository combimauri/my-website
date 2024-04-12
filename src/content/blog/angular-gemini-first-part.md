---
author: Mauricio Arce Torrez
pubDatetime: 2024-04-12T07:02:00Z
modDatetime: 2024-04-12T07:02:00Z
title: Angular + Gemini
slug: angular-gemini-first-part
featured: true
draft: false
tags:
  - angular
  - gemini
description: Una introducción a la integración de Gemini en nuestras aplicaciones Angular.
---

## Integrando Angular y Gemini

Bienvenido a este tutorial en el que daremos una introducción a cómo integrar Angular y Gemini de una forma muy sencilla.

**Requisitos previos:**

* Tener Node.js instalado en tu sistema. Puedes descargarlo desde [https://nodejs.org/en/download](https://nodejs.org/en/download).
* Tener instalado @angular/cli. Puedes instalarlo usando npm con este comando: `npm install --global @angular/cli`.
* Familiaridad básica con HTML, CSS y JavaScript.
* Familiaridad básica con Angular.

**Empezando:**

1. **Creación del proyecto en Angular**

Abre una terminal y navega hasta la ubicación donde deseas crear el proyecto, una vez ahí corre el siguiente comando:

```bash
ng new gemini-poc
```

Remplaza "gemini-poc" con el nombre que prefieras para tu proyecto. La CLI te guiará en el proceso de creación.

2. **Instalar librería de Google Generative AI**

Para poder usar un modelo de Gemini desde nuestra aplicación, debemos instalar la dependencia `@google/generative-ai`. Para ello corremos el comando:

```bash
npm install @google/generative-ai
```

3. **Implementar servicio que se conectará con Gemini**

Crea un servicio para separar la lógica de conexión con el modelo. Para ello corre el comando:

```bash
ng generate service gemini
```

"gemini" es el nombre que le estamos dando a nuestro servicio, puedes darle otro nombre si lo deseas.

Necesitamos una instancia del modelo para poder mandarle prompts:

```typescript
readonly #API_KEY = '<YOUR-API-KEY>';
readonly #genAI = new GoogleGenerativeAI(this.#API_KEY);
readonly #model = this.#genAI.getGenerativeModel({ model: 'gemini-pro' });
```

La *API key* veremos cómo obtenerla en el siguiente paso.
*#genAI* es una propiedad privada que contiene una instancia de la librería.
*#model* es una instancia del modelo, el mismo está usando *gemini-pro*, el cual es el modelo para entradas de solo texto. Puedes ver las diferentes variaciones de modelos [aquí](https://ai.google.dev/models/gemini?hl=es-419).

También debemos implementar una función que se encargue de enviar prompts a nuestro modelo para generar contenido:

```typescript
async sendPrompt(prompt: string): Promise<string> {
  try {
    const { response } = await this.#model.generateContent(prompt);
    return response.text();
  } catch (error) {
    console.error(error);
    return 'An error has occurred. Please try again.';
  }
}
```

Nuestro servicio debería lucir así:

```typescript
import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  readonly #API_KEY = '<YOUR-API-KEY>';
  readonly #genAI = new GoogleGenerativeAI(this.#API_KEY);
  readonly #model = this.#genAI.getGenerativeModel({ model: 'gemini-pro' });

async sendPrompt(prompt: string): Promise<string> {
  try {
    const { response } = await this.#model.generateContent(prompt);
    return response.text();
  } catch (error) {
    console.error(error);
    return 'An error has occurred. Please try again.';
  }
}
}

```

4. **Obtener nuestra API key**

Accede a [Google AI Studio](https://aistudio.google.com/app/apikey) y crea una nueva *API key*. Asegúrate de guardar este valor una vez se haya generado y no compartirlo con nadie. No olvides que en caso de perderlo o compartirlo por accidente, siempre puedes eliminar la key y crear una nueva.

Reemplaza la key que obtuviste en la propiedad del servicio creado en el anterior paso. Toma en cuenta que el código con tu key no debería ser publicado, solo lo estamos agregando de forma directa en el código para desarrollo local.

5. **Actualiza el app.component**

Debemos actualizar el template y el componente `app.component` para poder mandar los prompts.

La lógica del componente necesita propiedades para almacenar la respuesta de Gemini y una función que utilice el servicio para poder mandar el prompt.

Para guardar la respuesta podemos hacer uso de un `signal`:

```typescript
response = signal('');
```

Mientras que nuestra función podría lucir así:

```typescript
readonly #geminiService = inject(GeminiService);

sendPrompt(prompt: string): void {
  this.#geminiService
    .sendPrompt(prompt)
    .then((response) => this.response.set(response));
}
```

Ahora, necesitamos renderizar la repuesta de Gemini en nuestro template (app.component.html):

```html
<p>
  {{ response() }}
</p>
```

También debemos agregar un campo de texto que llame a nuestra función `sendPrompt` cada que presionemos la tecla "Enter":

```html
<input
  #promptInput
  placeholder="Introduce una petición aquí"
  type="text"
  (keyup.enter)="sendPrompt(promptInput.value)"
/>
```

Después de estos cambios, nuestro archivo app.component.ts debería lucir así:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { GeminiService } from '../core/services/gemini.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatComponent {
  response = signal('');
  readonly #geminiService = inject(GeminiService);

  sendPrompt(prompt: string): void {
    this.#geminiService
      .sendPrompt(prompt)
      .then((response) => this.response.set(response));
  }
}
```

Y el archivo app.component.html así:

```html
<p>
  {{ response() }}
</p>

<input
  #promptInput
  placeholder="Introduce una petición aquí"
  type="text"
  (keyup.enter)="sendPrompt(promptInput.value)"
/>
```

6. **A probar nuestra app**

Si hasta aquí hemos hecho todo bien, deberíamos poder correr nuestra app con el comando `ng serve` e interactuar con la misma abriendo en nuestro navegador web **http://localhost:4200**:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eibx1dbdxe434598738x.gif)
