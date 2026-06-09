# Imagen base liviana con Node 20
FROM node:20-alpine
 
# Directorio de trabajo dentro del contenedor
WORKDIR /app
 
# Copiamos solo los archivos de dependencias primero (mejor caché)
COPY package*.json ./
 
# Instalamos dependencias
RUN npm install --legacy-peer-deps
 
# Copiamos el resto del código fuente
COPY . .
 
# Comando por defecto: ejecutar los tests
CMD ["npm", "test"]