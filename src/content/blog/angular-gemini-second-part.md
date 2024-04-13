---
author: Mauricio Arce Torrez
pubDatetime: 2024-04-13T18:22:00Z
modDatetime: 2024-04-13T18:22:00Z
title: Angular + Gemini Pro Vision (Segunda parte)
slug: angular-gemini-second-part
featured: true
draft: false
tags:
  - angular
  - gemini
description: Una introducción a la integración de Gemini en nuestras aplicaciones Angular usando imágenes.
---

## Integrando Angular y Gemini Vision Pro

Bienvenido a la segunda parte de este tutorial en el que daremos una introducción a cómo integrar Angular y Gemini Vision Pro de una forma muy sencilla.

**Empezando:**

1. **Actualizar nuestro gemini.service para que reciba archivos**

Para poder enviar imágenes a nuestro modelo de Gemini, necesitamos actualizar nuestro servicio con una nueva función que reciba un archivo. Para ello agregaremos una nueva función llamada `sendImage` que reciba un archivo y devuelva una promesa con el resultado.:

```typescript
async sendImage(file: File): Promise<string> {
}
```

Debemos usar un nuevo modelo, el `gemini-pro-vision`, el cual es un modelo que nos permitirá enviar imágenes. Para ello, moveremos la instancia de nuestro modelo dentro de cada función:

```typescript
async sendPrompt(prompt: string): Promise<string> {
  const model = this.#genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const { response } = await model.generateContent(prompt);
    return response.text();
  } catch (error) {
    console.error(error);
    return 'An error has occurred. Please try again.';
  }
}

async sendImage(file: File): Promise<string> {
  const model = this.#genAI.getGenerativeModel({
    model: 'gemini-pro-vision',
  });
}
```

El modelo recibe un dato de tipo `Part`, así que debemos convertir nuestro archio a este tipo de dato:

```typescript
async sendImage(file: File): Promise<string> {
  const model = this.#genAI.getGenerativeModel({
    model: 'gemini-pro-vision',
  });
  const part = await this.convertFileToGenerativePart(file);
}

async convertFileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}
```

Para concluir, debemos enviar la imagen junto a un prompt al modelo, y asegurarnos de manejar cualquier error que pueda surgir:

```typescript
async sendImage(file: File): Promise<string> {
  const model = this.#genAI.getGenerativeModel({
    model: 'gemini-pro-vision',
  });

  try {
    const part = await this.convertFileToGenerativePart(file);
    const prompt = '¿Qué es lo que ves en esta imagen?';
    const { response } = await model.generateContent([prompt, part]);

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
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  readonly #API_KEY = '<YOUR-API-KEY>';
  readonly #genAI = new GoogleGenerativeAI(this.#API_KEY);

  async sendPrompt(prompt: string): Promise<string> {
    const model = this.#genAI.getGenerativeModel({ model: 'gemini-pro' });

    try {
      const { response } = await model.generateContent(prompt);
      return response.text();
    } catch (error) {
      console.error(error);
      return 'An error has occurred. Please try again.';
    }
  }

  async sendImage(file: File): Promise<string> {
    const model = this.#genAI.getGenerativeModel({
      model: 'gemini-pro-vision',
    });

    try {
      const part = await this.convertFileToGenerativePart(file);
      const prompt = '¿Qué es lo que ves en esta imagen?';
      const { response } = await model.generateContent([prompt, part]);

      return response.text();
    } catch (error) {
      console.error(error);
      return 'An error has occurred. Please try again.';
    }
  }

  async convertFileToGenerativePart(file: File): Promise<Part> {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }
}

```

2. **Enviar la imagen al modelo**

Agregaremos un nuevo input en nuestro chat.component.html para que el usuario pueda enviar una imagen:

```html
<input
  #fileInput
  type="file"
  accept="image/*"
  (change)="sendImageMessage(fileInput.files)"
/>
```

Podemos ver que cada que se selecciona un archivo, se llama a la función `sendImageMessage` con el archivo seleccionado, la cual debemos implementar en nuestro chat.component.ts:

```typescript
sendImageMessage(files: FileList | null): void {
  if (!files) {
    return;
  }

  const file = files[0];

  this.#geminiService
    .sendImage(file)
    .then((response) => this.response.set(response));
}
```

Nuestra función valida si se seleccionó un archivo, y si es así, llama a nuestro servicio para enviar la imagen y mostrar la respuesta en nuestro chat.

3. **Mostrar la imagen**

Ya por último, debemos mostrar la imagen en nuestro chat.component.html:

```html
<img *ngIf="imageSrc()" [src]="imageSrc()" />
```

Estamos asumiendo que existe un signal `imageSrc` que contiene la URL de la imagen. Para ello, debemos agregarlo a nuestro chat.component.ts:

```typescript
imageSrc = signal('');
```

Y actualizar nuestra función `sendImageMessage` para que guarde la URL de la imagen en nuestro signal:

```typescript
sendImageMessage(files: FileList | null): void {
  if (!files) {
    return;
  }

  const file = files[0];
  this.imageSrc.set(URL.createObjectURL(file));

  this.#geminiService
    .sendImage(file)
    .then((response) => this.response.set(response));
}
```

Con estos cambios, ya deberíamos poder enviar imágenes a nuestro modelo de Gemini y mostrar la respuesta en nuestro chat.

¡Y eso es todo! Espero que este tutorial te haya sido de ayuda. Si tienes alguna duda, no dudes en contactarme.
