**Токен**
Для защищенной зоны используется middlewares/checkAuth.js
const token = req.header('x-auth')
При успешной проверке выдается новый токен (с тем же ID пользователя)
res.header('x-auth', newToken);

**Стоп-лист**
После выхода через" logout" идентификатор id пользователя (email или телефон) попадает в стоп-лист на 11 минут (время жизни токена 10 минут).
Стоп-лист организован с помощью модуля 'node-persist' следующим образом:
1. Стоп-лист хранит состояние после перезагрузки сервера. В рабочей версии, наверное, лучше использовать Redis.
2. Стоп-лист автоматически обнуляет значения, которым более 11 минут. То есть когда гарантированно истекают  выданные с этим id токены.
3. После успешного signIn id пользователя удаляется из стоп-листа.

**Инициализация стоп-листа в server.js**

const blackList = require('node-persist');
blackList.init( {dir: 'app/black-list', ttl: 11 * 60 * 1000});//11 минут

**Дамп MySql**
test_users.sql в корневой папке  
**Структура базы**
База содержит 1 таблицу users с двумя полями id и password. 


