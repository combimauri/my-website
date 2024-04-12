---
author: Mauricio Arce Torrez
pubDatetime: 2023-07-13T04:58:53Z
modDatetime: 2024-04-12T03:05:00Z
title: Angular Micro-frontends
slug: angular-micro-frontends
featured: true
draft: false
tags:
  - angular
  - micro-frontends
  - module-federation
description: Crea tus primeros micro-frontends usando Angular y Module Federation.
---

Micro-frontends es la introducción de un concepto como el de micro-servicios pero aplicados al desarrollo del lado del cliente. Nos permite tener varios proyectos del lado del frontend conectados entre sí para crear una sola aplicación más grande.

## ¿Por qué usar Micro-frontends?

- Puedes desacoplar el proyecto en distintas bases de código.
- Es más sencillo entender, extender y mantener el código al manejar proyectos más pequeños.
- Las dependencias pueden ser actualizadas de forma independiente (siempre y cuando no sean dependencias compartidas).
- Los builds son desacoplados y escalables.
- Los artifacts pueden ser publicados de forma independiente con un impacto mínimo a otros proyectos.
- El riesgo de cada publicación se reduce.
- Se pueden tener equipos independientes y especializados en cada proyecto.
- Cada equipo puede trabajar con una tecnología distinta (no es lo recomendado, pero de poder se puede).

## Casos de uso

- Migrar/actualizar bases de código gradualmente. Por ejemplo, para un proyecto hecho en AngularJS puedes empezar a trabajar en nuevos features usando la última versión de Angular, a medida que se actualiza el código legacy a Angular también.
- Compartir un feature en diferentes aplicaciones. Un solo micro-frontend puede ser utilizado en múltiples proyectos.
- Equipos autónomos trabajan en diferentes features del proyecto, cada uno en un micro-frontend distinto.
- Deployments (publicaciones) independientes. Puedes trabajar en un cambio que afecta un micro-frontend específico y publicarlo sin necesidad de hacer deploy de todo el proyecto.

## Consideraciones al implementar micro-frontends

- Evita en lo posible mezclar frameworks/librerías en diferentes micro-frontends al menos que sea estrictamente necesario. El mezclar tecnologías genera bundles más grandes al no permitir el compartir dependencias, además de mezclar conceptos y guidelines al momento del desarrollo.
- Procura manejar dependencias compartidas y crear librerías para el código común, así el mismo puede ser reutilizado. Sin embargo, ten cuidado de no acoplar demasiado el código, esto disminuye la autonomía de los equipos trabajando en cada proyecto.

## ¿Cómo implementar micro-frontends?

- iframe
- Web Components (custom elements)
- Single-spa
- Module Federation

En este artículo nos concentraremos en esta última opción, Module Federation.

## Module Federation

Module Federation es un feature de Webpack, un module bundler muy popular para JavaScript, además de ser la herramienta que usa Angular para este propósito. Con Module Federation podemos habilitar la carga dinámica de módulos de múltiples sistemas independientes, los cual nos habilita para la creación de aplicaciones que siguen una estructura basada en micro-frontends.

## Usando Module Federation en Angular

