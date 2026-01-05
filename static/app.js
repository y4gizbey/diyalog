const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatThread = document.getElementById('chat-thread');
const heroSection = document.getElementById('hero');
const homeBtn = document.getElementById('home-btn');
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyBack = document.getElementById('history-back');
const historyList = document.getElementById('history-list');
const newChatBtn = document.getElementById('new-chat');
const aboutBtn = document.getElementById('about-btn');
const workBtn = document.getElementById('work-btn');
const savedBtn = document.getElementById('saved-btn');
const presetButtons = document.querySelectorAll('.preset');
const systemBanner = document.getElementById('system-banner');
const systemText = document.querySelector('.system-text');
const systemToggle = document.getElementById('system-toggle');
const systemClose = document.getElementById('system-close');
const aboutPanel = document.getElementById('about-panel');
const workPanel = document.getElementById('work-panel');
const savedPanel = document.getElementById('saved-panel');
const composerWrap = document.querySelector('.composer');
const workspaceChips = document.querySelectorAll('.chip');
const workspaceActive = document.getElementById('workspace-active');
const savedListEl = document.getElementById('saved-list');
const memoryToast = document.getElementById('memory-toast');
const aboutFields = {
    app: document.querySelector('[data-about="app"]'),
    developer: document.querySelector('[data-about="developer"]'),
    purpose: document.querySelector('[data-about="purpose"]'),
    tech: document.querySelector('[data-about="tech"]'),
    license: document.querySelector('[data-about="license"]'),
    note: document.querySelector('[data-about="note"]'),
};

const __idLock = (() => {
    const m = (set) => set.join('');
    const a = ['y4', 'g', 'iz', 'b', 'ey'];
    const b = ['Ya', 'ğı', 'z ', 'Efe ', 'Ağ', 'cahan'];
    const c = ['di', 'yal', 'og-', 'se', 'ed-', 'v1'];
    const f = ['659e', 'b37b', '7110', 'e331', 'c93c', '7448', '70bc', 'b1f8', 'a725', '0c3a', '156a', 'a1a8', '7f99', 'b191', '060c', '343d'];
    const w = Object.freeze({ u: m(a), v: m(b), k: m(c), q: 'MIT' });
    const e = new TextEncoder();
    const s = async (txt) => {
        const buf = await crypto.subtle.digest('SHA-256', e.encode(txt));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    };
    const g = async () => {
        const mix = w.k.slice(0, 5) + w.u + w.k.slice(5) + w.v;
        const cksum = await s(mix);
        return cksum === m(f);
    };
    return Object.freeze({
        alias: () => w.u,
        name: () => w.v,
        license: () => w.q,
        check: g,
    });
})();

const STORAGE_KEY = 'diyalog-chats';
const MEMORY_KEY = 'diyalog-memory';
const WORKSPACE_KEY = 'diyalog-workspace';
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
let chats = [];
let currentChatId = null;
let isStreaming = false;
let mode = 'home'; // home | chat
const SCROLL_STICKY_THRESHOLD = 80;
let currentSection = 'home'; // home | chat | about | work | saved
let selectedWorkspace = null;
let memoryItems = [];
let pendingMemory = null;

function loadChats() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        chats = raw ? JSON.parse(raw) : [];
    } catch {
        chats = [];
    }
    if (!chats.length) {
        startNewChat(true);
    } else {
        selectChat(chats[0].id, true);
    }
}

function saveChats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

function loadMemory() {
    try {
        const raw = localStorage.getItem(MEMORY_KEY);
        memoryItems = raw ? JSON.parse(raw) : [];
    } catch {
        memoryItems = [];
    }
    renderMemory();
}

function saveMemory() {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memoryItems));
}

function loadWorkspace() {
    try {
        const raw = localStorage.getItem(WORKSPACE_KEY);
        selectedWorkspace = raw || null;
    } catch {
        selectedWorkspace = null;
    }
    workspaceChips.forEach(c => {
        const active = c.dataset.workspace === selectedWorkspace;
        c.classList.toggle('active', active);
    });
    if (selectedWorkspace) {
        workspaceActive.textContent = `Aktif çalışma alanı: ${selectedWorkspace}`;
        workspaceActive.classList.remove('hidden');
    } else {
        workspaceActive.classList.add('hidden');
    }
}

function saveWorkspace() {
    if (selectedWorkspace) {
        localStorage.setItem(WORKSPACE_KEY, selectedWorkspace);
    } else {
        localStorage.removeItem(WORKSPACE_KEY);
    }
}

