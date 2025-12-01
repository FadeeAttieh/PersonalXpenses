# 📚 Building a Personal Finance Web Application
## A Complete Guide to Modern Web Development

**Learn HTML, CSS, JavaScript, Node.js, PostgreSQL, and Docker by Building a Real Application**

---

**Author**: Educational Guide based on a production Personal Finance App  
**Target Audience**: Beginners to Intermediate Developers  
**Prerequisites**: Basic computer skills, willingness to learn  
**Time to Complete**: 40-60 hours of study and practice

---

## Table of Contents

### Part I: Fundamentals
- [Chapter 1: Introduction to Web Applications](#chapter-1-introduction-to-web-applications)
- [Chapter 2: Basic HTML You Need to Know](#chapter-2-basic-html-you-need-to-know)
- [Chapter 3: Basic CSS You Need to Know](#chapter-3-basic-css-you-need-to-know)
- [Chapter 4: Basic JavaScript You Need to Know](#chapter-4-basic-javascript-you-need-to-know)

### Part II: Architecture
- [Chapter 5: Architecture of This Personal Finance App](#chapter-5-architecture-of-this-personal-finance-app)
- [Chapter 6: App Loading Sequence](#chapter-6-app-loading-sequence)

### Part III: Frontend Deep Dive
- [Chapter 7: The Frontend Explained](#chapter-7-the-frontend-explained)
- [Chapter 8: Multi-View System Implementation](#chapter-8-multi-view-system-implementation)
- [Chapter 9: Forms and User Input](#chapter-9-forms-and-user-input)

### Part IV: Backend Deep Dive
- [Chapter 10: The Backend Explained](#chapter-10-the-backend-explained)
- [Chapter 11: Database Design and Models](#chapter-11-database-design-and-models)
- [Chapter 12: API Routes and Controllers](#chapter-12-api-routes-and-controllers)

### Part V: Advanced Topics
- [Chapter 13: Authentication and Security](#chapter-13-authentication-and-security)
- [Chapter 14: Communication Between Frontend and Backend](#chapter-14-communication-between-frontend-and-backend)
- [Chapter 15: Multi-Currency Support](#chapter-15-multi-currency-support)

### Part VI: Deployment and Beyond
- [Chapter 16: Docker and Containerization](#chapter-16-docker-and-containerization)
- [Chapter 17: How to Modify and Extend the App](#chapter-17-how-to-modify-and-extend-the-app)
- [Chapter 18: Common Mistakes and Debugging](#chapter-18-common-mistakes-and-debugging)

### Appendices
- [Appendix A: Complete Folder Structure](#appendix-a-complete-folder-structure)
- [Appendix B: Glossary](#appendix-b-glossary)
- [Appendix C: Resources and Further Learning](#appendix-c-resources-and-further-learning)

---

# Chapter 1: Introduction to Web Applications

## What is a Web Application?

A **web application** is software that runs in your web browser. Unlike traditional desktop applications that you install on your computer, web apps run on remote servers and you access them through a URL (like https://example.com).

### Examples of Web Applications:
- Gmail (email client)
- Google Docs (document editor)
- Netflix (video streaming)
- **This Personal Finance App** (expense tracking)

### Web App vs Website

| Website | Web Application |
|---------|----------------|
| Mostly static content | Interactive and dynamic |
| Read-only information | User can create, edit, delete data |
| Example: News site | Example: Facebook, Twitter |
| Simple navigation | Complex functionality |

**Our Personal Finance App is a web application** because it:
- Lets users create accounts
- Stores and retrieves personalized data
- Performs calculations (totals, averages, statistics)
- Has multiple interactive features (forms, charts, views)

## How Web Apps Work: The Client-Server Model

```
┌─────────────────────┐          ┌─────────────────────┐
│                     │          │                     │
│   YOUR BROWSER      │◄────────►│   SERVER            │
│   (Frontend/Client) │  HTTP    │   (Backend)         │
│                     │  Request │                     │
│   - HTML            │  /       │   - Node.js         │
│   - CSS             │  Response│   - Express         │
│   - JavaScript      │          │   - API Endpoints   │
│                     │          │                     │
└─────────────────────┘          └──────────┬──────────┘
                                            │
                                            │
                                 ┌──────────▼──────────┐
                                 │                     │
                                 │   DATABASE          │
                                 │   (PostgreSQL)      │
                                 │                     │
                                 │   - Users           │
                                 │   - Entries         │
                                 │   - Balances        │
                                 │                     │
                                 └─────────────────────┘
```

### The Three-Tier Architecture

Our app uses a **three-tier architecture**:

1. **Presentation Tier (Frontend)**: What the user sees and interacts with
   - HTML for structure
   - CSS for styling
   - JavaScript for interactivity

2. **Application Tier (Backend)**: The brain of the application
   - Node.js with Express framework
   - Handles business logic
   - Processes requests from frontend
   - Communicates with database

3. **Data Tier (Database)**: Where information is stored
   - PostgreSQL database
   - Stores users, transactions, balances
   - Ensures data persistence

### How They Work Together: A Simple Example

Let's say you want to add a new expense of $50 for groceries:

```
Step 1: USER ACTION
└─► User fills out form and clicks "Add Expense"

Step 2: FRONTEND (JavaScript)
└─► Collects form data: { amount: 50, note: "Groceries", type: "Food" }
    └─► Sends HTTP POST request to backend API

Step 3: BACKEND (Node.js)
└─► Receives request at POST /entries endpoint
    └─► Validates the data (is amount a number? is user logged in?)
        └─► Inserts new record into database

Step 4: DATABASE (PostgreSQL)
└─► Stores: INSERT INTO Entries (amount, note, typeId, userId, ...)

Step 5: BACKEND RESPONSE
└─► Sends back: { success: true, entry: { id: 123, amount: 50, ... } }

Step 6: FRONTEND UPDATE
└─► Receives response
    └─► Updates the display to show new expense
        └─► User sees their $50 expense in the list
```

## Frontend vs Backend: Key Differences

### Frontend (What You See)

**Location**: Runs in your browser  
**Languages**: HTML, CSS, JavaScript  
**Purpose**: User interface and experience  
**Can Access**: Only what the server sends it  
**Security**: Never trust frontend! Users can modify it

**In Our App**:
- File: `/Public/index.html` (~5,400 lines)
- Handles: Forms, tables, charts, view switching
- Stores: Temporary data in `localStorage`

### Backend (The Brain)

**Location**: Runs on the server  
**Languages**: Node.js (JavaScript on the server)  
**Purpose**: Business logic, data validation, security  
**Can Access**: Database, external APIs, file system  
**Security**: This is where security matters

**In Our App**:
- File: `/app.js` + controllers + routes
- Handles: Authentication, data validation, database operations
- Protects: User data, ensures rules are followed

## Understanding HTTP: How Frontend and Backend Talk

**HTTP** (HyperText Transfer Protocol) is the language browsers and servers use to communicate.

### HTTP Methods (Verbs)

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Get list of expenses |
| **POST** | Create new data | Add new expense |
| **PUT/PATCH** | Update existing data | Edit an expense |
| **DELETE** | Remove data | Delete an expense |

### HTTP Request Example

```javascript
// Frontend sends this:
fetch('/entries', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  },
  body: JSON.stringify({
    amount: 50,
    note: 'Groceries',
    category: 'expense'
  })
})
```

### HTTP Response Example

```javascript
// Backend sends this back:
{
  "status": 201,  // 201 means "Created"
  "data": {
    "id": 123,
    "amount": 50,
    "note": "Groceries",
    "category": "expense",
    "date": "2025-11-29",
    "userId": 1
  }
}
```

### HTTP Status Codes (Important Ones)

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK | Data retrieved successfully |
| **201** | Created | New record added |
| **400** | Bad Request | Invalid data sent |
| **401** | Unauthorized | Not logged in |
| **403** | Forbidden | Logged in but no permission |
| **404** | Not Found | URL doesn't exist |
| **500** | Server Error | Backend crashed |

## What Makes Our App Special?

This Personal Finance App is a **Single Page Application (SPA)**:

### Traditional Multi-Page App:
```
Click "Income" → Browser loads income.html (full page reload)
Click "Expenses" → Browser loads expenses.html (full page reload)
```

### Our Single Page App:
```
Click "Income" → JavaScript hides all sections, shows income section (no reload!)
Click "Expenses" → JavaScript hides all sections, shows expenses section (no reload!)
```

**Benefits**:
- ⚡ Faster: No page reloads
- 🎯 Smoother: No white flashes between pages
- 📱 App-like: Feels like a native mobile app
- 💾 Efficient: Loads data once, reuses it

## Key Technologies in Our Stack

### Frontend Technologies

1. **HTML5**: Structure and semantic meaning
2. **CSS3**: Styling with gradients, animations, flexbox, grid
3. **Vanilla JavaScript**: No frameworks! Pure JavaScript for learning
4. **localStorage**: Browser storage for user preferences
5. **Fetch API**: Making HTTP requests to backend

### Backend Technologies

1. **Node.js v20**: JavaScript runtime on the server
2. **Express.js**: Web framework for handling routes
3. **Sequelize ORM**: Talks to database using JavaScript objects
4. **PostgreSQL 16**: Relational database (like Excel on steroids)
5. **JWT (JSON Web Tokens)**: Secure authentication
6. **bcrypt**: Password encryption
7. **CSRF Protection**: Security against attacks

### DevOps Technologies

1. **Docker**: Containerization (app runs the same everywhere)
2. **Docker Compose**: Manages multiple containers
3. **Git**: Version control
4. **VS Code Dev Containers**: Consistent development environment

## The Development Environment

Our app runs in **Docker containers**:

```
┌────────────────────────────────────────────────────┐
│  Docker Compose Environment                        │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │   App Container  │  │   DB Container   │      │
│  │   (Port 3000)    │  │   (Port 5432)    │      │
│  │                  │  │                  │      │
│  │  - Node.js       │  │  - PostgreSQL    │      │
│  │  - Express       │  │  - Data Storage  │      │
│  │  - Our Code      │  │                  │      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌──────────────────┐                            │
│  │  pgAdmin         │                            │
│  │  (Port 8080)     │                            │
│  │                  │                            │
│  │  - DB Admin UI   │                            │
│  └──────────────────┘                            │
└────────────────────────────────────────────────────┘
```

**Why Docker?**
- ✅ Everyone has the same environment
- ✅ Easy to start: `docker compose up -d`
- ✅ Isolates dependencies
- ✅ Production-ready setup

## Chapter Summary

You've learned:
- ✅ What a web application is
- ✅ Client-Server architecture
- ✅ Frontend vs Backend responsibilities
- ✅ HTTP protocol basics
- ✅ Single Page Application concept
- ✅ Technologies in our stack
- ✅ Development environment setup

## Exercise 1.1: Explore the App

Before diving into code, explore the running app:

1. Start the app: `docker compose up -d`
2. Open browser to `http://localhost:3000`
3. Open browser DevTools (F12)
4. Go to Network tab
5. Register a new account
6. Watch the Network tab - see the POST request to `/auth/register`
7. Add an expense
8. Watch the Network tab - see the POST request to `/entries`

**Questions to Answer**:
1. What HTTP method is used to register?
2. What HTTP status code is returned on successful registration?
3. How many network requests happen when you add an expense?

---

# Chapter 2: Basic HTML You Need to Know

## What is HTML?

**HTML** (HyperText Markup Language) is the skeleton of every web page. It defines the **structure** and **content**, but not the appearance (that's CSS) or behavior (that's JavaScript).

Think of building a house:
- **HTML** = The wooden frame and walls (structure)
- **CSS** = Paint, wallpaper, decorations (appearance)
- **JavaScript** = Lights, plumbing, HVAC (functionality)

## HTML Document Structure

Every HTML page follows this basic structure:

```html
<!DOCTYPE html>              <!-- Tells browser: "This is HTML5" -->
<html lang="en">             <!-- Root element, language = English -->
<head>                       <!-- Metadata (not visible on page) -->
  <meta charset="UTF-8">     <!-- Character encoding -->
  <title>My Page</title>     <!-- Browser tab title -->
  <link rel="stylesheet" href="styles.css">  <!-- Load CSS -->
</head>
<body>                       <!-- Visible content goes here -->
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
  <script src="script.js"></script>  <!-- Load JavaScript -->
</body>
</html>
```

### Explanation of Each Part

| Element | Purpose | Required? |
|---------|---------|-----------|
| `<!DOCTYPE html>` | Declares HTML5 | Yes |
| `<html>` | Root container | Yes |
| `<head>` | Metadata section | Yes |
| `<meta charset="UTF-8">` | Character encoding | Recommended |
| `<title>` | Page title | Yes |
| `<body>` | Visible content | Yes |

## HTML Elements and Tags

An HTML **element** consists of:

```html
<tagname attribute="value">Content</tagname>
  ▲        ▲                 ▲         ▲
  │        │                 │         │
Opening   Attribute      Content   Closing
 Tag                                 Tag
```

### Self-Closing Tags

Some tags don't have content, so they close themselves:

```html
<img src="photo.jpg" alt="A photo">     <!-- Old style -->
<img src="photo.jpg" alt="A photo" />   <!-- XHTML style -->
<br>                                     <!-- Line break -->
<input type="text">                     <!-- Form input -->
```

## Essential HTML Elements Used in Our App

### 1. Headings (h1-h6)

```html
<h1>Most Important</h1>
<h2>Section Title</h2>
<h3>Sub-section</h3>
<h4>Sub-sub-section</h4>
<!-- h5 and h6 rarely used -->
```

**In Our App**:
```html
<h2 style="margin:0;">Income</h2>
<h3 style="margin:0 0 0.5em 0;">💼 Portfolio Overview</h3>
```

### 2. Paragraphs and Text

```html
<p>This is a paragraph.</p>
<span>Inline text</span>
<strong>Bold text</strong>
<em>Italic text</em>
```

### 3. Divisions (Containers)

```html
<div class="container">
  <div class="section">
    <p>Content here</p>
  </div>
</div>
```

**Purpose**: Groups related content together  
**In Our App**: Everything is wrapped in divs for styling

### 4. Sections (Semantic HTML)

```html
<section id="income">
  <header>
    <h2>Income</h2>
  </header>
  <main>
    <!-- Main content -->
  </main>
</section>
```

**Semantic HTML** means using tags that describe their purpose:
- `<section>` = A section of content
- `<header>` = Header area
- `<footer>` = Footer area
- `<nav>` = Navigation menu
- `<article>` = Self-contained content

**Our App Structure**:
```html
<body>
  <div id="initialScreen">...</div>    <!-- Landing page -->
  <nav id="sidebar">...</nav>          <!-- Navigation menu -->
  <div class="container">              <!-- Main content -->
    <section id="income">...</section>
    <section id="expenses">...</section>
    <section id="balances">...</section>
    <!-- More sections -->
  </div>
</body>
```

### 5. Forms (User Input)

Forms are how users send data to the server:

```html
<form id="incomeForm">
  <label for="amount">Amount:</label>
  <input 
    type="number" 
    id="amount" 
    name="amount" 
    required
    step="0.01"
    min="0"
  >
  
  <label for="note">Note:</label>
  <input type="text" id="note" name="note">
  
  <button type="submit">Add Income</button>
</form>
```

**Form Elements**:

| Element | Purpose | Example |
|---------|---------|---------|
| `<input type="text">` | Single-line text | Name, note |
| `<input type="number">` | Numbers only | Amount, PIN |
| `<input type="email">` | Email validation | user@example.com |
| `<input type="password">` | Hidden text | PIN, password |
| `<input type="date">` | Date picker | 2025-11-29 |
| `<select>` | Dropdown menu | Choose type |
| `<textarea>` | Multi-line text | Long descriptions |
| `<button>` | Clickable button | Submit, Cancel |

**Our Income Form** (simplified):
```html
<form id="incomeForm">
  <!-- Amount -->
  <input type="number" name="amount" step="0.01" required>
  
  <!-- Currency -->
  <select name="currency" required>
    <option value="USD">USD</option>
    <option value="LBP">LBP</option>
  </select>
  
  <!-- Date -->
  <input type="date" name="date" required>
  
  <!-- Type (dropdown) -->
  <select name="typeId" required>
    <option value="1">Salary</option>
    <option value="2">Freelance</option>
  </select>
  
  <!-- Note -->
  <input type="text" name="note">
  
  <!-- Submit -->
  <button type="submit">Add Income</button>
</form>

<!-- Result message -->
<div id="incomeResult"></div>
```

### 6. Tables

Tables display data in rows and columns:

```html
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2025-11-29</td>
      <td>$500</td>
      <td>Salary</td>
    </tr>
    <tr>
      <td>2025-11-28</td>
      <td>$50</td>
      <td>Groceries</td>
    </tr>
  </tbody>
</table>
```

**Table Structure**:
- `<table>` = Container
- `<thead>` = Header section
- `<tbody>` = Body section
- `<tr>` = Table row
- `<th>` = Header cell (bold)
- `<td>` = Data cell

**Our App's Table View**:
```html
<div class="type-table-view">
  <table class="type-table">
    <thead>
      <tr>
        <th>Type</th>
        <th>Category</th>
        <th>Currency</th>
        <th>Usage Count</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Salary</td>
        <td>income</td>
        <td>USD</td>
        <td>12</td>
        <td><button onclick="deleteType(1)">Delete</button></td>
      </tr>
    </tbody>
  </table>
</div>
```

### 7. Lists

```html
<!-- Unordered List (bullets) -->
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<!-- Ordered List (numbers) -->
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>
```

**Our Sidebar Menu**:
```html
<ul>
  <li><a href="#income" onclick="showSection('income')">💵 Income</a></li>
  <li><a href="#expenses" onclick="showSection('expenses')">💸 Expenses</a></li>
  <li><a href="#balances" onclick="showSection('balances')">💰 Balances</a></li>
</ul>
```

### 8. Links and Buttons

```html
<!-- Link to another page -->
<a href="https://google.com">Go to Google</a>

<!-- Link to section on same page -->
<a href="#income">Jump to Income</a>

<!-- Button that runs JavaScript -->
<button onclick="doSomething()">Click Me</button>

<!-- Link styled as button -->
<a href="#" class="button">I look like a button</a>
```

## HTML Attributes

Attributes provide extra information about elements:

### Common Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `id` | Unique identifier | `<div id="income">` |
| `class` | CSS class name(s) | `<div class="card active">` |
| `style` | Inline CSS | `<p style="color:red;">` |
| `onclick` | JavaScript event | `<button onclick="submit()">` |
| `data-*` | Custom data | `<div data-currency="USD">` |
| `name` | Form field name | `<input name="amount">` |
| `required` | Form validation | `<input required>` |
| `disabled` | Disable element | `<button disabled>` |

### ID vs Class

```html
<!-- ID: Unique, use once per page -->
<div id="sidebar"></div>
<div id="mainContent"></div>

<!-- Class: Reusable, use many times -->
<div class="card"></div>
<div class="card active"></div>
<div class="card inactive"></div>
```

**Rules**:
- IDs must be unique (only one `id="sidebar"` per page)
- Classes can repeat (many elements can have `class="card"`)
- JavaScript uses IDs to find specific elements: `document.getElementById('sidebar')`
- CSS uses classes to style groups: `.card { border: 1px solid #ccc; }`

## How Our App Uses HTML

Let's look at a real section from our app:

```html
<!-- Income Section -->
<section id="income" style="display:none;">
  <!-- Header with gradient background -->
  <div class="income-group-header">
    <span class="income-arrow">▼</span>
    <h2 style="margin:0;">Income</h2>
    <button 
      class="tutorial-btn" 
      onclick="showTutorial('income')"
      title="Help"
    >
      ?
    </button>
  </div>
  
  <!-- Form to add new income -->
  <form id="incomeForm">
    <input type="number" name="amount" placeholder="Amount" required>
    <select name="currency">
      <option value="USD">USD</option>
      <option value="LBP">LBP</option>
    </select>
    <input type="date" name="date" required>
    <select name="typeId"></select>
    <input type="text" name="note" placeholder="Note">
    <button type="submit">Add Income</button>
  </form>
  
  <!-- Result message -->
  <div id="incomeResult"></div>
  
  <!-- View switcher buttons -->
  <div class="data-view-switcher">
    <button onclick="changeIncomeView('cards')">🃏 Cards</button>
    <button onclick="changeIncomeView('tabs')">📑 Tabs</button>
    <button onclick="changeIncomeView('columns')">⚏ Columns</button>
    <button onclick="changeIncomeView('timeline')">📅 Timeline</button>
    <button onclick="changeIncomeView('dashboard')">📊 Dashboard</button>
  </div>
  
  <!-- Data display area (filled by JavaScript) -->
  <div id="incomeGrid"></div>
</section>
```

### Key Concepts in This Code:

1. **`style="display:none;"`**: Section is hidden by default
2. **`onclick="..."`**: Buttons trigger JavaScript functions
3. **`id="incomeForm"`**: JavaScript can find this form
4. **`name="amount"`**: Form data will have key "amount"
5. **`required`**: Browser won't submit if empty
6. **`<div id="incomeGrid">`**: JavaScript fills this with data

## HTML Best Practices

### 1. Always Close Tags

```html
<!-- ❌ Bad -->
<div>
  <p>Unclosed paragraph
</div>

<!-- ✅ Good -->
<div>
  <p>Closed paragraph</p>
</div>
```

### 2. Use Semantic HTML

```html
<!-- ❌ Bad: No meaning -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

<!-- ✅ Good: Clear meaning -->
<header>
  <nav>
    <a href="#home">Home</a>
  </nav>
</header>
```

### 3. Proper Nesting

```html
<!-- ❌ Bad: Overlapping tags -->
<div><span>Text</div></span>

<!-- ✅ Good: Proper nesting -->
<div><span>Text</span></div>
```

### 4. Use Meaningful IDs and Classes

```html
<!-- ❌ Bad: Unclear names -->
<div id="x1"></div>
<div class="a"></div>

<!-- ✅ Good: Descriptive names -->
<div id="incomeForm"></div>
<div class="card-header"></div>
```

### 5. Indentation for Readability

```html
<!-- ❌ Bad: Hard to read -->
<div><form><input type="text"><button>Submit</button></form></div>

<!-- ✅ Good: Properly indented -->
<div>
  <form>
    <input type="text">
    <button>Submit</button>
  </form>
</div>
```

## Common HTML Patterns in Our App

### Pattern 1: Card Layout

```html
<div class="card">
  <div class="card-header">
    <span class="card-icon">💵</span>
    <span class="card-title">USD</span>
  </div>
  <div class="card-body">
    <div class="card-stat">
      <span class="stat-label">Total:</span>
      <span class="stat-value">$1,500.00</span>
    </div>
  </div>
  <div class="card-footer">
    <button class="button">View Details</button>
  </div>
</div>
```

### Pattern 2: Modal (Popup)

```html
<div id="loginModal" class="modal" style="display:none;">
  <div class="modal-content">
    <span class="close" onclick="closeModal()">&times;</span>
    <h2>Login</h2>
    <form>
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="pin" placeholder="PIN">
      <button type="submit">Login</button>
    </form>
  </div>
</div>
```

### Pattern 3: Data Grid Container

```html
<div id="incomeGrid">
  <!-- JavaScript fills this dynamically -->
</div>
```

## Chapter Summary

You've learned:
- ✅ HTML document structure
- ✅ Essential HTML elements
- ✅ Forms and input types
- ✅ Tables for data display
- ✅ Attributes (id, class, style, onclick)
- ✅ Semantic HTML
- ✅ Best practices
- ✅ Common patterns in our app

## Exercise 2.1: Create a Simple Form

Create an HTML file with a form to track daily water intake:

**Requirements**:
1. Form should have:
   - Number input for glasses (min: 0, max: 20)
   - Date input
   - Text input for notes
   - Submit button
2. Display area for results below form
3. Use proper semantic HTML
4. Give appropriate IDs to elements

**Bonus**: Add a dropdown to select size (Small/Medium/Large)

**Solution** (Try first before looking!):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Water Tracker</title>
</head>
<body>
  <h1>Daily Water Intake</h1>
  
  <form id="waterForm">
    <label for="glasses">Glasses of Water:</label>
    <input 
      type="number" 
      id="glasses" 
      name="glasses" 
      min="0" 
      max="20" 
      required
    >
    
    <label for="date">Date:</label>
    <input type="date" id="date" name="date" required>
    
    <label for="size">Glass Size:</label>
    <select id="size" name="size">
      <option value="small">Small (8oz)</option>
      <option value="medium">Medium (12oz)</option>
      <option value="large">Large (16oz)</option>
    </select>
    
    <label for="notes">Notes:</label>
    <input type="text" id="notes" name="notes">
    
    <button type="submit">Track Water</button>
  </form>
  
  <div id="result"></div>
</body>
</html>
```

---

# Chapter 3: Basic CSS You Need to Know

## What is CSS?

**CSS** (Cascading Style Sheets) is the makeup artist of the web. While HTML provides the structure, CSS makes it look beautiful.

Think of it like this:
- **HTML** = A plain document with text
- **CSS** = Colors, fonts, layouts, animations

## How to Add CSS

### Method 1: Inline CSS (Not Recommended)

```html
<h1 style="color: blue; font-size: 24px;">Title</h1>
```

❌ **Problems**: Hard to maintain, repeats code

### Method 2: Internal CSS

```html
<head>
  <style>
    h1 {
      color: blue;
      font-size: 24px;
    }
  </style>
</head>
```

✅ **Better**: Centralized in one place

### Method 3: External CSS (Best Practice)

```html
<head>
  <link rel="stylesheet" href="css/styles.css">
</head>
```

**Our app uses this method**:
```html
<link rel="stylesheet" href="css/styles.css">
```

✅ **Best**: Separate file, reusable, cacheable

## CSS Syntax

```css
selector {
  property: value;
  property: value;
}
```

Example:
```css
h1 {
  color: purple;
  font-size: 32px;
  margin-bottom: 20px;
}
```

## CSS Selectors

Selectors tell CSS which HTML elements to style.

### 1. Element Selector

```css
/* Targets all <p> elements */
p {
  color: black;
  font-size: 16px;
}
```

### 2. Class Selector

```css
/* Targets elements with class="button" */
.button {
  background: purple;
  color: white;
  padding: 10px 20px;
}
```

```html
<button class="button">Click Me</button>
<a class="button">Link Button</a>
```

### 3. ID Selector

```css
/* Targets element with id="sidebar" */
#sidebar {
  width: 250px;
  background: #f5f5f5;
}
```

```html
<nav id="sidebar">...</nav>
```

### 4. Descendant Selector

```css
/* Targets <p> inside .card */
.card p {
  margin: 10px;
}
```

```html
<div class="card">
  <p>This will be styled</p>
</div>
<p>This won't be styled</p>
```

### 5. Multiple Selectors

```css
/* Same styles for h1, h2, h3 */
h1, h2, h3 {
  font-family: Arial, sans-serif;
  color: #333;
}
```

### 6. Pseudo-classes

```css
/* When hovering over a button */
.button:hover {
  background: darkpurple;
  transform: scale(1.05);
}

/* First child */
li:first-child {
  font-weight: bold;
}

/* Nth child */
tr:nth-child(even) {
  background: #f9f9f9;
}
```

## The Box Model

Every HTML element is a box:

```
┌─────────────────────────────────────┐
│ Margin (transparent space outside)  │
│ ┌─────────────────────────────────┐ │
│ │ Border                          │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Padding (space inside)      │ │ │
│ │ │ ┌─────────────────────────┐ │ │ │
│ │ │ │ Content                 │ │ │ │
│ │ │ │ (text, images, etc)     │ │ │ │
│ │ │ └─────────────────────────┘ │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

```css
.card {
  /* Content dimensions */
  width: 300px;
  height: 200px;
  
  /* Padding: space inside border */
  padding: 20px;
  
  /* Border */
  border: 2px solid #ccc;
  
  /* Margin: space outside border */
  margin: 10px;
}
```

### Shorthand Properties

```css
/* Individual sides */
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;

/* Shorthand: top, right, bottom, left */
padding: 10px 20px 10px 20px;

/* Shorthand: top/bottom, left/right */
padding: 10px 20px;

/* Shorthand: all sides */
padding: 10px;
```

## Colors in CSS

### Named Colors
```css
color: red;
background: blue;
```

### Hex Colors
```css
color: #667eea;        /* Purple */
background: #f5f5f5;   /* Light gray */
```

### RGB/RGBA
```css
color: rgb(102, 126, 234);           /* Purple */
background: rgba(102, 126, 234, 0.5); /* 50% transparent */
```

### Our App's Color Scheme

```css
/* Primary purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Neutral backgrounds */
background: #f5f5f5;   /* Light gray */
background: white;

/* Text colors */
color: #333;           /* Dark gray (main text) */
color: #888;           /* Medium gray (secondary text) */
color: #999;           /* Light gray (muted text) */
```

## Gradients

Linear gradients create smooth color transitions:

```css
/* Simple gradient: left to right */
background: linear-gradient(to right, #667eea, #764ba2);

/* Angled gradient: 135 degrees */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Multiple colors */
background: linear-gradient(90deg, red, yellow, green);
```

**Our purple gradient** (used throughout app):
```css
.income-group-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 10px;
}
```

## Flexbox Layout

Flexbox makes it easy to align and distribute items:

```css
.container {
  display: flex;              /* Enable flexbox */
  justify-content: center;    /* Center horizontally */
  align-items: center;        /* Center vertically */
  gap: 20px;                  /* Space between items */
}
```

### Flex Properties

```css
/* Container properties */
.flex-container {
  display: flex;
  flex-direction: row;         /* row | column */
  justify-content: space-between; /* start | center | end | space-between */
  align-items: stretch;        /* start | center | end | stretch */
  flex-wrap: wrap;             /* wrap items to next line */
  gap: 10px;                   /* space between items */
}

/* Item properties */
.flex-item {
  flex: 1;                     /* grow to fill space */
  flex-shrink: 0;              /* don't shrink */
  order: 2;                    /* reorder items */
}
```

**Example from our app**:
```css
.insights-grid {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.insight-card {
  flex: 1;
  min-width: 200px;
  padding: 1.5em;
  background: white;
  border-radius: 10px;
}
```

## Grid Layout

CSS Grid creates two-dimensional layouts:

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-gap: 20px;
  padding: 20px;
}
```

**Our register form** (2 columns):
```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2 equal columns */
  gap: 1em;
}

/* On mobile: stack vertically */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;    /* 1 column */
  }
}
```

## Responsive Design

Make the app work on all screen sizes:

```css
/* Default styles (desktop) */
.sidebar {
  width: 250px;
  position: fixed;
}

/* Tablet */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: relative;
  }
}
```

**Breakpoints in our app**:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## Animations and Transitions

### Transitions (Smooth Changes)

```css
.button {
  background: purple;
  transition: all 0.3s ease;
}

.button:hover {
  background: darkpurple;
  transform: scale(1.05);
}
```

**Properties**:
- `transition-property`: what to animate (background, transform, all)
- `transition-duration`: how long (0.3s, 500ms)
- `transition-timing-function`: easing (ease, linear, ease-in-out)

### Keyframe Animations

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar {
  animation: slideIn 0.3s ease;
}
```

**Our sidebar animation**:
```css
#sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

#sidebar.show {
  transform: translateX(0);
}
```

## Important CSS Properties in Our App

### 1. Display

```css
/* Hide element completely */
display: none;

/* Block: takes full width */
display: block;

/* Inline: only as wide as content */
display: inline;

/* Inline-block: inline but with width/height */
display: inline-block;

/* Flexbox */
display: flex;

/* Grid */
display: grid;
```

### 2. Position

```css
/* Normal flow */
position: static;

/* Relative to normal position */
position: relative;
top: 10px;

/* Relative to viewport */
position: fixed;
top: 0;
right: 0;

/* Relative to nearest positioned ancestor */
position: absolute;
top: 0;
left: 0;

/* Sticky header */
position: sticky;
top: 0;
```

**Our sidebar**:
```css
#sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  z-index: 1000;
}
```

### 3. Border and Border-Radius

```css
/* Border */
border: 2px solid #ccc;
border-top: 1px solid red;
border-radius: 5px;

/* Rounded corners */
border-radius: 10px;              /* all corners */
border-radius: 10px 10px 0 0;     /* top corners only */
border-radius: 50%;               /* perfect circle */
```

### 4. Shadows

```css
/* Box shadow */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
/*          x  y  blur spread  color  */

/* Text shadow */
text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
```

**Our cards**:
```css
.card {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}
```

### 5. Overflow

```css
/* Hide overflow */
overflow: hidden;

/* Scrollable */
overflow: auto;
overflow-y: scroll;  /* vertical scroll */
overflow-x: hidden;  /* hide horizontal */
```

## CSS Variables (Custom Properties)

Define reusable values:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --border-radius: 10px;
}

.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
}

.card {
  color: var(--text-color);
}
```

## Complete Example: Card Component

```css
/* Card container */
.currency-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5em;
  margin-bottom: 1.5em;
  transition: all 0.3s ease;
}

/* Hover effect */
.currency-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

/* Card header with gradient */
.currency-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 8px;
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Currency icon */
.currency-icon {
  font-size: 2em;
}

/* Stats section */
.currency-stats {
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
}

/* Individual stat */
.stat {
  flex: 1;
  min-width: 150px;
}

.stat-label {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 0.3em;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

/* Responsive: mobile */
@media (max-width: 768px) {
  .currency-card {
    padding: 1em;
  }
  
  .currency-stats {
    flex-direction: column;
    gap: 1em;
  }
  
  .stat {
    min-width: 100%;
  }
}
```

## CSS Organization in Our App

Our `styles.css` is organized into sections:

```css
/* ============================================
   1. GLOBAL STYLES
   ============================================ */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  color: #333;
}

/* ============================================
   2. LAYOUT COMPONENTS
   ============================================ */
#sidebar { ... }
.container { ... }

/* ============================================
   3. INCOME SECTION
   ============================================ */
.income-group-header { ... }
.income-card { ... }

/* ============================================
   4. EXPENSES SECTION
   ============================================ */
.expense-group-header { ... }

/* ... and so on */

/* ============================================
   99. RESPONSIVE STYLES
   ============================================ */
@media (max-width: 768px) { ... }
```

## Common CSS Patterns in Our App

### Pattern 1: Purple Gradient Headers

```css
.section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Pattern 2: View Switcher Buttons

```css
.data-view-switcher {
  display: flex;
  gap: 0.5em;
  margin: 1em 0;
  flex-wrap: wrap;
}

.data-view-btn {
  padding: 0.7em 1.2em;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.data-view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102,126,234,0.2);
}

.data-view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}
```

### Pattern 3: Progress Bars

```css
.progress-bar {
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}
```

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 65%;"></div>
</div>
```

## CSS Best Practices

### 1. Use Classes, Not IDs for Styling

```css
/* ❌ Bad */
#myButton {
  background: blue;
}

/* ✅ Good */
.button-primary {
  background: blue;
}
```

**Why?** Classes are reusable, IDs should be unique.

### 2. Avoid !important

```css
/* ❌ Bad */
.button {
  color: red !important;
}

/* ✅ Good */
.button.button-danger {
  color: red;
}
```

### 3. Use Shorthand Properties

```css
/* ❌ Verbose */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* ✅ Concise */
margin: 10px 20px;
```

### 4. Name Classes Descriptively

```css
/* ❌ Bad */
.btn1 { ... }
.box { ... }

/* ✅ Good */
.button-primary { ... }
.card-container { ... }
```

### 5. Group Related Styles

```css
/* ✅ Good organization */
/* Buttons */
.button { ... }
.button-primary { ... }
.button-danger { ... }

/* Cards */
.card { ... }
.card-header { ... }
.card-body { ... }
```

## Chapter Summary

You've learned:
- ✅ CSS syntax and selectors
- ✅ Box model (margin, padding, border)
- ✅ Colors, gradients, and shadows
- ✅ Flexbox and Grid layouts
- ✅ Responsive design with media queries
- ✅ Transitions and animations
- ✅ Common patterns in our app
- ✅ Best practices

## Exercise 3.1: Style the Water Tracker

Take the HTML form from Exercise 2.1 and add CSS:

**Requirements**:
1. Purple gradient header (like our app)
2. Form inputs with padding and borders
3. Submit button with hover effect
4. Card-style container with shadow
5. Responsive (stack on mobile)

**Solution**:
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
}

.card {
  background: white;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  color: #333;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 0.7em;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 1em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102,126,234,0.3);
}

#result {
  margin-top: 1em;
  padding: 1em;
  background: #f0f0f0;
  border-radius: 5px;
  display: none;
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  .card {
    padding: 1em;
  }
}
```

---

# Chapter 4: Basic JavaScript You Need to Know

## What is JavaScript?

**JavaScript** is the programming language of the web. It makes websites interactive and dynamic.

- **HTML** = Structure (the house frame)
- **CSS** = Style (paint and decoration)
- **JavaScript** = Behavior (lights, doors, interactive features)

## Where JavaScript Runs

### 1. In the Browser (Frontend)
```html
<script>
  alert('Hello from the browser!');
</script>
```

### 2. On the Server (Backend with Node.js)
```javascript
// app.js
const express = require('express');
const app = express();
app.listen(3000);
```

Our app uses JavaScript in **both** places!

## Variables: Storing Data

Variables are like labeled boxes that hold information.

### Three Ways to Declare Variables

```javascript
// var (old way, avoid)
var name = 'John';

// let (can change)
let age = 25;
age = 26;  // OK

// const (cannot change)
const PI = 3.14159;
PI = 3;  // ERROR!
```

**Best Practice**: Use `const` by default, `let` when you need to change it, never use `var`.

### Data Types

```javascript
// String (text)
const name = 'Alice';
const message = "Hello World";
const template = `Hello ${name}`;  // Template literal

// Number
const age = 25;
const price = 19.99;
const negative = -10;

// Boolean (true/false)
const isLoggedIn = true;
const hasData = false;

// Array (list of items)
const numbers = [1, 2, 3, 4, 5];
const names = ['Alice', 'Bob', 'Charlie'];
const mixed = [1, 'two', true, null];

// Object (key-value pairs)
const user = {
  username: 'alice',
  age: 25,
  email: 'alice@example.com'
};

// null and undefined
const empty = null;
let notSet;  // undefined
```

**In Our App**:
```javascript
// Storing user data
const user = {
  username: 'fadee',
  email: 'fadee@example.com'
};

// Storing entries
const incomeData = [
  { id: 1, amount: 500, note: 'Salary', date: '2025-11-29' },
  { id: 2, amount: 100, note: 'Freelance', date: '2025-11-28' }
];
```

## Functions: Reusable Code Blocks

Functions are like recipes - write once, use many times.

### Function Declaration

```javascript
function greet(name) {
  return 'Hello ' + name;
}

const message = greet('Alice');  // "Hello Alice"
```

### Arrow Functions (Modern)

```javascript
// Traditional
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => {
  return a + b;
};

// Shorthand (implicit return)
const add = (a, b) => a + b;

// Single parameter (no parentheses)
const double = x => x * 2;
```

**In Our App**:
```javascript
// Show a section
function showSection(sectionName) {
  hideAllSections();
  document.getElementById(sectionName).style.display = 'block';
  localStorage.setItem('lastSection', sectionName);
}

// Calculate total
const calculateTotal = (entries) => {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
};
```

### Parameters and Arguments

```javascript
//         ↓ Parameters
function greet(name, age) {
  return `Hello ${name}, you are ${age} years old`;
}

//        ↓ Arguments
greet('Alice', 25);
```

### Default Parameters

```javascript
function greet(name = 'Guest') {
  return `Hello ${name}`;
}

greet();         // "Hello Guest"
greet('Alice');  // "Hello Alice"
```

## Conditional Statements

Make decisions in code.

### if/else

```javascript
const age = 18;

if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}
```

### else if

```javascript
const score = 85;

if (score >= 90) {
  console.log('A');
} else if (score >= 80) {
  console.log('B');
} else if (score >= 70) {
  console.log('C');
} else {
  console.log('F');
}
```

### Ternary Operator (Shorthand)

```javascript
// condition ? valueIfTrue : valueIfFalse
const age = 18;
const status = age >= 18 ? 'Adult' : 'Minor';

// Nested ternary (harder to read)
const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'F';
```

**In Our App**:
```javascript
// Check if user is logged in
if (localStorage.getItem('jwtToken')) {
  showApp();
} else {
  hideApp();
}

// Display badge
const badge = stats.totalUsageCount > 0 
  ? '<span class="badge active">Active</span>' 
  : '<span class="badge unused">Unused</span>';
```

## Loops: Repeating Actions

### for Loop

```javascript
// Count 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Loop through array
const names = ['Alice', 'Bob', 'Charlie'];
for (let i = 0; i < names.length; i++) {
  console.log(names[i]);
}
```

### forEach (Array Method)

```javascript
const names = ['Alice', 'Bob', 'Charlie'];

names.forEach((name, index) => {
  console.log(`${index}: ${name}`);
});
```

### for...of (Modern)

```javascript
const names = ['Alice', 'Bob', 'Charlie'];

for (const name of names) {
  console.log(name);
}
```

**In Our App**:
```javascript
// Render each entry
incomeData.forEach(entry => {
  const html = `
    <div class="entry-card">
      <div class="amount">$${entry.amount}</div>
      <div class="note">${entry.note}</div>
      <div class="date">${entry.date}</div>
    </div>
  `;
  container.innerHTML += html;
});
```

## Arrays: Working with Lists

### Common Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// .push() - add to end
numbers.push(6);  // [1, 2, 3, 4, 5, 6]

// .pop() - remove from end
numbers.pop();  // [1, 2, 3, 4, 5]

// .shift() - remove from start
numbers.shift();  // [2, 3, 4, 5]

// .unshift() - add to start
numbers.unshift(1);  // [1, 2, 3, 4, 5]

// .map() - transform each item
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// .filter() - keep items that match condition
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// .reduce() - combine into single value
const sum = numbers.reduce((total, n) => total + n, 0);
// 15

// .find() - find first matching item
const found = numbers.find(n => n > 3);
// 4

// .includes() - check if item exists
const hasThree = numbers.includes(3);
// true

// .sort() - sort array
const sorted = [3, 1, 4, 2].sort((a, b) => a - b);
// [1, 2, 3, 4]
```

**In Our App**:
```javascript
// Get all income entries
const incomeEntries = entries.filter(e => e.category === 'income');

// Calculate total
const total = entries.reduce((sum, e) => sum + e.amount, 0);

// Sort by date
const sorted = entries.sort((a, b) => 
  new Date(b.date) - new Date(a.date)
);

// Add new entry to start
incomeData.unshift(newEntry);
```

## Objects: Key-Value Pairs

### Creating and Accessing Objects

```javascript
// Create object
const user = {
  username: 'alice',
  age: 25,
  email: 'alice@example.com',
  isVerified: true
};

// Access properties
console.log(user.username);      // Dot notation
console.log(user['username']);   // Bracket notation

// Add/modify properties
user.age = 26;
user.country = 'USA';

// Delete property
delete user.age;
```

### Object Methods

```javascript
const calculator = {
  value: 0,
  add: function(n) {
    this.value += n;
  },
  // Shorthand
  subtract(n) {
    this.value -= n;
  },
  // Arrow function (don't use for methods!)
  reset: () => {
    // this.value = 0;  // ERROR: 'this' doesn't work in arrow functions
  }
};

calculator.add(5);
calculator.subtract(2);
console.log(calculator.value);  // 3
```

### Destructuring

```javascript
// Object destructuring
const user = { username: 'alice', age: 25, email: 'alice@example.com' };
const { username, age } = user;
console.log(username);  // 'alice'

// Array destructuring
const [first, second] = [1, 2, 3];
console.log(first);  // 1
```

**In Our App**:
```javascript
// Form data as object
const formData = {
  amount: 500,
  currency: 'USD',
  note: 'Salary',
  typeId: 1
};

// Destructure query params
const { category, limit, offset } = req.query;

// Destructure response
const { token, user } = await res.json();
```

## DOM Manipulation: Changing HTML with JavaScript

**DOM** = Document Object Model (HTML as JavaScript objects)

### Selecting Elements

```javascript
// By ID
const sidebar = document.getElementById('sidebar');

// By class name (returns array-like object)
const cards = document.getElementsByClassName('card');

// By CSS selector (returns first match)
const firstCard = document.querySelector('.card');

// By CSS selector (returns all matches)
const allCards = document.querySelectorAll('.card');
```

### Modifying Elements

```javascript
const element = document.getElementById('myDiv');

// Change text content
element.textContent = 'New text';

// Change HTML content
element.innerHTML = '<strong>Bold text</strong>';

// Change styles
element.style.color = 'red';
element.style.display = 'none';

// Add/remove classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('selected');

// Check if has class
if (element.classList.contains('active')) {
  console.log('Element is active');
}

// Change attributes
element.setAttribute('data-id', '123');
element.id = 'newId';
```

**In Our App**:
```javascript
// Show a section
function showSection(name) {
  // Hide all sections
  document.querySelectorAll('section').forEach(sec => {
    sec.style.display = 'none';
  });
  
  // Show selected section
  document.getElementById(name).style.display = 'block';
}

// Update result message
document.getElementById('incomeResult').innerHTML = 
  '<span style="color:green;">Income added!</span>';

// Add active class to button
document.querySelector('.data-view-btn').classList.add('active');
```

### Creating and Adding Elements

```javascript
// Create new element
const div = document.createElement('div');
div.className = 'card';
div.textContent = 'Hello';

// Add to page
document.body.appendChild(div);

// Insert before another element
const parent = document.getElementById('container');
const referenceNode = document.getElementById('existingElement');
parent.insertBefore(div, referenceNode);

// Remove element
div.remove();
```

## Events: Responding to User Actions

### Adding Event Listeners

```javascript
// Method 1: HTML attribute (avoid)
<button onclick="doSomething()">Click</button>

// Method 2: JavaScript property
const button = document.getElementById('myButton');
button.onclick = function() {
  console.log('Clicked!');
};

// Method 3: addEventListener (best)
button.addEventListener('click', function() {
  console.log('Clicked!');
});

// With arrow function
button.addEventListener('click', () => {
  console.log('Clicked!');
});
```

### Common Events

```javascript
// Mouse events
element.addEventListener('click', () => {});
element.addEventListener('dblclick', () => {});
element.addEventListener('mouseover', () => {});
element.addEventListener('mouseout', () => {});

// Keyboard events
document.addEventListener('keydown', (e) => {
  console.log(e.key);  // Which key was pressed
});

// Form events
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Stop form from submitting normally
  // Handle form data
});

input.addEventListener('input', (e) => {
  console.log(e.target.value);  // Get input value
});

input.addEventListener('change', () => {});  // When value changes
input.addEventListener('focus', () => {});   // When input is focused
input.addEventListener('blur', () => {});    // When input loses focus

// Window events
window.addEventListener('load', () => {});      // Page fully loaded
window.addEventListener('resize', () => {});    // Window resized
window.addEventListener('scroll', () => {});    // Page scrolled
```

### Event Object

```javascript
button.addEventListener('click', (event) => {
  console.log(event.target);      // Element that was clicked
  console.log(event.type);        // 'click'
  console.log(event.clientX);     // Mouse X position
  event.preventDefault();         // Stop default action
  event.stopPropagation();        // Stop event bubbling
});
```

**In Our App**:
```javascript
// Form submission
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
  e.preventDefault();  // Don't reload page
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  // Send to server...
});

// Button click
document.getElementById('loginBtn').addEventListener('click', () => {
  openAuthModal('login');
});

// Infinite scroll
document.getElementById('incomeGrid').addEventListener('scroll', function() {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
    fetchMoreIncome();
  }
});
```

## Asynchronous JavaScript

JavaScript can do multiple things at once (non-blocking).

### setTimeout and setInterval

```javascript
// Run once after delay
setTimeout(() => {
  console.log('Hello after 2 seconds');
}, 2000);

// Run repeatedly
const intervalId = setInterval(() => {
  console.log('Every second');
}, 1000);

// Stop interval
clearInterval(intervalId);
```

### Promises

A promise represents a value that will be available in the future.

```javascript
// Creating a promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Success!');
    } else {
      reject('Error!');
    }
  }, 1000);
});

// Using a promise
promise
  .then(result => {
    console.log(result);  // 'Success!'
  })
  .catch(error => {
    console.error(error);
  });
```

### Async/Await (Modern)

```javascript
// Traditional promise chain
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// With async/await (cleaner)
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

**In Our App**:
```javascript
// Fetch income data
async function fetchIncome() {
  try {
    const response = await authFetch('/entries?category=income');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    incomeData = data;
    renderIncomeGrid();
  } catch (error) {
    console.error('Error fetching income:', error);
  }
}

// Login
async function login(username, pin) {
  const response = await authFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, pin })
  });
  const result = await response.json();
  return result;
}
```

## Fetch API: Making HTTP Requests

```javascript
// GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// POST request
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'alice',
    email: 'alice@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// With async/await
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
```

**Our authFetch Helper**:
```javascript
function authFetch(url, options = {}) {
  const token = localStorage.getItem('jwtToken');
  options.headers = options.headers || {};
  options.headers['Authorization'] = `Bearer ${token}`;
  
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
    options.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return fetch(url, options);
}
```

## localStorage: Browser Storage

Store data in the browser (persists after page reload).

```javascript
// Save data
localStorage.setItem('username', 'alice');
localStorage.setItem('age', '25');

// Save object (must stringify)
const user = { username: 'alice', age: 25 };
localStorage.setItem('user', JSON.stringify(user));

// Get data
const username = localStorage.getItem('username');
const userStr = localStorage.getItem('user');
const user = JSON.parse(userStr);

// Remove data
localStorage.removeItem('username');

// Clear all
localStorage.clear();

// Check if key exists
if (localStorage.getItem('jwtToken')) {
  console.log('User is logged in');
}
```

**In Our App**:
```javascript
// Save JWT token
localStorage.setItem('jwtToken', token);

// Save user info
localStorage.setItem('user', JSON.stringify({ username, email }));

// Save view preference
localStorage.setItem('incomeView', 'cards');

// Get currency
function getCurrency() {
  return localStorage.getItem('currency') || 'USD';
}

// Check if logged in
if (localStorage.getItem('jwtToken')) {
  showApp();
} else {
  showLoginScreen();
}
```

## Template Literals: Dynamic HTML

```javascript
// Old way (hard to read)
const html = '<div class="card">' +
  '<h3>' + title + '</h3>' +
  '<p>' + description + '</p>' +
  '</div>';

// New way with template literals
const html = `
  <div class="card">
    <h3>${title}</h3>
    <p>${description}</p>
  </div>
`;

// With expressions
const html = `
  <div class="card ${isActive ? 'active' : ''}">
    <span>${amount.toFixed(2)}</span>
  </div>
`;
```

**In Our App**:
```javascript
// Render income cards
function renderIncomeCards(entries) {
  let html = '<div class="income-cards">';
  
  entries.forEach(entry => {
    const icon = entry.Type ? entry.Type.name : 'Unknown';
    const date = new Date(entry.date).toLocaleDateString();
    
    html += `
      <div class="income-card">
        <div class="card-header">
          <span class="card-icon">${icon}</span>
          <span class="card-amount">$${entry.amount.toLocaleString()}</span>
        </div>
        <div class="card-body">
          <div class="card-date">${date}</div>
          <div class="card-note">${entry.note || '-'}</div>
        </div>
        <button onclick="deleteIncome(${entry.id})" class="delete-btn">
          Delete
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}
```

## Error Handling

```javascript
// try/catch
try {
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.error('Failed to parse JSON:', error.message);
}

