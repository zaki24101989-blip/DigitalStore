// ====================== بيانات المنتجات ======================
const products = [
    {
        id: 1,
        title: "قالب موقع إلكتروني احترافي",
        price: 149,
        category: "digital",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop",
        description: "قالب HTML حديث ومتجاوب جاهز للاستخدام. يتضمن صفحات متعددة وتصميم أنيق.",
        type: "رقمي"
    },
    {
        id: 2,
        title: "دورة تطوير الويب الكاملة",
        price: 299,
        category: "digital",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=350&fit=crop",
        description: "دورة شاملة لتعلم HTML, CSS, JavaScript و React من الصفر حتى الاحتراف.",
        type: "رقمي"
    },
    {
        id: 3,
        title: "كتاب إلكتروني: ريادة الأعمال",
        price: 79,
        category: "digital",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=350&fit=crop",
        description: "دليل عملي لبدء مشروعك الخاص وتحقيق النجاح في عالم الأعمال.",
        type: "رقمي"
    },
    {
        id: 4,
        title: "سماعات لاسلكية عالية الجودة",
        price: 450,
        category: "physical",
        image: "https://images.unsplash.com/photo-1505740420928-61764811d1b8?w=500&h=350&fit=crop",
        description: "سماعات بلوتوث بتقنية إلغاء الضوضاء وصوت نقي، بطارية تدوم 30 ساعة.",
        type: "واقعي"
    },
    {
        id: 5,
        title: "ساعة ذكية رياضية",
        price: 680,
        category: "physical",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=350&fit=crop",
        description: "ساعة ذكية مقاومة للماء مع تتبع اللياقة القلبية والرياضة.",
        type: "واقعي"
    },
    {
        id: 6,
        title: "حقيبة لابتوب جلدية",
        price: 320,
        category: "physical",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=350&fit=crop",
        description: "حقيبة أنيقة من الجلد الطبيعي تناسب أجهزة اللابتوب حتى 15 بوصة.",
        type: "واقعي"
    }
];

// ====================== رقم واتساب ديالك (غير الرقم هنا) ======================
const WHATSAPP_NUMBER = "2126XXXXXXXX"; // مثال: 212612345678 (بدون + ولا مسافات)

// ====================== حالة التطبيق ======================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ====================== عناصر DOM ======================
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const filterBtns = document.querySelectorAll('.filter-btn');

// ====================== عرض المنتجات ======================
function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <span class="product-badge ${product.category === 'digital' ? 'badge-digital' : 'badge-physical'}">
                    ${product.type}
                </span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price} درهم</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="showProduct(${product.id})">
                        التفاصيل
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// ====================== إضافة للسلة ======================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    alert(`تم إضافة "${product.title}" إلى السلة`);
}

// ====================== تحديث واجهة السلة ======================
function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px 0;">السلة فارغة</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price} درهم</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(div);
    });
    
    cartTotal.textContent = total;
}

// ====================== تغيير الكمية ======================
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    
    saveCart();
    updateCartUI();
}

// ====================== حذف من السلة ======================
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

// ====================== حفظ السلة ======================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ====================== عرض تفاصيل المنتج ======================
function showProduct(id) {
    const product = products.find(p => p.id === id);
    modalBody.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="modal-image">
        <span class="product-badge ${product.category === 'digital' ? 'badge-digital' : 'badge-physical'}">
            ${product.type}
        </span>
        <h2 style="margin: 15px 0;">${product.title}</h2>
        <div class="product-price" style="font-size: 1.6rem; margin-bottom: 15px;">
            ${product.price} درهم
        </div>
        <p style="color: #64748b; margin-bottom: 25px; line-height: 1.8;">
            ${product.description}
        </p>
        <button class="btn btn-primary" style="width: 100%;" onclick="addToCart(${product.id}); closeProductModal();">
            <i class="fas fa-cart-plus"></i> أضف إلى السلة
        </button>
    `;
    productModal.classList.add('show');
}

function closeProductModal() {
    productModal.classList.remove('show');
}

// ====================== الأحداث ======================
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
});

closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);
closeModal.addEventListener('click', closeProductModal);

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('show');
}

// الفلاتر
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ====================== إتمام الطلب → فتح واتساب ======================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = "السلام عليكم، بغيت نطلب هاد المنتجات:\n\n";
    
    cart.forEach(item => {
        message += `• ${item.title}\n  الكمية: ${item.quantity}\n  الثمن: ${item.price * item.quantity} درهم\n\n`;
    });
    
    message += `المجموع الكلي: ${total} درهم\n\nشكراً!`;
    
    // فتح واتساب مع الرسالة جاهزة
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // تفريغ السلة بعد الإرسال
    cart = [];
    saveCart();
    updateCartUI();
    closeCartSidebar();
});

// ====================== التشغيل الأولي ======================
renderProducts();
updateCartUI();
