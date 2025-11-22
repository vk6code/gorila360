#!/bin/bash

# Script de diagnóstico para verificar el estado del backend GraphQL

echo "🔍 Diagnóstico de GraphQL Backend"
echo "=================================="
echo ""

# 1. Verificar que el backend esté corriendo
echo "1. Verificando que el backend esté escuchando en puerto 8000..."
if netstat -tlnp 2>/dev/null | grep -q ":8000"; then
    echo "   ✅ Backend está corriendo en puerto 8000"
else
    echo "   ❌ Backend NO está corriendo en puerto 8000"
    exit 1
fi
echo ""

# 2. Probar query simple
echo "2. Probando query simple (hello)..."
RESPONSE=$(curl -s -X POST http://127.0.0.1:8000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ hello }"}')
echo "   Respuesta: $RESPONSE"
echo ""

# 3. Probar introspección
echo "3. Probando introspección del esquema..."
QUERIES=$(curl -s -X POST http://127.0.0.1:8000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ __schema { queryType { fields { name } } } }"}' \
    | python3 -c "import sys, json; data=json.load(sys.stdin); print(', '.join([f['name'] for f in data['data']['__schema']['queryType']['fields']]))" 2>/dev/null)
echo "   Queries disponibles: $QUERIES"
echo ""

# 4. Probar query userDietPlan
echo "4. Probando query userDietPlan..."
DIET_RESPONSE=$(curl -s -X POST http://127.0.0.1:8000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"query GetUserDietPlan { userDietPlan { userName fatsPlanned { name amount } } }"}')
echo "   Respuesta: $DIET_RESPONSE"
echo ""

# 5. Verificar Nginx
echo "5. Verificando configuración de Nginx..."
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo "   ✅ Configuración de Nginx es válida"
else
    echo "   ❌ Configuración de Nginx tiene errores"
fi
echo ""

# 6. Verificar logs de Nginx
echo "6. Últimas líneas de error de Nginx:"
sudo tail -n 5 /var/log/nginx/gorila360_error.log 2>/dev/null || echo "   No se pudo leer el log"
echo ""

# 7. Probar desde el proxy de Nginx
echo "7. Probando a través del proxy de Nginx (localhost)..."
NGINX_RESPONSE=$(curl -s -X POST http://localhost/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ hello }"}')
echo "   Respuesta: $NGINX_RESPONSE"
echo ""

echo "=================================="
echo "✅ Diagnóstico completado"
