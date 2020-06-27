# Delilah Restó

# Documentación

La misma se encuentra disponible en la siguiente dirección: <a href='https://app.swaggerhub.com/apis-docs/sfainbinda/delilah_resto_api/1.0.0'>

Si prefieres se encuentra en el repositorio como documentation.yaml

# Puesta en marcha

Para poder poner en marcha la aplicación deberás seguir los siguientes pasos:

# 1. Clonar repositorio GitHub

En primer lugar se debe clonar el repositorio. Lo encontrarás en: <a href='https://github.com/sfainbinda/delilahresto'>

# 2. Instalar Depencias

Deberás instalar todas las dependencias necesarias para el correcto funcionamiento de la aplicación. Ellas son: 

- bcrypt
- body-parser
- cors
- dotenv
- express
- jsonwebtoken
- moment
- mysql2
- nodemon
- sequelize

IMPORTANTE: en package.json encontrarás el número de versión de cada una de ellas. 

# 3. Base de datos

En tercer lugar deberás crear la base de datos y dar de alta valores iniciales. 
La base de datos se encuentra en: <a href='/src/database/createDataBase'>

Al hacer esto se crearán todas las tablas, las claves foraneas y se darán de alta valores iniciales predeterminados. Además se crearán dos usuarios: uno con perfil de administrador y otro de cliente. Puedes usarlo para hacer testeos. Son los siguientes: 

- Usuario con perfíl de administrador:

    username: admin
    email: sfain@mail.com
    password: sfain
    
- Usuario con perfíl de cliente: 

    username: csagan
    email: csagan@mail.com
    password: csagan

Para finalizar este paso deberás darle valor a las variables USERNAME y PASSWORD. Responden a los datos username y password, respectivamente, de tu base de datos. 

Estas variables se encuentran en el archivo .env siguiendo la siguiente ruta: <a href='/src/.env'>

# 4. Puesta en marcha de la aplicación

En la terminal, deberás posicionarte en la carpeta src e iniciar la aplicación con nodemon server. 

# Testeo de endpoints 

Si deseas testear los endpoints podrás hacerlo desde Postaman. Toda la información necesaria la encontrarás en delilah.postman_collection