function startNewChat(silent = false, goHome = true) {
    const id = uuid();
    const now = new Date().toISOString();
    const chat = { id, title: 'Yeni sohbet', createdAt: now, updatedAt: now, messages: [] };
    chats.unshift(chat);
    currentChatId = id;
    renderHistory();
    clearThread();
    if (goHome) {
        setMode('home');
    }
    if (!silent) saveChats();
}

function selectChat(id, silent = false) {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    currentChatId = id;
    clearThread();
    chat.messages.forEach(msg => addMessage(msg.content, msg.role === 'user', true));
    if (chat.messages.length) setMode('chat', true);
    renderHistory();
    if (!silent) saveChats();
}

function deleteChat(id) {
    const idx = chats.findIndex(c => c.id === id);
    if (idx === -1) return;
    chats.splice(idx, 1);
    if (!chats.length) {
        startNewChat(true);
    } else {
        currentChatId = chats[0].id;
    }
    renderHistory();
    selectChat(currentChatId, true);
    saveChats();
}

function renderHistory() {
    historyList.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item' + (chat.id === currentChatId ? ' active' : '');
        item.addEventListener('click', () => selectChat(chat.id));

        const title = document.createElement('div');
        title.className = 'history-title-text';
        title.textContent = chat.title || 'Sohbet';

        const meta = document.createElement('div');
        meta.className = 'history-meta';
        const date = new Date(chat.updatedAt || chat.createdAt);
        meta.textContent = date.toLocaleString('tr-TR');

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = '×';
        del.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });

        item.appendChild(title);
        item.appendChild(meta);
        item.appendChild(del);
        historyList.appendChild(item);
    });
}

function renderMemory() {
    savedListEl.innerHTML = '';
    if (!memoryItems.length) {
        savedListEl.innerHTML = '<li class="muted">Henüz kayıt yok.</li>';
        return;
    }
    memoryItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'saved-item';
        li.innerHTML = `
            <div class="saved-title">${escapeHTML(item.title || 'Kayıt')}</div>
            <div>${escapeHTML(item.content)}</div>
            <div class="saved-meta">${new Date(item.createdAt).toLocaleString('tr-TR')} ${item.tag ? ' · ' + escapeHTML(item.tag) : ''}</div>
        `;
        savedListEl.appendChild(li);
    });
}

function setMode(nextMode, instant = false) {
    mode = nextMode;
    if (mode === 'home') {
        heroSection.classList.remove('hidden');
        chatThread.classList.add('hidden');
        currentChatId = null;
        renderHistory();
    } else {
        heroSection.classList.add('hidden');
        chatThread.classList.remove('hidden');
    }
    if (!instant) window.setTimeout(() => chatThread.scrollTop = chatThread.scrollHeight, 50);
    homeBtn.classList.toggle('active', mode === 'home');
}

function isNearBottom() {
    const distance = chatThread.scrollHeight - chatThread.scrollTop - chatThread.clientHeight;
    return distance < SCROLL_STICKY_THRESHOLD;
}

function scrollToBottom(force = false) {
    if (force || isNearBottom()) {
        chatThread.scrollTop = chatThread.scrollHeight;
    }
}

function setSection(section) {
    currentSection = section;
    [aboutPanel, workPanel, savedPanel].forEach(p => p.classList.add('hidden'));
    chatThread.classList.remove('hidden');
    heroSection.classList.remove('hidden');
    composerWrap.classList.remove('disabled');

    [homeBtn, historyToggle, workBtn, savedBtn].forEach(btn => btn.classList.remove('active'));
    homeBtn.classList.toggle('active', section === 'home');
    historyToggle.classList.toggle('active', section === 'chat');
    workBtn.classList.toggle('active', section === 'work');
    savedBtn.classList.toggle('active', section === 'saved');

    if (section === 'home') {
        setMode('home');
    } else if (section === 'chat') {
        setMode('chat');
    } else if (section === 'about') {
        heroSection.classList.add('hidden');
        chatThread.classList.add('hidden');
        composerWrap.classList.add('disabled');
        aboutPanel.classList.remove('hidden');
    } else if (section === 'work') {
        heroSection.classList.add('hidden');
        chatThread.classList.add('hidden');
        composerWrap.classList.add('disabled');
        workPanel.classList.remove('hidden');
        setMode('chat', true);
    } else if (section === 'saved') {
        heroSection.classList.add('hidden');
        chatThread.classList.add('hidden');
        composerWrap.classList.add('disabled');
        savedPanel.classList.remove('hidden');
    }
}

