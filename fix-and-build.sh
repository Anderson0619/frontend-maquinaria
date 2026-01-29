#!/bin/bash
echo "=== Parchando error de TypeScript ==="

# Parche temporal: reemplazar la línea problemática
sed -i "s/claveDeDatos = { \`\${ClaveDeDatos}\` }/claveDeDatos = { String(ClaveDeDatos) }/g" src/componentes/_Custom/Tabla/Celdas.tsx

# Continuar con build normal
npm run build