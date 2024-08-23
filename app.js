const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Book = require('./models/Book');  // Certifique-se de criar o arquivo models/Book.js
const session = require('express-session');
const app = express();

// Substitua pelos seus detalhes
const uri = 'mongodb+srv://diegoscandido19:sa41NhegO@bibliotecasg.5ml4r.mongodb.net/?retryWrites=true&w=majority&appName=BibliotecaSGcle';

// Conectando ao MongoDB Atlas
mongoose.connect(uri)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas', err));

// Configurando o multer para salvar as imagens de capa
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))  // Adiciona a extensão correta do arquivo
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));  // Servindo arquivos estáticos da pasta de uploads

// Rota para cadastrar livros
app.post('/books', upload.single('coverImage'), async (req, res) => {
    try {
        const { title, author, synopsis, category } = req.body;
        const coverImage = req.file.path;

        const newBook = new Book({
            title,
            author,
            synopsis,
            coverImage,
            category
        });

        await newBook.save();
        res.status(201).json({ message: 'Livro cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar livro.', error });
    }
});



// Buscar livros
app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Página atual, padrão é 1
        const limit = 10;  // Número de livros por página
        const skip = (page - 1) * limit;  // Quantidade de livros a pular

        const books = await Book.find().skip(skip).limit(limit);
        const totalBooks = await Book.countDocuments();  // Total de livros no banco

        res.json({ books, totalBooks });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livros.', error });
    }
});

// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

