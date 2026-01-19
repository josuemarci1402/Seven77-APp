// Recupera dados
let alunos = JSON.parse(localStorage.getItem('seven77_db_v2')) || [];

// Mensagem de Cobrança
const msgCobrar = (nome) => encodeURIComponent(`⚠️ Atenção ${nome} ⚠️\n\nSua mensalidade venceu e está em aberto.\nPara evitar o Bloqueio automático do sistema, efetue o pagamento.\n\n💳 Chave Pix: 31991639752\n📩 Envie o comprovante aqui.\n\nEqpSeven🛸`);
// Mensagem de Contato Normal
const msgOla = (nome) => encodeURIComponent(`Olá ${nome}, tudo bem?\nPassando para saber como estão os treinos na SEVEN77! 🛸`);

function renderizar() {
    const lista = document.getElementById('lista-alunos');
    const termo = document.getElementById('busca').value.toLowerCase();
    
    lista.innerHTML = '';
    let totalReceita = 0, contaAtivos = 0, contaVencidos = 0;
    
    // Ordena: Vencidos primeiro
    alunos.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));

    alunos.forEach(aluno => {
        if (!aluno.nome.toLowerCase().includes(termo)) return;

        // Cálculo de Vencimento Real
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        const dataVenc = new Date(aluno.vencimento + "T00:00:00"); // Garante fuso
        
        const isVencido = hoje > dataVenc;
        const diasRestantes = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
        
        // Stats
        if(isVencido) contaVencidos++;
        else contaAtivos++;
        totalReceita += parseFloat(aluno.valor);

        // Visual do Card
        const borderClass = isVencido ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-white/5';
        const statusColor = isVencido ? 'text-red-500' : (diasRestantes <= 3 ? 'text-yellow-500' : 'text-green-500');
        const statusTexto = isVencido ? 'VENCIDO' : (diasRestantes === 0 ? 'VENCE HOJE' : `VENCE EM ${diasRestantes} DIAS`);

        const card = document.createElement('div');
        card.className = `glass p-5 rounded-[2rem] flex flex-col gap-4 border transition hover:bg-white/[0.02] ${borderClass}`;
        
        // Formata data BR
        const dataFormatada = dataVenc.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-[#16181c] flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span class="text-[10px] text-gray-500 font-bold uppercase">Vence</span>
                        <span class="text-lg font-black text-white leading-none">${dataFormatada.split('/')[0]}</span>
                        <span class="text-[8px] text-gray-600 font-bold uppercase">${dataFormatada.split('/')[1]}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-lg tracking-tight leading-tight">${aluno.nome}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[10px] font-black uppercase ${statusColor} bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                                ${statusTexto}
                            </span>
                            <span class="text-[11px] text-gray-400 font-bold">R$ ${parseFloat(aluno.valor).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                
                <a href="https://wa.me/55${aluno.telefone}?text=${isVencido ? msgCobrar(aluno.nome) : msgOla(aluno.nome)}" target="_blank"
                   class="col-span-1 h-10 rounded-xl flex items-center justify-center transition ${isVencido ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-green-500/20 hover:text-green-500'}">
                   <i class="fab fa-whatsapp text-lg"></i>
                </a>

                <button onclick="renovarAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center" title="Renovar por 1 mês">
                    <i class="fas fa-sync-alt text-sm"></i>
                </button>

                <button onclick="editarAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-purple-500 hover:text-white transition flex items-center justify-center" title="Editar">
                    <i class="fas fa-pen text-sm"></i>
                </button>

                <button onclick="removerAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-600 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        `;
        lista.appendChild(card);
    });

    document.getElementById('stat-ativos').innerText = contaAtivos;
    document.getElementById('stat-vencidos').innerText = contaVencidos;
    document.getElementById('stat-receita').innerText = totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// === FUNÇÕES DE AÇÃO ===

function salvarAluno() {
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('input-nome').value;
    const tel = document.getElementById('input-telefone').value.replace(/\D/g, '');
    const valor = document.getElementById('input-valor').value;
    const data = document.getElementById('input-vencimento').value;

    if (!nome || !valor || !data) return alert("Preencha os campos obrigatórios!");

    if (id) {
        // EDITA EXISTENTE
        const index = alunos.findIndex(a => a.id == id);
        if (index > -1) {
            alunos[index] = { ...alunos[index], nome: nome.toUpperCase(), telefone: tel, valor, vencimento: data };
        }
    } else {
        // CRIA NOVO
        alunos.push({ id: Date.now(), nome: nome.toUpperCase(), telefone: tel, valor, vencimento: data });
    }

    localStorage.setItem('seven77_db_v2', JSON.stringify(alunos));
    fecharModal();
    renderizar();
}

function editarAluno(id) {
    const aluno = alunos.find(a => a.id == id);
    if (!aluno) return;

    document.getElementById('modal-titulo').innerText = "Editar Aluno";
    document.getElementById('edit-id').value = aluno.id;
    document.getElementById('input-nome').value = aluno.nome;
    document.getElementById('input-telefone').value = aluno.telefone;
    document.getElementById('input-valor').value = aluno.valor;
    document.getElementById('input-vencimento').value = aluno.vencimento;
    
    abrirModal();
}

function renovarAluno(id) {
    const index = alunos.findIndex(a => a.id == id);
    if (index === -1) return;
    
    if(!confirm(`Confirmar pagamento de ${alunos[index].nome} e renovar para o mês que vem?`)) return;

    // Lógica para adicionar 1 mês na data atual
    const dataAtual = new Date(alunos[index].vencimento + "T00:00:00"); // Força meia-noite pra evitar bug de fuso
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    
    alunos[index].vencimento = dataAtual.toISOString().split('T')[0];
    localStorage.setItem('seven77_db_v2', JSON.stringify(alunos));
    renderizar();
}

function removerAluno(id) {
    if (confirm("Tem certeza? Essa ação não tem volta.")) {
        alunos = alunos.filter(a => a.id != id);
        localStorage.setItem('seven77_db_v2', JSON.stringify(alunos));
        renderizar();
    }
}

// === UTILITÁRIOS ===
function abrirModal() {
    document.getElementById('modal').classList.remove('hidden');
    // Limpa se não for edição (clicou no +)
    if(document.getElementById('modal-titulo').innerText !== "Editar Aluno") {
       limparForm();
    }
}

function fecharModal() {
    document.getElementById('modal').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('modal-titulo').innerText = "Novo Aluno";
        document.getElementById('edit-id').value = "";
        limparForm();
    }, 300);
}

function limparForm() {
    document.getElementById('edit-id').value = "";
    document.getElementById('input-nome').value = "";
    document.getElementById('input-telefone').value = "";
    document.getElementById('input-valor').value = "";
    // Data de hoje padrão
    document.getElementById('input-vencimento').value = new Date().toISOString().split('T')[0];
}

// Iniciar
renderizar();