// With async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

## ES6+ Features Used in Our App

### Spread Operator

```javascript
// Spread array
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// Spread object
const user = { name: 'Alice', age: 25 };
const updatedUser = { ...user, age: 26 };
```

### Destructuring

```javascript
// Array
const [first, second] = [1, 2, 3];

// Object
const { username, email } = user;

// Function parameters
function greet({ name, age }) {
  console.log(`Hello ${name}, age ${age}`);
}
```

### Optional Chaining

```javascript
// Without optional chaining
const typeName = entry.Type ? entry.Type.name : 'Unknown';

// With optional chaining
const typeName = entry.Type?.name || 'Unknown';
```

### Nullish Coalescing

```javascript
// Using || (returns first truthy value)
const value = 0 || 'default';  // 'default' (0 is falsy)

// Using ?? (returns first non-null/undefined value)
const value = 0 ?? 'default';  // 0 (0 is defined)
```

## Common JavaScript Patterns in Our App

### Pattern 1: Initialize on Page Load

```javascript
window.addEventListener('DOMContentLoaded', () => {
  fetchCsrfToken();
  
  const token = localStorage.getItem('jwtToken');
  if (token) {
    showApp();
    onLoginSuccess();
  } else {
    hideApp();
  }
  
  renderCurrencyFab();
  setCurrency(getCurrency());
});
```

### Pattern 2: Form Handling

```javascript
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await authFetch('/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, category: 'income' })
    });
    
    if (response.ok) {
      document.getElementById('incomeResult').textContent = 'Success!';
      e.target.reset();
      await fetchIncome({ reset: true });
    } else {
      const error = await response.json();
      document.getElementById('incomeResult').textContent = error.message;
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
```

### Pattern 3: Infinite Scroll

```javascript
let offset = 0;
let limit = 50;
let hasMore = true;
let isLoading = false;

async function fetchMore() {
  if (!hasMore || isLoading) return;
  
  isLoading = true;
  const response = await authFetch(`/entries?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  if (data.length < limit) hasMore = false;
  offset += data.length;
  
  appendToGrid(data);
  isLoading = false;
}

document.getElementById('grid').addEventListener('scroll', function() {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
    fetchMore();
  }
});
```

### Pattern 4: View Switching

```javascript
function changeView(view) {
  localStorage.setItem('currentView', view);
  
  // Update button states
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${view}"]`).classList.add('active');
  
  // Render view
  if (view === 'cards') renderCards();
  else if (view === 'table') renderTable();
  else if (view === 'chart') renderChart();
}
```

## Debugging JavaScript

### Console Methods

```javascript
// Log messages
console.log('Normal message');
console.warn('Warning message');
console.error('Error message');

// Log objects
console.log({ username, age, email });

