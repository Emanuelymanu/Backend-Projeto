// src/__tests__/setup.ts
import { sequelize } from '../config/connection';
import { initModels } from '../models-auto/init-models';

let models: any;

beforeAll(async () => {
  try {
    // 1. Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de teste');
    
    // 2. INICIALIZAR OS MODELOS (ISSO É CRUCIAL!)
    models = initModels(sequelize);
    console.log('✅ Modelos inicializados:', Object.keys(models));
    
    // 3. Sincronizar banco (recria tabelas)
    await sequelize.sync({ force: true });
    console.log('✅ Banco sincronizado');
    
  } catch (error) {
    console.error('❌ Erro no setup:', error);
    throw error;
  }
});

afterAll(async () => {
  await sequelize.close();
  console.log('✅ Conexão fechada');
});

export { models };