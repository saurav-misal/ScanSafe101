(function () {
  const API_KEY = window.OPENROUTER_API_KEY || "";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";
  const MODEL = "openai/gpt-oss-120b:free";

  const SYSTEM_PROMPT = `You are ScanSafe Diagnostic Assistant — a helpful, concise AI support agent embedded on the ScanSafe website. ScanSafe is a community-driven UPI literacy platform that helps rural and semi-urban India learn about digital payments, fight fraud, and embrace safe digital banking.

Your role:
- Answer questions about UPI, digital payments, fraud prevention, and scam awareness.
- Help users navigate ScanSafe features (Programs, Survey, Dashboard, Learn, Quiz, Try Payment, Community).
- Be friendly, clear, and keep answers short (2-4 sentences unless more detail is requested).
- If a question is outside your scope, politely redirect to relevant ScanSafe resources.`;

  let msgs = [
    { role: "bot", txt: "Connection established. I am an automated support system programmed to verify queries regarding digital transaction protocols. State your inquiry parameter." }
  ];
  let apiHistory = [];
  let isTyping = false;

  function getTime() {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function createMsgEl(role, txt) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.innerHTML = `<div class="msg-bubble">${txt}</div><div class="msg-time">${getTime()}</div>`;
    return div;
  }

  function createTypingEl() {
    const div = document.createElement("div");
    div.className = "msg bot";
    div.id = "typing-indicator";
    div.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
    return div;
  }

  function renderQuickReplies() {
    const container = document.getElementById("quick-replies");
    if (!container) return;
    if (msgs.length > 3) {
      container.style.display = "none";
    } else {
      container.style.display = "flex";
    }
  }

  function scrollToBottom() {
    const messagesEl = document.getElementById("chat-messages");
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function handleSend(txt) {
    txt = txt || document.getElementById("chat-input").value;
    if (!txt.trim() || isTyping) return;

    msgs.push({ role: "user", txt });
    apiHistory.push({ role: "user", content: txt });
    document.getElementById("chat-input").value = "";

    const messagesEl = document.getElementById("chat-messages");
    messagesEl.appendChild(createMsgEl("user", txt));
    renderQuickReplies();
    scrollToBottom();

    isTyping = true;
    messagesEl.appendChild(createTypingEl());
    scrollToBottom();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "ScanSafe Diagnostic Assistant"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...apiHistory
          ],
          reasoning: { enabled: true }
        })
      });
      const data = await res.json();

      const typingEl = document.getElementById("typing-indicator");
      if (typingEl) typingEl.remove();

      const assistantMsg = data.choices && data.choices[0] && data.choices[0].message;
      const reply = (assistantMsg && assistantMsg.content)
        ? assistantMsg.content
        : (data.error && data.error.message) || "Sorry, I could not process that request.";

      const historyEntry = { role: "assistant", content: reply };
      if (assistantMsg && assistantMsg.reasoning_details) {
        historyEntry.reasoning_details = assistantMsg.reasoning_details;
      }
      apiHistory.push(historyEntry);
      msgs.push({ role: "bot", txt: reply });
      messagesEl.appendChild(createMsgEl("bot", reply));

    } catch (err) {
      const typingEl = document.getElementById("typing-indicator");
      if (typingEl) typingEl.remove();

      const errorMsg = "Connection error. Please check your internet and try again.";
      msgs.push({ role: "bot", txt: errorMsg });
      messagesEl.appendChild(createMsgEl("bot", errorMsg));
    }

    isTyping = false;
    scrollToBottom();
  }

  function openChat() {
    const chatBtn = document.getElementById("chat-btn");
    const chatbot = document.getElementById("chatbot");
    const backdrop = document.getElementById("chatbot-backdrop");
    chatBtn.classList.add("hidden");
    chatbot.classList.add("open");
    if (backdrop) backdrop.classList.add("show");
  }

  function closeChat() {
    const chatBtn = document.getElementById("chat-btn");
    const chatbot = document.getElementById("chatbot");
    const backdrop = document.getElementById("chatbot-backdrop");
    chatbot.classList.remove("open");
    chatBtn.classList.remove("hidden");
    if (backdrop) backdrop.classList.remove("show");
  }

  function createBackdrop() {
    if (document.getElementById("chatbot-backdrop")) return;
    const overlay = document.createElement("div");
    overlay.id = "chatbot-backdrop";
    document.body.appendChild(overlay);
  }

  function init() {
    const chatBtn = document.getElementById("chat-btn");
    const chatbot = document.getElementById("chatbot");
    const closeBtn = document.getElementById("chat-close");
    const sendBtn = document.getElementById("chat-send");
    const inputEl = document.getElementById("chat-input");
    const messagesEl = document.getElementById("chat-messages");
    const quickReplies = document.querySelectorAll(".qr");

    createBackdrop();
    const backdrop = document.getElementById("chatbot-backdrop");

    messagesEl.appendChild(createMsgEl("bot", msgs[0].txt));

    chatBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openChat();
    });

    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeChat();
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeChat();
      });
    }

    document.addEventListener("click", function (e) {
      if (!chatbot.classList.contains("open")) return;
      if (chatbot.contains(e.target) || chatBtn.contains(e.target)) return;
      closeChat();
    });

    chatbot.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    sendBtn.addEventListener("click", function () {
      handleSend();
    });

    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSend();
    });

    quickReplies.forEach(function (btn) {
      btn.addEventListener("click", function () {
        handleSend(btn.dataset.query);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
