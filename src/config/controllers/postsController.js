import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

/**
 * Lista todos os posts existentes no sistema.
 * 
 * @async
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function listarPosts(req, res) {
  // 1. Chama a função do modelo para buscar todos os posts do banco de dados.
  const posts = await getTodosPosts();

  // 2. Envia uma resposta HTTP com status 200 (sucesso) e os posts em formato JSON.
  res.status(200).json(posts);
}

/**
 * Cria um novo post.
 * 
 * @async
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function postarNovoPost(req, res) {
  const novoPost = req.body; // Obtém os dados do novo post do corpo da requisição.

  try {
    // 1. Chama a função do modelo para criar o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);

    // 2. Envia uma resposta HTTP com status 200 (sucesso) e o post criado em formato JSON.
    res.status(200).json(postCriado);
  } catch (erro) {
    // 3. Caso ocorra algum erro, loga a mensagem de erro no console
    //    e envia uma resposta HTTP com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

/**
 * Cria um novo post com uma imagem e salva a imagem no sistema de arquivos.
 * 
 * @async
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function uploadImagem(req, res) {
  // 1. Cria um objeto com os dados do novo post, incluindo a URL da imagem.
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  try {
    // 2. Chama a função do modelo para criar o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);

    // 3. Gera um novo nome para o arquivo da imagem com base no ID do post.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

    // 4. Renomeia o arquivo da imagem para o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada);

    // 5. Envia uma resposta HTTP com status 200 (sucesso) e o post criado em formato JSON.
    res.status(200).json(postCriado);
  } catch (erro) {
    // 6. Caso ocorra algum erro, loga a mensagem de erro no console
    //    e envia uma resposta HTTP com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`


  try {

    const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imgBuffer)
    const post = {
      imgUrl:urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);

    // 2. Envia uma resposta HTTP com status 200 (sucesso) e o post criado em formato JSON.
    res.status(200).json(postCriado);
  } catch (erro) {
    // 3. Caso ocorra algum erro, loga a mensagem de erro no console
    //    e envia uma resposta HTTP com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}
