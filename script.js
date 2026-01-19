// Recupera dados do banco local
let alunos = JSON.parse(localStorage.getItem('seven77_db_v2')) || [];

// === MENSAGEM DE COBRANÇA OFICIAL ===
const msgCobrar = (nome) => encodeURIComponent(`⚠️ Atenção ${nome} ⚠️

Sua mensalidade está em aberto.
Para evitar o Bloqueio automático do sistema, efetue o pagamento.

💳 Chave Pix: 31991639752
📩 Comprovante deve ser enviado por aqui.
🔗 NÃO SE ESQUEÇA DE ENVIAR SEU E-MAIL E SENHA DO APLICATIVO PARA RENOVAÇÃO 

EqpSeven🛸`);

// Mensagem para quem está em dia (Opcional)
const msgOla = (nome) => encodeURIComponent(`Olá ${nome}, tudo bem? 🛸\nPassando para saber como estão os treinos na SEVEN77!`);

function renderizar() {
    const lista = document.getElementById('lista-alunos');
    const termo = document.getElementById('busca').value.toLowerCase();
    
    lista.innerHTML = '';
    let totalReceita = 0, contaAtivos = 0, contaVencidos = 0;
    
    // Ordena: Vencidos aparecem primeiro na lista
    alunos.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));

    alunos.forEach(aluno => {
        if (!aluno.nome.toLowerCase().includes(termo)) return;

        // Cálculo Inteligente de Data
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        // Ajuste de fuso horário simples adicionando T00:00:00
        const dataVenc = new Date(aluno.vencimento + "T00:00:00");
        
        const isVencido = hoje > dataVenc;
        // Calcula diferença em dias
        const diffTime = dataVenc - hoje;
        const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Estatísticas
        if(isVencido) contaVencidos++;
        else contaAtivos++;
        totalReceita += parseFloat(aluno.valor);

        // Define Cores e Status
        const borderClass = isVencido ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-500/5' : 'border-white/5';
        let statusColor = 'text-green-500';
        let statusTexto = `VENCE EM ${diasRestantes} DIAS`;

        if (isVencido) {
            statusColor = 'text-red-500';
            statusTexto = 'VENCIDO';
        } else if (diasRestantes === 0) {
            statusColor = 'text-yellow-500';
            statusTexto = 'VENCE HOJE';
        } else if (diasRestantes < 0) {
            // Caso de segurança
            statusTexto = 'VENCIDO';
        }

        const card = document.createElement('div');
        card.className = `glass p-5 rounded-[2rem] flex flex-col gap-4 border transition hover:bg-white/[0.02] ${borderClass}`;
        
        // Formatação da Data (Dia/Mês)
        const dia = dataVenc.getDate().toString().padStart(2, '0');
        const mes = (dataVenc.getMonth() + 1).toString().padStart(2, '0');

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-[#16181c] flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span class="text-[10px] text-gray-500 font-bold uppercase">Vence</span>
                        <span class="text-lg font-black text-white leading-none">${dia}</span>
                        <span class="text-[8px] text-gray-600 font-bold uppercase">${mes}</span>
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

            <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 mt-1">
                
                <a href="https://wa.me/55${aluno.telefone}?text=${isVencido ? msgCobrar(aluno.nome) : msgOla(aluno.nome)}" target="_blank"
                   class="col-span-1 h-10 rounded-xl flex items-center justify-center transition ${isVencido ? 'bg-red-500 text-white shadow-lg shadow-red-900/50 hover:scale-105' : 'bg-white/5 text-gray-400 hover:bg-green-500 hover:text-white'}">
                   <i class="fab fa-whatsapp text-lg"></i>
                </a>

                <button onclick="renovarAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center" title="Confirmar Pagamento">
                    <i class="fas fa-sync-alt text-sm"></i>
                </button>

                <button onclick="editarAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-purple-500 hover:text-white transition flex items-center justify-center" title="Editar Dados">
                    <i class="fas fa-pen text-sm"></i>
                </button>

                <button onclick="removerAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-600 hover:bg-red-500 hover:text-white transition flex items-center justify-center" title="Excluir">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        `;
        lista.appendChild(card);
    });

    // Atualiza o Painel Superior
    document.getElementById('stat-ativos').innerText = contaAtivos;
    document.getElementById('stat-vencidos').innerText = contaVencidos;
    document.getElementById('stat-receita').innerText = totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// === FUNÇÕES DO SISTEMA ===

function salvarAluno() {
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('input-nome').value;
    const tel = document.getElementById('input-telefone').value.replace(/\D/g, ''); // Remove traços/espaços
    const valor = document.getElementById('input-valor').value;
    const data = document.getElementById('input-vencimento').value;

    if (!nome || !valor || !data) return alert("Preencha nome, valor e vencimento!");

    if (id) {
        // Modo Edição
        const index = alunos.findIndex(a => a.id == id);
        if (index > -1) {
            alunos[index] = { ...alunos[index], nome: nome.toUpperCase(), telefone: tel, valor, vencimento: data };
        }
    } else {
        // Modo Novo Aluno
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
    
    // Confirmação simples
    if(!confirm(`Confirmar pagamento de ${alunos[index].nome}?`)) return;

    // Adiciona 1 mês na data de vencimento atual
    const dataAtual = new Date(alunos[index].vencimento + "T00:00:00");
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    
    // Salva a nova data
    alunos[index].vencimento = dataAtual.toISOString().split('T')[0];
    localStorage.setItem('seven77_db_v2', JSON.stringify(alunos));
    renderizar();
}

function removerAluno(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
        alunos = alunos.filter(a => a.id != id);
        localStorage.setItem('seven77_db_v2', JSON.stringify(alunos));
        renderizar();
    }
}

// === UTILITÁRIOS DE MODAL ===
function abrirModal() {
    document.getElementById('modal').classList.remove('hidden');
    if(document.getElementById('modal-titulo').innerText !== "Editar Aluno") {
       limparForm();
    }
}

function fecharModal() {
    document.getElementById('modal').classList.add('hidden');
    // Reseta o modal para o estado "Novo" após fechar
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
    // Padrão: Data de hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('input-vencimento').value = hoje;
}

// Inicia o sistema
renderizar();
