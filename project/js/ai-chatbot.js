/**
 * NEOXWEB — Mobile app AI assistant (left FAB)
 */
(function () {
    'use strict';

    var panel = null;
    var msgsEl = null;
    var inputEl = null;
    var fab = null;

    function reply(text) {
        var lower = text.toLowerCase();
        if (/seo|rank|google/.test(lower)) {
            return 'Our SEO team offers free audits and 150%+ traffic growth strategies. Visit Contact to send your website URL.';
        }
        if (/web|website|develop/.test(lower)) {
            return 'We build fast, modern websites and e-commerce stores. Typical launch: 2–4 weeks. Open Contact for a free quote.';
        }
        if (/ppc|ads|google ads|facebook/.test(lower)) {
            return 'We run high-ROI PPC campaigns on Google & Meta. Message us on WhatsApp +92 308 4858836 for a custom plan.';
        }
        if (/price|cost|budget|quote/.test(lower)) {
            return 'Pricing depends on your project scope. WhatsApp +92 308 4858836 or email supportneoxweb@gmail.com — free audit included.';
        }
        if (/contact|whatsapp|email|call/.test(lower)) {
            return 'WhatsApp: 0308 4858836 · Email: supportneoxweb@gmail.com · Or use the Contact tab in the app.';
        }
        if (/hello|hi|salam|hey/.test(lower)) {
            return 'Hello! 👋 I\'m the NEOXWEB assistant. Ask about web development, SEO, PPC, or pricing.';
        }
        return 'Thanks for your message! For a detailed reply, open Contact or WhatsApp +92 308 4858836 — we respond within minutes.';
    }

    function appendBubble(text, who) {
        if (!msgsEl) return;
        var bubble = document.createElement('div');
        bubble.className = 'nx-ai-chat__bubble nx-ai-chat__bubble--' + who;
        bubble.textContent = text;
        msgsEl.appendChild(bubble);
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function sendUserMessage() {
        if (!inputEl) return;
        var text = inputEl.value.trim();
        if (!text) return;
        appendBubble(text, 'user');
        inputEl.value = '';
        setTimeout(function () {
            appendBubble(reply(text), 'bot');
        }, 500);
    }

    function toggle(open) {
        if (!panel) return;
        var show = typeof open === 'boolean' ? open : !panel.classList.contains('is-open');
        panel.classList.toggle('is-open', show);
        if (fab) fab.classList.toggle('is-active', show);
        if (show && inputEl) setTimeout(function () { inputEl.focus(); }, 280);
    }

    function bind() {
        fab = document.getElementById('nxAiChatFab');
        panel = document.getElementById('nxAiChatPanel');
        msgsEl = document.getElementById('nxAiChatMessages');
        inputEl = document.getElementById('nxAiChatInput');
        var sendBtn = document.getElementById('nxAiChatSend');
        var closeBtn = document.getElementById('nxAiChatClose');

        if (!fab || !panel) return;

        fab.addEventListener('click', function (e) {
            e.preventDefault();
            toggle();
        });

        closeBtn?.addEventListener('click', function () { toggle(false); });

        sendBtn?.addEventListener('click', sendUserMessage);
        inputEl?.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendUserMessage();
            }
        });

        document.addEventListener('click', function (e) {
            if (!panel.classList.contains('is-open')) return;
            if (e.target.closest('#nxAiChatPanel, #nxAiChatFab')) return;
            toggle(false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }

    window.NxAiChat = { toggle: toggle };
})();
