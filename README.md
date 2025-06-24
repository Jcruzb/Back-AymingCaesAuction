graph TD
  subgraph Frontend
    A[React + MUI]
  end

  subgraph Backend
    B[app.js<br/>(punto de entrada)]
    C[config]
    D[routes]
    E[controllers]
    F[middlewares]
    G[models]
    H[seeds]
  end

  subgraph Base de Datos
    I[(MongoDB)]
  end

A[React + MUI] --> B[app.js]
  B --> C[config]
  B --> F[middlewares]
  F --> D[routes]
  D --> E[controllers]
  E --> G[models]
  G --> I[(MongoDB)]
  H[seeds] --> G
