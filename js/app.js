// Funções de Banco de Dados Local
function obterProdutos() {
    // Integração: Pega os produtos fixos do data.js e soma aos que você cadastrou no admin
    const baseFixa = typeof PRODUTOS_BASE !== 'undefined' ? PRODUTOS_BASE : [];
    const extras = JSON.parse(localStorage.getItem('produtos_extras')) || [];
    const dbLocalAntigo = JSON.parse(localStorage.getItem('fio_de_axe_db')) || [];
    
    // Une todas as fontes sem duplicados
    const todosAdicionados = [...extras, ...dbLocalAntigo];
    return [...baseFixa, ...todosAdicionados];
}

function renderizarProdutos() {
    const container = document.getElementById('grid-produtos');
    if (!container) return;
    
    const produtos = obterProdutos();
    
    if (produtos.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-stone-400 py-10">Nenhum produto encontrado.</p>`;
        return;
    }

    container.innerHTML = produtos.map(p => `
        <div class="card-produto group cursor-pointer border border-stone-100 p-4 bg-white shadow-sm transition-all hover:shadow-md">
            <div class="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-4" onclick="window.location.href='detalhes.html?id=${p.id}'">
                <img src="${p.imagem_url}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="${p.nome}">
            </div>
            <div class="text-center">
                <h3 class="text-sm font-bold uppercase tracking-widest mb-2">${p.nome}</h3>
                <p class="text-stone-800 font-semibold mb-4">R$ ${parseFloat(p.preco).toFixed(2)}</p>
                
                <button onclick="adicionarAoCarrinho(${p.id})" class="w-full text-[10px] bg-stone-800 text-white px-4 py-2 uppercase tracking-tighter hover:bg-black transition">
                    Adicionar à Sacola
                </button>
            </div>
        </div>
    `).join('');
}

// Lógica de Postagem com Upload Local
const formAdmin = document.getElementById('form-admin');
if (formAdmin) {
    formAdmin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('foto_local');
        const file = fileInput.files[0];
        const reader = new FileReader();

        // Quando o navegador terminar de ler a imagem
        reader.onloadend = function() {
            const novo = {
                id: Date.now(),
                nome: document.getElementById('nome').value,
                preco: parseFloat(document.getElementById('preco').value),
                descricao: document.getElementById('descricao').value,
                imagem_url: reader.result // Aqui está a imagem convertida em texto (Base64)
            };
            
            // Salva em ambas as chaves para garantir compatibilidade com o data.js
            const produtosExtras = JSON.parse(localStorage.getItem('produtos_extras')) || [];
            produtosExtras.push(novo);
            localStorage.setItem('produtos_extras', JSON.stringify(produtosExtras));
            localStorage.setItem('fio_de_axe_db', JSON.stringify(produtosExtras));
            
            alert('Guia publicada com sucesso!');
            window.location.href = 'index.html';
        };

        if (file) {
            reader.readAsDataURL(file); // Inicia a leitura do arquivo
        } else {
            alert("Por favor, selecione uma imagem.");
        }
    });
}

document.addEventListener('DOMContentLoaded', renderizarProdutos);