# Raskala

This is a marketplace website that adopts a new approachs of selling, buying and admin supervision, it is a Software project.

---

## How to run the project

Check those:
node -v
npm -v
git --version


If you dont have one of them install from official websites ...

1. **Clone the Project**
2. Inside the project run this:

npm install


It installs automatically: React / Tailwind CSS / Vite / All required libraries.

3. Run the Project:

npm run dev


4. Install icons:

npm install react-icons


---

## 1. What Each File Does

### Core Files

- `main.jsx` → Entry point, renders React app into HTML  
- `App.jsx` → Main React component (your app starts here)  
- `index.html` → HTML template that loads your React app  
- `vite.config.js` → Vite configuration (build settings)  

### Styling

- `index.css` → Global styles + Tailwind imports  
- `App.css` → Styles specific to App component (optional)  

### Config Files

- `package.json` → Dependencies and scripts  
- `package-lock.json` → Locked dependency versions  
- `eslint.config.js` → Code quality rules  

### Folders

- `src/` → Your code lives here  
- `public/` → Static files (images, icons)  
- `node_modules/` → Installed packages (don't touch)  
- `assets/` → Images, fonts used in components  

### Other

- `.gitignore` → Files Git should ignore  
- `README.md` → Project documentation  

---

## 2. Entry Point

`index.html` → `main.jsx` → `App.jsx`

- Browser loads `index.html`  
- `index.html` loads `main.jsx`  
- `main.jsx` renders `App.jsx` into the page  

---

## 3. What You Should Modify

### Files you'll work with

- `App.jsx` → Your main app logic  
- `index.css` → Global styles (already has Tailwind)  
- `src/components/` → Create components here (you'll make this folder)  
- `src/pages/` → Create pages here (you'll make this folder)  
- `src/services/api.js` → API calls to PHP backend (you'll create this)  

### Don't modify

- `node_modules/`  
- `package-lock.json`  
- `.gitignore`  
- `main.jsx`  
- `vite.config.js`  

---


**Project Structure:**

- **Raskala/**
  - **frontend/** - React + Vite + Tailwind
    - **public/**
      - `logo.svg`
    - **src/**
      - **components/** - Reusable components
        - `Header.jsx`
        - `Footer.jsx`
        - `Button.jsx`
      - **pages/** - Page components
        - `Home.jsx`
        - `About.jsx`
        - `Contact.jsx`
      - **services/** - API calls (AJAX)
        - `api.js`
      - `App.jsx` - Main app component
      - `main.jsx` - Entry point
      - `index.css` - Tailwind imports
    - `index.html`
    - `package.json`
    - `vite.config.js`
  - **backend/** - PHP Backend
    - **api/** - API endpoints
      - `users.php`
      - `posts.php`
      - `auth.php`
    - **config/** - Configuration
      - `database.php`
    - **includes/** - Reusable PHP code
      - `db.php`
      - `functions.php`
    - `index.php` - Optional: main entry point
  - `README.md`
