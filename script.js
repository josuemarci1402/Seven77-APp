// === CONFIGURAÇÃO DO SUPABASE ===
const SUPABASE_URL = 'https://mszivaeyfajiwndfezzz.supabase.co';
// GARANTA QUE ESTA É A CHAVE 'ANON' INTEIRA QUE VOCÊ COPIOU:
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeml2YWV5ZmFqaXduZGZlenp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDY3ODYsImV4cCI6MjA4NDQyMjc4Nn0.xP6GLOCZOibYtlsV1HgD50QNNCbxiPaS9oXuoOJME1Q';

// Inicializa a conexão
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variável local
let alunos = [];

// === MENSAGENS ===
const msgCobrar = (nome) => encodeURIComponent(`⚠️ Atenção ${nome} ⚠️\n\nSua mensalidade está em aberto.\nPara evitar o Bloqueio automático do sistema, efetue o pagamento.\n\n💳 Chave Pix: 31991639752\n📩 Comprovante deve ser enviado por aqui.\n🔗 NÃO SE ESQUEÇA DE ENVIAR SEU E-MAIL E SENHA DO APLICATIVO PARA RENOVAÇÃO\n\nEqpSeven🛸`);
const msgOla = (nome) => encodeURIComponent(`Olá ${nome}, tudo bem? 🛸\nPassando para saber como estão os treinos na SEVEN77!`);

// === 1. BUSCAR DADOS (READ) ===
async function renderizar() {
    const lista = document.getElementById('lista-alunos');
    const termo = document.getElementById('busca').value.toLowerCase();
    
    // Tenta conectar
    const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('vencimento', { ascending: true });

    if (error) {
        alert('ERRO DE CONEXÃO: ' + error.message); // AVISA SE A CONEXÃO FALHAR
        console.error(error);
        return;
    }

    alunos = data; 
    lista.innerHTML = '';
    
    let totalReceita = 0, contaAtivos = 0, contaVencidos = 0;
    
    alunos.forEach(aluno => {
        if (!aluno.nome.toLowerCase().includes(termo)) return;

        // Datas
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        const dataVenc = new Date(aluno.vencimento + "T00:00:00");
        
        const isVencido = hoje > dataVenc;
        const diffTime = dataVenc - hoje;
        const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if(isVencido) contaVencidos++;
        else contaAtivos++;
        totalReceita += parseFloat(aluno.valor);

        // Visual
        const borderClass = isVencido ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-500/5' : 'border-white/5';
        let statusColor = isVencido ? 'text-red-500' : 'text-green-500';
        let statusTexto = isVencido ? 'VENCIDO' : `VENCE EM ${diasRestantes} DIAS`;
        if (diasRestantes === 0 && !isVencido) { statusColor = 'text-yellow-500'; statusTexto = 'VENCE HOJE'; }

        const dia = dataVenc.getDate().toString().padStart(2, '0');
        const mes = (dataVenc.getMonth() + 1).toString().padStart(2, '0');

        const card = document.createElement('div');
        card.className = `glass p-5 rounded-[2rem] flex flex-col gap-4 border transition hover:bg-white/[0.02] ${borderClass}`;
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
                            <span class="text-[10px] font-black uppercase ${statusColor} bg-black/40 px-2 py-1 rounded-lg border border-white/5">${statusTexto}</span>
                            <span class="text-[11px] text-gray-400 font-bold">R$ ${parseFloat(aluno.valor).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 mt-1">
                <a href="https://wa.me/55${aluno.telefone}?text=${isVencido ? msgCobrar(aluno.nome) : msgOla(aluno.nome)}" target="_blank"
                   class="col-span-1 h-10 rounded-xl flex items-center justify-center transition ${isVencido ? 'bg-red-500 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-green-500'}">
                   <i class="fab fa-whatsapp text-lg"></i>
                </a>
                <button onclick="renovarAluno(${aluno.id}, '${aluno.vencimento}', '${aluno.nome}')" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white transition"><i class="fas fa-sync-alt text-sm"></i></button>
                <button onclick="editarAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-400 hover:bg-purple-500 hover:text-white transition"><i class="fas fa-pen text-sm"></i></button>
                <button onclick="removerAluno(${aluno.id})" class="col-span-1 h-10 rounded-xl bg-white/5 text-gray-600 hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash text-sm"></i></button>
            </div>
        `;
        lista.appendChild(card);
    });

    document.getElementById('stat-ativos').innerText = contaAtivos;
    document.getElementById('stat-vencidos').innerText = contaVencidos;
    document.getElementById('stat-receita').innerText = totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// === 2. SALVAR COM DIAGNÓSTICO ===
async function salvarAluno() {
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('input-nome').value.toUpperCase();
    const telefone = document.getElementById('input-telefone').value.replace(/\D/g, '');
    const valor = document.getElementById('input-valor').value;
    const vencimento = document.getElementById('input-vencimento').value;

    if (!nome || !valor || !vencimento) return alert("Preencha os campos!");

    const btn = document.querySelector('#modal button.grad-purple');
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testando...';
    btn.disabled = true;

    try {
        let error;
        if (id) {
            const { error: err } = await supabase.from('alunos').update({ nome, telefone, valor, vencimento }).eq('id', id);
            error = err;
        } else {
            const { error: err } = await supabase.from('alunos').insert([{ nome, telefone, valor, vencimento }]);
            error = err;
        }

        if (error) {
            throw error; // Joga o erro para o alerta
        }

        alert("SUCESSO! Aluno salvo."); // Confirmação visual
        fecharModal();
        renderizar();

    } catch (err) {
        alert('ERRO AO SALVAR: ' + err.message + '\n\nVerifique se o banco foi destravado.');
        console.error(err);
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

// === OUTRAS FUNÇÕES ===
async function renovarAluno(id, dataAtualStr, nome) {
    if(!confirm(`Confirmar pagamento de ${nome}?`)) return;
    const dataAtual = new Date(dataAtualStr + "T00:00:00");
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    const novaData = dataAtual.toISOString().split('T')[0];
    const { error } = await supabase.from('alunos').update({ vencimento: novaData }).eq('id', id);
    if (error) alert('Erro: ' + error.message); else renderizar();
}

async function removerAluno(id) {
    if (confirm("Apagar permanentemente?")) {
        const { error } = await supabase.from('alunos').delete().eq('id', id);
        if (error) alert('Erro: ' + error.message); else renderizar();
    }
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

function abrirModal() { document.getElementById('modal').classList.remove('hidden'); if(document.getElementById('modal-titulo').innerText !== "Editar Aluno") limparForm(); }
function fecharModal() { document.getElementById('modal').classList.add('hidden'); setTimeout(() => { document.getElementById('modal-titulo').innerText = "Novo Aluno"; document.getElementById('edit-id').value = ""; limparForm(); }, 300); }
function limparForm() { document.getElementById('edit-id').value = ""; document.getElementById('input-nome').value = ""; document.getElementById('input-telefone').value = ""; document.getElementById('input-valor').value = ""; document.getElementById('input-vencimento').value = new Date().toISOString().split('T')[0]; }

renderizar();
