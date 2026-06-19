/**

 * NEOXWEB WhatsApp chat widget — floating button + chat panel

 */

(function () {

    const DEFAULT_MSG = 'Hi NEOXWEB! I need help with my website project.';



    function getNumbers() {

        if (window.NeoxwebContact?.all) {

            return window.NeoxwebContact.all();

        }

        return [

            { display: '+92 308 4858836', e164: '923084858836' }

        ];

    }



    function waLink(number, text) {

        if (window.NeoxwebContact?.waLink) {

            return window.NeoxwebContact.waLink(number, text);

        }

        const num = String(number).replace(/\D/g, '');

        return `https://wa.me/${num}?text=${encodeURIComponent(text || DEFAULT_MSG)}`;

    }



    function loadContactScript() {

        if (window.NeoxwebContact) return Promise.resolve();

        return new Promise((resolve) => {

            const script = document.createElement('script');

            script.src = (document.querySelector('script[src*="navbar.js"]')?.src || '').replace(/navbar\.js.*$/, 'neoxweb-contact.js') || 'js/neoxweb-contact.js';

            script.onload = resolve;

            script.onerror = resolve;

            document.head.appendChild(script);

        });

    }



    function injectWidget() {

        if (document.getElementById('nxWaFab')) return;

        if (document.body.classList.contains('contact-chat-page')) return;



        const numbers = getNumbers();

        const numberChips = numbers.map((item, i) => `

            <button type="button" class="nx-wa-num-chip${i === 0 ? ' is-active' : ''}" data-wa="${item.e164}" title="Chat on ${item.display}">

                <i class="fab fa-whatsapp"></i> ${item.display}

            </button>

        `).join('');



        const panel = document.createElement('div');

        panel.className = 'nx-wa-panel';

        panel.id = 'nxWaPanel';

        panel.innerHTML = `

            <div class="nx-wa-panel__head">

                <div class="nx-wa-panel__avatar" aria-hidden="true">
                    <i class="fab fa-whatsapp"></i>
                </div>

                <div>

                    <strong>NEOXWEB</strong>

                    <span>Typically replies within minutes</span>

                </div>

                <a href="tel:+923084858836" class="nx-wa-panel__call" aria-label="Call NEOXWEB"><i class="fas fa-phone"></i></a>

            </div>

            <div class="nx-wa-panel__nums" id="nxWaNums">${numberChips}</div>

            <div class="nx-wa-panel__body" id="nxWaMessages">

                <div class="nx-wa-bubble">

                    Hi there! 👋<br>Welcome to NEOXWEB! How can we help you today?

                    <div class="nx-wa-bubble--time">Just now</div>

                </div>

            </div>

            <div class="nx-wa-panel__foot">

                <input type="text" id="nxWaInput" placeholder="Type a message..." autocomplete="off" maxlength="500">

                <button type="button" id="nxWaSend" aria-label="Send on WhatsApp"><i class="fab fa-whatsapp"></i></button>

            </div>

        `;



        const fab = document.createElement('button');

        fab.type = 'button';

        fab.className = 'nx-wa-fab';

        fab.id = 'nxWaFab';

        fab.setAttribute('aria-label', 'Chat on WhatsApp');

        fab.innerHTML = '<i class="fab fa-whatsapp"></i><span class="nx-wa-fab__dot" aria-hidden="true"></span>';



        document.body.appendChild(panel);

        document.body.appendChild(fab);



        const input = document.getElementById('nxWaInput');

        const send = document.getElementById('nxWaSend');

        let selectedWa = numbers[0]?.e164 || '923084858836';



        panel.querySelectorAll('.nx-wa-num-chip').forEach((chip) => {

            chip.addEventListener('click', () => {

                selectedWa = chip.dataset.wa;

                panel.querySelectorAll('.nx-wa-num-chip').forEach((c) => c.classList.remove('is-active'));

                chip.classList.add('is-active');

            });

        });



        fab.addEventListener('click', () => {

            panel.classList.toggle('is-open');

            if (panel.classList.contains('is-open')) input?.focus();

        });



        document.addEventListener('click', (e) => {

            if (!panel.classList.contains('is-open')) return;

            if (e.target.closest('#nxWaPanel, #nxWaFab')) return;

            panel.classList.remove('is-open');

        });



        function openWhatsApp() {

            const text = (input?.value || '').trim() || DEFAULT_MSG;

            window.open(waLink(selectedWa, text), '_blank', 'noopener,noreferrer');

            panel.classList.remove('is-open');

            if (input) input.value = '';

        }



        send?.addEventListener('click', openWhatsApp);

        input?.addEventListener('keydown', (e) => {

            if (e.key === 'Enter') {

                e.preventDefault();

                openWhatsApp();

            }

        });

    }



    async function loadWhatsAppFromSettings() {

        try {

            const base = window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || '';

            const res = await fetch(`${base}/settings/public.php`);

            const json = await res.json();

            const primary = json.data?.whatsapp_number;

            const secondary = json.data?.whatsapp_number_2;

            if (primary && window.NeoxwebContact) {

                window.NeoxwebContact.numbers[0].e164 = String(primary).replace(/\D/g, '');

            }

            if (secondary && window.NeoxwebContact?.numbers?.[1]) {

                window.NeoxwebContact.numbers[1].e164 = String(secondary).replace(/\D/g, '');

            }

        } catch {

            /* defaults */

        }

    }



    function init() {

        loadContactScript()

            .then(() => loadWhatsAppFromSettings())

            .finally(injectWidget);

    }



    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }



    window.NeoxwebWhatsApp = {

        open: (msg, number) => {

            const nums = getNumbers();

            const target = number || nums[0]?.e164;

            window.open(waLink(target, msg), '_blank', 'noopener');

        }

    };

})();

