import app from "./app";
import { sequelize } from "./config/connection";
import { initModels } from "./models-auto/init-models";

initModels(sequelize);



const port = 3000;

app.listen(port, () => {
  console.log(` Servidor rodando na porta ${port}`);
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');


    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }catch(error){
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