// Table format
console.table([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

// Timing
console.time('fetch');
await fetch('/api/data');
console.timeEnd('fetch');  // fetch: 150ms
```

### Debugger Statement

```javascript
function calculateTotal(entries) {
  debugger;  // Execution pauses here when DevTools is open
  return entries.reduce((sum, e) => sum + e.amount, 0);
}
```

### Browser DevTools

1. **Console Tab**: Run JavaScript, see logs
2. **Sources Tab**: Set breakpoints, step through code
3. **Network Tab**: See HTTP requests/responses
4. **Application Tab**: View localStorage, cookies

## Chapter Summary

You've learned:
- ✅ Variables (let, const) and data types
- ✅ Functions (regular and arrow)
- ✅ Conditionals and loops
- ✅ Arrays and objects
- ✅ DOM manipulation
- ✅ Event handling
- ✅ Async/await and Promises
- ✅ Fetch API for HTTP requests
- ✅ localStorage for browser storage
- ✅ Template literals for HTML
- ✅ Error handling
- ✅ Common patterns in our app

## Exercise 4.1: Interactive Counter

Create an interactive counter with JavaScript:

**Requirements**:
1. Display current count (starts at 0)
2. "+" button to increment
3. "-" button to decrement
4. "Reset" button to set to 0
5. Save count to localStorage
6. Load count on page load

**HTML**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Counter</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .counter {
      background: white;
      padding: 2em;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .count {
      font-size: 4em;
      margin: 0.5em 0;
      color: #667eea;
    }
    button {
      padding: 0.7em 2em;
      margin: 0.3em;
      font-size: 1.2em;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    .btn-plus, .btn-minus {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    .btn-reset {
      background: #dc3545;
      color: white;
    }
  </style>
</head>
<body>
  <div class="counter">
    <h1>Counter</h1>
    <div class="count" id="count">0</div>
    <div>
      <button class="btn-minus" id="btnMinus">-</button>
      <button class="btn-plus" id="btnPlus">+</button>
    </div>
    <button class="btn-reset" id="btnReset">Reset</button>
  </div>

  <script>
    // Your solution here
  </script>
</body>
</html>
```

**Solution** (Try first!):
```javascript
// Get elements
const countDisplay = document.getElementById('count');
const btnPlus = document.getElementById('btnPlus');
const btnMinus = document.getElementById('btnMinus');
const btnReset = document.getElementById('btnReset');

// Load count from localStorage
let count = parseInt(localStorage.getItem('counter') || '0');

// Update display
function updateDisplay() {
  countDisplay.textContent = count;
  localStorage.setItem('counter', count);
}

// Initial display
updateDisplay();

// Event listeners
btnPlus.addEventListener('click', () => {
  count++;
  updateDisplay();
});

btnMinus.addEventListener('click', () => {
  count--;
  updateDisplay();
});

btnReset.addEventListener('click', () => {
  count = 0;
  updateDisplay();
});
```

---

# Chapter 5: Architecture of This Personal Finance App

## Big Picture Overview

Our Personal Finance App is a **full-stack web application** with three main components:

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │          FRONTEND (Single Page App)               │  │
│  │                                                   │  │
│  │  • HTML (index.html - 5,443 lines)               │  │
│  │  • CSS (styles.css - styling)                    │  │
│  │  • JavaScript (Vanilla JS - no frameworks)       │  │
│  │                                                   │  │
│  │  Features:                                        │  │
│  │  - Income tracking with 5 views                  │  │
│  │  - Expense tracking with 5 views                 │  │
│  │  - Balance management with 4 views               │  │
│  │  - Multi-currency support                        │  │
│  │  - Types with statistics                         │  │
│  │  - Savings & transfers                           │  │
│  │  - Monthly reports with visualizations           │  │
│  │                                                   │  │
│  └────────────────┬──────────────────────────────────┘  │
│                   │                                     │
│                   │ HTTP Requests (Fetch API)           │
│                   │                                     │
└───────────────────┼─────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────┐
│              NODE.JS SERVER (Backend)                     │
│  ┌─────────────────────────────────────────────────┐     │
│  │           EXPRESS.JS APPLICATION                │     │
│  │                                                 │     │
│  │  • app.js (server setup)                       │     │
│  │  • Routes (API endpoints)                      │     │
│  │  • Controllers (business logic)                │     │
│  │  • Middleware (auth, CSRF, error handling)     │     │
│  │  • Models (Sequelize ORM)                      │     │
│  │                                                 │     │
│  │  API Endpoints:                                │     │
│  │  - POST /auth/register                         │     │
│  │  - POST /auth/login                            │     │
│  │  - GET  /entries?category=income               │     │
│  │  - POST /entries                               │     │
│  │  - GET  /balances                              │     │
│  │  - POST /balances/close-month                  │     │
│  │  - ... and more                                │     │
│  │                                                 │     │
│  └──────────────────┬──────────────────────────────┘     │
│                     │                                    │
└─────────────────────┼────────────────────────────────────┘
                      │
                      │ SQL Queries
                      │
                      ▼
┌───────────────────────────────────────────────────────────┐
│                 POSTGRESQL DATABASE                       │
│                                                          │
│  Tables:                                                 │
│  • Users (username, pin, email)                         │
│  • Entries (amount, category, date, note)               │
│  • Types (name, category, description)                  │
│  • Balances (currency, moneyOnHand, savings)            │
│  • Transfers (amount, from, to, date)                   │
│  • Savings (amount, date, note)                         │
│  • ClosedMonths (month, year, userId)                   │
│  • MonthCloseAudits (audit trail)                       │
│                                                          │
└───────────────────────────────────────────────────────────┘
```

## Complete Folder Structure

```
personal_finance/
├── Public/                    # Frontend files (served to browser)
│   ├── index.html            # Main HTML (5,443 lines - entire SPA)
│   ├── css/
│   │   └── styles.css        # All styling (~5,000+ lines)
│   ├── js/
│   │   └── menu.js           # Menu functions (if separate)
│   └── img/
│       └── currency_bills/   # Currency images
│
├── controllers/               # Backend business logic
│   ├── authController.js     # Login, register, verify email
│   ├── balanceController.js  # Balance operations, month closing
│   ├── entryController.js    # Income/expense CRUD
│   ├── reportController.js   # Monthly reports
│   ├── savingsController.js  # Savings operations
│   ├── transferController.js # Transfer operations
│   └── typeController.js     # Type management
│
├── middleware/                # Request processing
│   ├── authJwt.js            # JWT authentication
│   ├── errorHandler.js       # Error handling
│   └── validateJoi.js        # Input validation
│
├── models/                    # Database models (Sequelize)
│   ├── index.js              # Model initialization
│   ├── User.js               # User model
│   ├── Entry.js              # Income/expense model
│   ├── Type.js               # Transaction type model
│   ├── Balance.js            # Balance model
│   ├── Savings.js            # Savings model
│   ├── Transfer.js           # Transfer model
│   ├── ClosedMonth.js        # Closed months tracking
│   ├── MonthCloseAudit.js    # Audit logs
│   ├── Currency.js           # Currency definitions
│   └── UserCurrency.js       # User's active currencies
│
├── routes/                    # API endpoints
│   ├── auth.js               # /auth/* routes
│   ├── user.js               # /user/* routes
│   ├── entries.js            # /entries/* routes
│   ├── balances.js           # /balances/* routes
│   ├── savings.js            # /savings/* routes
│   ├── transfers.js          # /transfers/* routes
│   ├── types.js              # /types/* routes
│   └── report.js             # /report/* routes
│
├── migrations/                # Database schema changes
│   ├── 01-create-closedmonths.js
│   ├── 02-create-currencies.js
│   ├── 03-create-enums.js
│   ├── 04-create-users.js
│   ├── 05-create-types.js
│   ├── 06-create-entries.js
│   ├── 09-create-balances.js
│   ├── 10-create-savings.js
│   ├── 11-create-usercurrencies.js
│   ├── 12-create-monthcloseaudits.js
│   └── ... more migrations
│
├── seeders/                   # Sample data for development
│   ├── 01-user-fadee.js
│   ├── 02-types-fadee.js
│   └── ... more seeders
│
├── validation/                # Input validation schemas
│   └── schemas.js            # Joi validation schemas
│
├── config/                    # Configuration files
│   └── config.json           # Database connection config
│
├── devcontainer/              # VS Code dev container setup
│   ├── devcontainer.json
│   ├── Dockerfile
│   └── README.md
│
├── app.js                     # Main Express server
├── package.json               # Node.js dependencies
├── docker-compose.yml         # Docker services definition
├── .env                       # Environment variables (secret)
│
└── Documentation/
    ├── IMPLEMENTATION_SUMMARY.md
    ├── VISUAL_CHANGES_GUIDE.md
    ├── TURNSTILE_SETUP.md
    └── BOOK_WEB_DEVELOPMENT_GUIDE.md  # This book!
```

## Technology Stack Summary

### Frontend Stack
```
┌─────────────────────────────────┐
│ Browser Technologies           │
├─────────────────────────────────┤
│ HTML5      │ Structure          │
│ CSS3       │ Styling            │
│ JavaScript │ Interactivity      │
│ localStorage│ Client storage    │
│ Fetch API  │ HTTP requests      │
└─────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────┐
│ Server Technologies            │
├─────────────────────────────────┤
│ Node.js v20 │ JavaScript runtime│
│ Express.js  │ Web framework     │
│ Sequelize   │ ORM (database)    │
│ bcrypt      │ Password hashing  │
│ jsonwebtoken│ JWT authentication│
│ csurf       │ CSRF protection   │
│ nodemailer  │ Email sending     │
└─────────────────────────────────┘
```

### Database
```
┌─────────────────────────────────┐
│ PostgreSQL 16                  │
├─────────────────────────────────┤
│ • Relational database          │
│ • ACID compliant               │
│ • Supports complex queries     │
│ • Built-in data types          │
└─────────────────────────────────┘
```

### DevOps
```
┌─────────────────────────────────┐
│ Docker Ecosystem               │
├─────────────────────────────────┤
│ Docker          │ Containerization│
│ Docker Compose  │ Multi-container │
│ Dev Containers  │ VS Code integration│
└─────────────────────────────────┘
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id          │◄─────────┐
│ username    │          │
│ pin         │          │
│ email       │          │
│ email_verified│        │
└─────────────┘          │
                         │
      │                  │
      │ 1                │
      │                  │
      │ *                │
      ▼                  │
┌─────────────┐          │
│   Entries   │          │
├─────────────┤          │
│ id          │          │
│ userId      │──────────┘
│ typeId      │──────────┐
│ amount      │          │
│ currency    │          │
│ category    │          │
│ date        │          │
│ note        │          │
│ locked      │          │
└─────────────┘          │
                         │
                         │ *
      ┌──────────────────┘
      │ 1
      │
      ▼
┌─────────────┐
│    Types    │
├─────────────┤
│ id          │
│ userId      │
│ name        │
│ category    │
│ description │
└─────────────┘

┌─────────────┐
│  Balances   │
├─────────────┤
│ id          │
│ userId      │───┐
│ currency    │   │
│ moneyOnHand │   │
│ savings     │   │ 
│ initialBalance│ │
│ closingBalance│ │
│ month       │   │
│ year        │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│  Savings    │   │
├─────────────┤   │
│ id          │   │
│ userId      │───┤
│ amount      │   │
│ currency    │   │
│ date        │   │
│ note        │   │
│ locked      │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│  Transfers  │   │
├─────────────┤   │
│ id          │   │
│ userId      │───┤
│ amount      │   │
│ currency    │   │
│ from        │   │ (money_on_hand/savings)
│ to          │   │
│ date        │   │
│ note        │   │
│ locked      │   │
└─────────────┘   │
                  │
┌──────────────┐  │
│ ClosedMonths │  │
├──────────────┤  │
│ id           │  │
│ userId       │──┘
│ month        │
│ year         │
└──────────────┘
```

### Key Tables Explained

**Users Table**:
- Stores user accounts
- PIN is hashed with bcrypt
- Email verification required

**Entries Table**:
- Income and expenses
- `category`: 'income' or 'expense'
- `typeId`: Links to Types table
- `locked`: Prevents editing after month close

**Types Table**:
- User-defined categories (Salary, Rent, Food, etc.)
- Can be income or expense types
- Each user has their own types

**Balances Table**:
- Monthly balance snapshots
- Tracks money on hand and savings separately
- Per currency and per month

**Transfers Table**:
- Money moved between money_on_hand and savings
- Direction: 'money_on_hand' → 'savings' or vice versa

**ClosedMonths Table**:
- Tracks which months are closed
- Closed months can't be edited

## Request Flow: From Click to Response

Let's trace what happens when a user adds a new expense:

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: User fills form and clicks "Add Expense"       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: JavaScript Event Listener (Frontend)           │
│                                                         │
│  document.getElementById('expenseForm')                │
│    .addEventListener('submit', async (e) => {          │
│      e.preventDefault();  // Stop page reload          │
│                                                         │
│      // Collect form data                              │
│      const formData = new FormData(e.target);          │
│      const data = Object.fromEntries(formData);        │
│      // { amount: 50, currency: 'USD', note: 'Food' }  │
│    });                                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Send HTTP POST Request                         │
│                                                         │
│  const response = await authFetch('/entries', {        │
│    method: 'POST',                                     │
│    headers: {                                          │
│      'Content-Type': 'application/json',               │
│      'Authorization': 'Bearer eyJhbGc...',             │
│      'X-CSRF-Token': 'abc123...'                       │
│    },                                                   │
│    body: JSON.stringify({                              │
│      ...data,                                          │
│      category: 'expense'                               │
│    })                                                   │
│  });                                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTP Request travels to server
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Express.js Receives Request (Backend)          │
│                                                         │
│  app.js → app.use('/entries', ...)                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: Middleware Chain                               │
│                                                         │
│  ┌──────────────────────────────────────┐             │
│  │ 1. CSRF Protection                    │             │
│  │    → Validates CSRF token             │             │
│  └──────────────┬───────────────────────┘             │
│                 │                                       │
│  ┌──────────────▼───────────────────────┐             │
│  │ 2. JWT Authentication (authJwt)       │             │
│  │    → Validates JWT token              │             │
│  │    → Decodes user info                │             │
│  │    → Adds req.user = { id: 1, ... }   │             │
│  └──────────────┬───────────────────────┘             │
└─────────────────┼───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 6: Route Handler (routes/entries.js)              │
│                                                         │
│  router.post('/', entryController.createEntry);        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 7: Controller (controllers/entryController.js)    │
│                                                         │
│  exports.createEntry = async (req, res) => {           │
│    const { amount, currency, note, typeId } = req.body;│
│    const userId = req.user.id;  // From JWT            │
│                                                         │
│    // Validate data                                    │
│    if (!amount || !currency) {                         │
│      return res.status(400).json({ error: 'Invalid' });│
│    }                                                    │
│                                                         │
│    // Create database record                           │
│    const entry = await Entry.create({                  │
│      userId,                                           │
│      amount,                                           │
│      currency,                                         │
│      category: 'expense',                              │
│      note,                                             │
│      typeId,                                           │
│      date: new Date()                                  │
│    });                                                  │
│                                                         │
│    res.status(201).json(entry);                        │
│  };                                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 8: Sequelize ORM (models/Entry.js)                │
│                                                         │
│  Entry.create({ ... })                                 │
│    ↓                                                    │
│  Generates SQL:                                         │
│  INSERT INTO "Entries"                                  │
│    (userId, amount, currency, category, note, ...)     │
│  VALUES                                                 │
│    (1, 50, 'USD', 'expense', 'Food', ...)              │
│  RETURNING *;                                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 9: PostgreSQL Database                            │
│                                                         │
│  • Validates data types                                │
│  • Checks constraints                                  │
│  • Inserts row                                         │
│  • Returns inserted record with new ID                 │
│                                                         │
│  Record: { id: 123, userId: 1, amount: 50, ... }       │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Response travels back up the chain
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 10: HTTP Response to Frontend                     │
│                                                         │
│  Status: 201 Created                                   │
│  Body: {                                               │
│    id: 123,                                            │
│    userId: 1,                                          │
│    amount: 50,                                         │
│    currency: 'USD',                                    │
│    category: 'expense',                                │
│    note: 'Food',                                       │
│    date: '2025-11-29T10:30:00.000Z'                   │
│  }                                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 11: Frontend Handles Response                     │
│                                                         │
│  if (response.ok) {                                    │
│    // Show success message                             │
│    document.getElementById('expenseResult')            │
│      .textContent = 'Expense added!';                  │
│                                                         │
│    // Clear form                                       │
│    expenseForm.reset();                                │
│                                                         │
│    // Refresh data                                     │
│    await fetchExpenses({ reset: true });               │
│                                                         │
│    // Update balances                                  │
│    await showBalances();                               │
│  }                                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 12: UI Updates                                    │
│                                                         │
│  • New expense appears in list                         │
│  • Total amount updates                                │
│  • Balance reflects new expense                        │
│  • User sees updated UI                                │
└─────────────────────────────────────────────────────────┘
```

**Time**: This entire process takes ~50-200ms

## Component Responsibilities

### Frontend (Public/index.html)

**Single Responsibility**: User Interface

```javascript
// What it does:
✅ Display data to user
✅ Capture user input
✅ Send requests to backend
✅ Update UI based on responses
✅ Store preferences (localStorage)
✅ Handle view switching
✅ Client-side validation

// What it does NOT do:
❌ Store sensitive data permanently
❌ Validate data (trusts server)
❌ Direct database access
❌ Business logic
❌ Authentication (only stores token)
```

### Backend (app.js + controllers + routes)

**Single Responsibility**: Business Logic & Security

```javascript
// What it does:
✅ Validate all input
✅ Authenticate users
✅ Authorize actions
✅ Apply business rules
✅ Database operations
✅ Send emails
✅ Generate reports
✅ Protect against attacks

// What it does NOT do:
❌ Generate HTML/CSS
❌ Handle UI interactions
❌ Store UI state
```

### Database (PostgreSQL)

**Single Responsibility**: Data Persistence

```javascript
// What it does:
✅ Store data permanently
✅ Enforce data integrity
✅ Handle relationships
✅ Execute queries efficiently
✅ Transaction management
✅ Concurrent access

// What it does NOT do:
❌ Business logic
❌ Authentication
❌ Data formatting
❌ Email sending
```

## Security Architecture

```
┌──────────────────────────────────────────────┐
│ Security Layers                              │
├──────────────────────────────────────────────┤
│                                              │
│  1. HTTPS (Production)                       │
│     └─ Encrypts data in transit              │
│                                              │
│  2. CSRF Protection                          │
│     └─ Prevents cross-site request forgery   │
│                                              │
│  3. JWT Authentication                       │
│     └─ Stateless token-based auth            │
│                                              │
│  4. Password Hashing (bcrypt)                │
│     └─ Never store plain passwords           │
│                                              │
│  5. Input Validation (Joi)                   │
│     └─ Validate all user input               │
│                                              │
│  6. SQL Injection Protection (Sequelize)     │
│     └─ Parameterized queries                 │
│                                              │
│  7. Authorization Checks                     │
│     └─ Users only access their own data      │
│                                              │
│  8. Email Verification                       │
│     └─ Confirm email ownership               │
│                                              │
└──────────────────────────────────────────────┘
```

## Chapter Summary

You've learned:
- ✅ Three-tier architecture (Frontend, Backend, Database)
- ✅ Complete folder structure
- ✅ Technology stack
- ✅ Database schema and relationships
- ✅ Request flow from click to response
- ✅ Component responsibilities
- ✅ Security layers

## Exercise 5.1: Draw Your Own Architecture

**Task**: Draw a diagram showing the flow when a user:
1. Opens the app
2. Logs in
3. Views their balance
4. Adds a new income entry

**Include**:
- All three tiers (Frontend, Backend, Database)
- HTTP requests and responses
- Which files are involved
- What data is transferred

**Bonus**: Add where security checks happen (JWT, CSRF, etc.)

---

# Chapter 6: App Loading Sequence

## What Happens When You Open the App?

Understanding the **execution order** is crucial. Let's trace every step from typing the URL to seeing the app.

```
┌──────────────────────────────────────────────────────────┐
│  Step 1: User Types URL or Opens Bookmark                │
│  http://localhost:3000                                   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Step 2: Browser Sends HTTP GET Request                  │
│  GET / HTTP/1.1                                          │
│  Host: localhost:3000                                    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Step 3: Express Server Receives Request                 │
│  app.use(express.static('Public'))                       │
│  → Serves Public/index.html                              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Step 4: Browser Receives HTML File                      │
│  Content-Type: text/html                                 │
│  Status: 200 OK                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Step 5: Browser Parses HTML (Top to Bottom)             │
│                                                           │
│  <!DOCTYPE html>                                         │
│  <html lang="en">                                        │
│  <head>                                                  │
│    <meta charset="UTF-8">                                │
│    <title>Personal Expenses App</title>                 │
│    <link rel="stylesheet" href="css/styles.css"> ←──┐  │
│    <script src="turnstile-api.js"></script>  ←──────┐  │
│  </head>                                             │  │
│  <body>                                              │  │
│    ... HTML content loads ...                        │  │
│    <script> JavaScript code starts running </script> │  │
│  </body>                                             │  │
│  </html>                                             │  │
│                                                       │  │
└───────────────────────────────────────────────────────┼──┼─┘
                                                        │  │
        ┌───────────────────────────────────────────────┘  │
        │                                                   │
        ▼                                                   │
┌──────────────────────────────────────────────────────┐  │
│  Step 6: Browser Requests CSS File                   │  │
│  GET /css/styles.css                                 │  │
│  → Loads and applies all styles                      │  │
└──────────────────────────────────────────────────────┘  │
                                                           │
        ┌──────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│  Step 7: External Scripts Load                       │
│  • Bootstrap Icons CSS                               │
│  • Clusterize.js library                             │
│  • Cloudflare Turnstile (anti-bot)                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│  Step 8: DOMContentLoaded Event Fires                │
│  (HTML fully loaded, before images)                  │
│                                                       │
│  window.addEventListener('DOMContentLoaded', () => { │
│    // Our initialization code runs here              │
│  });                                                  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
```

## Detailed JavaScript Execution Flow

### Phase 1: Initialization (Lines 827-900)

```javascript
window.addEventListener('DOMContentLoaded', () => {
  // STEP 1: Fetch CSRF Token from server
  fetchCsrfToken();  // GET /csrf-token
  
  // STEP 2: Check if user already logged in
  const token = localStorage.getItem('jwtToken');
  if (token) {
    // User has token → show app
    showApp();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    onLoginSuccess(user);
  } else {
    // No token → show landing page
    hideApp();
  }
  
  // STEP 3: Apply saved theme
  const theme = localStorage.getItem('appTheme') || 'fancy-table';
  document.getElementById('themeSelect').value = theme;
  applyAppTheme(theme);
  
  // STEP 4: Initialize currency system
  renderCurrencyFab();
  setCurrency(getCurrency());  // Get from localStorage
  updateReportCurrencyDropdown();
  
  // STEP 5: Setup transfer dropdown sync
  const fromSelect = document.getElementById('transferFrom');
  const toSelect = document.getElementById('transferTo');
  fromSelect.addEventListener('change', syncTransferDropdowns);
  toSelect.addEventListener('change', syncTransferDropdowns);
  
  // STEP 6: Setup sidebar toggle
  document.getElementById('sidebarToggle')
    .addEventListener('click', openSidebar);
});
```

### Phase 2: If User is Logged In

```javascript
async function onLoginSuccess(user) {
  // STEP 1: Hide auth sections
  hideSection('login');
  hideSection('register');
  
  // STEP 2: Show user profile in sidebar
  showProfile(user);
  
  // STEP 3: Enable app sections
  enableApp();
  
  // STEP 4: Open sidebar
  openSidebar();
  
  // STEP 5: Fetch balances
  showBalances();  // GET /balances
  
  // STEP 6: Fetch user's currencies from backend
  try {
    const res = await authFetch('/user/currencies');
    if (res.ok) {
      const data = await res.json();
      const currencies = data.currencies || [];
      
      if (currencies.length === 0) {
        // Force user to select currencies
        showCurrencyPickerModal();
      } else {
        // Save currencies to localStorage
        setSelectedCurrencies(currencies.map(c => c.currencyCode));
        
        // STEP 7: Show last visited section
        let lastSection = localStorage.getItem('lastSection') || 'balances';
        showSection(lastSection);
        
        // STEP 8: Start idle timer
        resetIdleTimer();
      }
    }
  } catch (error) {
    console.error('Failed to fetch currencies:', error);
  }
}
```

### Phase 3: Section Loading

When user clicks "Income" in sidebar:

```javascript
function showSection(sectionName) {
  // STEP 1: Hide all sections
  document.querySelectorAll('.container section').forEach(sec => {
    sec.style.display = 'none';
  });
  
  // STEP 2: Show selected section
  const section = document.getElementById(sectionName);
  if (section) {
    section.style.display = 'block';
  }
  
  // STEP 3: Save to localStorage
  localStorage.setItem('lastSection', sectionName);
  
  // STEP 4: Load section data
  if (sectionName === 'income') {
    fetchIncome({ reset: true });  // GET /entries?category=income
  } else if (sectionName === 'expenses') {
    fetchExpenses({ reset: true }); // GET /entries?category=expense
  } else if (sectionName === 'balances') {
    showBalances();  // Already called, but refresh
  } else if (sectionName === 'types') {
    fetchTypes();  // GET /types
  } else if (sectionName === 'savings') {
    fetchSavings();  // GET /savings
  } else if (sectionName === 'transfers') {
    fetchTransfers({ reset: true });  // GET /transfers
  }
  
  // STEP 5: Close sidebar on mobile
  if (window.innerWidth < 768) {
    closeSidebar();
  }
}
```

### Phase 4: Data Fetching Example (Income)

```javascript
async function fetchIncome({ reset = false } = {}) {
  // Check if already loading
  if (incomeIsLoading) return;
  incomeIsLoading = true;
  
  if (reset) {
    incomeOffset = 0;
    incomeHasMore = true;
    incomeData = [];
  }
  
  try {
    // STEP 1: Fetch from API
    const res = await authFetch(
      `/entries?category=income&limit=${incomeLimit}&offset=${incomeOffset}`,
      { credentials: 'include' }
    );
    
    // STEP 2: Handle response
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    // STEP 3: Check if more data available
    if (data.length < incomeLimit) {
      incomeHasMore = false;
    }
    
    // STEP 4: Add to existing data
    incomeData.push(...data);
    incomeOffset += data.length;
    
    // STEP 5: Also fetch types for dropdowns
    if (reset) {
      await fetchTypes();
    }
    
    // STEP 6: Render the UI
    renderIncomeView(getCurrentIncomeView());
    
  } catch (error) {
    console.error('Error fetching income:', error);
    document.getElementById('incomeGrid').innerHTML = 
      '<p style="color:red;">Failed to load income data</p>';
  } finally {
    incomeIsLoading = false;
  }
}
```

## Timeline Diagram

```
Time  Event
═══════════════════════════════════════════════════════
0ms   User types URL
      │
50ms  Browser sends GET request
      │
100ms Server responds with index.html
      │
150ms HTML parsing begins
      │
200ms Browser requests CSS file
      │
250ms CSS loads, styles apply
      │
300ms External scripts start loading
      │
400ms DOMContentLoaded fires
      │
      ├─> fetchCsrfToken() → GET /csrf-token
      │   (Network: 50ms)
      │
450ms Check localStorage for JWT
      │
      ├─> Has token? 
      │   YES → Continue below
      │   NO  → Show landing page, DONE
      │
500ms showApp() - Hide landing, show sidebar
      │
550ms onLoginSuccess() begins
      │
      ├─> showProfile()
      ├─> enableApp()
      ├─> openSidebar()
      │
600ms showBalances() → GET /balances
      │   (Network: 100ms)
      │
700ms GET /user/currencies
      │   (Network: 80ms)
      │
780ms Currencies received, save to localStorage
      │
800ms showSection('balances') - last visited
      │
850ms fetchIncome() → GET /entries?category=income
      │   (Network: 120ms)
      │
970ms Income data received
      │
980ms renderIncomeView('cards')
      │
      ├─> Generate HTML with template literals
      ├─> Update DOM
      │
1000ms ✅ APP FULLY LOADED AND INTERACTIVE
```

**Total Load Time**: ~1 second (with good connection)

## Critical Loading Points

### 1. CSRF Token

**Why First?**: Every POST/PUT/DELETE request needs it.

```javascript
async function fetchCsrfToken() {
  try {
    const response = await fetch('/csrf-token');
    const data = await response.json();
    // Token stored in cookie automatically
    window.csrfToken = data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}
```

### 2. Authentication Check

**Why Early?**: Determines entire app flow.

```javascript
const token = localStorage.getItem('jwtToken');
if (token) {
  // Logged in → Load user data
  showApp();
  onLoginSuccess();
} else {
  // Not logged in → Show landing page
  hideApp();
  showLandingPage();
}
```

### 3. Currency System

**Why Important?**: All financial data needs currency context.

```javascript
function getCurrency() {
  return localStorage.getItem('currency') || 'USD';
}

function setCurrency(currency) {
  localStorage.setItem('currency', currency);
  updateAllCurrencyDisplays();
}
```

### 4. View Persistence

**Why Helpful?**: Returns user to where they left off.

```javascript
// Save when switching
function changeIncomeView(view) {
  localStorage.setItem('incomeView', view);
  renderIncomeView(view);
}

// Restore on load
function getCurrentIncomeView() {
  return localStorage.getItem('incomeView') || 'cards';
}
```

## Event Listeners Setup

All event listeners are attached during initialization:

```javascript
// Form submissions
document.getElementById('incomeForm').onsubmit = handleIncomeSubmit;
document.getElementById('expenseForm').onsubmit = handleExpenseSubmit;
document.getElementById('loginForm').onsubmit = handleLogin;

// Button clicks
document.getElementById('logoutBtn').onclick = logout;
document.getElementById('closeMonthBtn').onclick = openCloseMonthModal;

// Infinite scroll
document.getElementById('incomeGrid').addEventListener('scroll', () => {
  if (shouldFetchMore()) {
    fetchIncome();
  }
});

// Modal close on outside click
document.getElementById('loginModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeAuthModal();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // ESC closes modals
  if (e.key === 'Escape') {
    closeAllModals();
  }
});
```

## Global State Management

Our app uses **global variables** for state (simple but effective):

```javascript
// Current user
let currentUser = null;

// Data arrays
let incomeData = [];
let expenseData = [];
let typeData = [];
let balancesData = [];

// Pagination state
let incomeOffset = 0;
let incomeLimit = 50;
let incomeHasMore = true;
let incomeIsLoading = false;

// View state (also in localStorage)
let currentIncomeView = 'cards';
let currentExpenseView = 'cards';

// Window object for global access
window.typeStatistics = {};
window.balancesData = [];
```

## Performance Considerations

### Lazy Loading

We don't load everything at once:

```javascript
// ✅ Good: Load section data when needed
function showSection(name) {
  if (name === 'income' && incomeData.length === 0) {
    fetchIncome({ reset: true });
  }
}

// ❌ Bad: Load everything on page load
// fetchIncome();
// fetchExpenses();
// fetchTypes();
// fetchSavings();
// fetchTransfers();
```

### Infinite Scroll

Load data in chunks, not all at once:

```javascript
// Load 50 records at a time
const limit = 50;

// When user scrolls near bottom, load more
if (scrolledNearBottom && hasMore && !isLoading) {
  fetchMore();
}
```

### Debouncing

Prevent too many API calls:

```javascript
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(e.target.value);
  }, 300);  // Wait 300ms after user stops typing
});
```

## Chapter Summary

You've learned:
- ✅ Complete app loading sequence
- ✅ DOMContentLoaded initialization
- ✅ Authentication flow
- ✅ Data fetching order
- ✅ Event listener setup
- ✅ Global state management
- ✅ Performance optimizations
- ✅ Timeline from URL to interactive app

## Exercise 6.1: Add Console Logs

Add `console.log()` statements to trace execution:

```javascript
window.addEventListener('DOMContentLoaded', () => {
  console.log('1. DOMContentLoaded fired');
  
  fetchCsrfToken().then(() => {
    console.log('2. CSRF token fetched');
  });
  
  const token = localStorage.getItem('jwtToken');
  console.log('3. JWT token check:', token ? 'Found' : 'Not found');
  
  if (token) {
    console.log('4. Showing app');
    showApp();
    console.log('5. Calling onLoginSuccess');
    onLoginSuccess(JSON.parse(localStorage.getItem('user')));
  }
});
```

**Task**: Add these logs and observe the order in DevTools Console.

---

# Chapter 7: The Frontend Explained

## Single Page Application (SPA) Architecture

Our app is a **Single Page Application**: one HTML file with dynamic content updates.

### Traditional Multi-Page App

```
user clicks "Income"
  ↓
Browser loads income.html (full page reload)
  ↓
White flash
  ↓
New page appears

user clicks "Expenses"
  ↓
Browser loads expenses.html (full page reload)
  ↓
White flash
  ↓
New page appears
```

❌ **Problems**: Slow, jarring, loses scroll position

### Our Single Page App

```
user clicks "Income"
  ↓
JavaScript hides all sections
  ↓
JavaScript shows income section
  ↓
JavaScript fetches income data
  ↓
JavaScript updates DOM
  ↓
Smooth, instant transition

user clicks "Expenses"
  ↓
JavaScript hides all sections
  ↓
JavaScript shows expenses section
  ↓
Smooth, instant transition
```

✅ **Benefits**: Fast, smooth, app-like

## HTML Structure Overview

```html
<body>
  <!-- Landing Page (shown when not logged in) -->
  <div id="initialScreen">
    <h1>💰 Personal Finance</h1>
    <button onclick="openAuthModal('login')">Sign In</button>
    <button onclick="openAuthModal('register')">Sign Up</button>
  </div>
  
  <!-- Sidebar Navigation (hidden until login) -->
  <nav id="sidebar" style="display:none;">
    <div id="profileMenu">...</div>
    <a onclick="showSection('income')">Income</a>
    <a onclick="showSection('expenses')">Expenses</a>
    <a onclick="showSection('balances')">Balances</a>
    <!-- More menu items -->
  </nav>
  
  <!-- Main Content Container (hidden until login) -->
  <div class="container" style="display:none;">
    
    <!-- Income Section -->
    <section id="income" style="display:none;">
      <div class="income-group-header">
        <h2>Income</h2>
      </div>
      <form id="incomeForm">...</form>
      <div id="incomeGrid"></div>
    </section>
    
    <!-- Expenses Section -->
    <section id="expenses" style="display:none;">
      <div class="expense-group-header">
        <h2>Expenses</h2>
      </div>
      <form id="expenseForm">...</form>
      <div id="expenseGrid"></div>
    </section>
    
    <!-- Balances Section -->
    <section id="balances" style="display:none;">
      <div class="balance-group-header">
        <h2>Balances</h2>
      </div>
      <form id="balanceForm">...</form>
      <div id="actualBalances"></div>
    </section>
    
    <!-- More sections: types, savings, transfers, reports, settings -->
    
  </div>
  
  <!-- Modals (popups) -->
  <div id="loginModal" class="modal">...</div>
  <div id="registerModal" class="modal">...</div>
  <div id="currencyPickerModal" class="modal">...</div>
  <div id="tutorialModal" class="modal">...</div>
  
  <!-- JavaScript (inline at bottom) -->
  <script>
    // All JavaScript code here (~4,000+ lines)
  </script>
</body>
```

## Section Switching Logic

```javascript
function showSection(sectionName) {
  // 1. Hide everything
  hideAllSections();
  
  // 2. Show requested section
  const section = document.getElementById(sectionName);
  if (section) {
    section.style.display = 'block';
  }
  
  // 3. Remember choice
  localStorage.setItem('lastSection', sectionName);
  
  // 4. Load data if needed
  loadSectionData(sectionName);
  
  // 5. Close sidebar on mobile
  if (isMobile()) {
    closeSidebar();
  }
}

function hideAllSections() {
  document.querySelectorAll('.container section').forEach(section => {
    section.style.display = 'none';
  });
}
```

## The Multi-View System

Each section (Income, Expenses, Transfers) has **5 different ways to view data**:

```
┌─────────────────────────────────────────────────┐
│ View Switcher                                   │
│ [🃏 Cards] [📑 Tabs] [⚏ Columns] [📅 Timeline] [📊 Dashboard] │
└─────────────────────────────────────────────────┘
```

### Implementation Pattern

```javascript
// 1. View switcher buttons
function renderViewSwitcher(currentView) {
  return `
    <div class="data-view-switcher">
      <button class="${currentView === 'cards' ? 'active' : ''}"
              onclick="changeIncomeView('cards')">
        🃏 Cards
      </button>
      <button class="${currentView === 'tabs' ? 'active' : ''}"
              onclick="changeIncomeView('tabs')">
        📑 Tabs
      </button>
      <!-- More buttons -->
    </div>
  `;
}

// 2. Change view function
function changeIncomeView(view) {
  // Save preference
  localStorage.setItem('incomeView', view);
  
  // Re-render
  renderIncomeView(view);
}

// 3. Main render function
function renderIncomeView(view) {
  let html = '';
  
  // Add view switcher
  html += renderViewSwitcher(view);
  
  // Render based on view
  if (view === 'cards') {
    html += renderIncomeCards(incomeData);
  } else if (view === 'tabs') {
    html += renderIncomeTabs(incomeData);
  } else if (view === 'columns') {
    html += renderIncomeColumns(incomeData);
  } else if (view === 'timeline') {
    html += renderIncomeTimeline(incomeData);
  } else if (view === 'dashboard') {
    html += renderIncomeDashboard(incomeData);
  }
  
  // Update DOM
  document.getElementById('incomeGrid').innerHTML = html;
}
```

### Cards View Example

```javascript
function renderIncomeCards(entries) {
  // Group by currency
  const grouped = groupByCurrency(entries);
  
  let html = '';
  
  Object.keys(grouped).forEach(currency => {
    const currencyEntries = grouped[currency];
    const total = currencyEntries.reduce((sum, e) => sum + e.amount, 0);
    
    html += `
      <div class="currency-card">
        <div class="currency-card-header">
          <span class="currency-icon">💵</span>
          <span class="currency-name">${currency}</span>
          <span class="currency-total">
            ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </span>
        </div>
        <div class="currency-card-body">
    `;
    
    // Render each entry
    currencyEntries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const typeName = entry.Type?.name || 'Unknown';
      
      html += `
        <div class="entry-card">
          <div class="entry-header">
            <span class="entry-type">${typeName}</span>
            <span class="entry-amount">
              ${entry.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span>
          </div>
          <div class="entry-body">
            <div class="entry-date">${date}</div>
            <div class="entry-note">${entry.note || '-'}</div>
          </div>
          <div class="entry-actions">
            <button onclick="deleteIncome(${entry.id})" 
                    class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  return html;
}
```

## Form Handling Pattern

All forms follow the same pattern:

```javascript
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
  // STEP 1: Prevent page reload
  e.preventDefault();
  
  // STEP 2: Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  // Result: { amount: '500', currency: 'USD', note: 'Salary', ... }
  
  // STEP 3: Add additional data
  data.category = 'income';
  data.date = data.date || new Date().toISOString().split('T')[0];
  
  // STEP 4: Send to server
  try {
    const response = await authFetch('/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // STEP 5: Handle response
    if (response.ok) {
      const newEntry = await response.json();
      
      // Show success message
      document.getElementById('incomeResult').innerHTML = 
        '<span style="color:green;">Income added!</span>';
      
      // Clear form
      e.target.reset();
      
      // Refresh data
      await fetchIncome({ reset: true });
      
      // Update balances
      await showBalances();
      
    } else {
      // Show error
      const error = await response.json();
      document.getElementById('incomeResult').innerHTML = 
        `<span style="color:red;">${error.message}</span>`;
    }
    
  } catch (error) {
    console.error('Error adding income:', error);
    document.getElementById('incomeResult').innerHTML = 
      '<span style="color:red;">Network error</span>';
  }
});
```

## Data Grouping Utilities

### Group by Currency

```javascript
function groupByCurrency(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const currency = entry.currency || 'USD';
    if (!grouped[currency]) {
      grouped[currency] = [];
    }
    grouped[currency].push(entry);
  });
  
  return grouped;
}

