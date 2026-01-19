// Recupera dados ou inicia lista vazia
let alunos = JSON.parse(localStorage.getItem('seven77_db')) || [];

// Mensagem Padrão de Cobrança
const msgTemplate = (nome) => encodeURIComponent(`⚠️ Atenção ${nome} ⚠️\n\nSua mensalidade está em aberto.\nPara evitar o Bloqueio automático do sistema, efetue o pagamento.\n\n💳 Chave Pix: 31991639752\n📩 Comprovante deve ser enviado por aqui.\n🔗 NÃO ESQUEÇA DE ENVIAR E-MAIL E SENHA PARA RENOVAÇÃO\n\nEqpSeven🛸`);

function renderizar() {
    const lista = document.getElementById('lista-alunos');
    const busca = document.getElementById('busca').value.toLowerCase();
    const hoje = new Date().getDate(); // Dia de hoje (1-31)
    
    lista.innerHTML = '';
    let totalAtivos = 0;
    let totalVencidos = 0;
    let receita = 0;

    alunos.forEach(aluno => {
        // Lógica de Vencimento Automático:
        // Se o dia de hoje for maior que o dia do vencimento, marca como vencido
        let isVencido = hoje > parseInt(aluno.vencimento);
        // Opcional: Adicionar lógica de mês, mas para simplificar vamos usar o dia corrente
        
        let status = isVencido ? 'Vencido' : 'Ativo';
        
        // Contabiliza Stats
        if (isVencido) {
            totalVencidos++;
        } else {
            totalAtivos++;
            receita += parseFloat(aluno.valor); // Soma receita apenas de quem tá em dia (ou mude para somar tudo se preferir)
        }

        // Filtro de Busca
        if (!aluno.nome.toLowerCase().includes(busca)) return;

        const card = document.createElement('div');
        card.className = `glass p-4 rounded-[1.5rem] flex justify-between items-center border ${isVencido ? 'border-red-500/30 bg-red-500/5' : 'border-white/5'} transition hover:bg-white/5`;
        
        card.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#1A1D24] flex flex-col items-center justify-center border border-white/5">
                    <span class="text-[10px] text-gray-500 font-bold uppercase">Dia</span>
                    <span class="text-lg font-black text-white leading-none">${aluno.vencimento}</span>
                </div>
                <div>
                    <h4 class="font-bold text-white text-sm tracking-wide">${aluno.nome}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] font-black uppercase ${isVencido ? 'text-red-500' : 'text-green-500'} bg-black/30 px-2 py-0.5 rounded-md">
                            ${status}
                        </span>
                        <span class="text-[10px] text-gray-400 font-bold">R$ ${parseFloat(aluno.valor).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-2">
                ${isVencido ? `
                    <a href="https://wa.me/55${aluno.telefone}?text=${msgTemplate(aluno.nome)}" target="_blank" 
                       class="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-900/50 hover:scale-110 transition">
                        <i class="fab fa-whatsapp text-lg"></i>
                    </a>
                ` : ''}
                <button onclick="removerAluno(${aluno.id})" class="w-10 h-10 rounded-xl bg-[#1A1D24] text-gray-500 flex items-center justify-center hover:text-red-500 hover:bg-red-500/10 transition">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        `;
        lista.appendChild(card);
    });

    // Atualiza Painel
    document.getElementById('stat-ativos').innerText = totalAtivos;
    document.getElementById('stat-vencidos').innerText = totalVencidos;
    document.getElementById('stat-receita').innerText = receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function adicionarAluno() {
    const nome = document.getElementById('novo-nome').value;
    const telefone = document.getElementById('novo-telefone').value;
    const valor = document.getElementById('novo-valor').value;
    const vencimento = document.getElementById('novo-vencimento').value;

    if (!nome || !valor || !vencimento) return alert("Preencha todos os campos!");

    const novoAluno = {
        id: Date.now(),
        nome: nome.toUpperCase(),
        telefone: telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
        valor: valor,
        vencimento: vencimento
    };

    alunos.push(novoAluno);
    localStorage.setItem('seven77_db', JSON.stringify(alunos));
    
    fecharModal();
    renderizar();
    
    // Limpar campos
    document.getElementById('novo-nome').value = '';
    document.getElementById('novo-telefone').value = '';
    document.getElementById('novo-valor').value = '';
    document.getElementById('novo-vencimento').value = '';
}

function removerAluno(id) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        alunos = alunos.filter(a => a.id !== id);
        localStorage.setItem('seven77_db', JSON.stringify(alunos));
        renderizar();
    }
}

function abrirModal() { document.getElementById('modal').classList.remove('hidden'); }
function fecharModal() { document.getElementById('modal').classList.add('hidden'); }

// Inicializa
renderizar();
