// Shopping list stored locally — no Firebase, no real-time sync across devices

const STORAGE_KEY = "shoppingList"

// Dark mode toggle
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

// DOM elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const undoButtonEl = document.getElementById("undo-button")
const shoppingListEl = document.getElementById("shopping-list")

let lastDeletedItem = null

// Load items from localStorage
function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// Save items to localStorage
function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Render the shopping list from localStorage
function renderList() {
    const items = loadItems()
    clearShoppingListEl()

    if (items.length > 0) {
        items.forEach(item => appendItemToShoppingListEl(item))
    } else {
        shoppingListEl.innerHTML = "Lista Vacia"
    }
}

// Add new item when add button is clicked
addButtonEl.addEventListener("click", function () {
    const inputValue = inputFieldEl.value.trim()
    if (inputValue !== "") {
        const items = loadItems()
        const newItem = { id: Date.now().toString(), value: inputValue }
        items.push(newItem)
        saveItems(items)
        clearInputFieldEl()
        renderList()
    }
})

// Allow pressing Enter to add an item
inputFieldEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addButtonEl.click()
})

// Undo button — restore the last deleted item
undoButtonEl.addEventListener("click", function () {
    if (lastDeletedItem) {
        const items = loadItems()
        items.push(lastDeletedItem)
        saveItems(items)
        lastDeletedItem = null
        renderList()
    }
})

// Clear the shopping list element
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Append a single item to the list element
function appendItemToShoppingListEl(item) {
    const newEl = document.createElement("li")
    newEl.textContent = item.value

    newEl.addEventListener("click", function () {
        lastDeletedItem = item
        const items = loadItems().filter(i => i.id !== item.id)
        saveItems(items)
        renderList()
    })

    shoppingListEl.append(newEl)
}

// Initial render on page load
renderList()