// Usage:
// { USD: [...entries], LBP: [...entries] }
```

### Group by Date

```javascript
function groupByDate(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(entry);
  });
  
  return grouped;
}
```

### Group by Type

```javascript
function groupByType(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const typeName = entry.Type?.name || 'Unknown';
    if (!grouped[typeName]) {
      grouped[typeName] = {
        entries: [],
        total: 0,
        count: 0
      };
    }
    grouped[typeName].entries.push(entry);
    grouped[typeName].total += entry.amount;
    grouped[typeName].count++;
  });
  
  return grouped;
}
```

## Infinite Scroll Implementation

```javascript
// State variables
let incomeOffset = 0;
let incomeLimit = 50;
let incomeHasMore = true;
let incomeIsLoading = false;
let incomeData = [];

// Fetch function
async function fetchIncome({ reset = false } = {}) {
  // Prevent duplicate requests
  if (incomeIsLoading) return;
  
  // Check if more data available
  if (!reset && !incomeHasMore) return;
  
  incomeIsLoading = true;
  
  if (reset) {
    incomeOffset = 0;
    incomeHasMore = true;
    incomeData = [];
  }
  
  try {
    const url = `/entries?category=income&limit=${incomeLimit}&offset=${incomeOffset}`;
    const response = await authFetch(url);
    const newData = await response.json();
    
    // Check if we got less than limit (means no more data)
    if (newData.length < incomeLimit) {
      incomeHasMore = false;
    }
    
    // Add to existing data
    incomeData.push(...newData);
    incomeOffset += newData.length;
    
    // Render
    renderIncomeView(getCurrentIncomeView());
    
  } catch (error) {
    console.error('Error fetching income:', error);
  } finally {
    incomeIsLoading = false;
  }
}

// Scroll event listener
document.getElementById('incomeGrid').addEventListener('scroll', function() {
  // Check if scrolled near bottom
  const scrolledToBottom = 
    this.scrollTop + this.clientHeight >= this.scrollHeight - 50;
  
  if (scrolledToBottom && incomeHasMore && !incomeIsLoading) {
    fetchIncome();  // Load next page
  }
});
```

## Modal System

```javascript
// Open modal
function openAuthModal(type) {
  if (type === 'login') {
    document.getElementById('loginModal').style.display = 'flex';
  } else if (type === 'register') {
    document.getElementById('registerModal').style.display = 'flex';
  }
}

// Close modal
function closeAuthModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registerModal').style.display = 'none';
}

// Close on outside click
document.getElementById('loginModal').addEventListener('click', function(e) {
  if (e.target === this) {  // Clicked on backdrop, not content
    closeAuthModal();
  }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
});
```

## Tutorial System

```javascript
// Tutorial content
const tutorialContent = {
  income: {
    title: '💵 Income Tracking',
    content: `
      <p><strong>Purpose:</strong> Record all money you receive.</p>
      <p><strong>Features:</strong></p>
      <ul>
        <li>Add income entries with amount, type, and notes</li>
        <li>View in 5 different formats (Cards, Tabs, Timeline, etc.)</li>
        <li>Filter by currency</li>
        <li>Track income sources over time</li>
      </ul>
      <p><strong>Tip:</strong> Create types like "Salary", "Freelance", "Bonus" for better tracking.</p>
    `
  },
  // More sections...
};

// Show tutorial
function showTutorial(section) {
  const tutorial = tutorialContent[section];
  if (!tutorial) return;
  
  document.getElementById('tutorialTitle').textContent = tutorial.title;
  document.getElementById('tutorialContent').innerHTML = tutorial.content;
  document.getElementById('tutorialModal').style.display = 'flex';
}

// Tutorial buttons in headers
html += `
  <button class="tutorial-btn" 
          onclick="showTutorial('income')" 
          title="Help">
    ?
  </button>
`;
```

## Chapter Summary

You've learned:
- ✅ Single Page Application architecture
- ✅ Section switching mechanism
- ✅ Multi-view system implementation
- ✅ Form handling pattern
- ✅ Data grouping utilities
- ✅ Infinite scroll pagination
- ✅ Modal system
- ✅ Tutorial system

## Exercise 7.1: Add a New View

Create a "List" view for income:

**Requirements**:
1. Add "📝 List" button to view switcher
2. Create `renderIncomeList(entries)` function
3. Display entries in simple list format:
   ```
   • $500 - Salary - Nov 29, 2025
   • $100 - Freelance - Nov 28, 2025
   ```
4. Group by date
5. Save view preference to localStorage

**Hint**: Follow the pattern of other view functions!

---

*Continuing with more chapters...*

# Chapter 8: Multi-View System Deep Dive

## The Five Views Explained

Every data section offers 5 viewing options. Let's explore each:

### 1. Cards View 🃏

**Purpose**: Visual, scannable, mobile-friendly

**Structure**:
```
┌──────────────────────────────────────┐
│ 💵 USD                    $12,500.00 │
│ ┌─────────────────────────────────┐  │
│ │ Salary           $5,000.00      │  │
│ │ 📅 Nov 29, 2025                 │  │
│ │ 📝 Monthly salary               │  │
│ │ [Delete]                         │  │
│ └─────────────────────────────────┘  │
│ ┌─────────────────────────────────┐  │
│ │ Freelance        $2,500.00      │  │
│ │ 📅 Nov 28, 2025                 │  │
│ │ 📝 Website project              │  │
│ │ [Delete]                         │  │
│ └─────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**CSS Classes**:
```css
.currency-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.currency-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  border-bottom: 2px solid #7c3aed;
  padding-bottom: 10px;
}

.entry-card {
  background: #f9fafb;
  border-left: 4px solid #7c3aed;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.entry-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(124,58,237,0.2);
}
```

### 2. Tabs View 📑

**Purpose**: Organized by type, quick overview

**Structure**:
```
┌────────────────────────────────────────┐
│ [Salary] [Freelance] [Bonus] [Other]   │
├────────────────────────────────────────┤
│ Salary Tab Content                     │
│                                         │
│ Nov 29  $5,000.00  Monthly salary      │
│ Oct 29  $5,000.00  Monthly salary      │
│ Sep 29  $5,000.00  Monthly salary      │
│                                         │
│ Total: $15,000.00                      │
└────────────────────────────────────────┘
```

