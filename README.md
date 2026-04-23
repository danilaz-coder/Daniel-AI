<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Олег — Эксперт ВиталПласт | Демо виджета</title>
<style>
  /* ===== DEMO PAGE ===== */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0d2137 100%);
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .demo-center {
    text-align: center;
    padding: 40px 20px;
  }
  .demo-center h1 { font-size: 2rem; margin-bottom: 10px; }
  .demo-center p { opacity: 0.7; font-size: 1rem; }
  .demo-center .logo {
    font-size: 2.5rem; font-weight: 800;
    background: linear-gradient(135deg, #00c6ff, #0072ff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }
  .arrow {
    margin-top: 40px; font-size: 1rem; opacity: 0.6;
    animation: bounce 1.5s infinite;
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  /* ===== WIDGET STYLES ===== */
  #oleg-widget {
    position: fixed;
    bottom: 28px; right: 28px;
    z-index: 99999;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  /* Floating button */
  #oleg-btn {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    border: none; cursor: pointer;
    box-shadow: 0 6px 24px rgba(0,114,255,0.5);
    display: flex; align-items: center; justify-content: center;
    transition: transform .2s, box-shadow .2s;
    position: relative;
  }
  #oleg-btn:hover { transform: scale(1.08); box-shadow: 0 8px 32px rgba(0,114,255,0.65); }
  #oleg-btn img {
    width: 52px; height: 52px;
    border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(255,255,255,0.6);
  }
  .oleg-pulse {
    position: absolute; top: -3px; right: -3px;
    width: 18px; height: 18px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  .oleg-pulse::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 2px solid #22c55e;
    animation: oleg-ping 1.5s infinite;
  }
  @keyframes oleg-ping {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* Chat window */
  #oleg-chat {
    position: fixed;
    bottom: 108px; right: 28px;
    width: 370px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.22);
    display: none;
    flex-direction: column;
    overflow: hidden;
    max-height: 600px;
    animation: oleg-slide-up .25s ease;
    z-index: 99998;
  }
  @keyframes oleg-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  #oleg-chat.open { display: flex; }

  /* Header */
  .oleg-header {
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    padding: 16px 18px;
    display: flex; align-items: center; gap: 12px;
    position: relative;
  }
  .oleg-header img {
    width: 46px; height: 46px;
    border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(255,255,255,0.5);
    flex-shrink: 0;
  }
  .oleg-header-info { flex: 1; }
  .oleg-header-name { color: #fff; font-weight: 700; font-size: 1rem; }
  .oleg-header-sub { color: rgba(255,255,255,0.8); font-size: 0.75rem; margin-top: 2px; }
  .oleg-status {
    display: flex; align-items: center; gap: 5px;
    color: rgba(255,255,255,0.85); font-size: 0.72rem; margin-top: 3px;
  }
  .oleg-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e;
  }
  .oleg-close {
    background: rgba(255,255,255,0.15);
    border: none; color: #fff; cursor: pointer;
    width: 30px; height: 30px; border-radius: 50%;
    font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .oleg-close:hover { background: rgba(255,255,255,0.3); }

  /* Lang switcher */
  .oleg-langs {
    display: flex; gap: 4px;
    padding: 10px 14px;
    background: #f8faff;
    border-bottom: 1px solid #eef0f8;
  }
  .oleg-lang-btn {
    flex: 1; padding: 5px 0;
    border: 1px solid #d1d9f0;
    background: #fff; border-radius: 8px;
    font-size: 0.72rem; cursor: pointer;
    color: #555; transition: all .15s;
    font-weight: 500;
  }
  .oleg-lang-btn.active {
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    color: #fff; border-color: transparent;
  }

  /* Messages */
  .oleg-messages {
    flex: 1; overflow-y: auto;
    padding: 16px 14px;
    display: flex; flex-direction: column; gap: 10px;
    min-height: 220px; max-height: 310px;
    background: #f4f7ff;
  }
  .oleg-messages::-webkit-scrollbar { width: 4px; }
  .oleg-messages::-webkit-scrollbar-thumb { background: #c5d0ef; border-radius: 4px; }

  .msg {
    max-width: 82%; padding: 10px 13px;
    border-radius: 16px; font-size: 0.84rem;
    line-height: 1.5; word-break: break-word;
  }
  .msg.bot {
    background: #fff; color: #1a1a2e;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    align-self: flex-start;
  }
  .msg.user {
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    color: #fff; border-bottom-right-radius: 4px;
    align-self: flex-end;
  }
  .msg-time {
    font-size: 0.65rem; opacity: 0.5; margin-top: 3px;
    text-align: right;
  }
  .msg.bot .msg-time { text-align: left; }

  /* Typing indicator */
  .oleg-typing {
    display: flex; align-items: center; gap: 4px;
    padding: 10px 13px;
    background: #fff; border-radius: 16px; border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    align-self: flex-start; display: none;
  }
  .oleg-typing span {
    width: 7px; height: 7px; border-radius: 50%;
    background: #0072ff; display: inline-block;
    animation: typing-dot .9s infinite;
  }
  .oleg-typing span:nth-child(2) { animation-delay: .2s; }
  .oleg-typing span:nth-child(3) { animation-delay: .4s; }
  @keyframes typing-dot {
    0%,80%,100% { transform: scale(1); opacity: .5; }
    40% { transform: scale(1.3); opacity: 1; }
  }

  /* Quick buttons */
  .oleg-quick {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 10px 14px;
    background: #f8faff;
    border-top: 1px solid #eef0f8;
  }
  .oleg-quick-btn {
    flex: 1; min-width: 100px;
    padding: 7px 8px;
    background: #fff; border: 1px solid #d1d9f0;
    border-radius: 10px; font-size: 0.74rem;
    cursor: pointer; color: #0072ff; font-weight: 600;
    transition: all .15s; text-align: center;
    white-space: nowrap;
  }
  .oleg-quick-btn:hover {
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    color: #fff; border-color: transparent;
    transform: translateY(-1px);
  }

  /* Input area */
  .oleg-input-area {
    display: flex; gap: 8px;
    padding: 12px 14px;
    background: #fff;
    border-top: 1px solid #eef0f8;
  }
  .oleg-input {
    flex: 1; padding: 9px 13px;
    border: 1.5px solid #d1d9f0; border-radius: 12px;
    font-size: 0.85rem; outline: none;
    transition: border-color .2s; color: #1a1a2e;
    resize: none; height: 40px; min-height: 40px; max-height: 100px;
  }
  .oleg-input:focus { border-color: #0072ff; }
  .oleg-send {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: transform .15s, box-shadow .15s;
  }
  .oleg-send:hover { transform: scale(1.08); box-shadow: 0 4px 14px rgba(0,114,255,0.4); }
  .oleg-send svg { width: 18px; height: 18px; fill: #fff; }

  /* Footer */
  .oleg-footer {
    text-align: center; padding: 7px;
    font-size: 0.65rem; color: #aaa;
    background: #f8faff;
    border-top: 1px solid #eef0f8;
  }
  .oleg-footer a { color: #0072ff; text-decoration: none; }

  /* Social links */
  .oleg-socials {
    display: flex; gap: 8px; justify-content: center;
    padding: 8px 14px;
    background: #f8faff;
    border-top: 1px solid #eef0f8;
  }
  .oleg-social-link {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.72rem; color: #555; text-decoration: none;
    padding: 4px 8px; border-radius: 8px;
    background: #fff; border: 1px solid #e0e6f0;
    transition: all .15s;
  }
  .oleg-social-link:hover { background: #0072ff; color: #fff; border-color: transparent; }

  @media (max-width: 420px) {
    #oleg-chat { width: calc(100vw - 32px); right: 16px; bottom: 90px; }
    #oleg-btn { right: 16px; bottom: 16px; }
  }
</style>
</head>
<body>

<!-- DEMO PAGE BACKGROUND -->
<div class="demo-center">
  <div class="logo">ВиталПласт</div>
  <h1>pigment-vtp.ru</h1>
  <p>Пигменты · Лакокрасочные материалы · Полимеры · Упаковка</p>
  <div class="arrow">👇 Нажмите на кнопку Олега</div>
</div>

<!-- ============================================================ -->
<!-- ВИДЖЕТ ОЛЕГА — вставить этот блок на любой сайт             -->
<!-- ============================================================ -->

<!-- 1. Контейнер виджета -->
<div id="oleg-widget">

  <!-- Кнопка вызова чата -->
  <button id="oleg-btn" title="Спросить Олега" onclick="olegToggle()">
    <img id="oleg-avatar" src="professional_avatar_for_ai_business_expe_1776902780.png"
         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 52 52%22><circle cx=%2226%22 cy=%2226%22 r=%2226%22 fill=%22%23fff%22/><text x=%2226%22 y=%2232%22 text-anchor=%22middle%22 font-size=%2224%22>🧑‍💼</text></svg>'"
         alt="Олег">
    <div class="oleg-pulse"></div>
  </button>

  <!-- Окно чата -->
  <div id="oleg-chat">

    <!-- Шапка -->
    <div class="oleg-header">
      <img id="oleg-avatar2" src="professional_avatar_for_ai_business_expe_1776902780.png"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 46 46%22><circle cx=%2223%22 cy=%2223%22 r=%2223%22 fill=%22%23fff%22/><text x=%2223%22 y=%2230%22 text-anchor=%22middle%22 font-size=%2222%22>🧑‍💼</text></svg>'"
           alt="Олег">
      <div class="oleg-header-info">
        <div class="oleg-header-name">Олег</div>
        <div class="oleg-header-sub">Эксперт ВиталПласт</div>
        <div class="oleg-status"><span class="oleg-status-dot"></span> Онлайн</div>
      </div>
      <button class="oleg-close" onclick="olegToggle()">✕</button>
    </div>

    <!-- Переключатель языков -->
    <div class="oleg-langs">
      <button class="oleg-lang-btn active" onclick="olegSetLang('ru',this)">🇷🇺 RU</button>
      <button class="oleg-lang-btn" onclick="olegSetLang('en',this)">🇬🇧 EN</button>
      <button class="oleg-lang-btn" onclick="olegSetLang('tr',this)">🇹🇷 TR</button>
      <button class="oleg-lang-btn" onclick="olegSetLang('zh',this)">🇨🇳 ZH</button>
    </div>

    <!-- Сообщения -->
    <div class="oleg-messages" id="oleg-messages">
      <!-- Приветствие вставляется через JS -->
    </div>

    <!-- Быстрые кнопки -->
    <div class="oleg-quick">
      <button class="oleg-quick-btn" onclick="olegQuick('kp')">📄 Запросить КП</button>
      <button class="oleg-quick-btn" onclick="olegQuick('consult')">💬 Консультация</button>
      <button class="oleg-quick-btn" onclick="olegQuick('price')">💰 Цены</button>
    </div>

    <!-- Поле ввода -->
    <div class="oleg-input-area">
      <textarea class="oleg-input" id="oleg-input"
        placeholder="Напишите вопрос..."
        rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();olegSend()}"
        oninput="this.style.height='40px';this.style.height=Math.min(this.scrollHeight,100)+'px'"></textarea>
      <button class="oleg-send" onclick="olegSend()">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>

    <!-- Соцсети -->
    <div class="oleg-socials">
      <a class="oleg-social-link" href="https://vk.com/pk__vitalplast" target="_blank">📘 ВК</a>
      <a class="oleg-social-link" href="https://www.instagram.com/pkvitalplast/" target="_blank">📸 Instagram</a>
      <a class="oleg-social-link" href="https://www.youtube.com/channel/UCkh0tdKtXkba9_xdoV0A90w" target="_blank">📺 YouTube</a>
      <a class="oleg-social-link" href="https://pigment-vtp.ru" target="_blank">🌐 Сайт</a>
    </div>

    <!-- Подвал -->
    <div class="oleg-footer">
      Powered by <a href="#" target="_blank">ВиталПласт AI</a> &nbsp;|&nbsp;
      Support: <a href="https://www.instagram.com/pkvitalplast/" target="_blank">Danilaz-Coder</a>
    </div>

  </div>
</div>

<!-- ============================================================ -->
<!-- СКРИПТ ВИДЖЕТА                                               -->
<!-- ============================================================ -->
<script>
// ─── КОНФИГУРАЦИЯ ──────────────────────────────────────────────
const OLEG_CONFIG = {
  agentId: '4dfe0acc-4eb9-4b75-9f06-b030b2ae9b16',
  // Замените на ваш backend-эндпоинт, который проксирует запросы к CREAO API
  apiUrl: 'https://YOUR_BACKEND_URL/api/oleg',
  contacts: {
    vk: 'https://vk.com/pk__vitalplast',
    instagram: 'https://www.instagram.com/pkvitalplast/',
    youtube: 'https://www.youtube.com/channel/UCkh0tdKtXkba9_xdoV0A90w',
    site: 'https://pigment-vtp.ru',
    support: 'Danilaz-Coder'
  }
};

// ─── ТЕКСТЫ ПО ЯЗЫКАМ ──────────────────────────────────────────
const OLEG_TEXTS = {
  ru: {
    greeting: '👋 Привет! Я Олег, эксперт <b>ВиталПласт</b>.\n\nКонсультирую по пигментам, лакокрасочным материалам, полимерам, упаковке.\n\n<b>Чем могу помочь?</b>',
    placeholder: 'Напишите вопрос...',
    status: 'Онлайн',
    thinking: 'Олег думает...',
    kp: 'Хочу получить коммерческое предложение на продукт ВиталПласт',
    consult: 'Мне нужна консультация по пигментам и полимерам',
    price: 'Какие цены на пигменты и полимеры?',
    error: '⚠️ Ошибка соединения. Свяжитесь напрямую: pigment-vtp.ru',
    offline: '📴 В данный момент бот обрабатывает запрос. Мы ответим вам в ближайшее время!\n\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a> | 📘 <a href="https://vk.com/pk__vitalplast" target="_blank" style="color:#0072ff">ВКонтакте</a>'
  },
  en: {
    greeting: '👋 Hello! I\'m Oleg, expert at <b>VitalPlast</b>.\n\nI consult on pigments, coatings, polymers and packaging.\n\n<b>How can I help you?</b>',
    placeholder: 'Type your question...',
    status: 'Online',
    thinking: 'Oleg is thinking...',
    kp: 'I would like to receive a commercial offer for VitalPlast products',
    consult: 'I need a consultation on pigments and polymers',
    price: 'What are the prices for pigments and polymers?',
    error: '⚠️ Connection error. Contact us directly: pigment-vtp.ru',
    offline: '📴 Our bot is processing your request. We will reply shortly!\n\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a>'
  },
  tr: {
    greeting: '👋 Merhaba! Ben Oleg, <b>VitalPlast</b> uzmanı.\n\nPigmentler, boyalar, polimerler ve ambalaj konusunda danışmanlık yapıyorum.\n\n<b>Size nasıl yardımcı olabilirim?</b>',
    placeholder: 'Sorunuzu yazın...',
    status: 'Çevrimiçi',
    thinking: 'Oleg düşünüyor...',
    kp: 'VitalPlast ürünleri için ticari teklif almak istiyorum',
    consult: 'Pigmentler ve polimerler hakkında danışmanlık istiyorum',
    price: 'Pigmentlerin ve polimerlerin fiyatları nedir?',
    error: '⚠️ Bağlantı hatası. Doğrudan iletişime geçin: pigment-vtp.ru',
    offline: '📴 Botumuz talebinizi işliyor. En kısa sürede yanıt vereceğiz!'
  },
  zh: {
    greeting: '👋 您好！我是Oleg，<b>ВиталПласт</b>专家。\n\n我提供色素、涂料、聚合物和包装方面的咨询。\n\n<b>我能为您做什么？</b>',
    placeholder: '请输入您的问题...',
    status: '在线',
    thinking: 'Oleg正在思考...',
    kp: '我想获得ВиталПласт产品的商业报价',
    consult: '我需要关于色素和聚合物的咨询',
    price: '色素和聚合物的价格是多少？',
    error: '⚠️ 连接错误。请直接联系: pigment-vtp.ru',
    offline: '📴 我们的机器人正在处理您的请求。我们将尽快回复！'
  }
};

// ─── УМНЫЕ ОТВЕТЫ (работает без backend) ───────────────────────
const SMART_REPLIES = {
  ru: {
    пигмент: '🎨 <b>Пигменты ВиталПласт</b>\n\nПоставляем:\n• Фталоцианиновые (синий PB15, зелёный PG7) — для ЛКМ и пластиков\n• Органические — яркие цвета, 500–2000 руб/кг\n• Неорганические — укрывистость, 100–600 руб/кг\n• Сажа газовая — чёрный для ЛКМ и резины\n\n📩 <b>Отправить КП?</b> Напишите email и продукт.',
    лкм: '🖌️ <b>ЛКМ (лакокрасочные материалы)</b>\n\nПоставляем пигменты для:\n• Промышленных красок и эмалей\n• Антикоррозионных покрытий\n• Грунтовок и лаков\n\nФталоцианиновые — светостойкость 7-8, до 280°C.\n\n💬 Уточните тип покрытия — подберу нужный пигмент.',
    полимер: '⚗️ <b>Полимеры ВиталПласт</b>\n\n• Полипропилен ПП: 90–160 руб/кг\n• Меловая добавка CaCO3 (ввод 10–40%): 30–70 руб/кг\n• Дробленка ПЭ/ПП: 25–60 руб/кг\n• Polycom-101: модификатор ПЭ, гранулы, 0,5–1,5%\n\n📩 Нужен расчёт? Напишите объём и продукт.',
    дробленк: '♻️ <b>Дробленка ПЭ/ПП</b>\n\n• Вторичный переработанный полимер\n• Цена: 25–60 руб/кг (зависит от чистоты и цвета)\n• Применение: переработка, производство изделий\n\n🚛 Доставка по России. <b>Назовите объём?</b>',
    мешок: '📦 <b>Мешкотара и упаковка</b>\n\n• Пакеты ПЭ и ПП (ПВД, ПНД)\n• Плёнки ПЭ и ПП\n• Гибкая упаковка\n• Биг-бэги (FIBC)\n\nPOLYCOM-101 улучшает прочность мешков на растяжение. Интересует?',
    цен: '💰 <b>Ориентировочные цены</b>\n\n| Продукт | Цена |\n|---------|------|\n| Орган. пигменты | 500–2000 руб/кг |\n| Неорган. пигменты | 100–600 руб/кг |\n| Фталоцианиновые | 800–1500 руб/кг |\n| ПП | 90–160 руб/кг |\n| Меловая добавка | 30–70 руб/кг |\n| Дробленка | 25–60 руб/кг |\n\n📩 Точная цена — по запросу. Нужен КП?',
    polycom: '⚗️ <b>Polycom-101</b> — модификатор ПЭ\n\n• Форма: гранулы белого цвета\n• Совместимость: HDPE, LDPE, LLDPE\n• Дозировка: 0,5–1,5%\n\n✅ Прочность на растяжение\n✅ Больше CaCO3 и вторсырья\n✅ Гладкая глянцевая поверхность\n✅ Меньше пыли\n✅ Дольше работает оборудование\n\n<b>Назовите объём — рассчитаю КП!</b>',
    кп: '📄 <b>Запрос на КП</b>\n\nДля подготовки коммерческого предложения напишите:\n1️⃣ Продукт\n2️⃣ Объём (кг/тонн)\n3️⃣ Ваш email\n\nОлег отправит КП в течение нескольких минут! ✉️'
  }
};

// ─── СОСТОЯНИЕ ─────────────────────────────────────────────────
let olegLang = 'ru';
let olegOpen = false;
let olegTyping = null;

// ─── ИНИЦИАЛИЗАЦИЯ ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  olegAddMsg('bot', OLEG_TEXTS[olegLang].greeting, true);
});

// ─── ОТКРЫТЬ/ЗАКРЫТЬ ───────────────────────────────────────────
function olegToggle() {
  const chat = document.getElementById('oleg-chat');
  olegOpen = !olegOpen;
  if (olegOpen) { chat.classList.add('open'); olegFocusInput(); }
  else chat.classList.remove('open');
}

function olegFocusInput() {
  setTimeout(() => document.getElementById('oleg-input').focus(), 200);
}

// ─── СМЕНА ЯЗЫКА ───────────────────────────────────────────────
function olegSetLang(lang, btn) {
  olegLang = lang;
  document.querySelectorAll('.oleg-lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('oleg-input').placeholder = OLEG_TEXTS[lang].placeholder;
  // Обновить приветствие
  const msgs = document.getElementById('oleg-messages');
  msgs.innerHTML = '';
  olegAddMsg('bot', OLEG_TEXTS[lang].greeting, true);
}

// ─── БЫСТРЫЕ КНОПКИ ────────────────────────────────────────────
function olegQuick(type) {
  const t = OLEG_TEXTS[olegLang];
  const map = { kp: t.kp, consult: t.consult, price: t.price };
  if (map[type]) olegSendText(map[type]);
}

// ─── ОТПРАВКА СООБЩЕНИЯ ────────────────────────────────────────
function olegSend() {
  const inp = document.getElementById('oleg-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  inp.style.height = '40px';
  olegSendText(text);
}

function olegSendText(text) {
  olegAddMsg('user', text);
  olegShowTyping();
  // Попытка умного ответа сначала
  const smart = olegSmartReply(text);
  if (smart) {
    setTimeout(() => { olegHideTyping(); olegAddMsg('bot', smart, true); }, 900 + Math.random()*600);
  } else {
    // Запрос к API (раскомментируйте при наличии backend)
    // olegCallApi(text);
    // Пока без backend — общий ответ
    setTimeout(() => {
      olegHideTyping();
      olegAddMsg('bot', olegFallback(text), true);
    }, 1000 + Math.random()*800);
  }
}

// ─── УМНЫЙ ОТВЕТ (без backend) ──────────────────────────────────
function olegSmartReply(text) {
  const t = text.toLowerCase();
  const replies = SMART_REPLIES[olegLang] || SMART_REPLIES['ru'];
  for (const [key, val] of Object.entries(replies)) {
    if (t.includes(key)) return val;
  }
  return null;
}

function olegFallback(text) {
  const t = OLEG_TEXTS[olegLang];
  const fallbacks = {
    ru: `🧪 <b>Олег, эксперт ВиталПласт</b>\n\nПолучил ваш вопрос: <i>"${text}"</i>\n\nДля точного ответа свяжитесь:\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a>\n📘 <a href="https://vk.com/pk__vitalplast" target="_blank" style="color:#0072ff">ВКонтакте</a>\n🌐 <a href="https://pigment-vtp.ru" target="_blank" style="color:#0072ff">pigment-vtp.ru</a>\n\nИли напишите о <b>пигментах, полимерах, дробленке, КП</b> — отвечу сразу!`,
    en: `🧪 <b>Oleg, VitalPlast expert</b>\n\nGot your question. For a precise answer contact us:\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a>\n🌐 <a href="https://pigment-vtp.ru" target="_blank" style="color:#0072ff">pigment-vtp.ru</a>`,
    tr: `🧪 <b>Oleg, VitalPlast uzmanı</b>\n\nSorunuzu aldım. Kesin cevap için:\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a>`,
    zh: `🧪 <b>Oleg，ВиталПласт专家</b>\n\n收到您的问题。请联系:\n📸 <a href="https://www.instagram.com/pkvitalplast/" target="_blank" style="color:#0072ff">Instagram</a>`
  };
  return fallbacks[olegLang] || fallbacks['ru'];
}

// ─── API ВЫЗОВ (подключите свой backend) ────────────────────────
async function olegCallApi(text) {
  try {
    const res = await fetch(OLEG_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, lang: olegLang, agentId: OLEG_CONFIG.agentId })
    });
    const data = await res.json();
    olegHideTyping();
    olegAddMsg('bot', data.answer || OLEG_TEXTS[olegLang].error, true);
  } catch(e) {
    olegHideTyping();
    olegAddMsg('bot', OLEG_TEXTS[olegLang].offline, true);
  }
}

// ─── ДОБАВИТЬ СООБЩЕНИЕ ─────────────────────────────────────────
function olegAddMsg(who, text, isHtml = false) {
  const msgs = document.getElementById('oleg-messages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  const content = isHtml ? text.replace(/\n/g,'<br>') : escHtml(text).replace(/\n/g,'<br>');
  div.innerHTML = `<div>${content}</div><div class="msg-time">${time}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ─── ИНДИКАТОР НАБОРА ───────────────────────────────────────────
function olegShowTyping() {
  const msgs = document.getElementById('oleg-messages');
  const div = document.createElement('div');
  div.className = 'oleg-typing'; div.id = 'oleg-typing-el';
  div.innerHTML = '<span></span><span></span><span></span>';
  div.style.display = 'flex';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function olegHideTyping() {
  const el = document.getElementById('oleg-typing-el');
  if (el) el.remove();
}

// ─── УТИЛИТЫ ────────────────────────────────────────────────────
function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
</script>

<!-- КОНЕЦ ВИДЖЕТА -->
<!-- Для вставки на ваш сайт скопируйте блок от "ВИДЖЕТ ОЛЕГА" до "КОНЕЦ ВИДЖЕТА" -->

</body>
</html>
