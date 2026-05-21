const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const resetBoardBtn = document.getElementById('reset-board-btn');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');
const dragColumns = document.querySelectorAll('.drag-column');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Sync listArrays with the four real arrays
function syncListArrays() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
}

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Build a weather dashboard', 'Create a movie search app'];
    progressListArray = ['Choose project features', 'Sketch basic layout'];
    completeListArray = ['Build responsive UI', 'Add JavaScript functionality'];
    onHoldListArray = ['Set up project files', 'Initialize Git repository'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  syncListArrays();
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  listArrays.forEach((list, index) => {
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(list));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.draggable = true; // Makes an element draggable
  listEl.id = index;

  listEl.addEventListener('dragstart', drag);
  // List Item Text
  const listElText = document.createElement('span');
  listElText.classList.add('item-text');
  listElText.textContent = item;
  listElText.contentEditable = true; // Makes an element editable (like an input field)

  listElText.addEventListener('focusout', () => {
    updateItem(column, index);
  });
  // Delete Button
  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fa-solid', 'fa-xmark');

  deleteBtn.addEventListener('click', () => {
    deleteItem(column, index);
  });
  // Append
  listEl.append(listElText, deleteBtn);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
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

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if Necessary, or Update Array Value
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

// Add to Column List, Reset Text Box
function addToColumn(column) {
  const itemText = addItems[column].textContent.trim();
  const selectedArray = listArrays[column];
  if (itemText !== '') {
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
  }
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Delete Item
function deleteItem(column, index) {
  listArrays[column].splice(index, 1);
  updateDOM();
}

// Reset Board to Default
function resetBoard() {
  const confirmReset = confirm('Are you sure you want to reset the board?');
  if (confirmReset) {
    localStorage.clear();
    updatedOnLoad = false;
    updateDOM();
  }
}

function getItemsFromColumn(listElement) {
  const itemTexts = Array.from(listElement.children).map(item => item.querySelector('.item-text').textContent.trim());
  return itemTexts;
}

// Allows Arrays to reflect drag and drop items
function rebuildArrays() {
  syncListArrays();
  listArrays.forEach((array, index) => {
    array.splice(0, array.length, ...getItemsFromColumn(listColumns[index])); 
  });
  
  updateDOM();
}

// When Item Starts Dragging
function drag(event) {
  draggedItem = event.target;
  dragging = true;
  draggedItem.classList.add('is-dragging');
}

// Column Allows for Item to Drop
function allowDrop(event) {
  event.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove('over');
  });
  dragColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(event) {
  event.preventDefault();
  // Remove Background Color/Padding
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
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

// On Load
updateDOM();

