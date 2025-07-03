// Classe principal para gerenciar alunos
class ControleAlunos {
    constructor() {
        this.alunos = this.carregarAlunos();
        this.alunoEditando = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderizarAlunos();
        this.atualizarEstatisticas();
        this.carregarAcademias();
    }

    setupEventListeners() {
        // Botões principais
        document.getElementById('btnNovoAluno').addEventListener('click', () => this.abrirModal());
        document.getElementById('btnImportar').addEventListener('click', () => document.getElementById('fileInput').click());
        document.getElementById('fileInput').addEventListener('change', (e) => this.importarExcel(e));

        // Busca e filtros
        document.getElementById('searchInput').addEventListener('input', (e) => this.filtrarAlunos());
        document.getElementById('filterAcademia').addEventListener('change', (e) => this.filtrarAlunos());

        // Modal
        document.getElementById('formAluno').addEventListener('submit', (e) => this.salvarAluno(e));
        document.getElementById('btnCancelar').addEventListener('click', () => this.fecharModal());
        document.querySelector('.close').addEventListener('click', () => this.fecharModal());
        
        // Fechar modal clicando fora
        document.getElementById('modalAluno').addEventListener('click', (e) => {
            if (e.target.id === 'modalAluno') this.fecharModal();
        });

        // Máscara para telefone
        document.getElementById('inputTelefone').addEventListener('input', (e) => {
            e.target.value = this.formatarTelefone(e.target.value);
        });
    }

