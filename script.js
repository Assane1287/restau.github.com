

document.addEventListener('DOMContentLoaded', function() {
    // ====== ÉTAT GLOBAL ======
    
    const state = {
        cart: [],
        currentProduct: null,
        maxQuantity: 10,
        minQuantity: 1
    };
    const paymentModal = document.getElementById('payment-modal');
    const paymentBackBtn = document.querySelector('#payment-modal .back-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    const loginForm = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');



    // ====== SÉLECTEURS DOM ======
    const elements = {

        

        paymentModal: document.getElementById('payment-modal'),
        checkoutModal: document.getElementById('checkout-modal'),
        backBtn: document.querySelector('#payment-modal .back-btn'),
        confirmBtn: document.querySelector('.confirm-btn'),
        paymentOptions: document.querySelectorAll('.payment-option input[type="radio"]'),
        btnText: document.querySelector('.confirm-btn .btn-text'),
        // Modales
        hoursBtn: document.getElementById('hours-btn'),
        hoursModal: document.getElementById('hours-modal'),
        productModal: document.getElementById('product-modal'),
        cartModal: document.getElementById('cart-modal'),
        checkoutModal: document.getElementById('checkout-modal'),
        paymentModal: document.getElementById('payment-modal'),
        closeButtons: document.querySelectorAll('.close'),
        
        // Menu et filtres
        filterButtons: document.querySelectorAll('.filters button'),
        menuItems: document.querySelectorAll('.menu-item'),
        menuBtn: document.querySelector('.menu-btn'),
        
        // Panier
        cartIcon: document.getElementById('cart-icon'),
        cartCount: document.querySelector('.cart-count'),
        cartItems: document.querySelector('.cart-items'),
        cartTotalPrice: document.getElementById('cart-total-price'),
        checkoutBtn: document.querySelector('.checkout-btn'),
        
        // Détails produit
        modalProductImage: document.getElementById('modal-product-image'),
        modalProductName: document.getElementById('modal-product-name'),
        modalProductStock: document.getElementById('modal-product-stock'),
        modalTotalPrice: document.getElementById('modal-total-price'),
        addToCartBtn: document.querySelector('.add-to-cart-btn'),
        
        // Commande et paiement
        nextBtn: document.querySelector('.next-btn'),
        backBtn: document.querySelector('.back-btn'),
        deliveryForm: document.getElementById('delivery-form'),
        onsiteForm: document.getElementById('onsite-form'),
        orderSummary: document.querySelector('.order-summary'),
        paymentButtons: document.querySelectorAll('.payment-btn')
    };

    // ====== GESTIONNAIRES D'ÉVÉNEMENTS ======
    function initializeEventListeners() {
        // Défilement vers le menu
        elements.menuBtn.addEventListener('click', () => {
            document.querySelector('.filters').scrollIntoView({ behavior: 'smooth' });
        });

        // Gestion des modales
        elements.hoursBtn.addEventListener('click', () => showModal(elements.hoursModal));
        elements.cartIcon.addEventListener('click', () => {
            displayCart();
            showModal(elements.cartModal);
        });
            // ====== GESTION DU BOUTON RETOUR ======
    elements.backBtn.addEventListener('click', () => {
        closeModal(elements.paymentModal);
        showModal(elements.checkoutModal);  // Reopens the checkout modal
    });
        // ====== GESTION DU CHANGEMENT DE TEXTE EN FONCTION DU MODE DE PAIEMENT ======
        elements.paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                const selectedMethod = option.value;
                
                // Update the button text based on the selected payment method
                switch (selectedMethod) {
                    case 'wave':
                        elements.btnText.textContent = 'Payer avec Wave';
                        break;
                    case 'orange':
                        elements.btnText.textContent = 'Payer avec Orange Money';
                        break;
                    case 'livraison':
                        elements.btnText.textContent = 'Confirmer le paiement à la livraison';
                        break;
                    default:
                        elements.btnText.textContent = 'Sélectionnez un mode de paiement';
                }
    
                // Enable the confirm button after a payment method is selected
                elements.confirmBtn.disabled = false;
            });
        });
        // Fermeture des modales
        elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });

        // Fermeture au clic en dehors
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target);
            }
        });

        // Arrêt de la propagation dans le contenu des modales
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => e.stopPropagation());
        });

        // Filtres du menu
        elements.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => handleFilter(e));
        });

        // Items du menu
        elements.menuItems.forEach(item => {
            item.addEventListener('click', () => handleProductClick(item));
        });

        // Gestion du panier
        elements.addToCartBtn.addEventListener('click', handleAddToCart);
        
        // Gestion de la commande
        elements.checkoutBtn.addEventListener('click', () => {
            closeModal(elements.cartModal);
            showModal(elements.checkoutModal);
        });

        // Navigation commande
        elements.nextBtn.addEventListener('click', handleNextStep);
        elements.backBtn.addEventListener('click', () => {
            closeModal(elements.checkoutModal);
            showModal(elements.cartModal);
        });

        // Gestion du paiement
        elements.paymentButtons.forEach(button => {
            button.addEventListener('click', () => handlePayment(button));
        });

        // Gestion des quantités dans la modale produit
        initializeQuantityControls();
    }
      // Ajouter la gestion du changement de type de commande
      const orderTypeBtns = document.querySelectorAll('.order-type-btn');
      const deliveryForm = document.querySelector('.delivery-form');
      const onsiteForm = document.querySelector('.onsite-form');
  
      orderTypeBtns.forEach(btn => {
          btn.addEventListener('click', () => {
              // Retirer la classe active de tous les boutons
              orderTypeBtns.forEach(b => b.classList.remove('active'));
              // Ajouter la classe active au bouton cliqué
              btn.classList.add('active');
  
              // Afficher le formulaire correspondant
              if (btn.dataset.type === 'delivery') {
                  deliveryForm.classList.add('active');
                  onsiteForm.classList.remove('active');
              } else {
                  onsiteForm.classList.add('active');
                  deliveryForm.classList.remove('active');
              }
          });
      });


    // ====== GESTION DES MODALES ======
    function showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // ====== GESTION DES FILTRES ======
    function handleFilter(e) {
        elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.textContent.trim();
        filterProducts(category);
    }

    function filterProducts(category) {
        elements.menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent;
            if (category === 'Tous les plats' || itemName === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // ====== GESTION DES PRODUITS ======
    function handleProductClick(item) {
        const stockElement = item.querySelector('.item-info span');
        state.currentProduct = {
            name: item.querySelector('h3').textContent,
            price: parseInt(item.querySelector('.price').textContent),
            image: item.querySelector('img').src,
            stock: stockElement ? parseInt(stockElement.textContent) : 0,
            isAvailable: !item.querySelector('.stock-warning')
        };
        
        updateProductModal();
        showModal(elements.productModal);
    }

    function updateProductModal() {
        elements.modalProductImage.src = state.currentProduct.image;
        elements.modalProductName.textContent = state.currentProduct.name;
        elements.modalProductStock.textContent = state.currentProduct.isAvailable 
            ? `${state.currentProduct.stock} unités disponibles`
            : 'Rupture de stock';
        elements.modalTotalPrice.textContent = state.currentProduct.price;
        
        // Réinitialiser la quantité
        const quantityElement = elements.productModal.querySelector('.quantity');
        if (quantityElement) {
            quantityElement.textContent = '1';
        }

        // Désactiver le bouton si rupture de stock
        elements.addToCartBtn.disabled = !state.currentProduct.isAvailable;
    }

    // ====== GESTION DES QUANTITÉS ======
    function initializeQuantityControls() {
        const productModal = elements.productModal;
        const quantityBtns = productModal.querySelectorAll('.quantity-btn');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quantityElement = productModal.querySelector('.quantity');
                let quantity = parseInt(quantityElement.textContent);
                
                if (btn.classList.contains('plus')) {
                    quantity = Math.min(quantity + 1, state.maxQuantity);
                } else {
                    quantity = Math.max(quantity - 1, state.minQuantity);
                }
                
                quantityElement.textContent = quantity;
                updateModalPrice(quantity);
            });
        });
    }

    function updateModalPrice(quantity) {
        const totalPrice = state.currentProduct.price * quantity;
        elements.modalTotalPrice.textContent = totalPrice;
    }

    // ====== GESTION DU PANIER ======
    function handleAddToCart() {
        if (!state.currentProduct.isAvailable) return;

        const quantity = parseInt(elements.productModal.querySelector('.quantity').textContent);
        const cartItem = {
            ...state.currentProduct,
            quantity: quantity,
            totalPrice: quantity * state.currentProduct.price
        };
        
        addToCart(cartItem);
        closeModal(elements.productModal);
    }

    function addToCart(item) {
        const existingItemIndex = state.cart.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingItemIndex !== -1) {
            const newQuantity = Math.min(
                state.cart[existingItemIndex].quantity + item.quantity,
                state.maxQuantity
            );
            state.cart[existingItemIndex].quantity = newQuantity;
            state.cart[existingItemIndex].totalPrice = newQuantity * item.price;
        } else {
            state.cart.push(item);
        }
        
        updateCartCount();
    }

    function updateCartCount() {
        const count = state.cart.reduce((total, item) => total + item.quantity, 0);
        elements.cartCount.textContent = count;
    }

    function displayCart() {
        elements.cartItems.innerHTML = '';
        let total = 0;

        state.cart.forEach((item, index) => {
            const itemElement = createCartItemElement(item, index);
            elements.cartItems.appendChild(itemElement);
            total += item.totalPrice;
        });

        elements.cartTotalPrice.textContent = total;
        addCartItemEventListeners();
    }

    function createCartItemElement(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <p>${item.totalPrice} FCFA</p>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        `;
        return itemElement;
    }

    function addCartItemEventListeners() {
        const quantityButtons = elements.cartItems.querySelectorAll('.quantity-btn');
        
        quantityButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                const isPlus = e.target.classList.contains('plus');
                
                updateCartItemQuantity(index, isPlus);
            });
        });

        elements.cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                removeCartItem(index);
            });
        });
    }

    function updateCartItemQuantity(index, increase) {
        const item = state.cart[index];
        if (increase) {
            item.quantity = Math.min(item.quantity + 1, state.maxQuantity);
        } else {
            item.quantity = Math.max(item.quantity - 1, state.minQuantity);
        }
        
        item.totalPrice = item.quantity * item.price;
        displayCart();
        updateCartCount();
    }

    function removeCartItem(index) {
        state.cart.splice(index, 1);
        displayCart();
        updateCartCount();
    }

    // ====== GESTION DE LA COMMANDE ======
    function handleNextStep() {
        if (validateForms()) {
            closeModal(elements.checkoutModal);
            showModal(elements.paymentModal);
            updateOrderSummary();
        } else {
            alert('Veuillez remplir tous les champs requis.');
        }
    }

   function validateForms() {
        const activeForm = document.querySelector('.order-form.active');
        if (!activeForm) return false;

        const requiredFields = activeForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                
                // Retirer la classe 'invalid' après l'animation
                field.addEventListener('animationend', () => {
                    field.classList.remove('invalid');
                });
            }
        });

        return isValid;
    }

    function updateOrderSummary() {
        // Récupérer le type de commande actif (livraison ou sur place)
        const activeForm = document.querySelector('.order-form.active');
        const isDelivery = activeForm.classList.contains('delivery-form');
        const formData = {};
        
        // Collecter les données du formulaire actif
        activeForm.querySelectorAll('input, textarea').forEach(input => {
            if (input.value.trim()) {
                formData[input.placeholder] = input.value.trim();
            }
        });
    
        // Construire le HTML du récapitulatif
        let summaryHTML = `
            <div class="order-header">
                <h3>Récapitulatif de la commande</h3>
                <div class="order-type">
                    ${isDelivery ? '🚚 Livraison à domicile' : '🍽️ Sur place'}
                </div>
            </div>
    
            <div class="customer-info">
                <h4>Informations client</h4>
                ${Object.entries(formData).map(([key, value]) => `
                    <div class="info-item">
                        <span class="info-label">${key}:</span>
                        <span class="info-value">${value}</span>
                    </div>
                `).join('')}
            </div>
    
            <div class="order-items">
                <h4>Articles commandés</h4>
                ${state.cart.map(item => `
                    <div class="order-item">
                        <div class="item-info">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">×${item.quantity}</span>
                        </div>
                        <span class="item-price">${item.totalPrice} FCFA</span>
                    </div>
                `).join('')}
            </div>
    
            <div class="order-total">
                <span>Total de la commande:</span>
                <span class="total-amount">
                    ${state.cart.reduce((sum, item) => sum + item.totalPrice, 0)} FCFA
                </span>
            </div>
        `;
    
        // Mettre à jour le contenu du récapitulatif
        document.querySelector('.order-summary').innerHTML = summaryHTML;
    }
    
    // ====== GESTION DU PAIEMENT ======
    function handlePayment(button) {
        const paymentMethod = button.classList.contains('wave') ? 'Wave' : 'Orange Money';
        // Simulation du processus de paiement
        alert(`Paiement via ${paymentMethod} en cours de traitement...`);
        // Ici, vous pourriez ajouter l'intégration réelle avec le système de paiement
    }

    // Ajoutez ces fonctions dans votre script.js existant
function showConfirmationPopup() {
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h3>Votre commande est confirmée!</h3>
            <p>Merci pour votre confiance.</p>
            <button class="download-invoice-btn">Télécharger la facture</button>
        </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('active');
    }, 100);

    const downloadBtn = popup.querySelector('.download-invoice-btn');
    downloadBtn.addEventListener('click', generatePDF);

    setTimeout(() => {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 5000);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(24);
    doc.text('Assane Restau', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Facture', 105, 30, { align: 'center' });
    
    // Date
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, 20, 40);

    // Informations client
    const activeForm = document.querySelector('.order-form.active');
    const formData = {};
    activeForm.querySelectorAll('input, textarea').forEach(input => {
        if (input.value.trim()) {
            formData[input.placeholder] = input.value.trim();
        }
    });

    let yPos = 60;
    doc.setFontSize(14);
    doc.text('Informations Client', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    Object.entries(formData).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, yPos);
        yPos += 8;
    });

    // Articles commandés
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Articles Commandés', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    state.cart.forEach(item => {
        doc.text(`${item.name} x${item.quantity} - ${item.totalPrice} FCFA`, 20, yPos);
        yPos += 8;
    });

    // Total
    const total = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total: ${total} FCFA`, 20, yPos);

    // Pied de page
    doc.setFontSize(10);
    doc.text('Merci de votre confiance!', 105, 280, { align: 'center' });
    doc.text('Tivaouane Peulh / Diawrine - Tel: +221784513633', 105, 285, { align: 'center' });

    // Téléchargement
    doc.save('AssaneRestau-Facture.pdf');
}

