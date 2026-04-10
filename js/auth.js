// Configuração de acesso Restrito
const ADMIN_CREDENTIALS = {
    user: "fiodeaxe", // Mantemos em minúsculo aqui para comparação
    pass: "fiodeaxe" 
};

// Função que bloqueia páginas protegidas
function verificarAcesso() {
    const logado = sessionStorage.getItem('fio_de_axe_admin');
    
    // Pegamos o nome do arquivo atual da URL
    const paginaAtual = window.location.pathname.split("/").pop().toLowerCase();

    // Se não estiver logado e tentar acessar a página admin.html
    if (!logado && (paginaAtual === 'admin.html' || paginaAtual.includes('admin'))) {
        console.warn("Acesso não autorizado. Redirecionando para login...");
        window.location.href = 'login.html';
    }
}

// Função de execução do Login
function login(usuario, pass) {
    console.log("Tentativa de login iniciada...");

    // .toLowerCase() converte o que o usuário digitou para minúsculo antes de comparar
    const usuarioDigitado = String(usuario).toLowerCase().trim();
    const usuarioCorreto = ADMIN_CREDENTIALS.user.toLowerCase();

    if (usuarioDigitado === usuarioCorreto && pass === ADMIN_CREDENTIALS.pass) {
        sessionStorage.setItem('fio_de_axe_admin', 'true');
        console.log("Login bem-sucedido! Redirecionando para o painel...");
        
        // Timeout de 100ms apenas para garantir que o storage foi gravado antes de mudar a página
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 100);
    } else {
        console.error("Erro: Usuário ou senha incorretos.");
        alert("Acesso Negado. Credenciais incorretas.");
    }
}

function logout() {
    sessionStorage.removeItem('fio_de_axe_admin');
    console.log("Sessão encerrada.");
    window.location.href = 'index.html';
}

// --- IMPORTANTE: Torna as funções visíveis para o HTML ---
window.login = login;
window.logout = logout;
window.verificarAcesso = verificarAcesso;

// Executa a verificação imediatamente ao carregar o script
verificarAcesso();