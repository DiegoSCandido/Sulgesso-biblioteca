const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Book = require('./models/Book');  // Certifique-se de criar o arquivo models/Book.js

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


// criando acessso a area restrita 
// Configurar o middleware para lidar com formulários
app.use(express.urlencoded({ extended: true }));

// Configurar o middleware de sessões
app.use(session({
  secret: '@#SulGesso05550admin', // Use uma string aleatória e forte
  resave: false, // Não salvar a sessão se nada for modificado
  saveUninitialized: false, // Não criar sessões até que algo seja armazenado
  cookie: { secure: true } // Defina como true se estiver usando HTTPS
}));

// Rota para exibir a página de login do administrador
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Verificar senha e iniciar a sessão
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  
  // Defina a senha do administrador aqui
  const adminPassword = 'senha123';
  
  if (password === adminPassword) {
    // Se a senha estiver correta, iniciar a sessão
    req.session.isAuthenticated = true;
    res.redirect('/admin-dashboard.html');
  } else {
    res.send('Senha incorreta. <a href="/admin-login">Tente novamente</a>');
  }
});

// Middleware para proteger as rotas
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next(); // O usuário está autenticado, continuar
  } else {
    res.redirect('/admin-login'); // Redirecionar para a página de login
  }
}

// Rota para o painel de administração (protegida)
app.get('/admin-dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public','admin-dashboard.html'));
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Erro ao encerrar sessão.');
    }
    res.redirect('/admin-login.html');
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