**Implementation**:
```javascript
function renderIncomeTabs(entries) {
  // Group by type
  const grouped = groupByType(entries);
  const types = Object.keys(grouped);
  
  let html = '<div class="tabs-view">';
  
  // Tab buttons
  html += '<div class="tab-buttons">';
  types.forEach((type, index) => {
    const active = index === 0 ? 'active' : '';
    html += `
      <button class="tab-button ${active}" 
              onclick="switchTab('income', '${type}')">
        ${type}
        <span class="badge">${grouped[type].count}</span>
      </button>
    `;
  });
  html += '</div>';
  
  // Tab contents
  html += '<div class="tab-contents">';
  types.forEach((type, index) => {
    const active = index === 0 ? 'active' : '';
    const typeData = grouped[type];
    
    html += `
      <div class="tab-content ${active}" data-tab="${type}">
        <div class="tab-header">
          <h3>${type}</h3>
          <div class="tab-stats">
            <span>${typeData.count} entries</span>
            <span class="tab-total">
              ${typeData.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span>
          </div>
        </div>
        <div class="tab-entries">
    `;
    
    typeData.entries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      html += `
        <div class="tab-entry">
          <span class="tab-entry-date">${date}</span>
          <span class="tab-entry-amount">
            ${entry.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
            ${entry.currency}
          </span>
          <span class="tab-entry-note">${entry.note || '-'}</span>
          <button onclick="deleteIncome(${entry.id})" class="tab-delete-btn">×</button>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  html += '</div></div>';
  
  return html;
}

function switchTab(section, tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  event.target.classList.add('active');
}
```

### 3. Columns View ⚏

**Purpose**: Spreadsheet-like, detailed data

**Structure**:
```
┌──────────────────────────────────────────────────────┐
│ Date       │ Type      │ Amount   │ Currency │ Note  │
├──────────────────────────────────────────────────────┤
│ Nov 29     │ Salary    │ 5,000.00 │ USD      │ ...   │
│ Nov 28     │ Freelance │ 2,500.00 │ USD      │ ...   │
│ Nov 20     │ Bonus     │ 1,000.00 │ USD      │ ...   │
└──────────────────────────────────────────────────────┘
```

**Implementation**:
```javascript
function renderIncomeColumns(entries) {
  let html = '<div class="columns-view">';
  
  // Group by currency
  const grouped = groupByCurrency(entries);
  
  Object.keys(grouped).forEach(currency => {
    const currencyEntries = grouped[currency];
    const total = currencyEntries.reduce((sum, e) => sum + e.amount, 0);
    
    html += `
      <div class="currency-columns-section">
        <div class="currency-columns-header">
          <span>${currency}</span>
          <span class="currency-columns-total">
            ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </span>
        </div>
        
        <table class="columns-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    currencyEntries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const typeName = entry.Type?.name || 'Unknown';
      
      html += `
        <tr>
          <td>${date}</td>
          <td>${typeName}</td>
          <td class="amount-cell">
            ${entry.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </td>
          <td>${entry.note || '-'}</td>
          <td>
            <button onclick="deleteIncome(${entry.id})" class="table-delete-btn">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}
```

### 4. Timeline View 📅

**Purpose**: Chronological story, see patterns over time

**Structure**:
```
    │
    ├─ Nov 29, 2025
    │  ├─ Salary: $5,000.00
    │  └─ Freelance: $500.00
    │
    ├─ Nov 28, 2025
    │  └─ Project Payment: $2,000.00
    │
    ├─ Nov 20, 2025
    │  ├─ Bonus: $1,000.00
    │  └─ Gift: $100.00
    │
    ▼
```

**Implementation**:
```javascript
function renderIncomeTimeline(entries) {
  // Group by date
  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped).sort((a, b) => {
    return new Date(b) - new Date(a);  // Newest first
  });
  
  let html = '<div class="timeline-view">';
  
  dates.forEach((dateStr, index) => {
    const dateEntries = grouped[dateStr];
    const dateTotal = dateEntries.reduce((sum, e) => sum + e.amount, 0);
    const date = new Date(dateEntries[0].date);
    
    // Format date nicely
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    html += `
      <div class="timeline-date-group">
        <div class="timeline-date-marker">
          <div class="timeline-line ${index === 0 ? 'start' : ''}"></div>
          <div class="timeline-dot"></div>
          <div class="timeline-line ${index === dates.length - 1 ? 'end' : ''}"></div>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-date-header">
            <div>
              <div class="timeline-day-name">${dayName}</div>
              <div class="timeline-date-text">${monthDay}</div>
            </div>
            <div class="timeline-date-total">
              ${dateTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>
          
          <div class="timeline-entries">
    `;
    
    dateEntries.forEach(entry => {
      const typeName = entry.Type?.name || 'Unknown';
      html += `
        <div class="timeline-entry">
          <div class="timeline-entry-header">
            <span class="timeline-entry-type">${typeName}</span>
            <span class="timeline-entry-amount">
              ${entry.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
              ${entry.currency}
            </span>
          </div>
          <div class="timeline-entry-note">${entry.note || ''}</div>
          <button onclick="deleteIncome(${entry.id})" class="timeline-delete-btn">
            Delete
          </button>
        </div>
      `;
    });
    
    html += `
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}
```

### 5. Dashboard View 📊

**Purpose**: Analytics, insights, visualizations

**Structure**:
```
┌──────────────────────────────────────────┐
│ 📊 Income Dashboard                      │
├──────────────────────────────────────────┤
│ Total Income: $25,000.00                 │
│ Average per Entry: $1,250.00             │
│ Total Entries: 20                        │
├──────────────────────────────────────────┤
│ By Type:                                 │
│ ████████████████ Salary    60% $15,000   │
│ ██████████ Freelance       30% $7,500    │
│ ███ Bonus                  10% $2,500    │
├──────────────────────────────────────────┤
│ By Currency:                             │
│ ████████████████████ USD   80% $20,000   │
│ █████ LBP                  20% $5,000    │
└──────────────────────────────────────────┘
```

**Implementation**:
```javascript
function renderIncomeDashboard(entries) {
  if (entries.length === 0) {
    return '<p>No income data to analyze yet.</p>';
  }
  
  // Calculate statistics
  const stats = {
    total: entries.reduce((sum, e) => sum + e.amount, 0),
    count: entries.length,
    average: 0,
    byType: {},
    byCurrency: {},
    byMonth: {}
  };
  
  stats.average = stats.total / stats.count;
  
  // Group by type
  entries.forEach(entry => {
    const typeName = entry.Type?.name || 'Unknown';
    if (!stats.byType[typeName]) {
      stats.byType[typeName] = { total: 0, count: 0 };
    }
    stats.byType[typeName].total += entry.amount;
    stats.byType[typeName].count++;
  });
  
  // Group by currency
  entries.forEach(entry => {
    const currency = entry.currency || 'USD';
    if (!stats.byCurrency[currency]) {
      stats.byCurrency[currency] = { total: 0, count: 0 };
    }
    stats.byCurrency[currency].total += entry.amount;
    stats.byCurrency[currency].count++;
  });
  
  // Group by month
  entries.forEach(entry => {
    const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!stats.byMonth[month]) {
      stats.byMonth[month] = { total: 0, count: 0 };
    }
    stats.byMonth[month].total += entry.amount;
    stats.byMonth[month].count++;
  });
  
  // Render HTML
  let html = '<div class="dashboard-view">';
  
  // Overall stats
  html += `
    <div class="dashboard-summary">
      <div class="dashboard-stat-card">
        <div class="stat-value">${stats.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div class="stat-label">Total Income</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-value">${stats.count}</div>
        <div class="stat-label">Total Entries</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-value">${stats.average.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div class="stat-label">Average per Entry</div>
      </div>
    </div>
  `;
  
  // By Type
  html += `
    <div class="dashboard-section">
      <h3>Income by Type</h3>
      <div class="dashboard-bars">
  `;
  
  Object.entries(stats.byType)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([type, data]) => {
      const percentage = (data.total / stats.total) * 100;
      html += `
        <div class="dashboard-bar-item">
          <div class="bar-label">
            <span>${type}</span>
            <span>${data.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="bar-percentage">${percentage.toFixed(1)}%</div>
        </div>
      `;
    });
  
  html += '</div></div>';
  
  // By Currency
  html += `
    <div class="dashboard-section">
      <h3>Income by Currency</h3>
      <div class="dashboard-bars">
  `;
  
  Object.entries(stats.byCurrency)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([currency, data]) => {
      const percentage = (data.total / stats.total) * 100;
      html += `
        <div class="dashboard-bar-item">
          <div class="bar-label">
            <span>${currency}</span>
            <span>${data.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="bar-percentage">${percentage.toFixed(1)}%</div>
        </div>
      `;
    });
  
  html += '</div></div>';
  
  // By Month
  html += `
    <div class="dashboard-section">
      <h3>Income by Month</h3>
      <div class="dashboard-bars">
  `;
  
  Object.entries(stats.byMonth)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .forEach(([month, data]) => {
      const percentage = (data.total / stats.total) * 100;
      html += `
        <div class="dashboard-bar-item">
          <div class="bar-label">
            <span>${month}</span>
            <span>${data.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="bar-percentage">${percentage.toFixed(1)}%</div>
        </div>
      `;
    });
  
  html += '</div></div>';
  html += '</div>';
  
  return html;
}
```

## View Persistence

```javascript
// Save view preference
function changeIncomeView(view) {
  localStorage.setItem('incomeView', view);
  renderIncomeView(view);
}

// Get saved view
function getCurrentIncomeView() {
  return localStorage.getItem('incomeView') || 'cards';
}

// On page load
function showSection(sectionName) {
  if (sectionName === 'income') {
    const savedView = getCurrentIncomeView();
    renderIncomeView(savedView);
  }
}
```

## Mobile Responsiveness

```css
/* Desktop: Side by side */
@media (min-width: 768px) {
  .entry-card {
    display: flex;
    justify-content: space-between;
  }
}

/* Mobile: Stacked */
@media (max-width: 767px) {
  .entry-card {
    display: block;
  }
  
  .entry-actions {
    margin-top: 10px;
  }
  
  /* Timeline: More compact */
  .timeline-date-marker {
    width: 30px;
  }
  
  /* Dashboard: Full width bars */
  .dashboard-summary {
    display: block;
  }
  
  .dashboard-stat-card {
    margin-bottom: 15px;
  }
}
```

## Chapter Summary

You've learned:
- ✅ Five view types: Cards, Tabs, Columns, Timeline, Dashboard
- ✅ Implementation of each view with full code
- ✅ Grouping data by currency, type, date, month
- ✅ Calculating statistics and percentages
- ✅ Creating visual bars and charts
- ✅ View persistence with localStorage
- ✅ Mobile-responsive layouts

## Exercise 8.1: Add a Map View

Create a new "Map" view that shows data on a world map:

**Requirements**:
1. Add "🗺️ Map" button to view switcher
2. Create `renderIncomeMap(entries)` function
3. Group entries by country (you'll need to add country to entries)
4. Display using a visual ASCII map or colored regions
5. Show totals per country

**Bonus**: Use a real map library like Leaflet!

---

# Chapter 9: Forms and User Input

## Form Structure

Every data entry form follows a consistent pattern:

```html
<form id="incomeForm" class="data-form">
  <!-- Amount -->
  <div class="form-group">
    <label for="incomeAmount">Amount *</label>
    <input type="number" 
           id="incomeAmount" 
           name="amount" 
           step="0.01" 
           required 
           placeholder="0.00">
  </div>
  
  <!-- Currency -->
  <div class="form-group">
    <label for="incomeCurrency">Currency *</label>
    <select id="incomeCurrency" name="currency" required>
      <option value="USD">USD</option>
      <option value="LBP">LBP</option>
      <option value="EUR">EUR</option>
    </select>
  </div>
  
  <!-- Type -->
  <div class="form-group">
    <label for="incomeType">Type *</label>
    <select id="incomeType" name="typeId" required>
      <option value="">Select type...</option>
      <!-- Populated dynamically from /types -->
    </select>
  </div>
  
  <!-- Date -->
  <div class="form-group">
    <label for="incomeDate">Date *</label>
    <input type="date" 
           id="incomeDate" 
           name="date" 
           required
           value="${new Date().toISOString().split('T')[0]}">
  </div>
  
  <!-- Note -->
  <div class="form-group">
    <label for="incomeNote">Note</label>
    <textarea id="incomeNote" 
              name="note" 
              rows="3" 
              placeholder="Optional details..."></textarea>
  </div>
  
  <!-- Submit Button -->
  <button type="submit" class="submit-btn">Add Income</button>
  
  <!-- Result Message -->
  <div id="incomeResult" class="form-result"></div>
</form>
```

## Form Submission Flow

```javascript
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
  // ═══════════════════════════════════════════════════════════
  // STEP 1: PREVENT DEFAULT BEHAVIOR
  // ═══════════════════════════════════════════════════════════
  e.preventDefault();
  // Without this, browser would reload page!
  
  // ═══════════════════════════════════════════════════════════
  // STEP 2: COLLECT FORM DATA
  // ═══════════════════════════════════════════════════════════
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  /* Result:
  {
    amount: "500.00",
    currency: "USD",
    typeId: "15",
    date: "2025-11-29",
    note: "Monthly salary"
  }
  */
  
  // ═══════════════════════════════════════════════════════════
  // STEP 3: ADD ADDITIONAL FIELDS
  // ═══════════════════════════════════════════════════════════
  data.category = 'income';  // Identify this as income
  data.amount = parseFloat(data.amount);  // Convert to number
  
  // ═══════════════════════════════════════════════════════════
  // STEP 4: VALIDATE DATA
  // ═══════════════════════════════════════════════════════════
  if (data.amount <= 0) {
    showError('incomeResult', 'Amount must be greater than 0');
    return;
  }
  
  if (!data.typeId) {
    showError('incomeResult', 'Please select a type');
    return;
  }
  
  // ═══════════════════════════════════════════════════════════
  // STEP 5: DISABLE SUBMIT BUTTON (PREVENT DOUBLE-SUBMIT)
  // ═══════════════════════════════════════════════════════════
  const submitBtn = e.target.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  
  // ═══════════════════════════════════════════════════════════
  // STEP 6: SEND TO SERVER
  // ═══════════════════════════════════════════════════════════
  try {
    const response = await authFetch('/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // ═══════════════════════════════════════════════════════════
    // STEP 7: HANDLE RESPONSE
    // ═══════════════════════════════════════════════════════════
    if (response.ok) {
      const newEntry = await response.json();
      
      // Show success message
      showSuccess('incomeResult', 'Income added successfully!');
      
      // Clear form
      e.target.reset();
      
      // Reset date to today (because reset() clears it)
      document.getElementById('incomeDate').value = 
        new Date().toISOString().split('T')[0];
      
      // Refresh data
      await fetchIncome({ reset: true });
      
      // Update balances
      await showBalances();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        document.getElementById('incomeResult').innerHTML = '';
      }, 3000);
      
    } else {
      // Server returned error
      const error = await response.json();
      showError('incomeResult', error.message || 'Failed to add income');
    }
    
  } catch (error) {
    // Network error
    console.error('Error adding income:', error);
    showError('incomeResult', 'Network error. Please try again.');
    
  } finally {
    // ═══════════════════════════════════════════════════════════
    // STEP 8: RE-ENABLE SUBMIT BUTTON
    // ═══════════════════════════════════════════════════════════
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Income';
  }
});
```

## Helper Functions

```javascript
function showSuccess(elementId, message) {
  document.getElementById(elementId).innerHTML = 
    `<div class="alert alert-success">${message}</div>`;
}

function showError(elementId, message) {
  document.getElementById(elementId).innerHTML = 
    `<div class="alert alert-error">${message}</div>`;
}

function clearMessage(elementId) {
  document.getElementById(elementId).innerHTML = '';
}
```

## Dynamic Dropdown Population

```javascript
async function populateTypeDropdown(category) {
  try {
    // Fetch types from server
    const response = await authFetch(`/types?category=${category}`);
    const types = await response.json();
    
    // Get dropdown element
    const selectId = category === 'income' ? 'incomeType' : 'expenseType';
    const select = document.getElementById(selectId);
    
    // Clear existing options (except first)
    select.innerHTML = '<option value="">Select type...</option>';
    
    // Add options
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      select.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error loading types:', error);
  }
}

// Call when section loads
async function showSection(sectionName) {
  if (sectionName === 'income') {
    await populateTypeDropdown('income');
  } else if (sectionName === 'expenses') {
    await populateTypeDropdown('expense');
  }
}
```

## Form Validation

### HTML5 Validation

```html
<!-- Required field -->
<input type="number" required>

<!-- Must be positive -->
<input type="number" min="0.01" step="0.01">

<!-- Must be valid email -->
<input type="email" required>

<!-- Max length -->
<input type="text" maxlength="100">

<!-- Pattern matching -->
<input type="text" pattern="[A-Za-z]{3,}">
```

### JavaScript Validation

```javascript
function validateIncomeForm(data) {
  const errors = [];
  
  // Amount validation
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (data.amount > 1000000000) {
    errors.push('Amount is unrealistically high');
  }
  
  // Currency validation
  const validCurrencies = ['USD', 'LBP', 'EUR'];
  if (!validCurrencies.includes(data.currency)) {
    errors.push('Invalid currency');
  }
  
  // Date validation
  const entryDate = new Date(data.date);
  const today = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);
  
  if (entryDate > today) {
    errors.push('Date cannot be in the future');
  }
  
  if (entryDate < hundredYearsAgo) {
    errors.push('Date is too far in the past');
  }
  
  // Type validation
  if (!data.typeId) {
    errors.push('Please select a type');
  }
  
  // Note validation (optional but check length)
  if (data.note && data.note.length > 500) {
    errors.push('Note is too long (max 500 characters)');
  }
  
  return errors;
}

// Usage in submit handler
const errors = validateIncomeForm(data);
if (errors.length > 0) {
  showError('incomeResult', errors.join('<br>'));
  return;
}
```

## Currency Selector

```javascript
function renderCurrencyFab() {
  const currencies = getSelectedCurrencies();
  const currentCurrency = getCurrency();
  
  let html = `
    <div class="currency-fab">
      <button class="currency-fab-btn" onclick="toggleCurrencyMenu()">
        ${currentCurrency}
      </button>
      <div class="currency-menu" id="currencyMenu" style="display:none;">
  `;
  
  currencies.forEach(currency => {
    const active = currency === currentCurrency ? 'active' : '';
    html += `
      <button class="currency-menu-item ${active}" 
              onclick="setCurrency('${currency}')">
        ${currency}
      </button>
    `;
  });
  
  html += `
      <hr>
      <button class="currency-menu-item" onclick="showCurrencyPickerModal()">
        Manage Currencies
      </button>
      </div>
    </div>
  `;
  
  document.getElementById('currencyFabContainer').innerHTML = html;
}

function toggleCurrencyMenu() {
  const menu = document.getElementById('currencyMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setCurrency(currency) {
  localStorage.setItem('currency', currency);
  renderCurrencyFab();
  toggleCurrencyMenu();
  
  // Refresh all views that depend on currency
  refreshCurrentView();
}
```

## Transfer Form (Special Case)

The transfer form is unique because it moves money between balances:

```javascript
async function handleTransferSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Convert to numbers
  data.amount = parseFloat(data.amount);
  data.fromBalanceId = parseInt(data.fromBalanceId);
  data.toBalanceId = parseInt(data.toBalanceId);
  
  // Validation
  if (data.fromBalanceId === data.toBalanceId) {
    showError('transferResult', 'Cannot transfer to the same balance');
    return;
  }
  
  if (data.amount <= 0) {
    showError('transferResult', 'Amount must be greater than 0');
    return;
  }
  
  // Check if source has enough funds
  const sourceBalance = balancesData.find(b => b.id === data.fromBalanceId);
  if (sourceBalance && sourceBalance.amount < data.amount) {
    const confirm = window.confirm(
      `Source balance only has ${sourceBalance.amount}. Continue anyway?`
    );
    if (!confirm) return;
  }
  
  // Submit
  try {
    const response = await authFetch('/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showSuccess('transferResult', 'Transfer successful!');
      e.target.reset();
      
      // Refresh both transfers and balances
      await Promise.all([
        fetchTransfers({ reset: true }),
        showBalances()
      ]);
      
      setTimeout(() => clearMessage('transferResult'), 3000);
    } else {
      const error = await response.json();
      showError('transferResult', error.message);
    }
    
  } catch (error) {
    console.error('Transfer error:', error);
    showError('transferResult', 'Network error');
  }
}
```

## Dropdown Synchronization

When selecting "from" balance, remove it from "to" options:

```javascript
function syncTransferDropdowns() {
  const fromSelect = document.getElementById('transferFrom');
  const toSelect = document.getElementById('transferTo');
  
  const fromValue = fromSelect.value;
  const toValue = toSelect.value;
  
  // Temporarily remove event listeners
  fromSelect.removeEventListener('change', syncTransferDropdowns);
  toSelect.removeEventListener('change', syncTransferDropdowns);
  
  // Get all options
  const allOptions = Array.from(balancesData).map(balance => ({
    value: balance.id,
    text: `${balance.name} (${balance.currency})`
  }));
  
  // Repopulate "from" dropdown
  fromSelect.innerHTML = '<option value="">Select source...</option>';
  allOptions
    .filter(opt => opt.value != toValue)  // Exclude "to" selection
    .forEach(opt => {
      const option = new Option(opt.text, opt.value);
      if (opt.value == fromValue) option.selected = true;
      fromSelect.add(option);
    });
  
  // Repopulate "to" dropdown
  toSelect.innerHTML = '<option value="">Select destination...</option>';
  allOptions
    .filter(opt => opt.value != fromValue)  // Exclude "from" selection
    .forEach(opt => {
      const option = new Option(opt.text, opt.value);
      if (opt.value == toValue) option.selected = true;
      toSelect.add(option);
    });
  
  // Re-add event listeners
  fromSelect.addEventListener('change', syncTransferDropdowns);
  toSelect.addEventListener('change', syncTransferDropdowns);
}
```

## Chapter Summary

You've learned:
- ✅ Form structure and HTML elements
- ✅ Complete form submission flow
- ✅ Validation (client-side and server-side)
- ✅ Dynamic dropdown population
- ✅ Error and success message display
- ✅ Form reset and state management
- ✅ Special cases: transfers, currency selector
- ✅ Dropdown synchronization

## Exercise 9.1: Add Form Autocomplete

Add autocomplete to the note field based on previous entries:

**Requirements**:
1. Track last 10 notes for each type
2. Show suggestions as user types
3. Click to autofill
4. Store in localStorage

**Hint**: Use `<datalist>` or create custom dropdown!

---

*Continuing with backend chapters next...*

# PART IV - BACKEND EXPLAINED

# Chapter 10: The Backend Explained

## What Is the Backend?

```
┌──────────────────────────────────────────────────────┐
│ FRONTEND (Browser)                                   │
│ • HTML, CSS, JavaScript                              │
│ • User sees and interacts                            │
│ • Makes HTTP requests                                │
└───────────────────┬──────────────────────────────────┘
                    │
                    │  HTTP Request
                    │  GET /entries
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│ BACKEND (Server)                                      │
│ • Node.js + Express.js                                │
│ • Handles requests                                    │
│ • Validates data                                      │
│ • Talks to database                                   │
│ • Returns responses                                   │
└───────────────────┬──────────────────────────────────┘
                    │
                    │  SQL Query
                    │  SELECT * FROM entries
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL)                                 │
│ • Stores all data                                     │
│ • users, entries, balances, types, etc.              │
│ • Returns results                                     │
└──────────────────────────────────────────────────────┘
```

## Backend File Structure

```
personal_finance/
│
├── app.js                  ← Main server file
│
├── config/
│   └── config.json        ← Database connection settings
│
├── models/
│   ├── index.js           ← Sequelize setup
│   ├── User.js            ← User model
│   ├── Entry.js           ← Income/Expense model
│   ├── Balance.js         ← Balance model
│   ├── Type.js            ← Category type model
│   ├── Transfer.js        ← Transfer model
│   ├── Savings.js         ← Savings model
│   ├── Currency.js        ← Currency model
│   └── ... more models
│
├── controllers/
│   ├── authController.js     ← Login/Register logic
│   ├── entryController.js    ← Income/Expense CRUD
│   ├── balanceController.js  ← Balance operations
│   ├── typeController.js     ← Type management
│   └── ... more controllers
│
├── routes/
│   ├── auth.js            ← /auth/* endpoints
│   ├── entries.js         ← /entries/* endpoints
│   ├── balances.js        ← /balances/* endpoints
│   ├── types.js           ← /types/* endpoints
│   └── ... more routes
│
├── middleware/
│   ├── authJwt.js         ← JWT authentication
│   ├── validateJoi.js     ← Input validation
│   └── errorHandler.js    ← Error handling
│
└── migrations/
    ├── 01-create-users.js
    ├── 02-create-entries.js
    └── ... database migrations
```

## Main Server File: app.js

```javascript
// ═══════════════════════════════════════════════════════════
// 1. IMPORT DEPENDENCIES
// ═══════════════════════════════════════════════════════════
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Database
const db = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const balanceRoutes = require('./routes/balances');
const typeRoutes = require('./routes/types');
const transferRoutes = require('./routes/transfers');
const savingsRoutes = require('./routes/savings');
const reportRoutes = require('./routes/report');
const userRoutes = require('./routes/user');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// ═══════════════════════════════════════════════════════════
// 2. CREATE EXPRESS APP
// ═══════════════════════════════════════════════════════════
const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════
// 3. SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════

// Helmet: Sets secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "challenges.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["challenges.cloudflare.com"]
    }
  }
}));

// Rate Limiting: Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later'
});
app.use('/auth/', limiter);  // Apply to auth routes

// ═══════════════════════════════════════════════════════════
// 4. BODY PARSING MIDDLEWARE
// ═══════════════════════════════════════════════════════════
app.use(express.json());                          // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cookieParser());                         // Parse cookies

// ═══════════════════════════════════════════════════════════
// 5. CSRF PROTECTION
// ═══════════════════════════════════════════════════════════
const csrfProtection = csrf({ cookie: true });

// Endpoint to get CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF to all state-changing requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// ═══════════════════════════════════════════════════════════
// 6. STATIC FILES (FRONTEND)
// ═══════════════════════════════════════════════════════════
app.use(express.static(path.join(__dirname, 'Public')));

// ═══════════════════════════════════════════════════════════
// 7. API ROUTES
// ═══════════════════════════════════════════════════════════
app.use('/auth', authRoutes);
app.use('/entries', entryRoutes);
app.use('/balances', balanceRoutes);
app.use('/types', typeRoutes);
app.use('/transfers', transferRoutes);
app.use('/savings', savingsRoutes);
app.use('/report', reportRoutes);
app.use('/user', userRoutes);

// ═══════════════════════════════════════════════════════════
// 8. ERROR HANDLING
// ═══════════════════════════════════════════════════════════
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ═══════════════════════════════════════════════════════════
// 9. START SERVER
// ═══════════════════════════════════════════════════════════
db.sequelize.sync().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
});
```

## Request Flow

```
1. Browser sends request
   POST /entries
   Headers: {
     Authorization: Bearer eyJhbGc...
     Content-Type: application/json
     X-CSRF-Token: abc123...
   }
   Body: {
     amount: 500,
     currency: "USD",
     category: "income",
     typeId: 15,
     date: "2025-11-29"
   }

2. Express receives request
   ↓
3. Security middleware runs
   • Helmet sets headers
   • Rate limiter checks requests
   ↓
4. Body parsing
   • JSON body parsed to req.body
   • Cookies parsed to req.cookies
   ↓
5. CSRF check
   • Validates CSRF token
   • Rejects if invalid
   ↓
6. Route matching
   • Matches POST /entries
   • Goes to entryRoutes
   ↓
7. Route middleware
   • JWT authentication (authJwt)
   • Input validation (validateJoi)
   ↓
8. Controller function
   • Business logic
   • Database operations
   ↓
9. Response sent
   Status: 201 Created
   Body: {
     id: 234,
     amount: 500,
     currency: "USD",
     ...
   }
   ↓
10. Browser receives response
    • Updates UI
    • Shows success message
```

## Express Middleware Chain

Middleware functions execute in order:

```javascript
app.use(helmet());           // 1. Security headers
app.use(limiter);            // 2. Rate limiting
app.use(express.json());     // 3. Parse body
app.use(cookieParser());     // 4. Parse cookies
app.use(csrfProtection);     // 5. CSRF check
app.use('/entries', routes); // 6. Route specific

// In route file:
router.post('/',
  authJwt,         // 7. Check JWT
  validateJoi,     // 8. Validate input
  controller       // 9. Execute logic
);
```

Each middleware has access to:
- `req` (request object)
- `res` (response object)
- `next` (function to call next middleware)

```javascript
function myMiddleware(req, res, next) {
  // Do something with req or res
  console.log('Request URL:', req.url);
  
  // Continue to next middleware
  next();
  
  // Or send response and stop
  // res.status(403).json({ error: 'Forbidden' });
}
```

## HTTP Methods and REST

Our API follows **REST** principles:

```
GET    /entries          → Get list of entries
GET    /entries/:id      → Get single entry
POST   /entries          → Create new entry
PUT    /entries/:id      → Update entire entry
PATCH  /entries/:id      → Update part of entry
DELETE /entries/:id      → Delete entry
```

**HTTP Status Codes**:
```
200 OK                 → Success (GET, PUT, PATCH)
201 Created            → Resource created (POST)
204 No Content         → Success with no body (DELETE)
400 Bad Request        → Invalid input
401 Unauthorized       → Not logged in
403 Forbidden          → Not allowed
404 Not Found          → Resource doesn't exist
500 Internal Error     → Server error
```

## Environment Variables

Sensitive data goes in `.env` file:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=personal_finance
DATABASE_USER=postgres
DATABASE_PASSWORD=secretpassword

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRATION=86400

# Server
PORT=3000
NODE_ENV=development

# Email (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
```

Load in Node.js:

```javascript
require('dotenv').config();

const dbHost = process.env.DATABASE_HOST;
const jwtSecret = process.env.JWT_SECRET;
```

**⚠️ NEVER commit .env to git!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

## Chapter Summary

You've learned:
- ✅ Backend architecture and purpose
- ✅ File structure organization
- ✅ Main server setup (app.js)
- ✅ Middleware chain execution
- ✅ Request flow from browser to database
- ✅ Security middleware (Helmet, CSRF, rate limiting)
- ✅ REST API principles
- ✅ HTTP methods and status codes
- ✅ Environment variables

## Exercise 10.1: Add Request Logging

Add middleware to log all requests:

```javascript
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

app.use(requestLogger);
```

**Task**: 
1. Add this middleware to app.js
2. Also log response status code
3. Log request duration

**Hint**: Use `res.on('finish', callback)` to know when response completes!

---

# Chapter 11: Database Design and Models

## Database Schema Overview

Our PostgreSQL database has these tables:

```
┌─────────────┐
│   users     │  ← User accounts
├─────────────┤
│ id          │  Primary Key
│ username    │  Unique
│ password    │  Bcrypt hashed
│ email       │
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐
│   types     │  ← Income/Expense categories
├─────────────┤
│ id          │  Primary Key
│ name        │  "Salary", "Food", etc.
│ category    │  "income" or "expense"
│ description │
│ userId      │  Foreign Key → users.id
└─────────────┘

┌─────────────┐
│  entries    │  ← Income and Expense records
├─────────────┤
│ id          │  Primary Key
│ amount      │  DECIMAL(15,2)
│ currency    │  "USD", "LBP", etc.
│ category    │  "income" or "expense"
│ typeId      │  Foreign Key → types.id
│ userId      │  Foreign Key → users.id
│ date        │  DATE
│ note        │  TEXT
│ locked      │  BOOLEAN (if month closed)
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐
│  balances   │  ← Account balances
├─────────────┤
│ id          │  Primary Key
│ name        │  "Cash", "Bank", etc.
│ amount      │  DECIMAL(15,2)
│ currency    │  "USD", "LBP", etc.
│ userId      │  Foreign Key → users.id
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐
│ transfers   │  ← Money transfers between balances
├─────────────┤
│ id          │  Primary Key
│ amount      │  DECIMAL(15,2)
│ fromId      │  Foreign Key → balances.id
│ toId        │  Foreign Key → balances.id
│ userId      │  Foreign Key → users.id
│ date        │  DATE
│ note        │  TEXT
│ locked      │  BOOLEAN
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐
│  savings    │  ← Savings records
├─────────────┤
│ id          │  Primary Key
│ amount      │  DECIMAL(15,2)
│ currency    │  "USD", "LBP", etc.
│ userId      │  Foreign Key → users.id
│ date        │  DATE
│ note        │  TEXT
│ locked      │  BOOLEAN
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

## Relationships (Entity-Relationship Diagram)

```
           ┌──────────┐
           │  users   │
           └────┬─────┘
                │
      ┌─────────┼─────────┬─────────┬──────────┐
      │         │         │         │          │
      ▼         ▼         ▼         ▼          ▼
  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌──────┐
  │ types │ │entries│ │balance│ │transf.│ │savings│
  └───┬───┘ └───────┘ └───────┘ └───────┘ └──────┘
      │         │
      └────┬────┘
           │
      (typeId)
```

**Relationships**:
- User **has many** Types
- User **has many** Entries
- User **has many** Balances
- User **has many** Transfers
- User **has many** Savings
- Type **has many** Entries
- Entry **belongs to** User and Type

## Sequelize ORM

**ORM** = Object-Relational Mapping

Instead of writing SQL:
```sql
SELECT * FROM entries WHERE userId = 5 AND category = 'income'
```

We write JavaScript:
```javascript
await Entry.findAll({
  where: {
    userId: 5,
    category: 'income'
  }
});
```

### Sequelize Setup (models/index.js)

```javascript
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Create Sequelize instance
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'postgres',
    logging: false,  // Disable SQL logging
    pool: {
      max: 5,        // Maximum connections
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Type = require('./Type')(sequelize, Sequelize);
db.Entry = require('./Entry')(sequelize, Sequelize);
db.Balance = require('./Balance')(sequelize, Sequelize);
db.Transfer = require('./Transfer')(sequelize, Sequelize);
db.Savings = require('./Savings')(sequelize, Sequelize);
db.Currency = require('./Currency')(sequelize, Sequelize);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
```

### User Model (models/User.js)

```javascript
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],  // Length between 3-50
        isAlphanumeric: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,  // Adds createdAt, updatedAt
    
    hooks: {
      // Hash password before saving
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  
  // Instance method: Check password
  User.prototype.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Associations
  User.associate = (models) => {
    User.hasMany(models.Entry, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Type, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Balance, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Transfer, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Savings, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  
  return User;
};
```

### Entry Model (models/Entry.js)

```javascript
module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01
      }
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    category: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'types',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'entries',
    timestamps: true
  });
  
  Entry.associate = (models) => {
    Entry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User'
    });
    Entry.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'Type'
    });
  };
  
  return Entry;
};
```

## Common Sequelize Operations

### Create (INSERT)

```javascript
// Create new user
const user = await User.create({
  username: 'john_doe',
  password: 'secret123',  // Will be auto-hashed
  email: 'john@example.com'
});

// Create entry
const entry = await Entry.create({
  amount: 500.00,
  currency: 'USD',
  category: 'income',
  typeId: 15,
  userId: user.id,
  date: '2025-11-29',
  note: 'Monthly salary'
});
```

### Read (SELECT)

```javascript
// Find all
const allEntries = await Entry.findAll();

// Find with conditions
const incomeEntries = await Entry.findAll({
  where: {
    userId: 5,
    category: 'income'
  }
});

// Find one
const entry = await Entry.findOne({
  where: { id: 100 }
});

// Find by primary key
const entry = await Entry.findByPk(100);

// With associations
const entry = await Entry.findByPk(100, {
  include: [
    { model: Type, as: 'Type' },
    { model: User, as: 'User' }
  ]
});
```

### Update

```javascript
// Update instance
entry.amount = 600.00;
await entry.save();

// Update with query
await Entry.update(
  { amount: 600.00 },
  { where: { id: 100 } }
);

// Increment
await Balance.increment('amount', {
  by: 500,
  where: { id: 10 }
});
```

### Delete

```javascript
// Delete instance
await entry.destroy();

// Delete with query
await Entry.destroy({
  where: {
    userId: 5,
    category: 'income'
  }
});
```

### Advanced Queries

```javascript
// Pagination
const entries = await Entry.findAll({
  limit: 50,
  offset: 100,
  order: [['date', 'DESC']]
});

// Aggregation
const totalIncome = await Entry.sum('amount', {
  where: {
    userId: 5,
    category: 'income',
    currency: 'USD'
  }
});

// Count
const entryCount = await Entry.count({
  where: { userId: 5 }
});

// Group by
const totals = await Entry.findAll({
  attributes: [
    'currency',
    [sequelize.fn('SUM', sequelize.col('amount')), 'total']
  ],
  where: { userId: 5 },
  group: ['currency']
});

// Date filtering
const thisMonthEntries = await Entry.findAll({
  where: {
    userId: 5,
    date: {
      [Op.gte]: '2025-11-01',
      [Op.lte]: '2025-11-30'
    }
  }
});
```

## Database Transactions

For operations that must all succeed or all fail:

```javascript
const { sequelize } = require('./models');

async function transferMoney(fromBalanceId, toBalanceId, amount) {
  // Start transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Deduct from source
    await Balance.decrement('amount', {
      by: amount,
      where: { id: fromBalanceId },
      transaction
    });
    
    // Add to destination
    await Balance.increment('amount', {
      by: amount,
      where: { id: toBalanceId },
      transaction
    });
    
    // Create transfer record
    await Transfer.create({
      fromBalanceId,
      toBalanceId,
      amount,
      date: new Date()
    }, { transaction });
    
    // Commit: Make changes permanent
    await transaction.commit();
    
    return { success: true };
    
  } catch (error) {
    // Rollback: Undo all changes
    await transaction.rollback();
    throw error;
  }
}
```

## Chapter Summary

You've learned:
- ✅ Database schema design
- ✅ Table relationships and foreign keys
- ✅ Sequelize ORM basics
- ✅ Model definitions
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Advanced queries (pagination, aggregation, filtering)
- ✅ Database transactions

## Exercise 11.1: Add Category Model

Create a new model for expense subcategories:

**Requirements**:
1. Create `models/SubCategory.js`
2. Fields: id, name, parentTypeId (FK to types)
3. Association: SubCategory belongs to Type
4. Add migration file

**Schema**:
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING(100),
  parentTypeId: INTEGER (FK → types.id),
  userId: INTEGER (FK → users.id)
}
```

---

*Continuing with controllers and API routes next...*

# Chapter 12: API Routes and Controllers

## MVC Pattern

Our backend uses the **MVC** (Model-View-Controller) pattern:

```
┌──────────────────────┐
│ Route                │  ← Defines URL endpoints
│ routes/entries.js    │     Maps URLs to controllers
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Controller           │  ← Business logic
│ entryController.js   │     Processes requests
│                      │     Talks to models
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Model                │  ← Database operations
│ Entry.js             │     SQL queries via Sequelize
└──────────────────────┘
```

## Entry Routes (routes/entries.js)

```javascript
const express = require('express');
const router = express.Router();

// Middleware
const authJwt = require('../middleware/authJwt');
const { validateEntry } = require('../middleware/validateJoi');

// Controller
const entryController = require('../controllers/entryController');

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// GET /entries - Get all entries for user
router.get('/', 
  authJwt,                         // Check JWT
  entryController.getAllEntries    // Execute controller
);

// GET /entries/:id - Get single entry
router.get('/:id',
  authJwt,
  entryController.getEntryById
);

// POST /entries - Create new entry
router.post('/',
  authJwt,               // Check JWT
  validateEntry,         // Validate input
  entryController.createEntry
);

// PUT /entries/:id - Update entry
router.put('/:id',
  authJwt,
  validateEntry,
  entryController.updateEntry
);

// DELETE /entries/:id - Delete entry
router.delete('/:id',
  authJwt,
  entryController.deleteEntry
);

module.exports = router;
```

## Entry Controller (controllers/entryController.js)

```javascript
const { Entry, Type, User } = require('../models');
const { Op } = require('sequelize');

// ═══════════════════════════════════════════════════════════
// GET ALL ENTRIES
// ═══════════════════════════════════════════════════════════
exports.getAllEntries = async (req, res) => {
  try {
    const userId = req.userId;  // From JWT middleware
    
    // Query parameters
    const category = req.query.category;  // 'income' or 'expense'
    const currency = req.query.currency;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // Build where clause
    const where = { userId };
    
    if (category) {
      where.category = category;
    }
    
    if (currency) {
      where.currency = currency;
    }
    
    // Fetch entries
    const entries = await Entry.findAll({
      where,
      include: [{
        model: Type,
        as: 'Type',
        attributes: ['id', 'name', 'category']
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit,
      offset
    });
    
    // Return results
    res.status(200).json(entries);
    
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ 
      message: 'Failed to fetch entries',
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// GET SINGLE ENTRY
// ═══════════════════════════════════════════════════════════
exports.getEntryById = async (req, res) => {
  try {
    const userId = req.userId;
    const entryId = req.params.id;
    
    const entry = await Entry.findOne({
      where: { id: entryId, userId },
      include: [{
        model: Type,
        as: 'Type'
      }]
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.status(200).json(entry);
    
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ message: 'Failed to fetch entry' });
  }
};

// ═══════════════════════════════════════════════════════════
// CREATE ENTRY
// ═══════════════════════════════════════════════════════════
exports.createEntry = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, currency, category, typeId, date, note } = req.body;
    
    // Verify type belongs to user
    const type = await Type.findOne({
      where: { id: typeId, userId }
    });
    
    if (!type) {
      return res.status(400).json({ message: 'Invalid type' });
    }
    
    // Create entry
    const entry = await Entry.create({
      amount,
      currency,
      category,
      typeId,
      userId,
      date: date || new Date(),
      note: note || null
    });
    
    // Fetch complete entry with associations
    const completeEntry = await Entry.findByPk(entry.id, {
      include: [{ model: Type, as: 'Type' }]
    });
    
    res.status(201).json(completeEntry);
    
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ 
      message: 'Failed to create entry',
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// UPDATE ENTRY
// ═══════════════════════════════════════════════════════════
exports.updateEntry = async (req, res) => {
  try {
    const userId = req.userId;
    const entryId = req.params.id;
    const { amount, currency, category, typeId, date, note } = req.body;
    
    // Find entry
    const entry = await Entry.findOne({
      where: { id: entryId, userId }
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    // Check if locked
    if (entry.locked) {
      return res.status(403).json({ 
        message: 'Cannot update locked entry' 
      });
    }
    
    // Update fields
    entry.amount = amount;
    entry.currency = currency;
    entry.category = category;
    entry.typeId = typeId;
    entry.date = date;
    entry.note = note;
    
    await entry.save();
    
    // Fetch updated entry with associations
    const updatedEntry = await Entry.findByPk(entry.id, {
      include: [{ model: Type, as: 'Type' }]
    });
    
    res.status(200).json(updatedEntry);
    
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
};

// ═══════════════════════════════════════════════════════════
// DELETE ENTRY
// ═══════════════════════════════════════════════════════════
exports.deleteEntry = async (req, res) => {
  try {
    const userId = req.userId;
    const entryId = req.params.id;
    
    // Find entry
    const entry = await Entry.findOne({
      where: { id: entryId, userId }
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    // Check if locked
    if (entry.locked) {
      return res.status(403).json({ 
        message: 'Cannot delete locked entry' 
      });
    }
    
    // Delete
    await entry.destroy();
    
    res.status(204).send();  // No content
    
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
};
```

## Balance Controller (controllers/balanceController.js)

```javascript
const { Balance, Entry, Transfer, sequelize } = require('../models');
const { Op } = require('sequelize');

// ═══════════════════════════════════════════════════════════
// GET ALL BALANCES
// ═══════════════════════════════════════════════════════════
exports.getAllBalances = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all balances
    const balances = await Balance.findAll({
      where: { userId },
      order: [['name', 'ASC']]
    });
    
    // For each balance, calculate current amount
    const balancesWithCalculated = await Promise.all(
      balances.map(async (balance) => {
        // Get initial amount
        let currentAmount = balance.initialAmount || 0;
        
        // Add income
        const income = await Entry.sum('amount', {
          where: {
            userId,
            balanceId: balance.id,
            category: 'income'
          }
        }) || 0;
        
        // Subtract expenses
        const expenses = await Entry.sum('amount', {
          where: {
            userId,
            balanceId: balance.id,
            category: 'expense'
          }
        }) || 0;
        
        // Add transfers in
        const transfersIn = await Transfer.sum('amount', {
          where: {
            userId,
            toBalanceId: balance.id
          }
        }) || 0;
        
        // Subtract transfers out
        const transfersOut = await Transfer.sum('amount', {
          where: {
            userId,
            fromBalanceId: balance.id
          }
        }) || 0;
        
        // Calculate final amount
        currentAmount = currentAmount + income - expenses + transfersIn - transfersOut;
        
        return {
          ...balance.toJSON(),
          amount: currentAmount
        };
      })
    );
    
    res.status(200).json(balancesWithCalculated);
    
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ message: 'Failed to fetch balances' });
  }
};

// ═══════════════════════════════════════════════════════════
// CREATE BALANCE
// ═══════════════════════════════════════════════════════════
exports.createBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, initialAmount, currency } = req.body;
    
    // Check for duplicate name
    const existing = await Balance.findOne({
      where: { userId, name }
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: 'Balance with this name already exists' 
      });
    }
    
    // Create balance
    const balance = await Balance.create({
      name,
      initialAmount: initialAmount || 0,
      currency,
      userId
    });
    
    res.status(201).json(balance);
    
  } catch (error) {
    console.error('Error creating balance:', error);
    res.status(500).json({ message: 'Failed to create balance' });
  }
};

// ═══════════════════════════════════════════════════════════
// UPDATE BALANCE
// ═══════════════════════════════════════════════════════════
exports.updateBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const balanceId = req.params.id;
    const { name, initialAmount, currency } = req.body;
    
    // Find balance
    const balance = await Balance.findOne({
      where: { id: balanceId, userId }
    });
    
    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }
    
    // Update fields
    balance.name = name;
    balance.initialAmount = initialAmount;
    balance.currency = currency;
    
    await balance.save();
    
    res.status(200).json(balance);
    
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Failed to update balance' });
  }
};

// ═══════════════════════════════════════════════════════════
// DELETE BALANCE
// ═══════════════════════════════════════════════════════════
exports.deleteBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const balanceId = req.params.id;
    
    // Find balance
    const balance = await Balance.findOne({
      where: { id: balanceId, userId }
    });
    
    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }
    
    // Check if balance has transactions
    const hasEntries = await Entry.count({
      where: { balanceId }
    });
    
    const hasTransfers = await Transfer.count({
      where: {
        [Op.or]: [
          { fromBalanceId: balanceId },
          { toBalanceId: balanceId }
        ]
      }
    });
    
    if (hasEntries > 0 || hasTransfers > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete balance with transactions' 
      });
    }
    
    // Delete
    await balance.destroy();
    
    res.status(204).send();
    
  } catch (error) {
    console.error('Error deleting balance:', error);
    res.status(500).json({ message: 'Failed to delete balance' });
  }
};
```

## Type Controller with Statistics

```javascript
const { Type, Entry, sequelize } = require('../models');

// ═══════════════════════════════════════════════════════════
// GET TYPES WITH STATISTICS
// ═══════════════════════════════════════════════════════════
exports.getAllTypes = async (req, res) => {
  try {
    const userId = req.userId;
    const category = req.query.category;  // 'income' or 'expense'
    
    // Build where clause
    const where = { userId };
    if (category) {
      where.category = category;
    }
    
    // Get types
    const types = await Type.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    // Calculate statistics for each type
    const typesWithStats = await Promise.all(
      types.map(async (type) => {
        const stats = await Entry.findAll({
          attributes: [
            'currency',
            [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          where: {
            userId,
            typeId: type.id
          },
          group: ['currency'],
          raw: true
        });
        
        return {
          ...type.toJSON(),
          statistics: stats
        };
      })
    );
    
    res.status(200).json(typesWithStats);
    
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({ message: 'Failed to fetch types' });
  }
};
```

## Report Controller (Advanced Queries)

```javascript
const { Entry, Type, sequelize } = require('../models');
const { Op } = require('sequelize');

// ═══════════════════════════════════════════════════════════
// MONTHLY REPORT
// ═══════════════════════════════════════════════════════════
exports.getMonthlyReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month, currency } = req.query;
    
    // Date range
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0);  // Last day of month
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Get income
    const income = await Entry.findAll({
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        userId,
        category: 'income',
        date: {
          [Op.between]: [startDate, endDateStr]
        },
        ...(currency ? { currency } : {})
      },
      group: ['currency'],
      raw: true
    });
    
    // Get expenses
    const expenses = await Entry.findAll({
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        userId,
        category: 'expense',
        date: {
          [Op.between]: [startDate, endDateStr]
        },
        ...(currency ? { currency } : {})
      },
      group: ['currency'],
      raw: true
    });
    
    // Get expenses by type
    const expensesByType = await Entry.findAll({
      attributes: [
        'typeId',
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        userId,
        category: 'expense',
        date: {
          [Op.between]: [startDate, endDateStr]
        },
        ...(currency ? { currency } : {})
      },
      include: [{
        model: Type,
        as: 'Type',
        attributes: ['name']
      }],
      group: ['typeId', 'currency', 'Type.id'],
      order: [[sequelize.literal('total'), 'DESC']]
    });
    
    res.status(200).json({
      period: { year, month, startDate, endDate: endDateStr },
      income,
      expenses,
      expensesByType,
      net: income.map((inc, i) => ({
        currency: inc.currency,
        total: inc.total - (expenses[i]?.total || 0)
      }))
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

// ═══════════════════════════════════════════════════════════
// YEAR COMPARISON
// ═══════════════════════════════════════════════════════════
exports.getYearComparison = async (req, res) => {
  try {
    const userId = req.userId;
    const { year1, year2, currency } = req.query;
    
    async function getYearData(year) {
      const income = await Entry.sum('amount', {
        where: {
          userId,
          category: 'income',
          date: {
            [Op.between]: [`${year}-01-01`, `${year}-12-31`]
          },
          ...(currency ? { currency } : {})
        }
      });
      
      const expenses = await Entry.sum('amount', {
        where: {
          userId,
          category: 'expense',
          date: {
            [Op.between]: [`${year}-01-01`, `${year}-12-31`]
          },
          ...(currency ? { currency } : {})
        }
      });
      
      return {
        year,
        income: income || 0,
        expenses: expenses || 0,
        net: (income || 0) - (expenses || 0)
      };
    }
    
    const data1 = await getYearData(year1);
    const data2 = await getYearData(year2);
    
    res.status(200).json({
      comparison: [data1, data2],
      difference: {
        income: data2.income - data1.income,
        expenses: data2.expenses - data1.expenses,
        net: data2.net - data1.net
      }
    });
    
  } catch (error) {
    console.error('Error comparing years:', error);
    res.status(500).json({ message: 'Failed to compare years' });
  }
};
```

## Error Handler Middleware

```javascript
// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => e.message)
    });
  }
  
  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Duplicate entry',
      field: err.errors[0].path
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  // CSRF error
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      message: 'Invalid CSRF token'
    });
  }
  
  // Default error
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
```

## Chapter Summary

You've learned:
- ✅ MVC pattern implementation
- ✅ Route definition and middleware
- ✅ Controller functions for CRUD operations
- ✅ Query parameters and filtering
- ✅ Advanced database queries
- ✅ Report generation with aggregations
- ✅ Error handling middleware

## Exercise 12.1: Add Search Endpoint

Create a search endpoint that searches entries by note text:

**Requirements**:
1. Add route: `GET /entries/search?q=salary`
2. Create controller: `searchEntries(req, res)`
3. Use Sequelize `Op.iLike` for case-insensitive search
4. Return matching entries with pagination

**Hint**:
```javascript
where: {
  note: {
    [Op.iLike]: `%${searchTerm}%`
  }
}
```

---

*Continuing with authentication and security...*

# Chapter 13: Authentication and Security

## Authentication Flow

```
┌─────────────────────────────────────────────────┐
│ REGISTRATION                                    │
└─────────────────────────────────────────────────┘