// Mettre à jour la gestion du bouton de confirmation
document.querySelector('.confirm-btn').addEventListener('click', () => {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (selectedPayment) {
        showConfirmationPopup();
    }
});
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
document.head.appendChild(script);

    // ====== INITIALISATION ======
    initializeEventListeners();
});
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});
// Sélectionnez les éléments
const loginBtn = document.querySelector('.dashboard-login');
const loginModal = document.querySelector('.login-modal');
const closeBtn = document.querySelector('.login-modal .close-btn');
const loginForm = document.querySelector('.login-form');

// Ouvrir la modale
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

// Fermer la modale
closeBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

// Fermer la modale en cliquant à l'extérieur
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});

// Empêcher la fermeture lors du clic sur le formulaire
loginForm.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Gérer la soumission du formulaire
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Ajoutez ici votre logique de connexion
});
// Gestion de l'authentification Firebase
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginModal = document.querySelector('.login-modal');

    // Observer les changements d'état de l'authentification
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // L'utilisateur est connecté
            console.log('Utilisateur connecté:', user.email);
            loginModal.classList.remove('active');
            // Ajoutez ici la logique pour l'interface utilisateur connecté
        } else {
            // L'utilisateur est déconnecté
            console.log('Utilisateur déconnecté');
            // Ajoutez ici la logique pour l'interface utilisateur déconnecté
        }
    });

    // Gestion de la soumission du formulaire de connexion
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('Connexion réussie:', userCredential.user);
            // Réinitialiser le formulaire
            loginForm.reset();
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion: ' + error.message);
        }
    });

    // Fonction de déconnexion
    window.logout = async function() {
        try {
            await firebase.auth().signOut();
            console.log('Déconnexion réussie');
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            alert('Erreur de déconnexion: ' + error.message);
        }
    }
});

