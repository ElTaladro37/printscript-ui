# Usa la imagen de Nginx como base
FROM nginx:alpine

# Copia los archivos de la carpeta build (o dist) al contenedor
COPY dist/ /usr/share/nginx/html

# Exponer el puerto 5173
EXPOSE 5173

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
