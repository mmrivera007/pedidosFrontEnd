# PedidoFrontEnd

Proyecto construido con Angular CLI version 10.2.0, Node 12.18.3. Se deberá contar con estas versiones o superiores para configurar el ambiente de desarrollo. Se utilizó como IDE VSCode.

## Development server
Descargue la aplicación en su repositorio local, ejecute el comando `npm install` para descargar todas las dependencias del proyecto.

Ejecute el comando `ng serve` para poner en funcionamiento el proyecto en el entorno de desarrollo. Abra un navegador e ingrese la url `http://localhost:4200/`. 

Nota: previamente deberá tener ya levantado el proyecto de backend de pedidos.

## Build

Ejecute el comando `ng build`(desarrollo) o `ng build --prod`(producción) para contruir el proyectoto, el resultado se alamcenará en el directorio `dist/`.

Descargue y configure el servidor Nginx, copie la carpeta generada del proyecgto en `html`. Configure el archivo `nginx.conf` la ruta del proyecto y el puerto para acceder desde `http://localhost:4200/`.