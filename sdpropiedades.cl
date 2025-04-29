server {
    listen 80;
    server_name sdpropiedades.cl;

    # Ruta para servir archivos estáticos del frontend
    root /var/www/RS-SDP/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Redirigir las peticiones de la API al backend (supón que está en el puerto 3000)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuración para manejar errores
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
