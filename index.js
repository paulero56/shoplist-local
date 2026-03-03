// Shopping list — localStorage only, no sync across devices

const STORAGE_KEY = "shoppingList"

// ── Dark mode ──────────────────────────────────────────
const themeToggleEl = document.getElementById("theme-toggle")

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark")
    themeToggleEl.textContent = "☀️"
}

themeToggleEl.addEventListener("click", function () {
    document.body.classList.toggle("dark")
    const isDark = document.body.classList.contains("dark")
    themeToggleEl.textContent = isDark ? "☀️" : "🌙"
    localStorage.setItem("theme", isDark ? "dark" : "light")
})

// ── DOM refs ───────────────────────────────────────────
const inputFieldEl   = document.getElementById("input-field")
const addButtonEl    = document.getElementById("add-button")
const undoButtonEl   = document.getElementById("undo-button")
const clearButtonEl  = document.getElementById("clear-button")
const shoppingListEl = document.getElementById("shopping-list")
const itemCountEl    = document.getElementById("item-count")

let lastDeletedItem = null

// ── Storage helpers ────────────────────────────────────
function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// ── Render ─────────────────────────────────────────────
function renderList() {
    const items = loadItems()
    shoppingListEl.innerHTML = ""

    if (items.length > 0) {
        items.forEach(item => appendItemEl(item))
    } else {
        const empty = document.createElement("p")
        empty.className = "empty-state"
        empty.textContent = "Tu lista está vacía — agrega algo 🛒"
        shoppingListEl.appendChild(empty)
    }

    updateCount(items.length)
}

function updateCount(n) {
    itemCountEl.textContent = n === 1 ? "1 artículo" : `${n} artículos`
}

// ── Add item ───────────────────────────────────────────
addButtonEl.addEventListener("click", function () {
    const value = inputFieldEl.value.trim()
    if (value !== "") {
        const items = loadItems()
        items.push({ id: Date.now().toString(), value })
        saveItems(items)
        inputFieldEl.value = ""
        renderList()
    }
})

inputFieldEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addButtonEl.click()
})

// ── Undo ───────────────────────────────────────────────
undoButtonEl.addEventListener("click", function () {
    if (lastDeletedItem) {
        const items = loadItems()
        items.push(lastDeletedItem)
        saveItems(items)
        lastDeletedItem = null
        renderList()
    }
})

// ── Clear all ──────────────────────────────────────────
clearButtonEl.addEventListener("click", function () {
    if (loadItems().length === 0) return
    saveItems([])
    lastDeletedItem = null
    renderList()
})

// ── Build list item element ────────────────────────────
function appendItemEl(item) {
    const li = document.createElement("li")
    li.textContent = item.value

    li.addEventListener("click", function () {
        lastDeletedItem = item
        const items = loadItems().filter(i => i.id !== item.id)
        saveItems(items)
        renderList()
    })

    shoppingListEl.appendChild(li)
}

// ── Init ───────────────────────────────────────────────
renderList()
