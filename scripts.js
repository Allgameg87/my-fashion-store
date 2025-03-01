document.addEventListener('DOMContentLoaded', () => {
    // Очистка корзины при первом посещении
    localStorage.removeItem('cart');

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    updateCartLink();
    updateTotalPrice();

    // Обработчик кликов по кнопкам "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseInt(product.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
            const productImage = product.getAttribute('data-image');

            const existingItem = cartItems.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
            }

            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateCartCount();
            updateCartLink();
            updateTotalPrice();
            showNotification(productName, productImage);
        });
    });

    // Обработчик поиска
    document.getElementById('search-button').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const products = document.querySelectorAll('#catalog .product');
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    // Обновление количества товаров в корзине
    function updateCartCount() {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    }

    // Обновление ссылки на корзину
    function updateCartLink() {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-link').textContent = `Корзина (${count})`;
    }

    // Обновление итоговой суммы в корзине
    function updateTotalPrice() {
        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        document.getElementById('total-price').textContent = `${totalPrice} руб.`;
    }

    // Обновление корзины на странице cart.html
    if (window.location.pathname.includes('cart.html')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        const clearCartButton = document.getElementById('clear-cart');
        const payButton = document.getElementById('pay-button');
        const modal = document.getElementById('payment-modal');
        const closeBtn = document.querySelector('.close');

        // Очистка корзины
        clearCartButton.addEventListener('click', () => {
            localStorage.removeItem('cart');
            cartItemsContainer.innerHTML = '';
            totalPriceElement.textContent = '0 руб.';
            updateCartCount();
            updateCartLink();
            alert('Корзина очищена!');
        });

        // Отображение модального окна для оплаты
        payButton.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('Корзина пуста. Добавьте товары для оплаты.');
                return;
            }
            modal.style.display = 'block';
        });

        // Закрытие модального окна
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Обработка формы оплаты
        document.getElementById('payment-form').addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Оплата прошла успешно!');
            modal.style.display = 'none';
            localStorage.removeItem('cart');
            cartItemsContainer.innerHTML = '';
            totalPriceElement.textContent = '0 руб.';
            updateCartCount();
            updateCartLink();
        });

        // Заполнение корзины
        cartItems.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="images/${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Количество: ${item.quantity}</p>
                </div>
                <div class="item-price">${item.price * item.quantity} руб.</div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        totalPriceElement.textContent = `${totalPrice} руб.`;
    }

    // Показ уведомления при добавлении товара
    function showNotification(productName, productImage) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <img src="images/${productImage}" alt="${productName}">
            <span>${productName} добавлен в корзину!</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Всплывающий чат поддержки
    const supportIcon = document.getElementById('support-icon');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.querySelector('.chat-messages');

    // Открытие чата
    supportIcon.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    // Закрытие чата
    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Обработка отправки сообщений
    sendButton.addEventListener('click', () => {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `<p>${messageText}</p>`;
        chatMessages.appendChild(messageElement);
        chatInput.value = '';

        // Автоматический ответ на типичные вопросы
        const typicalQuestions = [
            { question: 'Как я могу отследить мой заказ?', answer: 'Вы можете отследить заказ на странице "Мои заказы" в личном кабинете или связаться с нами по телефону.' },
            { question: 'Какие способы оплаты доступны?', answer: 'Мы принимаем карты Visa, MasterCard и наличные. Также доступна оплата через электронные кошельки.' },
            { question: 'Как вернуть товар?', answer: 'Для возврата товара свяжитесь с нашим службой поддержки в течение 14 дней с момента покупки.' },
            { question: 'Где можно найти размерную таблицу?', answer: 'Размерную таблицу вы можете найти на странице "О нас" или в разделе "Каталог" рядом с каждым товаром.' },
            { question: 'Какие гарантии предоставляет ваш магазин?', answer: 'Мы предоставляем гарантию на все товары в течение 1 года на дефекты производителя.' }
        ];

        const typicalAnswer = typicalQuestions.find(q => q.question.toLowerCase().includes(messageText.toLowerCase()));
        if (typicalAnswer) {
            const responseElement = document.createElement('div');
            responseElement.className = 'message support-message';
            responseElement.innerHTML = `<p>${typicalAnswer.answer}</p>`;
            chatMessages.appendChild(responseElement);
        } else {
            const responseElement = document.createElement('div');
            responseElement.className = 'message support-message';
            responseElement.innerHTML = `<p>Мы скоро ответим на ваш вопрос.</p>`;
            chatMessages.appendChild(responseElement);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Обработка отправки сообщений по Enter
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});