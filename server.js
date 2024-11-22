import express from "express";
import conectarAoBanco from "./src/config/dbConfig.js";
import routes from "./src/config/routes/postRoutes.js";


// Array de posts hardcoded, utilizado para demonstração. 
// Em um cenário real, esses dados seriam obtidos do banco de dados.
const posts = [
    // ... seus posts ...
];

// Inicializa o aplicativo Express.
const app = express();
app.use(express.static("uploads"));
routes(app)


// Inicia o servidor na porta 3000 e exibe uma mensagem no console.
app.listen(3000, () => {
    console.log("servidor escutando...");
});


