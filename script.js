const carrinho = {
    itens: [],
    adicionar(e, t, i, r) {
        const a = this.itens.find(t => t.id === e);
        a ? a.quantidade++ : this.itens.push({
            id: e,
            nome: t,
            preco: i,
            imagem: r,
            quantidade: 1
        });
        this.salvarNoLocalStorage();
        this.atualizarBadgeCarrinho();
        console.log(`${t} adicionado ao carrinho`);
    },
    remover(e) {
        this.itens = this.itens.filter(t => t.id !== e);
        this.salvarNoLocalStorage();
        this.atualizarBadgeCarrinho();
    },
    limpar() {
        this.itens = [];
        this.salvarNoLocalStorage();
        this.atualizarBadgeCarrinho();
    },
    salvarNoLocalStorage() {
        localStorage.setItem("carrinho_drunkflow", JSON.stringify(this.itens));
    },
    carregarDoLocalStorage() {
        const e = localStorage.getItem("carrinho_drunkflow");
        if (e) {
            this.itens = JSON.parse(e);
            this.atualizarBadgeCarrinho();
        }
    },
    atualizarBadgeCarrinho() {
        const e = this.itens.reduce((e, t) => e + t.quantidade, 0);
        const t = document.getElementById("carrinho-badge");
        if (t) {
            t.textContent = e;
            t.style.display = e > 0 ? "block" : "none";
        }
    },
    calcularTotal() {
        return this.itens.reduce((e, t) => e + t.preco * t.quantidade, 0);
    },
    obterResumo() {
        return {
            quantidade: this.itens.length,
            itens: this.itens,
            total: this.calcularTotal()
        };
    }
};

const galeria = {
    abrirLightbox(e, t) {
        let i = document.getElementById("lightbox");
        if (!i) {
            i = this.criarLightbox();
        }
        document.getElementById("lightbox-imagem").src = e;
        document.getElementById("lightbox-titulo").textContent = t;
        i.classList.add("ativo");
    },
    fecharLightbox() {
        const e = document.getElementById("lightbox");
        if (e) {
            e.classList.remove("ativo");
        }
    },
    criarLightbox() {
        const e = document.createElement("div");
        e.id = "lightbox";
        e.className = "lightbox";
        e.innerHTML = `
            <div class="lightbox-conteudo">
                <button class="lightbox-fechar" onclick="galeria.fecharLightbox()">&times;</button>
                <img id="lightbox-imagem" src="" alt="Produto em destaque">
                <h3 id="lightbox-titulo"></h3>
            </div>
        `;
        e.addEventListener("click", t => {
            if (t.target === e) {
                this.fecharLightbox();
            }
        });
        document.addEventListener("keydown", t => {
            if (t.key === "Escape") {
                this.fecharLightbox();
            }
        });
        document.body.appendChild(e);
        return e;
    }
};

const filtros = {
    filtrarPorPreco(e, t) {
        document.querySelectorAll(".produto").forEach(i => {
            const r = parseFloat(i.querySelector(".preco")?.textContent.replace("R$", "").trim() || 0);
            if (r >= e && r <= t) {
                i.style.display = "block";
            } else {
                i.style.display = "none";
            }
        });
    },
    buscarPorNome(e) {
        const t = e.toLowerCase();
        document.querySelectorAll(".produto").forEach(e => {
            const i = e.querySelector("h4")?.textContent.toLowerCase() || "";
            const r = e.querySelector(".produto-descricao")?.textContent.toLowerCase() || "";
            if (i.includes(t) || r.includes(t)) {
                e.style.display = "block";
            } else {
                e.style.display = "none";
            }
        });
    },
    resetarFiltros() {
        document.querySelectorAll(".produto").forEach(e => {
            e.style.display = "block";
        });
    }
};

