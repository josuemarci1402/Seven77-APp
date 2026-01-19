// Banco de dados local (salva no navegador)
let alunos = JSON.parse(localStorage.getItem('seven77_alunos')) || [
    { id: 1, nome: "RAYLANDERSON SOUZA", status: "vencido" }
];

// Mensagem Oficial EqpSeven🛸
const msgBase = encodeURIComponent("⚠️Atenção⚠️\n\nSua mensalidade está em aberto.\nPara evitar o Bloqueio automático do sistema, efetue o pagamento.\n\n💳 Chave Pix: 31991639752\n📩 Comprovante deve ser enviado por aqui.\n🔗NÃO SE ESQUEÇA DE ENVIAR SEU E-MAIL E SENHA DO APLICATIVO PARA RENOVAÇÃO\n\nEqpSeven🛸");

function renderizar() {
    const lista = document.getElementById('lista-alunos');
    if (!lista) return;
    lista.innerHTML = '';
    
    let ativos = 0, vencidos = 0;

    alunos.forEach(aluno => {
        aluno.status === 'ativo' ? ativos++ : vencidos++;
        
        const card = document.createElement('div');
        card.className = `glass p-4 rounded-[2rem] flex justify-between items-center transition`;
        card.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 uppercase font-black text-purple-500">
                    ${aluno.nome.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-sm tracking-tight">${aluno.nome}</h4>
                    <p class="text-[9px] font-black uppercase ${aluno.status === 'vencido' ? 'text-red-500' : 'text-green-500'}">
                        ${aluno.status}
                    </p>
                </div>
            </div>
            <div class="flex gap-2">
                ${aluno.status === 'vencido' ? `
                    <a href="https://wa.me/5531991639752?text=${msgBase}" class="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                ` : ''}
                <button onclick="removerAluno(${aluno.id})" class="w-10 h-10 rounded-xl bg-white/5 text-gray-600 flex items-center justify-center hover:text-red-500">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </div>
        `;
        lista.appendChild(card);
    });

    // Atualiza os contadores no topo
    document.getElementById('stat-ativos').innerText = ativos;
    document.getElementById('stat-vencidos').innerText = vencidos;
    localStorage.setItem('seven77_alunos', JSON.stringify(alunos));
}

function adicionarAluno() {
    const nome = document.getElementById('nome-novo').value;
    const status = document.getElementById('status-novo').value;
    if(!nome) return alert("Digite o nome");
    
    alunos.push({ id: Date.now(), nome: nome.toUpperCase(), status: status });
    document.getElementById('nome-novo').value = '';
    fecharModal();
    renderizar();
}

function removerAluno(id) {
    if(confirm("Deseja remover este aluno?")) {
        alunos = alunos.filter(a => a.id !== id);
        renderizar();
    }
}

// Inicializa a lista ao carregar
window.onload = renderizar;
