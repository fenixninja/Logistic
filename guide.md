# Guía Técnica y de Uso: WhatsAuth Logistic Terminal

Guía completa de arquitectura, diseño, interactividad y mantenimiento de la plataforma **WhatsAuth Logistic Terminal**.

---

## 1. Introducción y Objetivo

**WhatsAuth Logistic Terminal** es una aplicación web interactiva diseñada para operadores logísticos y repartidores de última milla. Proporciona una interfaz visual de alta tecnología ("LogTech") para:
1. **Gestionar la carga asignada** en ruta mediante una rejilla interactiva de cajas de paquetería.
2. **Escanear y verificar pedidos** a través de un terminal móvil iPhone con visor láser holográfico.
3. **Emitir comprobantes de entrega innegables** con registro criptográfico (SHA-256) y validación de geocerca.

---

## 2. Identidad Visual y Colores de Marca

La aplicación aplica estrictamente las directrices del manual de marca ([style/brand.md](file:///Users/fenixrios/Documents/CODIGO/Logistic/style/brand.md)):

| Color | Código HEX | Valores RGB | Uso en la Aplicación |
| :--- | :--- | :--- | :--- |
| **CORE BLUE** | `#1F4594` | `(31, 69, 148)` | Fondo de cabecera, etiquetas de navegación, bordes activos y elementos institucionales |
| **DELIVERY ORANGE** | `#FE6C27` | `(254, 108, 39)` | Láser de escaneo, precinto de seguridad, botones de acción (CTA), estados activos y acentos |
| **PURE WHITE** | `#FFFFFF` | `(255, 255, 255)` | Etiquetas de envío con códigos de barras, tipografía principal y contrastes |

### Activos Gráficos Oficiales
- **Logotipo de Cabecera:** [img/logo.png](file:///Users/fenixrios/Documents/CODIGO/Logistic/img/logo.png) (situado en el extremo izquierdo de la cabecera superior).
- **Fondo de Pantalla del Terminal Móvil:** [img/FNX_logo.jpeg](file:///Users/fenixrios/Documents/CODIGO/Logistic/img/FNX_logo.jpeg) (imagen mostrada en el interior del iPhone bajo el visor de escaneo).

---

## 3. Estructura de Archivos del Proyecto

```
/Logistic
├── index.html          # Estructura semántica, menú superior, sección SCAN y 6 cajas
├── style.css           # Vanilla CSS con paleta de marca, mockup del iPhone y cajas kraft
├── index.js            # Control del resize del notch, bucle de vídeos y sincronización
├── guide.md            # Esta guía completa del proyecto
├── brainstorm.md       # Copys publicitarios, textos y FAQs extraídos
├── style/
│   └── brand.md        # Manual de colores oficiales y logotipo
├── img/
│   ├── logo.png        # Logotipo oficial transparente para cabecera
│   ├── FNX_logo.jpeg   # Imagen interior para la pantalla del iPhone
│   ├── Color_brand.jpeg# Referencia visual de la paleta
│   └── patinete.jpeg   # Referencia de reparto en scooter
└── video/              # Grabaciones de reparto y transporte logístico en bucle continuo
    ├── Delivery_man_walking_city_street_20260915195750.mp4
    ├── Blue_delivery_van_driving_street_20260915200136.mp4
    ├── Scooter_driving_down_city_street_20260915210220.mp4
    ├── Delivery_person_riding_electric_…_20260915212306.mp4
    ├── Cargo_airplane_taxiing_on_runway_20260915222350.mp4
    └── Container_ship_sailing_ocean_20260915223125.mp4
```

---

## 4. Arquitectura de la Interfaz de Usuario

### 4.1. Menú Superior (Header)
- **Alineación Izquierda:** Logotipo oficial `img/logo.png` acompañado del distintivo `LOGISTIC TERMINAL`.
- **Centro:** Menú de navegación con indicador de sección activa (`Escanear`, `Paquetes en Ruta [6]`, `Hoja de Reparto`, `Historial`).
- **Alineación Derecha:** Indicador de estado satelital (`● EN LÍNEA • GPS ACTIVO`) y botón de acción en color naranja (`Sincronizar Ruta`).

### 4.2. Fondo Cinemático de Vídeo en Bucle
- Capa fija a pantalla completa (`.video-bg-container`) con reproducción continua y secuencial de los 3 vídeos de la carpeta `video/`.
- Incorpora una viñeta oscura y un patrón de rejilla geométrica para garantizar el máximo contraste y legibilidad del contenido sin perder la atmósfera dinámica de reparto urbano.

### 4.3. Disposición del Body (Desktop 2 Columnas con Separador)
El espacio principal se organiza en dos secciones claramente delimitadas:

```
+-----------------------------------------------------------------------------------+
|  HEADER: [Logo img/logo.png]        [Navegación]           [● GPS] [Sincronizar]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ SECCIÓN SCAN ]              |   |       [ SELECCIONAR PAQUETE ]                |
|  - Mockup iPhone               | H |       - Rejilla 3x2 (6 Cajas de Cartón)      |
|  - Dynamic Island              | U |         [Caja 1]    [Caja 2]    [Caja 3]     |
|  - Fondo img/FNX_logo.jpeg     | E |         [Caja 4]    [Caja 5]    [Caja 6]     |
|  - Visor Láser Naranja         | C |                                              |
|  - Datos en Tiempo Real        | O |                                              |
|  - Botón Certificar            |   |                                              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  FOOTER: Protocolo eIDAS & Art. 326 LEC • Paleta Oficial WhatsAuth Logistic       |
+-----------------------------------------------------------------------------------+
```

---

## 5. Componentes Principales y su Funcionamiento

### 5.1. Sección SCAN (Mockup iPhone con Dynamic Island)
- **Chasis y Hardware:**
  - Carcasa oscura con bordes redondeados (`--border-radius: 6.666em`), biseles de cristal reflectante y escala adaptable (`--size: clamp(...)`).
  - Botones físicos reproducidos: subir/bajar volumen e interruptor de silencio en el lateral izquierdo, y botón de encendido en el derecho.
  - Cámara frontal integrada.
- **Dynamic Island / Notch:**
  - En reposo muestra una píldora discreta en la parte superior.
  - Al colocar el cursor encima (`:hover`) o al enfocar (`:focus-within`), se expande de manera fluida mostrando el logotipo en miniatura, el estado del escáner y la señal activa.
- **Pantalla Interior:**
  - Muestra la imagen oficial `img/FNX_logo.jpeg` ajustada al centro.
  - **Retícula Láser:** Marco delimitador con esquinas en naranja `#FE6C27` y una línea láser animada que barre verticalmente la pantalla.
  - **Tarjeta HUD:** Muestra el ID del paquete, destinatario, dirección de entrega, peso y verificación de geocerca (por ejemplo, `Δ 2.4 m`).
  - **Botón de Certificación:** Botón destacado en Delivery Orange (`#FE6C27`) que al pulsarse registra la entrega, emite el hash SHA-256 y marca la recepción como sellada.

### 5.2. Sección SELECCIONAR PAQUETE (6 Cajas de Cartón 3x2)
- **Diseño Realista de las Cajas:**
  - Gradiente tridimensional color cartón kraft (`#d79e64` a `#a46d37`) con microtextura rugosa.
  - Cinta de embalaje superior con precinto de seguridad impreso: `SECURITY SEAL • WHATSAUTH`.
  - Etiqueta blanca de paquetería con encabezado de transportista, código de barras gráfico, código alfanumérico y datos del destinatario.
  - Sellos de estampación técnica: `FRÁGIL`, `URGENTE`, `CUSTODIA`, `PESADO`, `CONTROL COLD CHAIN` y peso exacto.
- **Paquetes incluidos por defecto:**
  1. `ES-MAD-8921` — Elena Morales (C/ Velázquez 45) • 1.8 kg • Frágil
  2. `ES-MAD-8922` — Marcos Soler (C/ Gran Vía 32) • 2.4 kg • Estándar
  3. `ES-MAD-8923` — Laura Méndez (Paseo de la Castellana 110) • 0.8 kg • Custodia
  4. `ES-MAD-8924` — David Rivas (C/ Serrano 48) • 3.5 kg • Frágil
  5. `ES-MAD-8925` — Javier Gil (C/ Alcalá 142) • 4.2 kg • Pesado
  6. `ES-MAD-8926` — Sofía Varela (C/ Goya 67) • 1.1 kg • Control Sanitario

---

## 6. Lógica de Interacción (index.js)

### 6.1. Control del Redimensionamiento del Notch
Fragmento integrado para estabilizar el notch durante los cambios de tamaño de pantalla:
```javascript
const delay = 300;
let afterResize;
let currentStyle;

window.onresize = function () {
  document.body.classList.add("is-resizing");
  clearTimeout(afterResize);
  afterResize = setTimeout(
    () => document.body.classList.remove("is-resizing"),
    delay
  );
};
```

### 6.2. Sincronización Caja ➔ iPhone
Al hacer clic en cualquier caja de cartón:
1. Se transfiere la clase `.active` a la caja seleccionada (borde naranja de 3px y elevación tridimensional).
2. Se extraen los atributos del elemento (`data-pkg-id`, `data-name`, `data-address`, `data-weight`).
3. Se actualizan reactivamente los campos de texto dentro del iPhone en la sección SCAN.
4. El haz láser reinicia su ciclo de lectura.
5. El Dynamic Island muestra temporalmente `ESCANEANDO...` y confirma con `CÓDIGO VERIFICADO`.

### 6.3. Sellado Criptográfico
Al pulsar el botón **«CERTIFICAR RECEPCIÓN»**:
1. El botón pasa a estado `FIRMANDO COMPROBANTE...`.
2. Tras 800 ms se confirma en verde `#10b981`: `✓ RECEPCIÓN SELLADA`.
3. Se imprime el hash SHA-256 generado con la hora local de entrega.
4. La caja seleccionada en la columna derecha se actualiza automáticamente a `✓ ENTREGADO`.

---

## 7. Adaptabilidad Móvil y Responsive

- **Escritorio (> 1200px):** Dos columnas completas con el iPhone a la izquierda y las 6 cajas en rejilla de 3x2 a la derecha, separadas por el conector central.
- **Tabletas (769px a 1200px):** Las 6 cajas se reordenan automáticamente en rejilla de 2 columnas.
- **Dispositivos Móviles (< 768px):**
  - Las dos columnas se apilan verticalmente: la sección de paquetes arriba (1 columna fluida) para facilitar la selección táctil, y el iPhone abajo para verificar y certificar la entrega.
  - La navegación de texto del header se oculta dejando visible el logotipo y los indicadores esenciales.

---

## 8. Sistema de Internacionalización (i18n)

La plataforma cuenta con un motor nativo de internacionalización en JavaScript con soporte para **7 idiomas**:

| Código | Idioma | Bandera | Detección Automática |
| :--- | :--- | :---: | :--- |
| `es` | Español | 🇪🇸 | Idioma por defecto / fallback |
| `en` | English | 🇺🇸 | Soportado |
| `de` | Deutsch | 🇩🇪 | Soportado |
| `fr` | Français | 🇫🇷 | Soportado |
| `hi` | हिन्दी | 🇮🇳 | Soportado |
| `zh` | 中文 | 🇨🇳 | Soportado |
| `ja` | 日本語 | 🇯🇵 | Soportado |

### Funcionamiento:
1. **Detección del Navegador:** Al cargar, la aplicación inspecciona los parámetros de la URL (`?lang=`), la preferencia almacenada en `localStorage` (`logistic_preferred_lang`) y las cabeceras `navigator.languages` o `navigator.language`.
2. **Selector en la Cabecera:** Situado en la zona superior derecha del menú, permite cambiar el idioma al instante sin recargar la página.
3. **Traducción Reactiva Integral:**
   - Textos estructurales mediante atributos `data-i18n`.
   - Mensajes dinámicos del escáner (estados del notch, lectura láser, hash criptográfico SHA-256).
   - Sellos y estados de las cajas de paquetería kraft.

---

## 9. Guía de Ejecución Local

Para visualizar y probar la aplicación en tu entorno local:

1. Abre una terminal en la raíz del proyecto (`/Users/fenixrios/Documents/CODIGO/Logistic`).
2. Inicia un servidor web HTTP:
   ```bash
   python3 -m http.server 8080
   ```
3. Abre tu navegador preferido y accede a:
   ```
   http://localhost:8080/index.html
   ```
   O prueba directamente con un idioma específico:
   ```
   http://localhost:8080/index.html?lang=en
   http://localhost:8080/index.html?lang=ja
   ```