// Sauvegarder les commandes dans Firestore
function saveOrderToFirestore(orderData) {
    return firebase.firestore().collection('orders')
        .add({
            ...orderData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: firebase.auth().currentUser?.uid
        })
        .then((docRef) => {
            console.log('Commande enregistrée avec ID:', docRef.id);
            return docRef.id;
        })
        .catch((error) => {
            console.error('Erreur lors de l\'enregistrement de la commande:', error);
            throw error;
        });
}

// Modifiez la fonction handlePayment pour sauvegarder la commande
async function handlePayment(button) {
    const paymentMethod = button.classList.contains('wave') ? 'Wave' : 'Orange Money';
    
    // Créer l'objet de commande
    const orderData = {
        items: state.cart,
        total: state.cart.reduce((sum, item) => sum + item.totalPrice, 0),
        paymentMethod,
        customerInfo: {
            // Récupérer les informations du formulaire actif
            // Ajoutez ici la logique pour récupérer les informations client
        },
        status: 'pending'
    };

    try {
        // Sauvegarder la commande dans Firestore
        const orderId = await saveOrderToFirestore(orderData);
        console.log('Commande sauvegardée avec succès:', orderId);
        showConfirmationPopup();
    } catch (error) {
        console.error('Erreur lors du traitement de la commande:', error);
        alert('Une erreur est survenue lors du traitement de votre commande.');
    }
}