User submits:
  • username
  • password
  • email
    ↓
Backend validates:
  • Username unique?
  • Password strong enough?
  • Email valid?
    ↓
Hash password with bcrypt
  password → $2b$10$N9qo8...
    ↓
Save to database
    ↓
Return success


┌─────────────────────────────────────────────────┐
│ LOGIN                                            │
└─────────────────────────────────────────────────┘

User submits:
  • username
  • password
    ↓
Find user in database
    ↓
Compare passwords with bcrypt
  bcrypt.compare(input, hashed)
    ↓
  Match? ──NO──> Return 401 Unauthorized
    │
   YES
    ↓
Generate JWT token
  {
    userId: 5,
    username: "john",
    exp: timestamp + 24h
  }
  signed with SECRET_KEY
    ↓
Return token to frontend
    ↓
Frontend stores in localStorage
    ↓
Frontend includes in all requests:
  Authorization: Bearer eyJhbGc...


┌─────────────────────────────────────────────────┐
│ PROTECTED ROUTE ACCESS                           │
└─────────────────────────────────────────────────┘

Request to /entries
  Headers: {
    Authorization: Bearer eyJhbGc...
  }
    ↓
authJwt middleware extracts token
    ↓
Verify token with SECRET_KEY
    ↓
  Valid? ──NO──> Return 401 Unauthorized
    │
   YES
    ↓
Extract userId from payload
    ↓
Add to request: req.userId = 5
    ↓
Continue to controller
    ↓
Controller uses req.userId for queries
```

## Auth Controller (controllers/authController.js)

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

// ═══════════════════════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════════════════════
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password required' 
      });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if username exists
    const existingUser = await User.findOne({ 
      where: { username } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username already taken' 
      });
    }
    
    // Check if email exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ 
        where: { email } 
      });
      
      if (existingEmail) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }
    }
    
    // Create user (password will be auto-hashed by model hook)
    const user = await User.create({
      username,
      password,
      email: email || null
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ 
      where: { username } 
    });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const passwordValid = await user.checkPassword(password);
    
    if (!passwordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION
      }
    );
    
    // Return token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// VERIFY TOKEN (for auto-login)
// ═══════════════════════════════════════════════════════════
exports.verifyToken = async (req, res) => {
  try {
    const userId = req.userId;  // From authJwt middleware
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// ═══════════════════════════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════════════════════════
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    
    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current and new passwords required' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters' 
      });
    }
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const passwordValid = await user.checkPassword(currentPassword);
    
    if (!passwordValid) {
      return res.status(401).json({ 
        message: 'Current password incorrect' 
      });
    }
    
    // Update password (will be auto-hashed)
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      message: 'Password changed successfully' 
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Password change failed' });
  }
};
```

## JWT Authentication Middleware (middleware/authJwt.js)

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No token provided' 
      });
    }
    
    // Format: "Bearer eyJhbGc..."
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid token format' 
      });
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'Token expired' 
          });
        }
        
        return res.status(401).json({ 
          message: 'Invalid token' 
        });
      }
      
      // Add user info to request
      req.userId = decoded.userId;
      req.username = decoded.username;
      
      // Continue to next middleware/controller
      next();
    });
    
  } catch (error) {
    console.error('JWT middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};
```

## Frontend: authFetch Helper

```javascript
// Helper function for authenticated requests
async function authFetch(url, options = {}) {
  // Get JWT token from localStorage
  const token = localStorage.getItem('jwtToken');
  
  // Get CSRF token
  const csrfToken = window.csrfToken;
  
  // Merge headers
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  // Make request
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'  // Include cookies
  });
  
  // Handle 401 (Unauthorized)
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    // Show login modal
    alert('Session expired. Please log in again.');
    openAuthModal('login');
    
    throw new Error('Unauthorized');
  }
  
  return response;
}
```

## Password Hashing with bcrypt

```javascript
const bcrypt = require('bcrypt');

// Hash password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Compare password
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

**How bcrypt works**:
```
plainPassword: "myPassword123"
    ↓
Salt generated: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl
    ↓
Hash with salt: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7xNrr5u.kVL8r8fBTn0b3VG
    ↓
Stored in database
```

**Why bcrypt?**
- ✅ Slow by design (prevents brute force)
- ✅ Automatically includes salt
- ✅ Industry standard
- ✅ Adaptive (can increase rounds over time)

## CSRF Protection

**What is CSRF?**
Cross-Site Request Forgery: attacker tricks user's browser into making unwanted requests.

**Example attack**:
```html
<!-- Evil website -->
<img src="https://yourbank.com/transfer?to=attacker&amount=1000">
```

If user is logged in, their cookies are sent automatically!

**Our protection**:

1. **Server generates token**:
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

2. **Frontend fetches token**:
```javascript
const response = await fetch('/csrf-token');
const data = await response.json();
window.csrfToken = data.csrfToken;
```

3. **Frontend includes in requests**:
```javascript
headers: {
  'X-CSRF-Token': window.csrfToken
}
```

4. **Server validates**:
```javascript
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});
```

## Rate Limiting

Prevent brute force attacks:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts
  message: 'Too many login attempts. Try again later.',
  skipSuccessfulRequests: true  // Don't count successful logins
});

app.post('/auth/login', loginLimiter, authController.login);
```

## Security Headers (Helmet)

```javascript
const helmet = require('helmet');

app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  
  // Other headers
  hsts: {
    maxAge: 31536000,  // 1 year
    includeSubDomains: true
  }
}));
```

**Headers added**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## Input Validation (Joi)

```javascript
const Joi = require('joi');

// Define schema
const entrySchema = Joi.object({
  amount: Joi.number().min(0.01).max(1000000000).required(),
  currency: Joi.string().valid('USD', 'LBP', 'EUR').required(),
  category: Joi.string().valid('income', 'expense').required(),
  typeId: Joi.number().integer().required(),
  date: Joi.date().max('now').required(),
  note: Joi.string().max(500).optional()
});

// Middleware
function validateEntry(req, res, next) {
  const { error } = entrySchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
}

// Usage
router.post('/entries', authJwt, validateEntry, entryController.create);
```

## Session Timeout (Frontend)

```javascript
let idleTimer;
const IDLE_TIMEOUT = 30 * 60 * 1000;  // 30 minutes

function resetIdleTimer() {
  clearTimeout(idleTimer);
  
  idleTimer = setTimeout(() => {
    // Log out user
    alert('Session expired due to inactivity');
    logout();
  }, IDLE_TIMEOUT);
}

// Reset on user activity
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// Start timer on login
onLoginSuccess(() => {
  resetIdleTimer();
});
```

## Security Best Practices

### ✅ DO:
- Use HTTPS in production
- Hash passwords with bcrypt (never store plain)
- Use JWT for stateless authentication
- Implement CSRF protection
- Add rate limiting
- Validate all input (frontend AND backend)
- Use security headers (Helmet)
- Set session timeouts
- Log security events
- Keep dependencies updated

### ❌ DON'T:
- Store passwords in plain text
- Trust user input
- Use predictable tokens
- Expose sensitive data in URLs
- Forget to sanitize database queries
- Use weak JWT secrets
- Store sensitive data in localStorage (JWT is okay)
- Send detailed error messages to client
- Forget to validate on backend

## Environment Variables for Security

`.env` file:
```bash
# STRONG JWT secret (use random string generator)
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c
JWT_EXPIRATION=24h

# Database credentials
DATABASE_PASSWORD=veryStrongPassword123!@#

# Email credentials
EMAIL_PASSWORD=app-specific-password

# Node environment
NODE_ENV=production
```

**Never commit `.env` to git!**

## Chapter Summary

You've learned:
- ✅ Complete authentication flow
- ✅ Password hashing with bcrypt
- ✅ JWT token generation and verification
- ✅ Protected routes with middleware
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Input validation (Joi)
- ✅ Session timeout
- ✅ Security best practices

## Exercise 13.1: Add Email Verification

Implement email verification on registration:

**Requirements**:
1. Generate verification token
2. Send email with verification link
3. Create `/auth/verify/:token` endpoint
4. Mark user as verified
5. Only allow verified users to log in

**Bonus**: Add "Resend verification email" functionality!

---

*Continuing with remaining chapters...*

# Chapter 14: Communication Between Frontend and Backend

## The Request-Response Cycle

Every interaction between frontend and backend follows this pattern:

```
FRONTEND                    BACKEND                   DATABASE
(Browser)                   (Node.js + Express)       (PostgreSQL)

   │                            │                         │
   │  1. User clicks "Add"      │                         │
   │                            │                         │
   │  2. JavaScript collects    │                         │
   │     form data              │                         │
   │                            │                         │
   │  3. Send HTTP POST         │                         │
   │─────────────────────────>  │                         │
   │  POST /entries             │                         │
   │  Body: {                   │                         │
   │    amount: 500,            │  4. Validate request    │
   │    currency: "USD"         │     Check JWT           │
   │  }                         │     Check CSRF          │
   │                            │                         │
   │                            │  5. Execute SQL query   │
   │                            │─────────────────────>   │
   │                            │  INSERT INTO entries... │
   │                            │                         │
   │                            │  6. Return new row      │
   │                            │ <───────────────────────│
   │                            │  {id: 234, amount: 500} │
   │                            │                         │
   │  7. Send response          │                         │
   │ <─────────────────────────│                         │
   │  Status: 201 Created       │                         │
   │  Body: {id: 234,...}       │                         │
   │                            │                         │
   │  8. Update UI              │                         │
   │     Add to list            │                         │
   │     Show success message   │                         │
   │                            │                         │
```

## HTTP Anatomy

### HTTP Request Structure

```
POST /entries HTTP/1.1                          ← Request line
Host: localhost:3000                            ← Headers
Authorization: Bearer eyJhbGc...
Content-Type: application/json
X-CSRF-Token: abc123...
Content-Length: 89

{                                               ← Body
  "amount": 500,
  "currency": "USD",
  "category": "income",
  "typeId": 15,
  "date": "2025-11-29"
}
```

### HTTP Response Structure

```
HTTP/1.1 201 Created                            ← Status line
Content-Type: application/json                  ← Headers
Date: Fri, 29 Nov 2025 10:30:00 GMT
Content-Length: 156

{                                               ← Body
  "id": 234,
  "amount": 500,
  "currency": "USD",
  "category": "income",
  "typeId": 15,
  "date": "2025-11-29",
  "createdAt": "2025-11-29T10:30:00.000Z"
}
```

## Fetch API (Frontend)

### Basic GET Request

```javascript
async function getEntries() {
  try {
    // Send request
    const response = await fetch('/entries');
    
    // Check if successful
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    // Parse JSON response
    const entries = await response.json();
    
    // Use data
    console.log('Received entries:', entries);
    return entries;
    
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    throw error;
  }
}
```

### POST Request with Body

```javascript
async function createEntry(entryData) {
  try {
    const response = await fetch('/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'X-CSRF-Token': window.csrfToken
      },
      body: JSON.stringify(entryData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const newEntry = await response.json();
    return newEntry;
    
  } catch (error) {
    console.error('Failed to create entry:', error);
    throw error;
  }
}

// Usage
const data = {
  amount: 500,
  currency: 'USD',
  category: 'income',
  typeId: 15,
  date: '2025-11-29',
  note: 'Monthly salary'
};

createEntry(data)
  .then(entry => {
    console.log('Created:', entry);
    refreshView();
  })
  .catch(error => {
    alert('Failed to add income');
  });
```

### PUT Request (Update)

```javascript
async function updateEntry(id, updates) {
  const response = await fetch(`/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(updates)
  });
  
  return await response.json();
}
```

### DELETE Request

```javascript
async function deleteEntry(id) {
  const response = await fetch(`/entries/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken
    }
  });
  
  if (response.status === 204) {
    // Success, no content returned
    return true;
  }
  
  throw new Error('Delete failed');
}
```

## Query Parameters

### Backend: Reading Query Params

```javascript
// Route: GET /entries?category=income&currency=USD&limit=50

router.get('/entries', authJwt, (req, res) => {
  const category = req.query.category;    // "income"
  const currency = req.query.currency;    // "USD"
  const limit = parseInt(req.query.limit); // 50
  
  // Use in database query
  const entries = await Entry.findAll({
    where: { category, currency },
    limit
  });
  
  res.json(entries);
});
```

### Frontend: Sending Query Params

```javascript
// Manual construction
const url = `/entries?category=income&currency=USD&limit=50`;
fetch(url);

// Using URLSearchParams (cleaner)
const params = new URLSearchParams({
  category: 'income',
  currency: 'USD',
  limit: 50
});

fetch(`/entries?${params.toString()}`);

// Helper function
function buildUrl(base, params) {
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

const url = buildUrl('/entries', { category: 'income', limit: 50 });
// Result: "/entries?category=income&limit=50"
```

## URL Parameters (Path Parameters)

### Backend: Reading URL Params

```javascript
// Route: GET /entries/:id

router.get('/entries/:id', authJwt, (req, res) => {
  const entryId = req.params.id;  // From URL path
  
  const entry = await Entry.findByPk(entryId);
  
  if (!entry) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  res.json(entry);
});
```

### Frontend: Using URL Params

```javascript
const entryId = 234;
const url = `/entries/${entryId}`;

fetch(url);  // GET /entries/234
```

## Request Body

### Backend: Reading Request Body

```javascript
// Middleware parses body automatically
app.use(express.json());

router.post('/entries', authJwt, (req, res) => {
  // req.body contains parsed JSON
  const { amount, currency, category, typeId, date, note } = req.body;
  
  // Validate
  if (!amount || !currency) {
    return res.status(400).json({ 
      message: 'Amount and currency required' 
    });
  }
  
  // Use data
  const entry = await Entry.create(req.body);
  res.status(201).json(entry);
});
```

### Frontend: Sending Request Body

```javascript
const data = {
  amount: 500,
  currency: 'USD',
  category: 'income',
  typeId: 15
};

fetch('/entries', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)  // Convert to JSON string
});
```

## Response Formats

### JSON (Most Common)

```javascript
// Backend
res.json({ id: 1, name: 'John' });

// Frontend
const data = await response.json();
```

### Plain Text

```javascript
// Backend
res.send('Hello World');