function addMessage(text, isUser, silent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'user-message' : 'ai-message');
    if (isUser) {
        messageDiv.textContent = text;
    } else {
        messageDiv.innerHTML = renderFormatted(text);
    }
    chatThread.appendChild(messageDiv);
    scrollToBottom(true);
    if (!silent) chatThread.classList.remove('hidden');
}

function updateAIMessage(text) {
    let aiDiv = chatThread.querySelector('.ai-message:last-child');
    if (!aiDiv || aiDiv.textContent.trim() === '') {
        aiDiv = document.createElement('div');
        aiDiv.className = 'message ai-message';
        chatThread.appendChild(aiDiv);
    }
    aiDiv.innerHTML = renderFormatted(text);
    scrollToBottom(false);
}

function clearThread() {
    chatThread.innerHTML = '';
    chatThread.classList.add('hidden');
}

function toggleHistory(open) {
    const shouldOpen = open !== undefined ? open : !historyPanel.classList.contains('open');
    historyPanel.classList.toggle('open', shouldOpen);
}

function showSystemMessage(text) {
    systemText.textContent = text;
    systemBanner.classList.remove('hidden');
    systemBanner.classList.remove('expanded');
    systemToggle.textContent = 'Devamını göster';
}

function hideSystemMessage() {
    systemBanner.classList.add('hidden');
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!isStreaming) sendMessage();
    }
});

homeBtn.addEventListener('click', () => {
    setSection('home');
    toggleHistory(false);
});

historyToggle.addEventListener('click', () => toggleHistory());
historyBack.addEventListener('click', () => toggleHistory(false));
newChatBtn.addEventListener('click', () => {
    startNewChat();
    toggleHistory(false);
});

aboutBtn.addEventListener('click', () => {
    toggleHistory(false);
    setSection('about');
});

workBtn.addEventListener('click', () => {
    toggleHistory(false);
    setSection('work');
});

savedBtn.addEventListener('click', () => {
    toggleHistory(false);
    setSection('saved');
});

presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.dataset.text || '';
        messageInput.value = text;
        sendMessage();
    });
});

window.addEventListener('click', (e) => {
    if (!historyPanel.contains(e.target) && !historyToggle.contains(e.target)) {
        toggleHistory(false);
    }
});

systemToggle.addEventListener('click', () => {
    const expanded = systemBanner.classList.toggle('expanded');
    systemToggle.textContent = expanded ? 'Daralt' : 'Devamını göster';
});

systemClose.addEventListener('click', hideSystemMessage);

workspaceChips.forEach(chip => {
    chip.addEventListener('click', () => {
        workspaceChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedWorkspace = chip.dataset.workspace;
        workspaceActive.textContent = `Aktif çalışma alanı: ${selectedWorkspace}`;
        workspaceActive.classList.remove('hidden');
        saveWorkspace();
    });
});

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isStreaming) return;
    if (currentSection === 'about' || currentSection === 'saved') {
        return;
    }
    const memoryIntent = checkMemoryIntent(message);
    if (memoryIntent === 'confirm') {
        return;
    }
    const chat = chats.find(c => c.id === currentChatId);
    if (mode === 'home' || !currentChatId || !chat) {
        startNewChat(true, false);
    }

    addMessage(message, true);
    messageInput.value = '';
    setMode('chat');

    const targetChat = chats.find(c => c.id === currentChatId);
    targetChat.messages.push({role: 'user', content: message});
    targetChat.title = targetChat.title === 'Yeni sohbet' ? message.slice(0, 48) || 'Sohbet' : targetChat.title;
    targetChat.updatedAt = new Date().toISOString();
    saveChats();
    renderHistory();

    isStreaming = true;
    sendButton.disabled = true;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: message,
                history: targetChat.messages.slice(0, -1),
                workspace: selectedWorkspace,
                memory: memoryItems.slice(-5) // son 5 kayıt hafif bağlam
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMessage = '';
        let isSystemError = false;

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {stream: true});
            if (!aiMessage && chunk.trim().toLowerCase().startsWith('hata:')) {
                showSystemMessage(chunk.trim());
                isSystemError = true;
                break;
            }
            aiMessage += chunk;
            updateAIMessage(aiMessage);
        }

        if (!isSystemError && aiMessage.trim()) {
            targetChat.messages.push({role: 'assistant', content: aiMessage});
            targetChat.updatedAt = new Date().toISOString();
            saveChats();
            renderHistory();
        }
    } catch (error) {
        showSystemMessage('Hata: ' + error.message);
    } finally {
        isStreaming = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}