    // Dados iniciais dos alunos
    obterDadosIniciais() {
        return [
            {
                id: 'al001',
                nome: 'Raylanderson Maycon Souza e Silva',
                telefone: '+55 31 9816-2633',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-05-31',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al002',
                nome: 'Natal Maciel Pedroso Filho',
                telefone: '+55 31 9325-6212',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-05-31',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al003',
                nome: 'Eliane Lopes dos Reis',
                telefone: '+55 31 9325-6212',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-05-31',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al004',
                nome: 'Eduardo Daniel Gomes da Mota',
                telefone: '+55 31 9798-6973',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-05-31',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al005',
                nome: 'Raphael Artur Moreira e Silva',
                telefone: '+55 31 8609-1885',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-05-31',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al006',
                nome: 'Alex Junio Silva de Oliveira',
                telefone: '+55 31 9285-7128',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-01',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al007',
                nome: 'Vitor de Lima Fraga',
                telefone: '+55 31 9380-5587',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-01',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al008',
                nome: 'Luiza Rocha Siqueira',
                telefone: '+55 31 9380-5587',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-01',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al009',
                nome: 'Paulo Henrique Vieira dos Santos',
                telefone: '+55 31 7555-7083',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-01',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al010',
                nome: 'Arthur da Silva Simplicio',
                telefone: '+55 31 8443-5120',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-02',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al011',
                nome: 'Maria de Fátima Santos',
                telefone: '+55 31 8790-6146',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-03',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al012',
                nome: 'David Da Conceição',
                telefone: '+55 31 8586-0191',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-03',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al013',
                nome: 'Natan Soares Ferreira',
                telefone: '+55 31 9372-1775',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-18',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al014',
                nome: 'Rayane',
                telefone: '+55 31 9760-9800',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-06',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al015',
                nome: 'José Lucas Miranda de Barros',
                telefone: '+55 31 7519-6207',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-06',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al016',
                nome: 'Felipe Araujo Guerra',
                telefone: '+55 31 9313-6142',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-04',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al017',
                nome: 'Ana Carolina Vieira dos Santos',
                telefone: '+55 31 9188-3269',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-06',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al018',
                nome: 'David Lorran Alves',
                telefone: '+55 31 9705-5116',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-09',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al019',
                nome: 'Rodrigo Peterson',
                telefone: '+55 31 9652-6246',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-13',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al020',
                nome: 'Layla Carla Lopes da Silva',
                telefone: '+55 31 8796-6617',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-13',
                status: 'inativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al021',
                nome: 'Marcelo Januário',
                telefone: '+55 31 8537-9582',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-13',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al022',
                nome: 'Gleidson Clesio',
                telefone: '+55 31 9816-2633',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-21',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al023',
                nome: 'Fernando Pereira Guerra',
                telefone: '+55 31 7568-6253',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-23',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al024',
                nome: 'Gabriel Henrique Lopes',
                telefone: '+55 31 9290-6703',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-23',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al025',
                nome: 'Daniela de Assis Silva',
                telefone: '+55 31 9421-6539',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-23',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al026',
                nome: 'Claudia Francislene de Souza Silva',
                telefone: '+55 31 9816-2633',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-24',
                status: 'inativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al027',
                nome: 'Rosilene dos Santos Silva',
                telefone: '+55 31 9816-2633',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-24',
                status: 'inativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al028',
                nome: 'Frederico Igor da Silva',
                telefone: '+55 31 8618-7718',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-05-27',
                status: 'inativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al029',
                nome: 'Michelle Cristina de Lima',
                telefone: '+55 31 9380-5587',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-14',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al030',
                nome: 'Lucas de Oliveira Franco',
                telefone: '+55 31 8347-5008',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-06',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al031',
                nome: 'Jéssica da Silva Simplício Leal',
                telefone: '+55 31 8010-5747',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-06',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al032',
                nome: 'Mateus Afonso de Araújo',
                telefone: '+55 31 8534-9448',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al033',
                nome: 'Afonso Ferreira de Araújo',
                telefone: '+55 31 8534-9448',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al034',
                nome: 'Larissa Moraes Costa',
                telefone: '+55 31 9083-4278',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-12',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al035',
                nome: 'Juliana Barboza',
                telefone: '+55 31 9820-0669',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-12',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al036',
                nome: 'Wederson Lisboa',
                telefone: '+55 31 9820-0669',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-12',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al037',
                nome: 'Fabíola Ketlen Lisboa Rossati',
                telefone: '+55 31 9831-9363',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al038',
                nome: 'Karoline Alves Macedo Viterbo',
                telefone: '+55 31 9831-9363',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al039',
                nome: 'Emilly Vitória Alves Pimenta',
                telefone: '+55 31 9583-9125',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al040',
                nome: 'Thalita Keteli de Almeida',
                telefone: '+55 31 9519-7048',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al041',
                nome: 'Bruna Ariane Lopes',
                telefone: '+55 31 9153-8681',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-11',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al042',
                nome: 'Talita Gomes Vieira Santos',
                telefone: '+55 31 8440-2928',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-15',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al043',
                nome: 'Michelle Caroline Oton',
                telefone: '+55 31 9823-1427',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-15',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al044',
                nome: 'Manuella Vales Vitkauskas',
                telefone: '+55 31 9960-0821',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-16',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al045',
                nome: 'José Victor',
                telefone: '+55 31 8303-9961',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-14',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al046',
                nome: 'Marilda dos Santos Vieira Fiau',
                telefone: '+55 31 9731-2536',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-17',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al047',
                nome: 'Maximo dos Santos Fiau',
                telefone: '+55 31 9533-3547',
                academia: 'CONTORNO DO CORPO',
                valor: 120.00,
                vencimento: '2025-06-18',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al048',
                nome: 'Camila de Oliveira Mendes',
                telefone: '+55 31 8010-5747',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-19',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al049',
                nome: 'Wellington',
                telefone: '+55 31 8672-5131',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-20',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            },
            {
                id: 'al050',
                nome: 'Miguel Ângelo de Souza Almeida',
                telefone: '+55 31 9951-9704',
                academia: 'PRATIQUE',
                valor: 89.90,
                vencimento: '2025-06-20',
                status: 'ativo',
                dataCadastro: '2025-01-01'
            }
        ];
    }

    // Carregar alunos do localStorage ou dados iniciais
    carregarAlunos() {
        const dados = localStorage.getItem('controle-alunos');
        if (dados) {
            return JSON.parse(dados);
        } else {
            // Se não há dados salvos, usar dados iniciais
            const dadosIniciais = this.obterDadosIniciais();
            localStorage.setItem('controle-alunos', JSON.stringify(dadosIniciais));
            return dadosIniciais;
        }
    }

    // Salvar alunos no localStorage
    salvarDados() {
        localStorage.setItem('controle-alunos', JSON.stringify(this.alunos));
        this.atualizarEstatisticas();
    }

    // Gerar ID único
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Abrir modal para novo aluno ou edição
    abrirModal(aluno = null) {
        const modal = document.getElementById('modalAluno');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('formAluno');

        if (aluno) {
            title.textContent = '✏️ Editar Aluno';
            this.alunoEditando = aluno;
            this.preencherFormulario(aluno);
        } else {
            title.textContent = '➕ Novo Aluno';
            this.alunoEditando = null;
            form.reset();
            // Data padrão: próximo mês
            const proximoMes = new Date();
            proximoMes.setMonth(proximoMes.getMonth() + 1);
            document.getElementById('inputVencimento').value = proximoMes.toISOString().split('T')[0];
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fechar modal
    fecharModal() {
        document.getElementById('modalAluno').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.alunoEditando = null;
    }

    // Preencher formulário com dados do aluno
    preencherFormulario(aluno) {
        document.getElementById('inputNome').value = aluno.nome;
        document.getElementById('inputTelefone').value = aluno.telefone;
        document.getElementById('inputAcademia').value = aluno.academia;
        document.getElementById('inputValor').value = aluno.valor;
        document.getElementById('inputVencimento').value = aluno.vencimento;
        document.getElementById('inputStatus').value = aluno.status;
    }

    // Salvar aluno (novo ou editado)
    salvarAluno(e) {
        e.preventDefault();
        
        const dados = {
            nome: document.getElementById('inputNome').value.trim(),
            telefone: document.getElementById('inputTelefone').value.trim(),
            academia: document.getElementById('inputAcademia').value.trim(),
            valor: parseFloat(document.getElementById('inputValor').value),
            vencimento: document.getElementById('inputVencimento').value,
            status: document.getElementById('inputStatus').value
        };

        // Validações
        if (!dados.nome || !dados.telefone || !dados.academia || !dados.valor || !dados.vencimento) {
            this.mostrarToast('Por favor, preencha todos os campos!', 'error');
            return;
        }

        if (this.alunoEditando) {
            // Editar aluno existente
            const index = this.alunos.findIndex(a => a.id === this.alunoEditando.id);
            this.alunos[index] = { ...this.alunoEditando, ...dados };
            this.mostrarToast('Aluno atualizado com sucesso!', 'success');
        } else {
            // Novo aluno
            const novoAluno = {
                id: this.gerarId(),
                ...dados,
                dataCadastro: new Date().toISOString().split('T')[0]
            };
            this.alunos.push(novoAluno);
            this.mostrarToast('Aluno cadastrado com sucesso!', 'success');
        }

        this.salvarDados();
        this.renderizarAlunos();
        this.carregarAcademias();
        this.fecharModal();
    }

    // Excluir aluno
    excluirAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) {
            this.alunos = this.alunos.filter(a => a.id !== id);
            this.salvarDados();
            this.renderizarAlunos();
            this.carregarAcademias();
            this.mostrarToast('Aluno excluído com sucesso!', 'success');
        }
    }

    // Renderizar lista de alunos
    renderizarAlunos(alunosFiltrados = null) {
        const container = document.getElementById('alunosGrid');
        const alunos = alunosFiltrados || this.alunos;

        if (alunos.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3>👨‍🎓 Nenhum aluno encontrado</h3>
                    <p>Adicione o primeiro aluno ou ajuste os filtros de busca</p>
                </div>
            `;
            return;
        }

        container.innerHTML = alunos.map(aluno => this.criarCardAluno(aluno)).join('');
    }

    // Criar card do aluno
    criarCardAluno(aluno) {
        const diasVencimento = this.calcularDiasVencimento(aluno.vencimento);
        const statusVencimento = diasVencimento < 0 ? 'vencido' : diasVencimento <= 7 ? 'vencendo' : 'ok';
        
        return `
            <div class="aluno-card glass-card">
                <div class="aluno-header">
                    <div>
                        <div class="aluno-nome">${aluno.nome}</div>
                        <div class="aluno-academia">🏋️ ${aluno.academia}</div>
                    </div>
                    <span class="status-badge status-${aluno.status}">
                        ${aluno.status === 'ativo' ? '✅' : aluno.status === 'inativo' ? '❌' : '⏳'} 
                        ${aluno.status.toUpperCase()}
                    </span>
                </div>
                
                <div class="aluno-info">
                    <div class="info-item">
                        <span class="info-label">📱 Telefone:</span>
                        <span class="info-value">${aluno.telefone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">💰 Mensalidade:</span>
                        <span class="info-value">R$ ${aluno.valor.toFixed(2)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Vencimento:</span>
                        <span class="info-value ${statusVencimento === 'vencido' ? 'text-danger' : statusVencimento === 'vencendo' ? 'text-warning' : ''}">
                            ${this.formatarData(aluno.vencimento)}
                            ${diasVencimento < 0 ? `(${Math.abs(diasVencimento)} dias atrasado)` : 
                              diasVencimento <= 7 ? `(${diasVencimento} dias)` : ''}
                        </span>
                    </div>
                </div>
                
                <div class="aluno-actions">
                    <button class="btn-action btn-whatsapp" onclick="app.enviarWhatsApp('${aluno.id}')">
                        💬 WhatsApp
                    </button>
                    <button class="btn-action btn-edit" onclick="app.editarAluno('${aluno.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-action btn-delete" onclick="app.excluirAluno('${aluno.id}')">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `;
    }

    // Editar aluno
    editarAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (aluno) {
            this.abrirModal(aluno);
        }
    }

    // Filtrar alunos
    filtrarAlunos() {
        const busca = document.getElementById('searchInput').value.toLowerCase();
        const academiaFiltro = document.getElementById('filterAcademia').value;

        let alunosFiltrados = this.alunos;

        // Filtro por busca
        if (busca) {
            alunosFiltrados = alunosFiltrados.filter(aluno =>
                aluno.nome.toLowerCase().includes(busca) ||
                aluno.academia.toLowerCase().includes(busca) ||
                aluno.telefone.includes(busca)
            );
        }

        // Filtro por academia
        if (academiaFiltro) {
            alunosFiltrados = alunosFiltrados.filter(aluno => aluno.academia === academiaFiltro);
        }

        this.renderizarAlunos(alunosFiltrados);
    }

    // Carrega as academias no filtro
    carregarAcademias() {
        const academias = [...new Set(this.alunos.map(aluno => aluno.academia))].sort();
        const select = document.getElementById('filterAcademia');
        
        // Manter o valor selecionado
        const valorAtual = select.value;
        
        select.innerHTML = '<option value="">🏋️ Todas Academias</option>';
        academias.forEach(academia => {
            select.innerHTML += `<option value="${academia}">${academia}</option>`;
        });
        
        select.value = valorAtual;
    }

    // Atualizar estatísticas
    atualizarEstatisticas() {
        const total = this.alunos.length;
        const ativos = this.alunos.filter(a => a.status === 'ativo').length;
        
        document.getElementById('totalAlunos').textContent = total;
        document.getElementById('alunosAtivos').textContent = ativos;
    }

    // Enviar mensagem WhatsApp
    enviarWhatsApp(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (!aluno) return;

        const diasVencimento = this.calcularDiasVencimento(aluno.vencimento);
        let mensagem = '';

        if (diasVencimento < 0) {
            mensagem = `Olá ${aluno.nome}! 👋\n\nSua mensalidade da ${aluno.academia} está em atraso há ${Math.abs(diasVencimento)} dias.\n\nValor: R$ ${aluno.valor.toFixed(2)}\nVencimento: ${this.formatarData(aluno.vencimento)}\n\nPor favor, regularize sua situação. Obrigado!`;
        } else if (diasVencimento <= 7) {
            mensagem = `Olá ${aluno.nome}! 👋\n\nLembrando que sua mensalidade da ${aluno.academia} vence em ${diasVencimento} dias.\n\nValor: R$ ${aluno.valor.toFixed(2)}\nVencimento: ${this.formatarData(aluno.vencimento)}\n\nObrigado!`;
        } else {
            mensagem = `Olá ${aluno.nome}! 👋\n\nSua mensalidade da ${aluno.academia}:\n\nValor: R$ ${aluno.valor.toFixed(2)}\nVencimento: ${this.formatarData(aluno.vencimento)}\n\nObrigado!`;
        }

        const telefone = aluno.telefone.replace(/\D/g, '');
        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }

    // Importar dados do Excel
    async importarExcel(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const data = await this.lerArquivo(file);
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            let importados = 0;
            let erros = 0;

            jsonData.forEach(row => {
                try {
                    // Mapear colunas (aceita diferentes nomes)
                    const aluno = {
                        id: this.gerarId(),
                        nome: row.Nome || row.nome || row.NOME || '',
                        telefone: this.formatarTelefone(String(row.Telefone || row.telefone || row.TELEFONE || '')),
                        academia: row.Academia || row.academia || row.ACADEMIA || '',
                        valor: parseFloat(row.Valor || row.valor || row.VALOR || 0),
                        vencimento: this.formatarDataExcel(row.Vencimento || row.vencimento || row.VENCIMENTO),
                        status: (row.Status || row.status || row.STATUS || 'ativo').toLowerCase(),
                        dataCadastro: new Date().toISOString().split('T')[0]
                    };

                    // Validar dados obrigatórios
                    if (aluno.nome && aluno.telefone && aluno.academia && aluno.valor && aluno.vencimento) {
                        this.alunos.push(aluno);
                        importados++;
                    } else {
                        erros++;
                    }
                } catch (e) {
                    erros++;
                }
            });

            this.salvarDados();
            this.renderizarAlunos();
            this.carregarAcademias();

            this.mostrarToast(`Importação concluída! ${importados} alunos importados${erros > 0 ? `, ${erros} erros` : ''}`, 'success');

        } catch (error) {
            this.mostrarToast('Erro ao importar arquivo. Verifique o formato.', 'error');
        }

        // Limpar input
        event.target.value = '';
    }

    // Ler arquivo
    lerArquivo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        });
    }

    // Utilitários
    formatarTelefone(telefone) {
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length <= 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    }

    formatarData(data) {
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    }

    formatarDataExcel(data) {
        if (!data) return '';
        
        // Se já está no formato correto (YYYY-MM-DD)
        if (typeof data === 'string' && data.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return data;
        }
        
        // Se é uma data do Excel (número)
        if (typeof data === 'number') {
            const date = new Date((data - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }
        
        // Tentar converter string
        try {
            const date = new Date(data);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    }

    calcularDiasVencimento(vencimento) {
        const hoje = new Date();
        const dataVenc = new Date(vencimento + 'T00:00:00');
        const diferenca = dataVenc - hoje;
        return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    }

    mostrarToast(mensagem, tipo = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.textContent = mensagem;

        container.appendChild(toast);

        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Adicionar estilos dinâmicos para status de vencimento
const style = document.createElement('style');
style.textContent = `
    .text-danger { color: #ff4444 !important; }
    .text-warning { color: #ffff00 !important; }
`;
document.head.appendChild(style);

// Inicializar aplicação
const app = new ControleAlunos();

// PWA - Detectar instalação
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar toast para instalação
    setTimeout(() => {
        app.mostrarToast('💡 Instale este app na tela inicial para melhor experiência!', 'info');
    }, 3000);
});

window.addEventListener('appinstalled', (evt) => {
    app.mostrarToast('✅ App instalado com sucesso!', 'success');
});
