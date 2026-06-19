/**

 * NEOXWEB — full-page WhatsApp-style contact chat

 */

(function () {

    const messagesEl = document.getElementById('contactChatMessages');

    const inputEl = document.getElementById('contactChatInput');

    const sendBtn = document.getElementById('contactChatSend');

    const numsContainer = document.getElementById('contactWaNums');



    if (!messagesEl || !inputEl) return;



    function getNumbers() {

        if (window.NeoxwebContact?.all) {

            return window.NeoxwebContact.all();

        }

        return [

            { display: '0308 4858836', e164: '923084858836' },

            { display: '0308 4858836', e164: '923084858836' }

        ];

    }



    let selectedWa = getNumbers()[0]?.e164 || '923084858836';



    function waUrl(text) {

        if (window.NeoxwebContact?.waLink) {

            return window.NeoxwebContact.waLink(selectedWa, text);

        }

        return `https://wa.me/${selectedWa.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

    }



    function renderNumberPicker() {

        if (!numsContainer) return;

        const numbers = getNumbers();

        numsContainer.innerHTML = numbers.map((item, i) => `

            <button type="button" class="contact-wa-num${i === 0 ? ' is-active' : ''}" data-wa="${item.e164}">

                <i class="fab fa-whatsapp" aria-hidden="true"></i> ${item.display}

            </button>

        `).join('');



        numsContainer.querySelectorAll('.contact-wa-num').forEach((btn) => {

            btn.addEventListener('click', () => {

                selectedWa = btn.dataset.wa;

                numsContainer.querySelectorAll('.contact-wa-num').forEach((b) => b.classList.remove('is-active'));

                btn.classList.add('is-active');

            });

        });

    }



    function timeNow() {

        const d = new Date();

        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    }



    function appendBubble(text, type) {

        const bubble = document.createElement('div');

        bubble.className = 'nx-wa-bubble' + (type === 'user' ? ' nx-wa-bubble--user' : '');

        bubble.innerHTML = `${text.replace(/\n/g, '<br>')}<div class="nx-wa-bubble--time">${timeNow()}</div>`;

        messagesEl.appendChild(bubble);

        messagesEl.scrollTop = messagesEl.scrollHeight;

    }



    function botReply(userText) {

        const lower = userText.toLowerCase();

        if (lower.includes('seo')) {

            return 'Great choice! Our SEO team can audit your site for free. Share your website URL on WhatsApp and we\u2019ll send a report. 📈';

        }

        if (lower.includes('web') || lower.includes('website')) {

            return 'We build fast, modern websites that convert. Tell us your business name on WhatsApp and we\u2019ll share a custom plan. 🚀';

        }

        if (lower.includes('ppc') || lower.includes('ads')) {

            return 'Our PPC experts run high-ROI Google & Meta campaigns. Message us your budget range on WhatsApp! 💰';

        }

        if (lower.includes('audit') || lower.includes('free')) {

            return 'Yes — free website audit! Send your site URL on WhatsApp and we\u2019ll reply with actionable tips. ✅';

        }

        return 'Thanks for reaching out! Tap below to continue on WhatsApp — we typically reply within minutes. 💬';

    }



    async function saveToDatabase(text) {

        try {

            if (!window.NexuraAPI) return false;

            const session = typeof getStorage === 'function' ? getStorage('nexuraSession') : null;

            await NexuraAPI.submitContact({

                name: session?.name || 'WhatsApp Chat User',

                email: session?.email || `chat${Date.now()}@neoxweb.com`,

                phone: selectedWa,

                message: `[WhatsApp] ${text}`

            });

            return true;

        } catch {

            return false;

        }

    }



    function sendMessage(text) {

        const msg = (text || inputEl.value || '').trim();

        if (!msg) return;



        appendBubble(msg, 'user');

        inputEl.value = '';



        saveToDatabase(msg).then((saved) => {

            if (saved) {

                setTimeout(() => {

                    appendBubble('✅ Message saved! Opening WhatsApp…', 'bot');

                }, 400);

            }

        });



        setTimeout(() => {

            appendBubble(botReply(msg), 'bot');

        }, 700);



        setTimeout(() => {

            window.open(waUrl(msg), '_blank', 'noopener,noreferrer');

        }, 1400);

    }



    renderNumberPicker();



    sendBtn?.addEventListener('click', () => sendMessage());

    inputEl.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    });



    document.querySelectorAll('[data-chat-quick]').forEach((btn) => {

        btn.addEventListener('click', () => sendMessage(btn.dataset.chatQuick));

    });

})();

