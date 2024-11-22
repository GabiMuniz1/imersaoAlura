import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../dbConfig.js";


// Esta linha cria uma constante 'conexao' e aguarda a função 'conectarAoBanco' retornar a conexão com o banco de dados. 
// A string de conexão é obtida da variável de ambiente 'process.env.STRING_CONEXAO'.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para obter todos os posts do banco de dados.
export async function getTodosPosts() {
    // Seleciona o banco de dados 'imersao-instabytes'.
    const db = conexao.db("imersao-instabytes");
    // Seleciona a coleção 'posts'.
    const colecao = db.collection("posts");
    // Retorna um array com todos os documentos da coleção.
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post em um banco de dados.
// Recebe um objeto `novoPost` contendo as informações do novo post.
export async function criarPost(novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return await colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id)
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}

