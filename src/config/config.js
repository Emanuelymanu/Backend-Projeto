module.exports = {
  development: {
    username: 'root',
    password: "",
    database: 'projeto5p',
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    }
  },
  test: {
    username: "root",
    password: "",
    database: "projeto5p_test",
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      charset: 'utf8mb4',
    }
  }
}

/*"production": {
  "username": "root",
  "password": null,
  "database": "database_production",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
}*/
