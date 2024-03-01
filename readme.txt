Proyecto Final Ecommerce Backend LUCO Objetos

-Solo los usuarios pueden agregar productos a su carrito (que se genera al crear su usuario).
-Si quiero agregar productos al carrito o ingresar al mismo siendo admin obtengo error
-Los usuarios premium no pueden agregar sus propios productos al carrito
-Si intento eliminar usuarios siendo user o premium no puedo lograrlo
-Si intento crear productos nuevos siendo user no puedo lograrlo
-Solo los usuarios premium y admin pueden cargar nuevos productos

Utilizando Swagger, en la url https://entregafinalnodejsspittle-production.up.railway.app/apidocs/ se dispone de informacion de los metodos basicos

Para obtener los usuarios : /api/users
Para eliminar usuarios inactivos : /api/users/inactive

Existen creados 3 usuarios para facilitar las pruebas:
-Usuario "user" con mail "user@gmail.com" y contraseña asd
-Usuario "admin" con mail "admin@gmail.com" y contraseña asd
-Usuario "premium" con mail "premium@gmail.com" y contraseña asd

Link del proyecto: https://entregafinalnodejsspittle-production.up.railway.app/