// Produtos iniciais (Base fixa)
const PRODUTOS_BASE = [
    {
        id: 1,
        nome: "Guia de Oxalá",
        preco: 45.90,
        descricao: "Confeccionada com miçangas de vidro branco leitoso, 1 fio.",
        categoria: "Guia de Orixá",
        imagem_url: "https://via.placeholder.com/300",
        status: "disponivel"
    },
    {
        id: 2,
        nome: "Guia de Ogum",
        preco: 45.90,
        descricao: "Confeccionada com miçangas azul marinho de alta qualidade.",
        categoria: "Guia de Orixá",
        imagem_url: "https://via.placeholder.com/300",
        status: "disponivel"
    }
];

// Função unificada para obter todos os produtos
function obterProdutos() {
    // Tenta ler de ambas as chaves que estavas a usar para não perder dados
    const extras = JSON.parse(localStorage.getItem('produtos_extras')) || [];
    const db_local = JSON.parse(localStorage.getItem('fio_de_axe_db')) || [];
    
    // Filtra IDs duplicados caso existam nas duas listas
    const adicionados = [...extras, ...db_local].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    
    return [...PRODUTOS_BASE, ...adicionados];
}

// Função para salvar novo produto (usada pelo Admin)
function salvarNovoProduto(produto) {
    const adicionados = JSON.parse(localStorage.getItem('produtos_extras')) || [];
    produto.id = Date.now(); 
    adicionados.push(produto);
    localStorage.setItem('produtos_extras', JSON.stringify(adicionados));
    localStorage.setItem('fio_de_axe_db', JSON.stringify(adicionados)); // Sincroniza as duas chaves
}