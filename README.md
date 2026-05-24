# Project Planner

A responsive project planner app built with HTML, CSS, and JavaScript. Users can organize tasks across multiple columns, add new tasks, edit existing tasks, delete tasks, reset the board, and drag tasks between project stages.

## Live Demo

https://alvisia.github.io/project-planner/

## Screenshots

### Desktop

<img width="1914" height="946" alt="Project Planner desktop view" src="https://github.com/user-attachments/assets/98cbc0de-84fb-429d-ab41-ad8249ac560e" />

### Mobile

<img width="394" height="798" alt="Project Planner mobile view" src="https://github.com/user-attachments/assets/9480433c-0c1e-47e0-8172-ac52b0a43426" />

## Features

- Drag and drop tasks between columns
- Add new tasks dynamically
- Edit existing task text directly on the task card
- Delete individual tasks
- Reset the board to its default tasks
- Save board changes with localStorage
- Prevent empty or whitespace-only tasks from being saved
- Visual feedback for dragging, editing, hovering, and focused elements
- Responsive layout for desktop, tablet, and mobile screens

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome
- GitHub Pages

## What I Customized

This project began as a drag-and-drop JavaScript course project from ZTM. I customized and expanded it into a project planner by adding new functionality, improving the UI, refactoring JavaScript, and making the layout responsive.

Key improvements I made:

- Changed the concept from a generic drag-and-drop board into a project planner
- Updated the column names and default tasks to match the new project concept
- Added delete icons dynamically to each task
- Added a reset board button with confirmation
- Prevented empty and whitespace-only tasks from being saved
- Improved the drag and drop feedback with column highlights and dragged-item styling
- Replaced inline event handlers with JavaScript event listeners
- Refactored repeated column rendering logic into reusable functions
- Improved localStorage handling so task changes stay saved after refresh 
- Improved responsive layout for mobile, tablet, and desktop screens

## What I Learned

While improving this project, I practiced:

- Working with the HTML Drag and Drop API
- Managing task data with arrays and localStorage
- Creating and updating DOM elements dynamically
- Using `addEventListener()` instead of inline event handlers
- Refactoring repeated JavaScript logic into reusable helper functions
- Using `Array.from()`, `.map()`, `.splice()`, and the spread operator
- Improving responsive layouts with CSS Grid, media queries, and `clamp()`
- Writing clearer class names and organizing code for maintainability

## Future Improvements

Possible future improvements include:

- Add a custom drag preview for a more polished drag-and-drop experience
- Add keyboard accessibility improvements for task controls
- Replace the browser confirm dialog with a custom styled confirmation popup
- Add categories, priorities, or due dates for tasks
- Add a dark/light theme toggle
- Improve touch support for drag-and-drop on mobile and tablet devices

## Setup

To run the project locally:

1. Clone the repository
2. Open `index.html` in your browser
