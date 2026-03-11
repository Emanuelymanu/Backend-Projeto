// test-upload.ts
import path from 'path';
import fs from 'fs';

console.log('🔍 INICIANDO DIAGNÓSTICO DE UPLOAD');
console.log('==================================');

// 1. Verificar diretório atual
console.log('1️⃣ Diretório atual:', process.cwd());

// 2. Verificar __dirname
console.log('2️⃣ __dirname:', __dirname);

// 3. Construir caminho absoluto
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'capas');
console.log('3️⃣ Caminho completo da pasta uploads:', uploadDir);

// 4. Verificar se o caminho existe
console.log('4️⃣ A pasta existe?', fs.existsSync(uploadDir) ? '✅ SIM' : '❌ NÃO');

// 5. Tentar criar a pasta
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('5️⃣ Pasta criada com sucesso!');
    } else {
        console.log('5️⃣ Pasta já existe.');
    }
} catch (error) {
    console.error('5️⃣ Erro ao criar pasta:', error);
}

// 6. Verificar permissões
try {
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log('6️⃣ Permissão de escrita: ✅ OK');
} catch (error) {
    console.error('6️⃣ Permissão de escrita: ❌ NEGADA');
}

// 7. Listar arquivos da pasta (se existir)
if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    console.log('7️⃣ Arquivos na pasta:', files.length ? files : '(vazia)');
}

// 8. Testar criação de arquivo
try {
    const testFile = path.join(uploadDir, 'test.txt');
    fs.writeFileSync(testFile, 'teste');
    console.log('8️⃣ Criação de arquivo: ✅ OK');
    fs.unlinkSync(testFile); // Remove o arquivo de teste
} catch (error) {
    console.error('8️⃣ Criação de arquivo: ❌ FALHOU', error);
}

console.log('==================================');