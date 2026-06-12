# Calculadora de salario neto España

Calculadora de nómina en español que estima el salario neto mensual a partir del bruto, aplicando cotizaciones a la Seguridad Social y retenciones de IRPF según tu comunidad autónoma y situación personal.

La aplicación funciona íntegramente en el navegador: no requiere backend ni registro. Los resultados se actualizan al instante mientras introduces los datos.

## Características

- **Salario neto por paga** con soporte para 12 o 14 pagas anuales.
- **Bruto anual o mensual**: introduce el salario en el periodo que prefieras.
- **Seguridad Social**: cotización del trabajador (contingencias comunes, desempleo, formación profesional y MEI) con bases mínimas y máximas.
- **IRPF automático o manual**:
  - **Automático (por defecto)**: tramos estatales y autonómicos, mínimos personales y por hijos.
  - **Manual**: introduces el porcentaje de retención; al activarlo se rellena con el último tipo efectivo calculado en modo automático.
- **Desglose visual**: Seguridad Social, cuotas estatales y autonómicas de IRPF, y neto anual.
- **Modo claro y modo oscuro**, con preferencia guardada en el navegador.
- **Accesibilidad**: etiquetas en formularios, navegación por teclado, `aria-live` en resultados.
- **SEO básico**: meta tags, Open Graph y datos estructurados.

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Tests | Vitest |
| Estilos | CSS con variables (sin librería UI) |
| Tipografías | Fraunces + IBM Plex Sans |

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación y uso

```bash
# Clonar e instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Tests
npm test

# Build de producción
npm run build

# Previsualizar el build
npm run preview
```

Tras `npm run dev`, abre la URL que indique Vite (normalmente `http://localhost:5173`).

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Arranca el servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila TypeScript y genera la carpeta `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm test` | Ejecuta los tests unitarios con Vitest |
| `npm run deploy:ftp` | Build de producción y subida a SiteGround por FTP |

## Estructura del proyecto

```
src/
├── components/
│   ├── calculator/
│   │   └── SalaryCalculator.tsx     # Interfaz principal
│   └── ui/                          # Input, Select, Toggle, ThemeToggle
├── data/
│   ├── irpfStateBrackets.ts         # Tramos IRPF estatal
│   ├── irpfRegionalBrackets.ts      # Tramos IRPF autonómicos
│   ├── personalMinimums.ts            # Mínimos personales y por hijos
│   └── socialSecurityRates.ts       # Tipos de cotización del trabajador
├── hooks/
│   ├── useSalaryCalculator.ts       # Estado del formulario + cálculo
│   └── useTheme.ts                  # Modo claro / oscuro
├── lib/
│   ├── salary/
│   │   ├── calculateSalary.ts       # Motor de cálculo
│   │   ├── calculateIrpf.ts         # IRPF automático y manual
│   │   ├── calculateSocialSecurity.ts
│   │   ├── applyProgressiveBrackets.ts
│   │   └── mapFormDataToSalaryCalculationInput.ts
│   └── errors/
│       └── SalaryCalculationError.ts
├── types/                           # Tipos del dominio
└── test/
    └── calculateSalary.test.ts
```

## Cómo funciona el cálculo

### Entrada del formulario

| Campo | Descripción |
|-------|-------------|
| Salario bruto | Importe anual o mensual según el toggle |
| Número de pagas | 12 o 14 pagas al año |
| Tipo de contrato | Indefinido o temporal (afecta al paro) |
| Comunidad autónoma | Determina los tramos autonómicos de IRPF |
| Estado civil | Soltero/a o casado/a |
| Hijos a cargo | De 0 a 5 (reduce la base imponible) |
| IRPF manual | Toggle para sustituir el cálculo automático |

### Bruto anual

```
Si periodo mensual:
  Bruto anual = Salario mensual × 12

Si periodo anual:
  Bruto anual = Salario introducido
```

### Seguridad Social

```
Base mensual = clamp(Bruto anual / 12, base mínima, base máxima)
Cotización anual = Base mensual × 12 × (CC + desempleo + FP + MEI)
```

Los tipos del trabajador dependen del tipo de contrato (indefinido o temporal).

### Base de retención IRPF

```
Base de retención = Bruto anual − Cotización Seguridad Social
```

### IRPF automático (por defecto)

1. Se calculan las cuotas estatales y autonómicas aplicando tramos progresivos sobre la base de retención.
2. Se restan los mínimos personales (y por hijos o matrimonio) mediante reducción equivalente en tramos.
3. La cuota final no puede ser negativa.
4. El tipo efectivo es `Cuota IRPF anual / Base de retención × 100`.

Al activar el modo manual, el formulario rellena el porcentaje con el último tipo efectivo calculado en modo automático para que puedas ajustarlo.

### IRPF manual

```
Cuota IRPF anual = Base de retención × (tipo manual / 100)
Tipo efectivo = tipo manual introducido
```

### Salario neto

```
Neto anual = Bruto anual − Seguridad Social − IRPF
Neto por paga = Neto anual / número de pagas
IRPF mensual (referencia) = Cuota IRPF anual / 12
```

## Caso de referencia

| Parámetro | Valor |
|-----------|-------|
| Bruto | 30.000 € anuales |
| Pagas | 14 |
| Contrato | Indefinido |
| CCAA | Madrid |
| Estado civil | Soltero/a |
| Hijos | 0 |
| IRPF | Automático |

| Resultado | Valor orientativo |
|-----------|-------------------|
| Neto por paga | ~1.800–2.000 € |
| IRPF anual | Variable según tramos y mínimos |
| Seguridad Social | ~1.900–2.000 €/año (base acotada) |

Con **IRPF manual al 15 %**, la retención es fija sobre la base de retención y el neto difiere del modo automático.

Con **1 hijo a cargo**, la cuota de IRPF anual es menor que con 0 hijos gracias al mínimo por descendiente.

## Tests

Los tests siguen el patrón Given-When-Then:

```bash
npm test
```

Casos principales:

- `execute_whenAnnualGross30kMadrid14Pagas_thenMonthlyNetBetween1800And2000`
- `execute_whenManualIrpf15Percent_thenMonthlyNetDiffersFromAuto`
- `execute_whenOneChild_thenAnnualIrpfLowerThanZeroChildren`

## Despliegue

### Producción (breimato.es)

La app está publicada en **https://breimato.es/salario-neto/**

### FTP (SiteGround)

1. Copia `.env.deploy.example` → `.env.deploy.local` y rellena las credenciales FTP (no commitear).
2. Despliega:

```bash
npm run deploy:ftp
```

Variables relevantes:

| Variable | Valor en producción |
|----------|---------------------|
| `FTP_REMOTE_DIR` | `breimato.es/public_html/salario-neto` |
| `VITE_BASE_PATH` | `/salario-neto/` |

El script hace `npm run build` con `VITE_BASE_PATH` y sube `dist/` por FTP con `basic-ftp`.

### Build manual

```bash
VITE_BASE_PATH=/salario-neto/ npm run build
```

## Accesibilidad y calidad web

- Contraste de color en modo claro y oscuro
- `lang="es"` en el documento
- Skip link al contenido principal
- Resultados anunciados con `aria-live`
- `prefers-reduced-motion` respetado en transiciones

## Aviso legal

Esta calculadora ofrece **cifras orientativas**. Los tipos de cotización, tramos de IRPF, mínimos personales y retenciones reales pueden variar según normativa vigente, convenio colectivo, situación familiar y datos de la empresa. Confirma siempre los importes con tu nómina o asesor fiscal.

## Licencia

Proyecto privado. Todos los derechos reservados.
