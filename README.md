
# Node.js Express Mini Project

The code creates server and listen user requests. You need to authenticate for database like array operations. You can create,read,update and delete users from the array. You don't need to be authenticate for checking logs. You can also get basic home page and about page without authentication.

You have to create admin with post request to /sign. You need JSON object as {user,password} structure. The response will give you token to login.

You have to login as admin with post request to /login. You have to pass JSON object as {token, password}. Then, you can make database operations.

User objects have 3 fields. It consists of "name","surName" and "id".  