const menuData = [
    {
        category: "Hambúrgueres Especiais",
        items: [
            { id: 1, name: "Hambúrguer Gigante", desc: "Pão artesanal, muito queijo e ingredientes selecionados para matar a sua fome.", price: 35.00, img: "images/amburguergigante.jpg" },
            { id: 2, name: "Big Burger Clássico", desc: "O clássico que nunca falha. Carne suculenta, queijo derretido e molho especial.", price: 28.00, img: "images/bigburger.jpg" }
        ]
    },
    {
        category: "Pratos & Saudáveis",
        items: [
            { id: 3, name: "Frango Assado", desc: "Delicioso frango temperado e assado, com um sabor irresistível.", price: 26.00, img: "images/frango.jpg" },
            { id: 4, name: "Salada Fresca", desc: "Opção leve e saudável. Folhas frescas, tomate e ingredientes selecionados.", price: 18.00, img: "images/salada.jpg" }
        ]
    }
];

let currentItem = null;
let currentQty = 1;
let cart = []; 

function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    menuData.forEach(categoryGroup => {
        const catTitle = document.createElement('h3');
        catTitle.className = 'category-title';
        catTitle.innerText = categoryGroup.category;
        container.appendChild(catTitle);

        categoryGroup.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(item); 
            
            card.innerHTML = `
                <div class="product-info">
                    <div class="product-title">${item.name}</div>
                    <div class="product-desc">${item.desc}</div>
                    <div class="product-price">${formatPrice(item.price)}</div>
                </div>
                <img src="${item.img}" alt="${item.name}" class="product-img">
            `;
            container.appendChild(card);
        });
    });
}