Para poder utilizar Module Federation en Angular, tenemos disponible la siguiente herramienta: [@angular-architects/module-federation](https://github.com/angular-architects/module-federation-plugin).

Para ejemplificar su uso, implementaremos tres proyectos, uno que servirá como host o contenedor de la aplicación, un micro-frontend que vendría a llenar el contenido de la aplicación, y una librería con la cual podremos compartir información entre ambas aplicaciones.

### Creando el host

Usando el CLI de Angular, ejecutamos el siguiente comando para crear nuestro host:

```bash
ng new host --routing
```

Hay que notar que le pasamos la opción `--routing` para que se nos cree un módulo separado que se encargará de definir la configuración de rutas, mediante la cual luego podremos cargar el módulo remoto que crearemos en el otro proyecto.

Lo siguiente que haremos será ingresar al proyecto y en la raíz correr el schematic necesario para agregar el plugin de Module Federation:

```bash
ng add @angular-architects/module-federation --type host
```

Cuando se nos pregunte por el nombre y puerto del proyecto, le daremos el nombre `host` y el puerto `4200`. El valor del nombre es el de nuestro proyecto Angular, para el puerto podemos definir el que queramos, mantendremos `4200` para este ejemplo.

Debes notar que al correr el schematic le pasamos una opción `--type host`. Existen 3 posibles valores para esta opción `type`:

- `host`
- `dynamic-host`
- `remote`

El usar la adecuada nos proporcionará una configuración más acorde al tipo de proyecto, siendo `host` y `dynamic-host` las opciones usadas para crear un proyecto contenedor, el que se encarga de cargar los proyectos remotos (`remote`), la única diferencia entre ambas es que al usar `dynamic-host` también se creará un archivo donde podremos definir los paths de los diferentes micro-frontends que vayamos a usar.

Al correr el schematic notaremos cambios en algunos archivos, como ser configuración adicional en el `angular.json` file para usar un builder distinto, además de que se agregará una propiedad `extraWebpackConfig` que apuntará a la ruta de un archivo recién creado, el `webpack.config.js`. En este último archivo tendremos la configuración base necesaria con la ruta de los micro-frontends que vayamos a consumir (`remotes`) y las dependencias compartidas (`shared`).

### Creando el micro-frontend

Igual haremos uso del CLI para crear el proyecto, tomando en cuenta el hacerlo en un path distinto al del host:

```bash
ng new mfe
```

Esta vez no es necesario definir un módulo de rutas, ya que este proyecto solo tendrá feature modules que serán cargados desde el proyecto `host`.

Ingresamos al proyecto y corremos el schematic para agregar Module Federation, teniendo cuidado de usar el type `remote`:

```bash
ng add @angular-architects/module-federation --type remote
```

El nombre del proyecto es `mfe` y para el puerto debemos usar uno distinto al del proyecto `host`, en mi caso usaré el `3000` para que haga match con la configuración por defecto que ya se encuentra en el archivo `webpack.config.js` en la sección de `remotes` del proyecto `host`.

Al correr el schematic notaremos cambios muy similares a los que ocurrieron en el proyecto `host`, pero veremos algunas diferencias en el `webpack.config.js` generado, ya que en vez de tener una propiedad `remotes` tendrá una propiedad llamada `exposes`. Modificaremos esta propiedad más adelante para que concuerde con el módulo que crearemos y de esta forma poder exponerlo para que sea consumido por el host.

Lo siguiente será crear nuestro feature module, para ello creamos un par de nuevos módulos, el del feature como tal y el de rutas para el mismo:

```bash
ng g m feature-one --routing
```

Y también creamos un componente principal para este módulo:

```bash
ng g c feature-one
```

Nos aseguraremos de tener bien configurado nuestro módulo de rutas recién creado (`feature-one-routing.module.ts`). Para ello, definimos que para el path vacío se cargue el componente recién creado:

```typescript
import { FeatureOneComponent } from './feature-one.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureOneComponent,
  },
];
```

Ahora, a diferencia de un feature module normal cargado por lazy loading, este lo debemos importar en el módulo raíz (`app.module.ts`) para que sea parte de la compilación de TypeScript:

```typescript
import { FeatureOneModule } from './feature-one/feature-one.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FeatureOneModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Ahora sí, volvemos al `webpack.config.js` y realizamos la modificación que teníamos pendiente en la propiedad `exposes`:

```javascript
  exposes: {
    './FeatureOneModule': './src/app/feature-one/feature-one.module.ts',
  },
```

Debemos prestar atención al nombre de la propiedad que estamos agregando, en este caso `./FeatureOneModule`, ya que será el valor que utilizaremos en el proyecto `host` al cargar este módulo.

Ya estamos casi listos para conectar nuestros dos proyectos.

### Conectando ambos proyectos

Ve al módulo de rutas del módulo raíz del proyecto `host` (`app-routing.module.ts`) y define que para la ruta vacía se haga una redirección a la ruta `feature-one`. Para esta última ruta usaremos lazy loading para cargar el feature module que creamos en nuestro proyecto `mfe`, pero notarás que en vez de importarlo localmente, como se haría usualmente para un módulo dentro del mismo proyecto, lo cargaremos de forma remota:

```typescript
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'feature-one',
    pathMatch: 'full',
  },
  {
    path: 'feature-one',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:3000/remoteEntry.js',
        exposedModule: './FeatureOneModule',
      }).then((mod) => mod.FeatureOneModule),
  },
];
```

En `type` viene el tipo de elemento que estamos cargando, en este caso es un `module`.

En `remoteEntry` definimos la ruta del archivo remoto, es decir, del proyecto `mfe`. El nombre del archivo remoto por defecto lleva el nombre `remoteEntry.js` al momento de correr el schematic, sin embargo este es un nombre que podemos modificar si lo quisiéramos en la configuración del proyecto `mfe` más adelante. Para este tutorial lo dejaremos tal cual está.

En `exposedModule` nos debemos asegurar de poner el nombre que usamos en `exposes` de la configuración webpack del `mfe`.

Lo que resta por hacer es modificar nuestro template para que luzca como queremos. En este caso agregaremos una barra de navegación sin estilizarla demasiado para este ejemplo, además de tener en posición el elemento `router-outlet`, que será donde cargará el contenido de nuestras rutas. Reemplazamos el contenido de `app.component.html` por el siguiente:

```html
<nav>
  <a routerLink="/feature-one"> Feature One </a>
  <!-- Aquí podemos seguir agregando más enlaces a otros feature modules, remotos o locales -->
