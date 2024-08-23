document.getElementById("button").addEventListener("click", function() {
        window.location.href = "./admin.html"; 
    });

    let currentPage = 1;
    const booksContainer = document.getElementById('books-container');
    const loadMoreButton = document.getElementById('load-more');
    
    function loadBooks(page = 1) {
        fetch(`http://localhost:3000/books?page=${page}`)
            .then(response => response.json())
            .then(data => {
                data.books.forEach(book => {
                    const bookDiv = document.createElement('div');
                    bookDiv.classList.add('book-item');
                    bookDiv.innerHTML = `
                        <h3>${book.title}</h3>
                        <p><strong>Autor:</strong> ${book.author}</p>
                        <p><strong>Categoria:</strong> ${book.category}</p>
                        <p><strong>Sinopse:</strong> ${book.synopsis}</p>
                        <img src="${book.coverImage}" alt="Capa do livro">
                        
                    `;
                    booksContainer.appendChild(bookDiv);
                });
    
                // Se não há mais livros, esconde o botão
                if (booksContainer.children.length >= data.totalBooks) {
                    loadMoreButton.style.display = 'none';
                }
            })
            .catch(error => console.error('Erro ao carregar livros:', error));
    }
    
    // Inicialmente carrega os primeiros 10 livros
    loadBooks(currentPage);
    
    // Carrega mais livros ao clicar no botão
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadBooks(currentPage);
    });
