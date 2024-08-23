const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,  // URL ou caminho do arquivo da imagem
        required: true
    },
    category: {
        type: String,
        enum: ['Agronomia', 'Gestão', 'Diversos', 'Infantil'],
        required: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;