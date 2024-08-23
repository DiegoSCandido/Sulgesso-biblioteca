// Seleciona os elementos do DOM
const form = document.getElementById('bookForm');
const messageDiv = document.getElementById('message');
const bookList = document.getElementById('bookList');

// Manipula o envio do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    fetch('http://localhost:3000/books', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then((_msg) => {
        messageDiv.textContent = 'Livro cadastrado com sucesso!';
        messageDiv.style.color = 'green';
        form.reset();
        loadBooks();  // Recarrega a lista de livros após o cadastro
    })
    .catch(error => {
        messageDiv.textContent = 'Erro ao cadastrar livro. Tente novamente.';
        messageDiv.style.color = 'red';
        console.error('Error:', error);
    });
});

// Função para buscar e exibir os livros
function loadBooks() {
    fetch('http://localhost:3000/books') // Certifique-se de usar o URL completo se necessário
        .then(response => response.json())
        .then(books => {
            bookList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.innerHTML = `
                    <h2>${book.title}</h2>
                    <p><strong>Autor:</strong> ${book.author}</p>
                    <p><strong>Categoria:</strong> ${book.category}</p>
                    <p><strong>Sinopse:</strong> ${book.synopsis}</p>
                    <img src="${book.coverImage}" alt="${book.title}" width="100">
                    
                `;
                bookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error('Erro ao buscar livros:', error));
}

// Carregar os livros ao iniciar a página
loadBooks();

