// DOM selectors
const addBtns = document.querySelectorAll('.add-btn');
const saveItemBtns = document.querySelectorAll('.save-btn');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const resetBoardBtn = document.getElementById('reset-board-btn');

const listColumns = document.querySelectorAll('.drag-item-list');
const ideasList = document.getElementById('ideas-list');
const planningList = document.getElementById('planning-list');
const inProgressList = document.getElementById('in-progress-list');
const completedList = document.getElementById('completed-list');
const dragColumns = document.querySelectorAll('.drag-column');

// Local storage keys and default board data
const storageKeys = ['ideasItems', 'planningItems', 'inProgressItems', 'completedItems'];

const defaultLists = [
  ['Build a weather dashboard', 'Create a movie search app'],
  ['Choose project features', 'Sketch basic layout'],
  ['Build responsive UI', 'Add JavaScript functionality'],
  ['Set up project files', 'Initialize Git repository'],
];

// Board state
let updatedOnLoad = false;

let ideasListArray = [];
let planningListArray = [];
let inProgressListArray = [];
let completedListArray = [];
let listArrays = [];

// Drag state
let draggedItem;
let dragging = false;
let currentColumn;

// Keep listArrays synced with the four column arrays
function syncListArrays() {
  listArrays = [ideasListArray, planningListArray, inProgressListArray, completedListArray];
}

// Load saved board data or fall back to default tasks
function getSavedColumns() {
  const hasSavedColumns = storageKeys.every(key => localStorage.getItem(key));

  if (hasSavedColumns) {
    ideasListArray = JSON.parse(localStorage.getItem(storageKeys[0]));
    planningListArray = JSON.parse(localStorage.getItem(storageKeys[1]));
    inProgressListArray = JSON.parse(localStorage.getItem(storageKeys[2]));
    completedListArray = JSON.parse(localStorage.getItem(storageKeys[3]));
  } else {
    ideasListArray = [...defaultLists[0]];
    planningListArray = [...defaultLists[1]];
    inProgressListArray = [...defaultLists[2]];
    completedListArray = [...defaultLists[3]];
  }
}

// Save current board state to localStorage
function updateSavedColumns() {
  syncListArrays();

  listArrays.forEach((list, index) => {
    localStorage.setItem(storageKeys[index], JSON.stringify(list));
  });
}

// Create one task card and attach its event listeners
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.id = index;
  listEl.addEventListener('dragstart', drag);
  
  const listElText = document.createElement('span');
  listElText.classList.add('item-text');
  listElText.textContent = item;
  listElText.contentEditable = true;
  listElText.addEventListener('focusout', () => {
    updateItem(column, index);
  });
  
  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fa-solid', 'fa-xmark');
  deleteBtn.addEventListener('click', () => {
    deleteItem(column, index);
  });
  
  listEl.append(listElText, deleteBtn);
  columnEl.appendChild(listEl);
}

// Render all columns from the current board arrays
function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  syncListArrays();
  
  listArrays.forEach((array, column) => {
    listColumns[column].textContent = '';

    array.forEach((item, index) => {
      createItemEl(listColumns[column], column, item, index);
    });
  });

  updatedOnLoad = true;
  updateSavedColumns();
}

// Save edited task text, or remove the task if it is empty
function updateItem(column, id) {
  const selectedArray = listArrays[column];
  const selectedColumnItems = listColumns[column].children;
  const selectedItem = selectedColumnItems[id];
  const selectedItemText = selectedItem.querySelector('.item-text');

  if (!dragging) {
    const trimmedText = selectedItemText.textContent.trim();

    if (!trimmedText) {
      selectedArray.splice(id, 1);
    } else {
      selectedArray[id] = trimmedText;
    }

    updateDOM();
  }
}

// Add a new task to the selected column
function addToColumn(column) {
  const itemText = addItems[column].textContent.trim();
  const selectedArray = listArrays[column];

  if (itemText) {
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
  }
}

// Show the editable input area for a column
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide the input area and save the new task
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Remove a task from its column
function deleteItem(column, index) {
  listArrays[column].splice(index, 1);
  updateDOM();
}

// Reset localStorage and restore default board data
function resetBoard() {
  const confirmReset = confirm('Are you sure you want to reset the board?');

  if (confirmReset) {
    localStorage.clear();
    updatedOnLoad = false;
    updateDOM();
  }
}

// Get the current task text from one DOM column
function getItemsFromColumn(listElement) {
  return Array.from(listElement.children).map(item =>
    item.querySelector('.item-text').textContent.trim()
  );
}

// Rebuild arrays from the current DOM order after drag-and-drop
function rebuildArrays() {
  syncListArrays();

  listArrays.forEach((array, index) => {
    array.splice(0, array.length, ...getItemsFromColumn(listColumns[index])); 
  });
  
  updateDOM();
}

// Store the item being dragged and apply placeholder styling
function drag(event) {
  draggedItem = event.target;
  dragging = true;
  draggedItem.classList.add('is-dragging');
}

// Allow columns to receive dropped items
function allowDrop(event) {
  event.preventDefault();
}

// Highlight the column currently being dragged over
function dragEnter(column) {
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove('over');
  });
  dragColumns[column].classList.add('over');
  currentColumn = column;
}

// Move the dragged item into the selected column
function drop(event) {
  event.preventDefault();
  
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove('over');
  });
  
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  
  if (draggedItem) {
    draggedItem.classList.remove('is-dragging');
  }

  dragging = false;
  rebuildArrays();
}

// Event Listeners
resetBoardBtn.addEventListener('click', resetBoard);

dragColumns.forEach((dragColumn, index) => {
  dragColumn.addEventListener('drop', drop);
  dragColumn.addEventListener('dragover', allowDrop);
  dragColumn.addEventListener('dragenter', () => {
    dragEnter(index);
  });
});

addBtns.forEach((addButton, index) => {
  addButton.addEventListener('click', () => {
    showInputBox(index);
  });
});

saveItemBtns.forEach((saveButton, index) => {
  saveButton.addEventListener('click', () => {
    hideInputBox(index);
  });
});

// Initial render
updateDOM();

