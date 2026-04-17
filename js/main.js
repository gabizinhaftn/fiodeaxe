// Gerenciamento do Carrinho no LocalStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho_fio_de_axe')) || [];

function salvarCarrinho() {
    localStorage.setItem('carrinho_fio_de_axe', JSON.stringify(carrinho));
}

// ATUALIZADO: Agora verifica se o item já existe para somar quantidade
function adicionarAoCarrinho(id) {
    const produtosBase = typeof PRODUTOS !== 'undefined' ? PRODUTOS : obterProdutos();
    const produto = produtosBase.find(p => p.id === id);
    
    if (produto) {
        const itemExistente = carrinho.find(item => item.id === id);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            // Adiciona o produto com a propriedade quantidade inicializada em 1
            carrinho.push({ ...produto, quantidade: 1 });
        }
        
        salvarCarrinho();
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
        alert(`${produto.nome} adicionado à sacola!`);
    }
}

// NOVO: Função para aumentar ou diminuir quantidade
function alterarQuantidade(id, delta) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade += delta;
        
        // Se a quantidade chegar a 0, removemos o item
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.id !== id);
        }
        
        salvarCarrinho();
        updateCartUI();
    }
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    updateCartUI();
}

function limparCarrinho() {
    localStorage.removeItem('carrinho_fio_de_axe');
    carrinho = [];
    updateCartUI();
}

/** * ATUALIZAÇÃO: Lógica de Checkout com validação de usuário e Quantidades
 */
async function finalizarCompra() {
    // 1. Validação de Carrinho Vazio
    if (carrinho.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    // 2. Preparação da Mensagem para WhatsApp com Quantidades
    const numeroWhatsApp = "5511913333917"; 
    let totalVenda = 0;
    let itensTexto = "";

    carrinho.forEach((item) => {
        const subtotalItem = parseFloat(item.preco) * item.quantidade;
        itensTexto += `• ${item.nome} (${item.quantidade}x) - R$ ${subtotalItem.toFixed(2)}\n`;
        totalVenda += subtotalItem;
    });

    const mensagem = `Olá! Gostaria de encomendar os seguintes itens:\n\n${itensTexto}\n*Total: R$ ${totalVenda.toFixed(2)}*`;

    try {
        // Se houver integração com Firebase (como no seu index.html)
        if (window.db_online && window.userLogado) {
            await window.addDoc(window.collection(window.db_online, "vendas"), {
                userId: window.userLogado.uid,
                cliente: window.userLogado.displayName || window.userLogado.email,
                itens: carrinho.map(i => `${i.nome} (${i.quantidade}x)`).join(', '),
                total: totalVenda.toFixed(2),
                data: new Date().toLocaleDateString('pt-BR'),
                status: "Aguardando Pagamento",
                pagamento: "Pendente"
            });
        }

        window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`, '_blank');
        
        // Limpa o carrinho após o sucesso
        carrinho = [];
        salvarCarrinho();
        updateCartUI();
        if (typeof toggleCart === 'function') toggleCart();
        
    } catch (e) {
        console.error("Erro ao registrar pedido:", e);
        alert("Erro ao registrar pedido no banco de dados.");
    }
}