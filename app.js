lucide.createIcons()

// DOM references
const profile = document.getElementById("profile");
const overlay = document.getElementById("overlay");
const settings = document.getElementById("settings");
const chatbar = document.getElementById("chatbar");
const viewTitle = document.getElementById("view-title");
const chatView = document.getElementById("chat-view");
const hearts = document.getElementById("hearts");
const chatInput = document.getElementById("chatInput");

// Load data
let chat = JSON.parse(localStorage.chat || "[]")
let dark = JSON.parse(localStorage.dark || "false")

if(dark) document.body.classList.add("dark")

function save() {
    localStorage.chat = JSON.stringify(chat)
    localStorage.dark = JSON.stringify(dark)
}

function enterApp() {
    document.getElementById("login").style.display = "none"
    renderChat()
}

function toggleDark(el) {
    dark = el.checked
    document.body.classList.toggle("dark")
    save()
}

function toggleProfile(v) {
    profile.classList.toggle("closed", !v)
    overlay.classList.toggle("hidden", !v)
}

function toggleSettings(v) {
    settings.classList.toggle("closed", !v)
}

function closeDrawers() {
    toggleProfile(false)
    toggleSettings(false)
}

function switchTab(name) {
    ["chat", "gallery", "plan", "game"].forEach(t => {
        document.getElementById(t + "-view").classList.add("hidden")
    })
    document.getElementById(name + "-view").classList.remove("hidden")
    chatbar.style.display = name === "chat" ? "flex" : "none"
    viewTitle.innerText = name.toUpperCase()
}

function sendMsg() {
    const v = chatInput.value.trim()
    if (!v) return
    chat.push(v)
    chatInput.value = ""
    save()
    renderChat()
}

function renderChat() {
    chatView.innerHTML = ""
    chat.forEach(t => {
        const d = document.createElement("div")
        d.textContent = t
        d.className = "chat-bubble"
        chatView.appendChild(d)
    })
    chatView.scrollTop = chatView.scrollHeight
}

function spawnHeart() {
    const h = document.createElement("div")
    h.innerText = "❤️"
    h.style.position = "absolute"
    h.style.left = Math.random() * 80 + "%"
    h.style.top = Math.random() * 80 + "%"
    h.style.fontSize = "48px"
    hearts.appendChild(h)
    setTimeout(() => h.remove(), 1000)
}

// Initialize icons
lucide.createIcons()