function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatInline(text) {
    let html = text;
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/(?:\r?\n)+/g, '<br>');
    return html;
}

function formatBlock(block) {
    const lines = block.split('\n').filter(l => l.trim() !== '');
    if (!lines.length) return '';

    const isBullet = lines.every(l => /^\s*[-*•]\s+/.test(l));
    const isNumbered = lines.every(l => /^\s*\d+\.\s+/.test(l));

    if (isBullet) {
        return '<ul>' + lines.map(l => `<li>${formatInline(l.replace(/^\s*[-*•]\s+/, ''))}</li>`).join('') + '</ul>';
    }
    if (isNumbered) {
        return '<ol>' + lines.map(l => `<li>${formatInline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('') + '</ol>';
    }

    // Merge lines into a paragraph for readability
    return '<p>' + formatInline(lines.join(' ').trim()) + '</p>';
}

function renderFormatted(raw) {
    if (!raw) return '';
    const segments = raw.split(/```/);
    let html = '';
    segments.forEach((seg, idx) => {
        if (idx % 2 === 1) {
            html += `<pre><code>${escapeHTML(seg.trim())}</code></pre>`;
        } else {
            const escaped = escapeHTML(seg);
            const blocks = escaped.split(/\n{2,}/);
            html += blocks.map(formatBlock).join('');
        }
    });
    return html;
}

function showMemoryToast(text) {
    memoryToast.textContent = text;
    memoryToast.classList.add('show');
    setTimeout(() => memoryToast.classList.remove('show'), 1800);
}

function addMemoryItem(content, tag = '') {
    const item = {
        id: uuid(),
        title: content.split('\n')[0].slice(0, 48) || 'Kayıt',
        content,
        tag,
        createdAt: new Date().toISOString(),
    };
    memoryItems.unshift(item);
    saveMemory();
    renderMemory();
    showMemoryToast('✅ Kaydedildi');
}

function checkMemoryIntent(message) {
    const lower = message.trim().toLowerCase();
    if (pendingMemory) {
        if (['evet', 'tamam', 'onayla', 'kaydet'].includes(lower)) {
            addMemoryItem(pendingMemory.content, pendingMemory.tag);
            addMessage('Kaydedildi.', false);
            pendingMemory = null;
            return 'confirm';
        }
        if (['hayır', 'iptal', 'vazgeç'].includes(lower)) {
            addMessage('Kaydetmedim.', false);
            pendingMemory = null;
            return 'confirm';
        }
    }
    const match = message.match(/kaydet(?:\s|:)(.+)/i);
    if (match && match[1]) {
        const content = match[1].trim();
        pendingMemory = { content, tag: selectedWorkspace || '' };
        addMessage('Bunu hafızaya kaydedeyim mi?', false);
        return 'confirm';
    }
    return null;
}




const aboutCopy = Object.freeze({
    app: 'Diyalog',
    purpose: 'Yerel, açık kaynak, estetik ve yüksek kaliteli sohbet deneyimi',
    tech: 'Ollama + Qwen2.5',
    license: __idLock.license(),
    note: 'Bu bölüm bilgilendirme amaçlıdır, sohbet başlatmaz.',
});

function hydrateAbout() {
    if (aboutFields.app) aboutFields.app.textContent = aboutCopy.app;
    if (aboutFields.developer) aboutFields.developer.textContent = `${__idLock.alias()} – ${__idLock.name()}`;
    if (aboutFields.purpose) aboutFields.purpose.textContent = aboutCopy.purpose;
    if (aboutFields.tech) aboutFields.tech.textContent = aboutCopy.tech;
    if (aboutFields.license) aboutFields.license.textContent = aboutCopy.license;
    if (aboutFields.note) aboutFields.note.textContent = aboutCopy.note;
}

async function enforceIdentity() {
    try {
        const valid = await __idLock.check();
        if (!valid) {
            console.error('Geliştirici kimlik doğrulaması başarısız.');
            showSystemMessage('Kimlik doğrulaması başarısız. Geliştirici bilgileri değişmiş olabilir.');
        }
    } catch (err) {
        console.error('Kimlik doğrulama yürütülemedi:', err);
    }
}

// Baslangic
loadChats();
loadMemory();
loadWorkspace();
hydrateAbout();
enforceIdentity();