function openModal(item) {
    currentItem = item;
    currentQty = 1; 

    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-price').innerText = formatPrice(item.price);
    document.getElementById('obs').value = ''; 

    updateModalFooter();
    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function changeQty(amount) {
    if (currentQty + amount >= 1) {
        currentQty += amount;
        updateModalFooter();
    }
}

function updateModalFooter() {
    document.getElementById('modal-qty').innerText = currentQty;
    const total = currentItem.price * currentQty;
    document.getElementById('modal-add-btn').innerText = `Adicionar ${formatPrice(total)}`;
}


// --- FUNÇÕES DO CARRINHO ---

function addToCart() {
    const obsText = document.getElementById('obs').value.trim();
    const cartItemId = Date.now(); 

    cart.push({
        cartItemId: cartItemId,
        item: currentItem,
        qty: currentQty,
        obs: obsText
    });

    closeModal();
    updateCartUI();
}

function updateCartUI() {
    const floatingBtn = document.getElementById('cart-floating-btn');
    if (cart.length === 0) {
        floatingBtn.style.display = 'none'; 
        return;
    }
    floatingBtn.style.display = 'block'; 

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(cartItem => {
        totalItems += cartItem.qty;
        totalPrice += (cartItem.item.price * cartItem.qty);
    });

    document.getElementById('cart-btn-qty').innerText = totalItems;
    document.getElementById('cart-btn-total').innerText = formatPrice(totalPrice);
}

function openCartModal() {
    renderCartItems();
    document.getElementById('cart-modal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px; color: #777;">Seu carrinho está vazio.</p>';
        document.getElementById('cart-modal-total').innerText = formatPrice(0);
        return;
    }

    let totalPrice = 0;

    cart.forEach(cartItem => {
        totalPrice += (cartItem.item.price * cartItem.qty);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        const obsHtml = cartItem.obs ? `<div class="cart-item-obs">Obs: ${cartItem.obs}</div>` : '';

        itemDiv.innerHTML = `
            <img src="${cartItem.item.img}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${cartItem.item.name}</div>
                ${obsHtml}
                <div class="cart-item-price">${formatPrice(cartItem.item.price * cartItem.qty)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="qty-control" style="height: 35px;">
                    <button class="qty-btn" style="width:30px; font-size:18px;" onclick="changeCartItemQty(${cartItem.cartItemId}, -1)">-</button>
                    <div class="qty-display" style="width:30px;">${cartItem.qty}</div>
                    <button class="qty-btn" style="width:30px; font-size:18px;" onclick="changeCartItemQty(${cartItem.cartItemId}, 1)">+</button>
                </div>
                <button class="cart-remove-btn" onclick="removeFromCart(${cartItem.cartItemId})">Remover</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    document.getElementById('cart-modal-total').innerText = formatPrice(totalPrice);
}

function changeCartItemQty(cartItemId, amount) {
    const cartItem = cart.find(ci => ci.cartItemId === cartItemId);
    if (cartItem) {
        if (cartItem.qty + amount >= 1) {
            cartItem.qty += amount;
            renderCartItems();
            updateCartUI();
        }
    }
}

function removeFromCart(cartItemId) {
    cart = cart.filter(ci => ci.cartItemId !== cartItemId);
    renderCartItems();
    updateCartUI();
    if (cart.length === 0) closeCartModal();
}

// --- FUNÇÕES DE CHECKOUT ---

function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    closeCartModal(); // Fecha o carrinho
    document.getElementById('checkout-modal').style.display = 'flex'; // Abre tela do endereço
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Lógica para alternar entre PIX e DINHEIRO
const radios = document.getElementsByName('pagamento');
radios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Dinheiro') {
            document.getElementById('div-troco').style.display = 'block';
            document.getElementById('div-pix').style.display = 'none';
        } else {
            document.getElementById('div-troco').style.display = 'none';
            document.getElementById('div-pix').style.display = 'block';
        }
    });
});

// FUNÇÃO QUE MONTA A MENSAGEM DO WHATSAPP
function sendWhatsAppOrder() {
    // 1. Pegar todos os valores preenchidos no formulário
    const nome = document.getElementById('chk-nome').value.trim();
    const telefone = document.getElementById('chk-telefone').value.trim();
    const bairro = document.getElementById('chk-bairro').value.trim();
    const rua = document.getElementById('chk-rua').value.trim();
    const numero = document.getElementById('chk-numero').value.trim();
    const complemento = document.getElementById('chk-complemento').value.trim();
    const referencia = document.getElementById('chk-referencia').value.trim();
    const troco = document.getElementById('chk-troco').value.trim();
    
    // Descobrir qual forma de pagamento foi selecionada
    let formaPagamento = "Pix";
    if (document.querySelector('input[name="pagamento"]:checked')) {
        formaPagamento = document.querySelector('input[name="pagamento"]:checked').value;
    }

    // 2. Validação simples para ver se os campos obrigatórios foram preenchidos
    if(!nome || !telefone || !bairro || !rua || !numero) {
        alert("Por favor, preencha todos os campos com asterisco (*).");
        return; // Interrompe a função aqui caso falte dados
    }

    // Gerador de número de pedido aleatório (ex: #5894)
    const numeroPedido = Math.floor(1000 + Math.random() * 9000);

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let totalPedido = 0;

    // 3. Montando a mensagem para o WhatsApp
    let msg = `*🍔 Red Burger & Cia*\n`;
    msg += `*PEDIDO #${numeroPedido}*\n`;
    msg += `🗓️ *Data:* ${dataFormatada} às ${horaFormatada}\n`;
    msg += `---------------------------------------\n\n`;

    cart.forEach(cartItem => {
        const totalItem = cartItem.item.price * cartItem.qty;
        totalPedido += totalItem;
        msg += `🔸 ${cartItem.qty}x *${cartItem.item.name}* - ${formatPrice(totalItem)}\n`;
        if (cartItem.obs) {
            msg += `   ↳ _Obs: ${cartItem.obs}_\n`;
        }
    });

    msg += `\n---------------------------------------\n`;
    msg += `💰 *TOTAL A PAGAR: ${formatPrice(totalPedido)}*\n\n`;
    
    msg += `👤 *Dados do Cliente*\n`;
    msg += `*Nome:* ${nome}\n`;
    msg += `*Telefone:* ${telefone}\n`;
    
    msg += `\n📍 *Endereço de Entrega*\n`;
    msg += `${rua}, Nº ${numero}, Bairro: ${bairro}\n`;
    if(complemento) msg += `*Comp:* ${complemento}\n`;
    if(referencia) msg += `*Ref:* ${referencia}\n`;

    msg += `\n💳 *Pagamento:* ${formaPagamento}\n`;
    
    // Se for dinheiro mostra troco, se for pix mostra a chave
    if (formaPagamento === 'Dinheiro') {
        if(troco) msg += `💵 *Troco para:* ${troco}\n`;
        else msg += `💵 *Troco:* Não precisa\n`;
    } else {
        msg += `🔑 *Chave Pix (CPF):* 10702617261\n`;
    }

    // O número final do WhatsApp
    const numeroWhatsApp = "5591985303850";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(msg)}`;

    // Resetar carrinho e fechar tudo
    cart = [];
    closeCheckoutModal();
    updateCartUI();

    // Redireciona o cliente pro WhatsApp
    window.open(urlWhatsApp, '_blank');
}

// Fechar os modais ao clicar na área escura
document.getElementById('product-modal').addEventListener('click', function(e) { if(e.target === this) closeModal(); });
document.getElementById('cart-modal').addEventListener('click', function(e) { if(e.target === this) closeCartModal(); });
document.getElementById('checkout-modal').addEventListener('click', function(e) { if(e.target === this) closeCheckoutModal(); });

renderMenu();
                               