const formulario = {
    validarEmail(e) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    },
    validarFormularioContato() {
        const e = document.getElementById("nome")?.value.trim();
        const t = document.getElementById("email")?.value.trim();
        const i = document.getElementById("mensagem")?.value.trim();
        if (!e || e.length < 3) {
            alert("Por favor, digite um nome válido (mínimo 3 caracteres)");
            return false;
        }
        if (!t || !this.validarEmail(t)) {
            alert("Por favor, digite um e-mail válido");
            return false;
        }
        if (!i || i.length < 10) {
            alert("Por favor, digite uma mensagem (mínimo 10 caracteres)");
            return false;
        }
        return true;
    },
    submeterFormulario(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.validarFormularioContato()) {
            alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
            document.querySelector(".form-contato")?.reset();
            return true;
        }
        return false;
    }
};

const animacoes = {
    contadorAnimado(e, t, i = 1000) {
        const r = document.getElementById(e);
        if (r) {
            let a = 0;
            const o = t / (i / 16);
            const interval = setInterval(() => {
                a += o;
                if (a >= t) {
                    r.textContent = t;
                    clearInterval(interval);
                } else {
                    r.textContent = Math.floor(a);
                }
            }, 16);
        }
    },
    revelarAoScroll() {
        const e = new IntersectionObserver(t => {
            t.forEach(t => {
                if (t.isIntersecting) {
                    t.target.classList.add("revelado");
                    e.unobserve(t.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll("[data-aos]").forEach(t => {
            e.observe(t);
        });
    }
};

document.addEventListener("DOMContentLoaded", function() {
    carrinho.carregarDoLocalStorage();
    animacoes.revelarAoScroll();
    carrinho.atualizarBadgeCarrinho();
    console.log("DrunkFlow - Script carregado!");
});

function formatarMoeda(e) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(e);
}

function formatarData(e) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(e);
}

function criarSlug(e) {
    return e.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
}
// Busca em tempo real
document.getElementById('search-input')?.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    if (resultsDiv) {
        if (query.length > 2) {
            // Busca real nos produtos
            const produtos = document.querySelectorAll('.produto h4, .produto .produto-descricao');
            let suggestions = [];
            produtos.forEach(prod => {
                const text = prod.textContent.toLowerCase();
                if (text.includes(query) && !suggestions.includes(text)) {
                    suggestions.push(text);
                }
            });
            resultsDiv.innerHTML = suggestions.slice(0, 5).map(s => `<div onclick="filtros.buscarPorNome('${s}')">${s}</div>`).join('');
            resultsDiv.style.display = 'block';
        } else {
            resultsDiv.style.display = 'none';
        }
    }
});

// Botão de carrinho - abre modal
document.getElementById('cart-btn')?.addEventListener('click', function() {
    abrirCarrinhoModal();
});

// Botão de login
document.getElementById('login-btn')?.addEventListener('click', function() {
    window.location.href = 'login.html';
});

// Função para abrir modal do carrinho
function abrirCarrinhoModal() {
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="fecharModal()">&times;</span>
            <h2>Carrinho de Compras</h2>
            <div id="cart-items"></div>
            <p>Total: <span id="cart-total"></span></p>
            <button onclick="finalizarPedido()">Finalizar Pedido</button>
        </div>
    `;
    document.body.appendChild(modal);
    atualizarModalCarrinho();
    modal.style.display = 'block';
}

// Atualizar conteúdo do modal
function atualizarModalCarrinho() {
    const itemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    if (itemsDiv && totalSpan) {
        itemsDiv.innerHTML = carrinho.itens.map(item => `
            <div class="cart-item">
                <span>${item.nome} - ${item.quantidade}x</span>
                <span>${formatarMoeda(item.preco * item.quantidade)}</span>
                <button onclick="carrinho.remover('${item.id}')">Remover</button>
            </div>
        `).join('');
        totalSpan.textContent = formatarMoeda(carrinho.calcularTotal());
    }
}

// Fechar modal
function fecharModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.remove();
    }
}

// Finalizar pedido
function finalizarPedido() {
    if (carrinho.itens.length === 0) {
        alert('Carrinho vazio!');
    } else {
        alert('Pedido finalizado! Total: ' + formatarMoeda(carrinho.calcularTotal()));
        carrinho.limpar();
        fecharModal();
    }
}

// Adicionar produto ao carrinho (exemplo para botões)
function adicionarAoCarrinho(id, nome, preco, imagem) {
    carrinho.adicionar(id, nome, preco, imagem);
}