</nav>

<main>
  <router-outlet></router-outlet>
</main>
```

¡Ya debería funcionar! Si corremos ambos proyectos (`ng serve`) y luego accedemos al path del `host` (`http://localhost:4200`), nuestra aplicación ya debería estar corriendo:

![Proyectos MFE corriendo juntos](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mz1l8xgyl8elmyo59odj.png)

Aquí podemos ver ambos proyectos resaltados:

![Proyectos MFE resaltando cada proyecto](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5fl4hz3kqsjd5nziy1ms.png)

Muy bien, ahora solo falta tener un mecanismo para poder compartir datos a través de ambos proyectos.

### Usando una librería para compartir información

Crearemos una librería para permitir el paso de datos e información entre ambos proyectos. Para ello, primero crearemos un workspace de angular vacío en un path distinto:

```bash
ng new libs --no-create-application
```

Accedemos al workspace y creamos la librería:

```bash
ng g library shared-library
```

En el path: `projects/shared-library/src/lib/shared-library.service.ts` encontraremos un servicio donde agregaremos un `BehaviorSubject` para ejemplificar cómo podemos compartir información:

```typescript
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedLibraryService {
  sharedData$ = new BehaviorSubject<string>('Hello World!');
}
```

Creamos un distribuible de nuestra librería corriendo el siguiente comando en la raíz de nuestro workspace:

```bash
npm run build
```

Notarás que se creó el distribuible en `dist/shared-library`. Accede a esa ruta y crea un symlink global de la librería usando este comando:

```bash
npm link
```

En el archivo `package.json` dentro de `projects/shared-library` podrás ver el nombre y la versión con la que se creó el symlink de la librería. Si no realizaste ningún cambio, los valores deberían ser `shared-library` y `0.0.1` respectivamente.

En cada uno de los proyectos anteriores debes instalar la librería que acabamos de crear creando un symbolic link del paquete global. Ve a la raíz de cada proyecto, detén la ejecución y corre el siguiente comando:

```bash
npm link shared-library
```

Una vez hecho esto, ve al `webpack.config.js` file de cada proyecto y modifica la propiedad shared para asegurarte de que se comparta una sola instancia de la librería en ambos proyectos:

```javascript
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
    "shared-library": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "0.0.1",
    },
  },
```

Debes definir que haya una sola instancia usando la propiedad `singleton`, además de asegurarte que ambos proyectos usen la misma versión de la librería con las propiedades `strictVersion` y `requiredVersion`.

