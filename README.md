После "logout"  id пользователя попадает в стоп-лист на 11 минут (время жизни токена 10 минут).
Стоп-лист организован с помощью модуля 'node-persist' следующим образом:
1. Стоп-лист хранит состояние после перезагрузки сервера. В рабочей версии, наверное, лучше использовать Redis.
2. Стоп-лист автоматически обнуляет значения, которым более 11 минут. То есть когда гарантированно истекают  выданные с этим id токены.

const blackList = require('node-persist');

blackList.init( {dir: 'app/black-list', ttl: 11*60*1000});//11 минут


test_users.sql в корневой папке - дамп MySql

База содержит 1 таблицу users с двумя полями id и password. 