// Frontend
const text = await response.text();
```

### File Download

```javascript
// Backend
res.download('/path/to/file.pdf');

// Frontend
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.pdf';
a.click();
```

## Error Handling

### Backend: Sending Errors

```javascript
try {
  const entry = await Entry.findByPk(id);
  
  if (!entry) {
    // 404 Not Found
    return res.status(404).json({
      message: 'Entry not found',
      code: 'ENTRY_NOT_FOUND'
    });
  }
  
  res.json(entry);
  
} catch (error) {
  // 500 Internal Server Error
  console.error(error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

### Frontend: Handling Errors

```javascript
async function fetchEntry(id) {
  try {
    const response = await fetch(`/entries/${id}`);
    
    // Check status code
    if (!response.ok) {
      // Parse error message
      const error = await response.json();
      
      if (response.status === 404) {
        alert('Entry not found');
      } else if (response.status === 401) {
        alert('Please log in');
        showLoginModal();
      } else if (response.status === 403) {
        alert('Access denied');
      } else {
        alert(error.message || 'Something went wrong');
      }
      
      throw new Error(error.message);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Fetch error:', error);
    
    // Network error (no internet, server down)
    if (error.name === 'TypeError') {
      alert('Network error. Please check your connection.');
    }
    
    throw error;
  }
}
```

## CORS (Cross-Origin Resource Sharing)

If frontend and backend on different domains:

```javascript
// Backend: Enable CORS
const cors = require('cors');

app.use(cors({
  origin: 'https://frontend-domain.com',  // Allow this domain
  credentials: true                        // Allow cookies
}));

// Frontend: Include credentials
fetch('https://backend-domain.com/api/entries', {
  credentials: 'include'  // Send cookies
});
```

## Loading States

### Prevent Duplicate Requests

```javascript
let isLoading = false;

async function fetchData() {
  if (isLoading) return;  // Already loading
  
  isLoading = true;
  showSpinner();
  
  try {
    const data = await fetch('/entries').then(r => r.json());
    renderData(data);
  } catch (error) {
    showError(error);
  } finally {
    isLoading = false;
    hideSpinner();
  }
}
```

### Loading Indicators

```javascript
function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('content').style.opacity = '0.5';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
  document.getElementById('content').style.opacity = '1';
}
```

## Debouncing and Throttling

### Debounce (Wait for user to stop typing)

```javascript
let timeout;

function debounce(func, delay) {
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage: Search as user types
const searchInput = document.getElementById('search');

const debouncedSearch = debounce(async (query) => {
  const results = await fetch(`/entries/search?q=${query}`);
  displayResults(results);
}, 300);  // Wait 300ms after user stops typing

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Throttle (Limit frequency)

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll event
const handleScroll = throttle(() => {
  console.log('Scrolled');
}, 1000);  // Max once per second

window.addEventListener('scroll', handleScroll);
```

## Caching Responses

```javascript
const cache = {};

async function fetchWithCache(url, options = {}) {
  // Check cache first
  if (cache[url] && !options.noCache) {
    console.log('Using cached data');
    return cache[url];
  }
  
  // Fetch from server
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Save to cache
  cache[url] = data;
  
  return data;
}

// Clear cache when data changes
function invalidateCache(url) {
  delete cache[url];
}

// Usage
const entries = await fetchWithCache('/entries');  // Fetch from server
const entries2 = await fetchWithCache('/entries'); // Use cache

// After creating new entry
await createEntry(data);
invalidateCache('/entries');  // Force refresh next time
```

## Polling (Auto-refresh)

```javascript
let pollInterval;

function startPolling(url, callback, interval = 5000) {
  // Initial fetch
  fetch(url).then(r => r.json()).then(callback);
  
  // Poll every interval
  pollInterval = setInterval(() => {
    fetch(url).then(r => r.json()).then(callback);
  }, interval);
}

function stopPolling() {
  clearInterval(pollInterval);
}

// Usage: Auto-refresh balances every 10 seconds
startPolling('/balances', (balances) => {
  updateBalanceDisplay(balances);
}, 10000);

// Stop when user leaves page
window.addEventListener('beforeunload', stopPolling);
```

## WebSockets (Real-time)

For real-time updates (beyond this app's scope, but good to know):

```javascript
// Backend
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      client.send(message);
    });
  });
});

// Frontend
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};

ws.send(JSON.stringify({ type: 'newEntry', data: {...} }));
```

## Chapter Summary

You've learned:
- ✅ Request-response cycle
- ✅ HTTP request and response structure
- ✅ Fetch API for all HTTP methods
- ✅ Query parameters vs URL parameters vs body
- ✅ Error handling strategies
- ✅ CORS for cross-origin requests
- ✅ Loading states and indicators
- ✅ Debouncing and throttling
- ✅ Response caching
- ✅ Polling for auto-refresh

## Exercise 14.1: Add Optimistic Updates

Implement optimistic UI updates (update UI before server response):

**Requirements**:
1. When user adds entry, immediately add to UI
2. Send request to server
3. If successful, keep the entry
4. If failed, remove from UI and show error

**Hint**:
```javascript
// 1. Add to UI immediately
addToUI(tempEntry);

// 2. Send to server
try {
  const saved = await createEntry(tempEntry);
  // 3. Replace temp with real data
  replaceInUI(tempEntry.tempId, saved);
} catch (error) {
  // 4. Remove on error
  removeFromUI(tempEntry.tempId);
  alert('Failed to save');
}
```

---

*Continuing with multi-currency chapter...*

# Chapter 15: Multi-Currency Support

## Why Multi-Currency?

Our app supports multiple currencies because users may:
- Earn income in USD but spend in LBP
- Have bank accounts in different currencies
- Travel and spend in EUR
- Want accurate financial tracking without mixing currencies

## The Core Rule: Never Mix Currencies

❌ **WRONG**: Adding USD + LBP
```javascript
totalIncome = 500 USD + 750,000 LBP = 750,500 ??? 
// This is meaningless!
```

✅ **CORRECT**: Separate by currency
```javascript
totalIncome = {
  USD: 500,
  LBP: 750,000
}
```

## Database Design for Multi-Currency

### Every financial table has a `currency` column:

```sql
-- entries table
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  -- other columns...
);

-- balances table
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  -- other columns...
);

-- transfers table (same currency only!)
CREATE TABLE transfers (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(15,2) NOT NULL,
  from_balance_id INTEGER REFERENCES balances(id),
  to_balance_id INTEGER REFERENCES balances(id),
  -- Currency implied by source balance
);
```

### Supported Currencies Table

```sql
CREATE TABLE currencies (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10),
  decimal_places INTEGER DEFAULT 2
);

INSERT INTO currencies VALUES
  ('USD', 'US Dollar', '$', 2),
  ('LBP', 'Lebanese Pound', 'ل.ل', 0),
  ('EUR', 'Euro', '€', 2),
  ('GBP', 'British Pound', '£', 2);
```

### User's Selected Currencies

```sql
CREATE TABLE user_currencies (
  user_id INTEGER REFERENCES users(id),
  currency_code VARCHAR(10) REFERENCES currencies(code),
  PRIMARY KEY (user_id, currency_code)
);

-- User 5 uses USD and LBP
INSERT INTO user_currencies VALUES (5, 'USD'), (5, 'LBP');
```

## Frontend: Currency Storage

### localStorage Structure

```javascript
// User's selected currencies (array)
localStorage.setItem('selectedCurrencies', JSON.stringify(['USD', 'LBP', 'EUR']));

// Currently active currency for data entry
localStorage.setItem('currency', 'USD');

// Example functions
function getSelectedCurrencies() {
  return JSON.parse(localStorage.getItem('selectedCurrencies') || '["USD"]');
}

function setSelectedCurrencies(currencies) {
  localStorage.setItem('selectedCurrencies', JSON.stringify(currencies));
}

function getCurrency() {
  return localStorage.getItem('currency') || 'USD';
}

function setCurrency(currency) {
  localStorage.setItem('currency', currency);
}
```

## Grouping Data by Currency

### Group Income by Currency

```javascript
function groupByCurrency(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    const currency = entry.currency || 'USD';
    
    if (!grouped[currency]) {
      grouped[currency] = [];
    }
    
    grouped[currency].push(entry);
  });
  
  return grouped;
}

// Result:
// {
//   USD: [entry1, entry2, entry3],
//   LBP: [entry4, entry5]
// }
```

### Calculate Totals by Currency

```javascript
function calculateTotalsByCurrency(entries) {
  const totals = {};
  
  entries.forEach(entry => {
    const currency = entry.currency || 'USD';
    
    if (!totals[currency]) {
      totals[currency] = {
        total: 0,
        count: 0
      };
    }
    
    totals[currency].total += parseFloat(entry.amount);
    totals[currency].count++;
  });
  
  return totals;
}

// Result:
// {
//   USD: { total: 5000, count: 10 },
//   LBP: { total: 7500000, count: 25 }
// }
```

## Rendering Currency-Separated Data

### Cards View with Currency Separation

```javascript
function renderIncomeCards(entries) {
  const grouped = groupByCurrency(entries);
  let html = '';
  
  // Render each currency group
  Object.keys(grouped).forEach(currency => {
    const currencyEntries = grouped[currency];
    const total = currencyEntries.reduce((sum, e) => sum + e.amount, 0);
    
    html += `
      <div class="currency-card">
        <div class="currency-header">
          <span class="currency-name">${currency}</span>
          <span class="currency-total">
            ${formatCurrency(total, currency)}
          </span>
        </div>
        
        <div class="currency-body">
    `;
    
    // Render entries
    currencyEntries.forEach(entry => {
      html += `
        <div class="entry-card">
          <span>${entry.Type.name}</span>
          <span>${formatCurrency(entry.amount, currency)}</span>
          <span>${new Date(entry.date).toLocaleDateString()}</span>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  return html;
}
```

### Dashboard with Currency Breakdown

```javascript
function renderIncomeDashboard(entries) {
  const byCurrency = calculateTotalsByCurrency(entries);
  
  let html = '<div class="dashboard">';
  
  // Overall stats per currency
  html += '<div class="currency-summary">';
  Object.entries(byCurrency).forEach(([currency, data]) => {
    html += `
      <div class="currency-stat-card">
        <div class="currency-name">${currency}</div>
        <div class="currency-total">${formatCurrency(data.total, currency)}</div>
        <div class="currency-count">${data.count} entries</div>
        <div class="currency-average">
          Avg: ${formatCurrency(data.total / data.count, currency)}
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  html += '</div>';
  return html;
}
```

## Currency Formatting

```javascript
function formatCurrency(amount, currency) {
  // Get currency info
  const currencyInfo = {
    'USD': { symbol: '$', decimals: 2, position: 'before' },
    'LBP': { symbol: 'ل.ل', decimals: 0, position: 'after' },
    'EUR': { symbol: '€', decimals: 2, position: 'before' },
    'GBP': { symbol: '£', decimals: 2, position: 'before' }
  };
  
  const info = currencyInfo[currency] || { symbol: currency, decimals: 2, position: 'after' };
  
  // Format number
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals
  });
  
  // Add symbol
  if (info.position === 'before') {
    return `${info.symbol}${formatted}`;
  } else {
    return `${formatted} ${info.symbol}`;
  }
}

// Examples:
formatCurrency(1234.56, 'USD');  // "$1,234.56"
formatCurrency(1234567, 'LBP');  // "1,234,567 ل.ل"
formatCurrency(1234.56, 'EUR');  // "€1,234.56"
```

## Currency Selector UI

### Floating Action Button (FAB)

```javascript
function renderCurrencyFab() {
  const currencies = getSelectedCurrencies();
  const current = getCurrency();
  
  let html = `
    <div class="currency-fab" id="currencyFab">
      <button class="fab-button" onclick="toggleCurrencyMenu()">
        ${current}
        <i class="bi bi-chevron-down"></i>
      </button>
      
      <div class="currency-menu" id="currencyMenu" style="display:none;">
  `;
  
  currencies.forEach(currency => {
    const active = currency === current ? 'active' : '';
    html += `
      <button class="currency-menu-item ${active}" 
              onclick="setCurrency('${currency}')">
        <span>${currency}</span>
        ${currency === current ? '<i class="bi bi-check"></i>' : ''}
      </button>
    `;
  });
  
  html += `
      <hr>
      <button class="currency-menu-item" onclick="openCurrencyManager()">
        <i class="bi bi-gear"></i>
        Manage Currencies
      </button>
      </div>
    </div>
  `;
  
  document.getElementById('currencyFabContainer').innerHTML = html;
}

function toggleCurrencyMenu() {
  const menu = document.getElementById('currencyMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setCurrency(currency) {
  localStorage.setItem('currency', currency);
  renderCurrencyFab();
  toggleCurrencyMenu();
  
  // Update form dropdowns
  updateCurrencyDropdowns();
  
  // Optional: Refresh current view to show only this currency
  // refreshCurrentView();
}
```

### CSS for Currency FAB

```css
.currency-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.fab-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: all 0.3s;
}

.fab-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

.currency-menu {
  position: absolute;
  bottom: 60px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  min-width: 150px;
  overflow: hidden;
}

.currency-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.currency-menu-item:hover {
  background: #f3f4f6;
}

.currency-menu-item.active {
  background: #ede9fe;
  color: #7c3aed;
  font-weight: bold;
}
```

## Currency Picker Modal

```javascript
function openCurrencyManager() {
  const allCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
  ];
  
  const selected = getSelectedCurrencies();
  
  let html = `
    <div class="currency-picker-modal">
      <h2>Manage Currencies</h2>
      <p>Select the currencies you use:</p>
      
      <div class="currency-list">
  `;
  
  allCurrencies.forEach(curr => {
    const checked = selected.includes(curr.code) ? 'checked' : '';
    html += `
      <label class="currency-checkbox">
        <input type="checkbox" 
               value="${curr.code}" 
               ${checked}
               onchange="toggleCurrencySelection('${curr.code}')">
        <span class="currency-info">
          <span class="currency-code">${curr.code}</span>
          <span class="currency-name">${curr.name}</span>
          <span class="currency-symbol">${curr.symbol}</span>
        </span>
      </label>
    `;
  });
  
  html += `
      </div>
      
      <div class="modal-actions">
        <button onclick="saveCurrencySelection()">Save</button>
        <button onclick="closeCurrencyManager()">Cancel</button>
      </div>
    </div>
  `;
  
  document.getElementById('currencyPickerModal').innerHTML = html;
  document.getElementById('currencyPickerModal').style.display = 'flex';
}

function toggleCurrencySelection(code) {
  let selected = getSelectedCurrencies();
  
  if (selected.includes(code)) {
    selected = selected.filter(c => c !== code);
  } else {
    selected.push(code);
  }
  
  // Temporary save
  window.tempSelectedCurrencies = selected;
}

async function saveCurrencySelection() {
  const selected = window.tempSelectedCurrencies || getSelectedCurrencies();
  
  if (selected.length === 0) {
    alert('Please select at least one currency');
    return;
  }
  
  // Save locally
  setSelectedCurrencies(selected);
  
  // Save to backend
  try {
    await authFetch('/user/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currencies: selected })
    });
    
    // Refresh UI
    renderCurrencyFab();
    closeCurrencyManager();
    
  } catch (error) {
    console.error('Failed to save currencies:', error);
    alert('Failed to save currency preferences');
  }
}
```

## Backend: Currency Endpoints

```javascript
// GET user's currencies
router.get('/user/currencies', authJwt, async (req, res) => {
  try {
    const userId = req.userId;
    
    const userCurrencies = await UserCurrency.findAll({
      where: { userId },
      include: [{
        model: Currency,
        as: 'Currency'
      }]
    });
    
    res.json({
      currencies: userCurrencies.map(uc => ({
        code: uc.currencyCode,
        name: uc.Currency.name,
        symbol: uc.Currency.symbol
      }))
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch currencies' });
  }
});

// POST update user's currencies
router.post('/user/currencies', authJwt, async (req, res) => {
  try {
    const userId = req.userId;
    const { currencies } = req.body;  // Array of currency codes
    
    // Delete existing
    await UserCurrency.destroy({ where: { userId } });
    
    // Insert new
    const records = currencies.map(code => ({
      userId,
      currencyCode: code
    }));
    
    await UserCurrency.bulkCreate(records);
    
    res.json({ message: 'Currencies updated' });
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to update currencies' });
  }
});
```

## Reports with Multi-Currency

```javascript
async function getMonthlyReport(year, month) {
  const response = await authFetch(`/report/monthly?year=${year}&month=${month}`);
  const data = await response.json();
  
  // data.income = [ {currency: 'USD', total: 5000}, {currency: 'LBP', total: 7500000} ]
  // data.expenses = [ {currency: 'USD', total: 3000}, {currency: 'LBP', total: 5000000} ]
  
  let html = '<div class="monthly-report">';
  
  // Income section
  html += '<h3>Income</h3>';
  data.income.forEach(curr => {
    html += `
      <div class="report-row">
        <span>${curr.currency}</span>
        <span>${formatCurrency(curr.total, curr.currency)}</span>
      </div>
    `;
  });
  
  // Expense section
  html += '<h3>Expenses</h3>';
  data.expenses.forEach(curr => {
    html += `
      <div class="report-row">
        <span>${curr.currency}</span>
        <span>${formatCurrency(curr.total, curr.currency)}</span>
      </div>
    `;
  });
  
  // Net (per currency)
  html += '<h3>Net</h3>';
  data.income.forEach(incCurr => {
    const expCurr = data.expenses.find(e => e.currency === incCurr.currency);
    const net = incCurr.total - (expCurr?.total || 0);
    
    html += `
      <div class="report-row ${net >= 0 ? 'positive' : 'negative'}">
        <span>${incCurr.currency}</span>
        <span>${formatCurrency(net, incCurr.currency)}</span>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}
```

## Transfer Validation (Same Currency Only)

```javascript
async function handleTransferSubmit(e) {
  e.preventDefault();
  
  const fromBalanceId = parseInt(document.getElementById('transferFrom').value);
  const toBalanceId = parseInt(document.getElementById('transferTo').value);
  const amount = parseFloat(document.getElementById('transferAmount').value);
  
  // Get balances
  const fromBalance = balancesData.find(b => b.id === fromBalanceId);
  const toBalance = balancesData.find(b => b.id === toBalanceId);
  
  // Check currency match
  if (fromBalance.currency !== toBalance.currency) {
    alert(`Cannot transfer between different currencies (${fromBalance.currency} → ${toBalance.currency})`);
    return;
  }
  
  // Proceed with transfer
  const data = {
    fromBalanceId,
    toBalanceId,
    amount,
    date: document.getElementById('transferDate').value
  };
  
  try {
    await authFetch('/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    alert('Transfer successful');
    e.target.reset();
    await fetchTransfers({ reset: true });
    await showBalances();
    
  } catch (error) {
    alert('Transfer failed');
  }
}
```

## Chapter Summary

You've learned:
- ✅ Why never to mix currencies
- ✅ Database design for multi-currency
- ✅ Grouping and calculating by currency
- ✅ Currency formatting with symbols
- ✅ Currency selector UI (FAB)
- ✅ Currency management modal
- ✅ Backend currency endpoints
- ✅ Reports with currency breakdown
- ✅ Transfer validation (same currency only)

## Exercise 15.1: Add Currency Conversion

Add optional currency conversion feature:

**Requirements**:
1. Add exchange rates table to database
2. Fetch rates from API (e.g., exchangerate-api.com)
3. Add "View in Single Currency" toggle
4. Show converted amounts with disclaimer
5. Never save converted amounts (display only!)

**Example**:
```
Income:
  USD: $5,000
  LBP: 7,500,000 ل.ل (≈ $5,000 USD at 1,500:1)
  
  Total (converted to USD): ≈ $10,000
  
  ⚠️ Conversion for display only. Actual amounts stored separately.
```

---

*Continuing with Docker and deployment...*

# PART VI - DEPLOYMENT AND BEYOND

# Chapter 16: Docker and Containerization

## What is Docker?

**Docker** packages your application and all its dependencies into a **container** that runs the same everywhere.

### Without Docker:
```
Development Machine          Production Server
├─ Node.js v20              ├─ Node.js v18 ❌ (different version!)
├─ PostgreSQL 16            ├─ PostgreSQL 14 ❌
├─ npm packages             ├─ Missing packages ❌
└─ Works fine ✅            └─ Doesn't work ❌
```

### With Docker:
```
Development Machine          Production Server
└─ Docker Container         └─ Same Docker Container
   ├─ Node.js v20 ✅           ├─ Node.js v20 ✅
   ├─ PostgreSQL 16 ✅         ├─ PostgreSQL 16 ✅
   ├─ npm packages ✅          ├─ npm packages ✅
   └─ Works! ✅                └─ Works! ✅
```

## Docker Concepts

### Container
A running instance of your app with all dependencies.
- Isolated from host system
- Lightweight (shares OS kernel)
- Starts in seconds

### Image
A blueprint for containers.
- Read-only template
- Contains OS, code, dependencies
- Built from Dockerfile

### Dockerfile
Instructions to build an image.

### Docker Compose
Tool to run multi-container apps (e.g., web app + database).

## Our Docker Setup

```
personal_finance/
├─ docker-compose.yml       ← Defines services
├─ Dockerfile               ← Builds Node.js image
└─ devcontainer/
   ├─ devcontainer.json    ← VS Code integration
   └─ Dockerfile            ← Dev environment
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16
    container_name: finance_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: personal_finance
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - finance_network
    restart: unless-stopped

  # Node.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: finance_app
    environment:
      NODE_ENV: production
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_NAME: personal_finance
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - finance_network
    restart: unless-stopped
    volumes:
      - ./:/app
      - /app/node_modules

  # pgAdmin (Database Management UI)
  pgadmin:
    image: dpage/pgadmin4
    container_name: finance_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - finance_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  finance_network:
    driver: bridge
```

**Explanation**:
- **3 services**: Database, App, pgAdmin
- **Volumes**: Persist database data
- **Networks**: Allow services to communicate
- **Ports**: Map container ports to host

## Dockerfile

```dockerfile
# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "app.js"]
```

**Build stages**:
1. Start with Node.js 20 Alpine (lightweight)
2. Set /app as working directory
3. Copy package.json and package-lock.json
4. Install dependencies (npm ci for production)
5. Copy all code
6. Expose port 3000
7. Run `node app.js` on start

## Docker Commands

### Start Services
```bash
docker-compose up
```

### Start in Background (Detached)
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app

# Follow logs (live)
docker-compose logs -f app
```

### Rebuild Images
```bash
docker-compose build

# Build and start
docker-compose up --build
```

### Execute Commands in Container
```bash
# Open bash shell in app container
docker-compose exec app sh

# Run npm command
docker-compose exec app npm install

# Run database migration
docker-compose exec app npx sequelize-cli db:migrate
```

### View Running Containers
```bash
docker ps
```

### Stop and Remove Everything
```bash
docker-compose down -v  # -v removes volumes too
```

## Development Container (.devcontainer)

VS Code can run your entire dev environment in Docker!

**devcontainer.json**:
```json
{
  "name": "Personal Finance Dev",
  "dockerComposeFile": ["../docker-compose.yml"],
  "service": "app",
  "workspaceFolder": "/app",
  
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker",
        "cweijan.vscode-postgresql-client2"
      ],
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      }
    }
  },
  
  "forwardPorts": [3000, 5432, 5050],
  
  "postCreateCommand": "npm install",
  
  "remoteUser": "node"
}
```

**Benefits**:
- ✅ Same environment for all developers
- ✅ No "works on my machine" issues
- ✅ Fresh start anytime (just rebuild)
- ✅ Isolated from host system

## Environment Variables in Docker

**.env file** (never commit!):
```bash
JWT_SECRET=super-secret-key-change-this
DATABASE_PASSWORD=strong-password
EMAIL_PASSWORD=smtp-password
NODE_ENV=production
```

**docker-compose.yml**:
```yaml
services:
  app:
    environment:
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
```

Docker Compose automatically loads `.env` file!

## Database Persistence

### Without Volume:
```
1. Start container → Database created
2. Add data → Data stored
3. Stop container → Container deleted
4. Start again → Empty database! ❌
```

### With Volume:
```
1. Start container → Database created in volume
2. Add data → Data stored in volume
3. Stop container → Volume remains
4. Start again → Data still there! ✅
```

**In docker-compose.yml**:
```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:  # Named volume
```

## Networking

Containers in the same network can communicate:

```yaml
networks:
  finance_network:
    driver: bridge

services:
  app:
    networks:
      - finance_network
  db:
    networks:
      - finance_network
```

**App can connect to database**:
```javascript
const sequelize = new Sequelize({
  host: 'db',  // Service name in docker-compose.yml
  port: 5432,
  database: 'personal_finance'
});
```

## Production Deployment

### 1. Build Optimized Image

**Production Dockerfile**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app .

USER node
EXPOSE 3000

CMD ["node", "app.js"]
```

### 2. Use Environment-Specific Compose Files

**docker-compose.prod.yml**:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Run**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Security Checklist

- ✅ Use non-root user
- ✅ Scan images for vulnerabilities
- ✅ Use secrets for sensitive data
- ✅ Enable HTTPS (reverse proxy)
- ✅ Limit container resources
- ✅ Update base images regularly

### 4. Monitoring and Logs

```bash
# View logs
docker-compose logs -f app

# Check container health
docker ps

# View resource usage
docker stats
```

### 5. Backup Database

```bash
# Backup
docker-compose exec db pg_dump -U postgres personal_finance > backup.sql

# Restore
docker-compose exec -T db psql -U postgres personal_finance < backup.sql
```

## Docker vs Traditional Hosting

### Traditional Hosting:
```
1. Rent server
2. Install OS
3. Install Node.js
4. Install PostgreSQL
5. Clone code
6. Install dependencies
7. Configure environment
8. Start services
9. Setup monitoring
10. Pray it works 🙏
```

### With Docker:
```
1. Rent server
2. Install Docker
3. Copy docker-compose.yml
4. Run: docker-compose up -d
5. Done! ✅
```

## Troubleshooting Docker Issues

### Container Won't Start
```bash
# Check logs
docker-compose logs app

# Common issues:
# - Port already in use → Change port in docker-compose.yml
# - Environment variable missing → Check .env file
# - Database not ready → Add depends_on and healthcheck
```

### Database Connection Error
```bash
# Check if database is running
docker-compose ps

# Check network
docker network ls
docker network inspect finance_network

# Verify environment variables
docker-compose exec app env | grep DATABASE
```

### Slow Build Times
```dockerfile
# Use .dockerignore to exclude unnecessary files
node_modules/
.git/
*.log
.env
```

### Clean Up Docker
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

## Chapter Summary

You've learned:
- ✅ What Docker is and why use it
- ✅ Containers, images, Dockerfile
- ✅ Docker Compose for multi-container apps
- ✅ Our app's Docker setup
- ✅ Essential Docker commands
- ✅ Development containers in VS Code
- ✅ Volume persistence
- ✅ Container networking
- ✅ Production deployment
- ✅ Security best practices
- ✅ Troubleshooting common issues

## Exercise 16.1: Add Redis Cache

Add Redis caching service to docker-compose.yml:

**Requirements**:
1. Add Redis service
2. Connect from app
3. Cache frequently accessed data (e.g., types)
4. Set expiration times

**Starter**:
```yaml
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - finance_network
```

---

# Chapter 17: How to Modify and Extend the App

## Adding a New Feature: Step-by-Step

Let's add a **Budget** feature that tracks spending limits per category.

### Step 1: Plan the Feature

**Requirements**:
- User sets monthly budget for each expense type
- App shows progress: spent / budget
- Alert when budget exceeded
- View budget history

**Database Design**:
```sql
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type_id INTEGER REFERENCES types(id),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, type_id, month, year)
);
```

### Step 2: Create Migration

```bash
npx sequelize-cli migration:generate --name create-budgets
```

**migrations/XXXXXX-create-budgets.js**:
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('budgets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'types', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('budgets', ['userId', 'typeId', 'month', 'year'], {
      unique: true,
      name: 'budgets_unique_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('budgets');
  }
};
```

**Run migration**:
```bash
npx sequelize-cli db:migrate
```

### Step 3: Create Model

**models/Budget.js**:
```javascript
module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define('Budget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'budgets',
    timestamps: true
  });

  Budget.associate = (models) => {
    Budget.belongsTo(models.User, { foreignKey: 'userId' });
    Budget.belongsTo(models.Type, { foreignKey: 'typeId' });
  };

  return Budget;
};
```

**Register in models/index.js**:
```javascript
db.Budget = require('./Budget')(sequelize, Sequelize);
```

### Step 4: Create Controller

**controllers/budgetController.js**:
```javascript
const { Budget, Type, Entry, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    const where = { userId };
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const budgets = await Budget.findAll({
      where,
      include: [{
        model: Type,
        attributes: ['id', 'name']
      }],
      order: [['month', 'DESC'], ['year', 'DESC']]
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = `${budget.year}-${String(budget.month).padStart(2, '0')}-01`;
        const endDate = new Date(budget.year, budget.month, 0).toISOString().split('T')[0];

        const spent = await Entry.sum('amount', {
          where: {
            userId,
            typeId: budget.typeId,
            category: 'expense',
            currency: budget.currency,
            date: { [Op.between]: [startDate, endDate] }
          }
        }) || 0;

        return {
          ...budget.toJSON(),
          spent,
          remaining: budget.amount - spent,
          percentage: (spent / budget.amount) * 100
        };
      })
    );

    res.json(budgetsWithSpent);

  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { typeId, amount, currency, month, year } = req.body;

    const budget = await Budget.create({
      userId,
      typeId,
      amount,
      currency,
      month,
      year
    });

    res.status(201).json(budget);

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Budget already exists for this type and month' 
      });
    }
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Failed to create budget' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const budgetId = req.params.id;
    const { amount } = req.body;

    const budget = await Budget.findOne({
      where: { id: budgetId, userId }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.amount = amount;
    await budget.save();

    res.json(budget);

  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const budgetId = req.params.id;

    const budget = await Budget.findOne({
      where: { id: budgetId, userId }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.destroy();
    res.status(204).send();

  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
};
```

### Step 5: Create Routes

**routes/budgets.js**:
```javascript
const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const budgetController = require('../controllers/budgetController');

router.get('/', authJwt, budgetController.getAllBudgets);
router.post('/', authJwt, budgetController.createBudget);
router.put('/:id', authJwt, budgetController.updateBudget);
router.delete('/:id', authJwt, budgetController.deleteBudget);

module.exports = router;
```

**Add to app.js**:
```javascript
const budgetRoutes = require('./routes/budgets');
app.use('/budgets', budgetRoutes);
```

### Step 6: Add Frontend Section

**In index.html**:
```html
<!-- Add to sidebar -->
<a onclick="showSection('budgets')">
  <i class="bi bi-calculator"></i> Budgets
</a>

<!-- Add section -->
<section id="budgets" style="display:none;">
  <div class="budget-header">
    <h2>Monthly Budgets</h2>
    <div class="month-selector">
      <select id="budgetMonth">
        <option value="1">January</option>
        <!-- ... more months -->
      </select>
      <select id="budgetYear">
        <!-- Populated dynamically -->
      </select>
    </div>
  </div>

  <form id="budgetForm">
    <select id="budgetType" required>
      <!-- Types populated from /types?category=expense -->
    </select>
    <input type="number" id="budgetAmount" step="0.01" required>
    <select id="budgetCurrency" required>
      <option value="USD">USD</option>
      <option value="LBP">LBP</option>
    </select>
    <button type="submit">Set Budget</button>
  </form>

  <div id="budgetList"></div>
</section>

<script>
// Fetch budgets
async function fetchBudgets() {
  const month = document.getElementById('budgetMonth').value;
  const year = document.getElementById('budgetYear').value;

  const response = await authFetch(`/budgets?month=${month}&year=${year}`);
  const budgets = await response.json();

  renderBudgets(budgets);
}

// Render budgets
function renderBudgets(budgets) {
  let html = '<div class="budget-cards">';

  budgets.forEach(budget => {
    const percentage = Math.min(budget.percentage, 100);
    const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';

    html += `
      <div class="budget-card ${status}">
        <div class="budget-card-header">
          <span class="budget-type">${budget.Type.name}</span>
          <span class="budget-currency">${budget.currency}</span>
        </div>
        
        <div class="budget-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-text">
            ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
          </div>
        </div>

        <div class="budget-remaining">
          ${budget.remaining >= 0 ? 'Remaining' : 'Over budget'}:
          <strong>${Math.abs(budget.remaining).toFixed(2)}</strong>
        </div>

        <button onclick="deleteBudget(${budget.id})">Delete</button>
      </div>
    `;
  });

  html += '</div>';
  document.getElementById('budgetList').innerHTML = html;
}

// Create budget
document.getElementById('budgetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    typeId: parseInt(document.getElementById('budgetType').value),
    amount: parseFloat(document.getElementById('budgetAmount').value),
    currency: document.getElementById('budgetCurrency').value,
    month: parseInt(document.getElementById('budgetMonth').value),
    year: parseInt(document.getElementById('budgetYear').value)
  };

  try {
    await authFetch('/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    alert('Budget set!');
    e.target.reset();
    fetchBudgets();

  } catch (error) {
    alert('Failed to set budget');
  }
});

// Delete budget
async function deleteBudget(id) {
  if (!confirm('Delete this budget?')) return;

  try {
    await authFetch(`/budgets/${id}`, { method: 'DELETE' });
    fetchBudgets();
  } catch (error) {
    alert('Failed to delete budget');
  }
}
</script>
```

### Step 7: Add Styling

```css
.budget-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.budget-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.budget-card.good {
  border-left: 4px solid #10b981;
}

.budget-card.warning {
  border-left: 4px solid #f59e0b;
}

.budget-card.over {
  border-left: 4px solid #ef4444;
}

.progress-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s;
}

.budget-card.warning .progress-fill {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.budget-card.over .progress-fill {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
```

### Step 8: Test Feature

1. ✅ Create budget
2. ✅ View budgets for current month
3. ✅ Add expenses and see progress update
4. ✅ Exceed budget and see warning
5. ✅ Update budget amount
6. ✅ Delete budget

---

*Continuing with debugging chapter...*

# Chapter 18: Common Mistakes and Debugging

## Debugging Mindset

**Don't panic!** Every bug is solvable with systematic debugging.

### The Debug Process:
```
1. Reproduce the bug
2. Understand expected vs actual behavior
3. Form hypothesis about cause
4. Test hypothesis
5. Fix if hypothesis correct
6. Repeat if wrong
```

## Browser DevTools

### Console (F12)

**Log everything during development**:
```javascript
// Basic logging
console.log('User logged in:', user);

// Warnings
console.warn('This feature is deprecated');

// Errors
console.error('Failed to fetch data:', error);

// Objects (formatted)
console.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]);

// Groups
console.group('User Actions');
console.log('Login successful');
console.log('Dashboard loaded');
console.groupEnd();

// Timing
console.time('fetchData');
await fetchData();
console.timeEnd('fetchData');  // fetchData: 523ms
```

### Network Tab

**Debug API requests**:
```
1. Open DevTools → Network tab
2. Perform action (e.g., add income)
3. Find request in list
4. Click to see details:
   - Headers (Authorization, CSRF token)
   - Request payload (data sent)
   - Response (data received)
   - Status code (200, 401, 500, etc.)
```

**Common issues**:
- 401 Unauthorized → Check JWT token
- 403 Forbidden → Check CSRF token
- 404 Not Found → Check URL
- 500 Internal Error → Check server logs

### Application Tab

**Inspect storage**:
- localStorage → Check JWT, user, currencies
- Cookies → Check CSRF token
- Session Storage

### Elements Tab

**Inspect HTML/CSS**:
- Right-click element → Inspect
- Edit HTML live
- Toggle CSS properties
- View computed styles
- Check box model

## Common Frontend Bugs

### 1. "Cannot read property of undefined"

```javascript
// ❌ Error
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.username);  // Error if user is null!

// ✅ Fix
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log(user.username || 'Guest');

// ✅ Better with optional chaining
console.log(user?.username ?? 'Guest');
```

### 2. "Unexpected token in JSON"

```javascript
// ❌ Error
const data = JSON.parse(undefined);  // Error!

// ✅ Fix
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  console.error('Invalid JSON:', error);
  // Use default value
}
```

### 3. Form Not Submitting

```javascript
// ❌ Missing preventDefault
form.addEventListener('submit', async (e) => {
  // Page reloads before async completes!
  const data = await fetch('/api');
});

// ✅ Fix
form.addEventListener('submit', async (e) => {
  e.preventDefault();  // Prevent page reload
  const data = await fetch('/api');
});
```

### 4. Infinite Loop

```javascript
// ❌ Infinite requests
async function fetchData() {
  const response = await fetch('/entries');
  const data = await response.json();
  renderData(data);
  fetchData();  // Calls itself forever!
}

// ✅ Fix with condition
let hasMore = true;
async function fetchData() {
  if (!hasMore) return;
  const response = await fetch('/entries');
  const data = await response.json();
  if (data.length === 0) hasMore = false;
  renderData(data);
}
```

### 5. Stale Closure

```javascript
// ❌ Bug
let count = 0;
button.addEventListener('click', () => {
  setTimeout(() => {
    console.log(count);  // Always logs old value!
  }, 1000);
  count++;
});

// ✅ Fix
button.addEventListener('click', () => {
  const currentCount = count;
  setTimeout(() => {
    console.log(currentCount);
  }, 1000);
  count++;
});
```

## Common Backend Bugs

### 1. Missing JWT Middleware

```javascript
// ❌ Anyone can access!
router.get('/entries', entryController.getAll);

// ✅ Protected
router.get('/entries', authJwt, entryController.getAll);
```

### 2. Not Checking User Ownership

```javascript
// ❌ User A can delete User B's entry!
exports.deleteEntry = async (req, res) => {
  const entry = await Entry.findByPk(req.params.id);
  await entry.destroy();
};

// ✅ Verify ownership
exports.deleteEntry = async (req, res) => {
  const entry = await Entry.findOne({
    where: { id: req.params.id, userId: req.userId }
  });
  
  if (!entry) {
    return res.status(404).json({ message: 'Entry not found' });
  }
  
  await entry.destroy();
};
```

### 3. SQL Injection (if using raw queries)

```javascript
// ❌ DANGEROUS!
const query = `SELECT * FROM users WHERE username = '${username}'`;
// If username = "admin'; DROP TABLE users; --"
// Query becomes: SELECT * FROM users WHERE username = 'admin'; DROP TABLE users; --'

// ✅ Use Sequelize (parameterized queries)
const user = await User.findOne({ where: { username } });

// ✅ Or use parameterized raw query
sequelize.query(
  'SELECT * FROM users WHERE username = ?',
  { replacements: [username] }
);
```

### 4. Unhandled Promise Rejection

```javascript
// ❌ Silent failure
async function getData() {
  const data = await fetch('/api');  // Might throw
  return data.json();
}

// ✅ Handle errors
async function getData() {
  try {
    const response = await fetch('/api');
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}
```

### 5. Memory Leak

```javascript
// ❌ Leaked event listeners
function setupView() {
  const button = document.getElementById('btn');
  button.addEventListener('click', handleClick);
  // Called multiple times = multiple listeners!
}

// ✅ Remove old listeners
function setupView() {
  const button = document.getElementById('btn');
  button.removeEventListener('click', handleClick);
  button.addEventListener('click', handleClick);
}
```

## Database Debugging

### Check Connection

```javascript
// Test database connection
db.sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));
```

### Enable SQL Logging

```javascript
const sequelize = new Sequelize({
  // ...
  logging: console.log  // See all SQL queries
});
```

### Check Constraints

```sql
-- View all constraints
SELECT * FROM information_schema.table_constraints
WHERE table_name = 'entries';

-- View foreign keys
SELECT * FROM information_schema.key_column_usage
WHERE table_name = 'entries';
```

### Query Performance

```javascript
// Measure query time
console.time('query');
const entries = await Entry.findAll({ where: { userId: 5 } });
console.timeEnd('query');  // query: 234ms

// Explain query (PostgreSQL)
const result = await sequelize.query(
  'EXPLAIN ANALYZE SELECT * FROM entries WHERE user_id = 5'
);
console.log(result);
```

## Error Tracking

### Structured Logging

```javascript
// Simple logger
const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    // Could send to logging service
  },
  warn: (message, data) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  }
};

// Usage
logger.info('User logged in', { userId: 5, username: 'john' });
logger.error('Database query failed', error);
```

### Error Boundaries (Production)

```javascript
// Catch all unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
  reportError({
    message: event.error.message,
    stack: event.error.stack,
    url: window.location.href,
    timestamp: new Date()
  });
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  reportError({
    message: 'Unhandled Promise Rejection',
    reason: event.reason,
    url: window.location.href
  });
});
```

## Testing Tips

### Manual Testing Checklist

- [ ] Test with empty data (new user)
- [ ] Test with large amounts of data (1000+ entries)
- [ ] Test all CRUD operations
- [ ] Test with different currencies
- [ ] Test month close functionality
- [ ] Test on mobile screen
- [ ] Test with slow internet (throttle in DevTools)
- [ ] Test logout and re-login
- [ ] Test with expired JWT
- [ ] Test browser back/forward buttons

### Unit Test Example (Optional)

```javascript
const assert = require('assert');

function formatCurrency(amount, currency) {
  return `${currency} ${amount.toFixed(2)}`;
}

// Test
assert.strictEqual(formatCurrency(100, 'USD'), 'USD 100.00');
assert.strictEqual(formatCurrency(50.5, 'EUR'), 'EUR 50.50');

console.log('✅ All tests passed');
```

## Production Issues

### 1. "Works in Dev, Not in Production"

**Check**:
- Environment variables (`.env` copied?)
- Database migrations (run `db:migrate`?)
- Node version (same as dev?)
- File permissions
- Firewall rules

### 2. Slow Performance

**Common causes**:
- Missing database indexes
- N+1 query problem
- Not using pagination
- Large images not optimized
- No caching

**Solutions**:
```javascript
// Add index
await queryInterface.addIndex('entries', ['userId', 'date']);

// Fix N+1 (use include)
const entries = await Entry.findAll({
  include: [{ model: Type }]  // One query instead of N
});

// Add pagination
const entries = await Entry.findAll({
  limit: 50,
  offset: page * 50
});
```

### 3. Memory Leaks

**Signs**:
- Server slows down over time
- Eventually crashes
- High memory usage

**Common causes**:
- Event listeners not removed
- Global variables accumulating data
- Database connections not closed

**Debug**:
```bash
# Check memory
docker stats

# Profile with Node.js
node --inspect app.js
# Open chrome://inspect in Chrome
```

## Debugging Tools

### Frontend
- Chrome DevTools
- React DevTools (if using React)
- Redux DevTools (if using Redux)
- Postman (for API testing)

### Backend
- `console.log` (simple but effective)
- VS Code debugger (set breakpoints)
- `node --inspect` (Chrome debugging)
- Morgan (HTTP request logger)
- Winston (advanced logging)

### Database
- pgAdmin (visual interface)
- psql (command line)
- `EXPLAIN ANALYZE` (query analysis)

## Chapter Summary

You've learned:
- ✅ Systematic debugging process
- ✅ Browser DevTools mastery
- ✅ Common frontend bugs and fixes
- ✅ Common backend bugs and fixes
- ✅ Database debugging techniques
- ✅ Error tracking and logging
- ✅ Testing checklist
- ✅ Production troubleshooting
- ✅ Performance optimization
- ✅ Essential debugging tools

## Exercise 18.1: Debug Challenge

Find and fix bugs in this code:

```javascript
async function addEntry() {
  const amount = document.getElementById('amount').value;
  const data = { amount, category: 'income' };
  
  const response = fetch('/entries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  const entry = response.json();
  entries.push(entry);
  renderEntries();
}
```

**Bugs**:
1. Missing `await` before `fetch`
2. Missing `await` before `response.json()`
3. Missing headers (`Content-Type`, `Authorization`)
4. No error handling
5. Should use `authFetch` instead

**Fixed version**:
```javascript
async function addEntry() {
  try {
    const amount = document.getElementById('amount').value;
    const data = { amount, category: 'income' };
    
    const response = await authFetch('/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add entry');
    }
    
    const entry = await response.json();
    entries.push(entry);
    renderEntries();
    
  } catch (error) {
    console.error('Error adding entry:', error);
    alert('Failed to add entry');
  }
}
```

---

# APPENDICES

# Appendix A: Complete Folder Structure

```
personal_finance/
│
├── app.js                          ← Main server file (Express app)
├── package.json                    ← Dependencies and scripts
├── package-lock.json               ← Locked dependency versions
├── .env                            ← Environment variables (gitignored)
├── .gitignore                      ← Files to exclude from git
├── docker-compose.yml              ← Docker services definition
├── Dockerfile                      ← Docker image for app
├── README.md                       ← Project documentation
│
├── config/
│   └── config.json                ← Database configuration
│
├── models/                         ← Sequelize models
│   ├── index.js                   ← Model initialization
│   ├── User.js                    ← User model
│   ├── Entry.js                   ← Income/Expense entries
│   ├── Balance.js                 ← Account balances
│   ├── Type.js                    ← Category types
│   ├── Transfer.js                ← Money transfers
│   ├── Savings.js                 ← Savings records
│   ├── Currency.js                ← Available currencies
│   ├── UserCurrency.js            ← User's selected currencies
│   ├── ClosedMonth.js             ← Month close records
│   └── MonthCloseAudit.js         ← Audit trail
│
├── controllers/                    ← Business logic
│   ├── authController.js          ← Registration, login, JWT
│   ├── entryController.js         ← Income/Expense CRUD
│   ├── balanceController.js       ← Balance operations
│   ├── typeController.js          ← Type management
│   ├── transferController.js      ← Transfer operations
│   ├── savingsController.js       ← Savings operations
│   ├── reportController.js        ← Report generation
│   └── menuController.js          ← Menu functions (month close)
│
├── routes/                         ← API endpoints
│   ├── auth.js                    ← /auth/* endpoints
│   ├── entries.js                 ← /entries/* endpoints
│   ├── balances.js                ← /balances/* endpoints
│   ├── types.js                   ← /types/* endpoints
│   ├── transfers.js               ← /transfers/* endpoints
│   ├── savings.js                 ← /savings/* endpoints
│   ├── report.js                  ← /report/* endpoints
│   └── user.js                    ← /user/* endpoints
│
├── middleware/                     ← Express middleware
│   ├── authJwt.js                 ← JWT authentication
│   ├── validateJoi.js             ← Input validation with Joi
│   └── errorHandler.js            ← Global error handler
│
├── migrations/                     ← Database migrations
│   ├── 01-create-closedmonths.js
│   ├── 02-create-currencies.js
│   ├── 03-create-enums.js
│   ├── 04-create-users.js
│   ├── 05-create-types.js
│   ├── 06-create-entries.js
│   ├── 09-create-balances.js
│   ├── 10-create-savings.js
│   ├── 11-create-usercurrencies.js
│   ├── 12-create-monthcloseaudits.js
│   ├── 13-add-initial-amount.js
│   └── ... more migrations
│
├── seeders/                        ← Sample data for testing
│   ├── 01-user-fadee.js
│   ├── 02-types-fadee.js
│   ├── 03-balances-july.js
│   └── ... more seeders
│
├── validation/                     ← Joi validation schemas
│   └── schemas.js
│
├── Public/                         ← Frontend files (served statically)
│   │
│   ├── index.html                 ← Main SPA file
│   │
│   ├── css/
│   │   └── styles.css             ← All styling
│   │
│   ├── js/
│   │   └── menu.js                ← Menu-related functions
│   │
│   └── img/
│       └── currency_bills/        ← Currency images
│
└── devcontainer/                   ← VS Code Dev Container
    ├── devcontainer.json          ← Container configuration
    ├── Dockerfile                 ← Dev environment image
    └── README.md                  ← Dev container documentation
```

---

# Appendix B: Glossary

## A

**API (Application Programming Interface)**
A set of endpoints that allow programs to communicate. Our backend provides a REST API.

**Authentication**
Verifying who a user is (login with username/password).

**Authorization**
Verifying what a user can access (checking permissions).

**async/await**
JavaScript syntax for handling asynchronous operations cleanly.

## B

**Backend**
Server-side code that handles business logic, database, and API requests.

**bcrypt**
Library for hashing passwords securely.

**Body (HTTP)**
Data sent with POST/PUT requests (payload).

## C

**Container (Docker)**
Isolated environment running an application with all dependencies.

**Controller**
Function that handles a specific API endpoint's logic.

**CORS (Cross-Origin Resource Sharing)**
Security feature allowing/blocking requests from different domains.

**CRUD**
Create, Read, Update, Delete - basic database operations.

**CSRF (Cross-Site Request Forgery)**
Attack where malicious site tricks user's browser into making unwanted requests.

**CSS (Cascading Style Sheets)**
Language for styling HTML elements.

## D

**Database**
System for storing and retrieving data (we use PostgreSQL).

**Debouncing**
Delaying function execution until user stops performing action.

**Docker**
Platform for packaging applications in containers.

**DOM (Document Object Model)**
JavaScript representation of HTML document.

## E

**Endpoint**
Specific URL for API operation (e.g., `GET /entries`).

**Environment Variables**
Configuration stored outside code (passwords, API keys).

**Express.js**
Web framework for Node.js.

## F

**Fetch API**
JavaScript API for making HTTP requests.

**Foreign Key**
Database column referencing primary key in another table.

**Frontend**
Client-side code running in browser (HTML, CSS, JavaScript).

## H

**Helmet**
Express middleware adding security headers.

**HTML (HyperText Markup Language)**
Language for structuring web pages.

**HTTP (HyperText Transfer Protocol)**
Protocol for communication between browser and server.

## J

**JavaScript**
Programming language for web interactivity.

**Joi**
Library for data validation.

**JSON (JavaScript Object Notation)**
Format for exchanging data between frontend and backend.

**JWT (JSON Web Token)**
Secure token for user authentication.

## M

**Middleware**
Function that runs between receiving request and sending response.

**Migration**
Script that modifies database schema (add/remove tables/columns).

**Model**
JavaScript class representing database table (Sequelize).

**MVC (Model-View-Controller)**
Architectural pattern separating data, logic, and presentation.

## N

**Node.js**
JavaScript runtime for server-side code.

**npm (Node Package Manager)**
Tool for installing JavaScript libraries.

## O

**ORM (Object-Relational Mapping)**
Library that lets you interact with database using objects (Sequelize).

## P

**Pagination**
Loading data in chunks instead of all at once.

**PostgreSQL**
Powerful open-source relational database.

**Promise**
JavaScript object representing eventual completion of async operation.

## R

**Rate Limiting**
Restricting number of requests from a user (prevent abuse).

**REST (Representational State Transfer)**
Architectural style for designing APIs.

**Route**
Mapping of URL to controller function.

## S

**Sequelize**
ORM for Node.js supporting PostgreSQL, MySQL, etc.

**SPA (Single Page Application)**
Web app that updates content without reloading page.

**SQL (Structured Query Language)**
Language for querying databases.

## T

**Token**
String used for authentication (JWT).

**Transaction**
Group of database operations that must all succeed or all fail.

## V

**Validation**
Checking if data meets requirements before processing.

**Volume (Docker)**
Persistent storage for container data.

---

# Appendix C: Resources and Further Learning

## Official Documentation

### Frontend
- **MDN Web Docs**: https://developer.mozilla.org/
  - HTML, CSS, JavaScript reference
  - Best practices and tutorials
- **Can I Use**: https://caniuse.com/
  - Browser compatibility checker

### Backend
- **Node.js**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **Sequelize**: https://sequelize.org/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/

### Tools
- **Docker**: https://docs.docker.com/
- **Git**: https://git-scm.com/doc
- **VS Code**: https://code.visualstudio.com/docs

## Learning Platforms

### Free
- **freeCodeCamp**: https://www.freecodecamp.org/
  - Full web development curriculum
- **The Odin Project**: https://www.theodinproject.com/
  - Comprehensive full-stack path
- **MDN Learn**: https://developer.mozilla.org/en-US/docs/Learn
  - Beginner-friendly guides

### Paid
- **Udemy**: Various web development courses
- **Pluralsight**: Technology skills platform
- **Frontend Masters**: Advanced frontend courses

## Books

### Beginner
- "HTML and CSS: Design and Build Websites" by Jon Duckett
- "JavaScript and JQuery: Interactive Front-End" by Jon Duckett
- "Eloquent JavaScript" by Marijn Haverbeke (free online)

### Intermediate
- "You Don't Know JS" series by Kyle Simpson
- "Node.js Design Patterns" by Mario Casciaro
- "Learning SQL" by Alan Beaulieu

### Advanced
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "Clean Code" by Robert C. Martin
- "Refactoring" by Martin Fowler

## Video Channels

- **Traversy Media**: Web development tutorials
- **The Net Ninja**: JavaScript, Node.js, databases
- **Fireship**: Quick tech explanations
- **Academind**: In-depth courses
- **Web Dev Simplified**: Clear, concise tutorials

## Communities

- **Stack Overflow**: https://stackoverflow.com/
  - Q&A for programming problems
- **Reddit**: r/webdev, r/node, r/javascript
- **Dev.to**: https://dev.to/
  - Developer articles and discussions
- **Discord**: Various web dev servers

## Practice

- **CodePen**: https://codepen.io/
  - Frontend playground
- **LeetCode**: https://leetcode.com/
  - Algorithm practice
- **HackerRank**: https://www.hackerrank.com/
  - Coding challenges

## Tools & Libraries to Explore

### Frontend
- **React**: Modern UI library
- **Vue.js**: Progressive framework
- **Tailwind CSS**: Utility-first CSS
- **Chart.js**: Data visualization

### Backend
- **TypeScript**: Type-safe JavaScript
- **Nest.js**: Enterprise Node.js framework
- **Prisma**: Modern ORM
- **Redis**: In-memory cache

### DevOps
- **Kubernetes**: Container orchestration
- **GitHub Actions**: CI/CD
- **AWS/Azure/GCP**: Cloud platforms

## Next Steps

### Beginner → Intermediate
1. ✅ Complete this app
2. Add more features (budgets, goals, reports)
3. Build a second project from scratch
4. Learn a frontend framework (React or Vue)
5. Deploy to production (Heroku, Railway, AWS)

### Intermediate → Advanced
1. Add tests (Jest, Mocha)
2. Implement caching (Redis)
3. Add real-time features (WebSockets)
4. Microservices architecture
5. Learn CI/CD pipelines
6. Study system design

## Staying Current

- Follow tech blogs (Medium, Dev.to)
- Subscribe to newsletters (JavaScript Weekly, Node Weekly)
- Attend meetups and conferences
- Contribute to open source
- Build side projects
- Read documentation regularly

---

# Conclusion

## What You've Accomplished

Congratulations! You've learned:

✅ **Frontend**: HTML, CSS, JavaScript, SPA architecture  
✅ **Backend**: Node.js, Express, REST APIs, controllers  
✅ **Database**: PostgreSQL, Sequelize ORM, migrations  
✅ **Security**: Authentication, JWT, CSRF, validation  
✅ **DevOps**: Docker, containers, deployment  
✅ **Best Practices**: Code organization, error handling, debugging

## Your Journey Continues

This app is your foundation. Build upon it:
- Add features you need
- Refactor as you learn better patterns
- Experiment with new technologies
- Share your knowledge with others

## Final Words

**You're not just learning to code - you're learning to solve problems.**

Every bug you fix, every feature you add, every error you debug makes you a better developer.

Keep building. Keep learning. Keep growing.

---

**Thank you for reading this guide!**

**Happy coding! 🚀**

---

*End of Book*