Ahora nos iremos al proyecto `host` e inyectaremos el servicio de la librería compartida en el `app.component.ts` file para poder consumir la `sharedData$`:

```typescript
import { SharedLibraryService } from 'shared-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  data$ = this.sharedService.sharedData$;

  constructor(private sharedService: SharedLibraryService) {}
}
```

Lo siguiente será hacer binding de `data$` en el template (`app.component.html`):

```html
<nav>
  <a routerLink="/feature-one"> Feature One </a>
  <!-- Aquí podemos seguir agregando más enlaces a otros feature modules, remotos o locales -->
</nav>

<main>
  <p>
    {{ data$ | async }}
  </p>
  <router-outlet></router-outlet>
</main>
```

Además, agregaremos un pequeño estilo para poder diferenciar este párrafo con la información compartida del que agregaremos en el proyecto `mfe` más adelante. En el archivo `app.component.css` colocamos lo siguiente:

```css
p {
  color: blue;
}
```

Si corremos ambos proyectos, `host` y `mfe`, veremos lo siguiente:

![Proyectos MFE donde el host consume la información compartida](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ala5kbx964ytonm339s3.png)

¡Genial! El `host` ya consume la información compartida de la librería. Nos queda hacer algo muy parecido en el `mfe`.

Nos vamos al `feature-one.component.ts` del `mfe` y hacemos lo mismo, inyectamos el servicio compartido y nos creamos una propiedad pública para guardar la `sharedData$` del servicio y mostrarla en el template. De forma adicional agregaremos una función que se encargará de actualizar la información compartida.

```typescript
import { SharedLibraryService } from 'shared-library';

@Component({
  selector: 'app-feature-one',
  templateUrl: './feature-one.component.html',
  styleUrls: ['./feature-one.component.css'],
})
export class FeatureOneComponent {
  data$ = this.sharedService.sharedData$;

  constructor(private sharedService: SharedLibraryService) {}

  updateSharedData(): void {
    this.sharedService.sharedData$.next('Hello from the MFE');
  }
}
```

Nos queda actualizar el template (`feature-one.component.html`):

```html
<p>
  {{ data$ | async }}
</p>

<button (click)="updateSharedData()">
  Update shared data
</button>
```

Y agregar un estilo (en `feature-one.component.css`) para diferenciar este párrafo del que tiene el `host`:

```css
p {
  color: red;
}
```

Este será el resultado:

![Proyectos MFE donde el host y el mfe consumen la información compartida](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3r0gbzlhb462519u92z0.png)

Ahora, solo nos queda asegurarnos de que efectivamente la información se está compartiendo. Para ello fue que agregamos la función que actualiza `sharedData$` del servicio (`updateSharedData`). Si todo está correcto, al llamar a la función, la información compartida se debería actualizar tanto en el `mfe` como en el `host`:

![Proyectos MFE donde el mfe actualiza la información y el cambio se refleja en ambos proyectos](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l0vpq2oaidb2kv79txu5.gif)

¡Lo hicimos!

### Apuntes finales

Esta es sola una introducción a cómo podemos empezar a implementar micro-frontends usando Angular. Espero de corazón te sea de mucha ayuda.

Puedes encontrar el código de todo lo que hicimos en este tutorial en el siguiente repositorio: https://github.com/combimauri/my-first-mfes

Mucha más información relacionada a Module Federation y la integración con Angular la verás aquí: https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/

Si tienes consultas puedes hacerlas por aquí y/o dejármelas en mi [GitHub](https://github.com/combimauri), [LinkedIn](https://www.linkedin.com/in/combimauri), [Twitter](https://twitter.com/combimauri) o [Threads](https://www.threads.net/@combimauri).

Quiero hacer un agradecimiento especial a mis compañeros de trabajo: `Allan Leon Mendieta`, `Sergio Lopez` y `Diego Garcia`, quienes directa o indirectamente aportaron un montón a este artículo y en base a muchas partes de su investigación es que el mismo pudo ser completado.
