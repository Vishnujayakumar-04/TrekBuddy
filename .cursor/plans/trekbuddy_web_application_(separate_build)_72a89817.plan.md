---
name: TrekBuddy Web Application (Separate Build)
overview: Build a completely independent, modern web application for TrekBuddy in `/web/` folder using React + Vite + TailwindCSS + Firebase + Three.js. The mobile app remains completely untouched.
todos:
  - id: setup-vite
    content: Create Vite React project in /web folder and install all dependencies (firebase, react-router-dom, three.js, framer-motion, tailwindcss)
    status: completed
  - id: configure-tailwind
    content: Configure TailwindCSS with config file and add base styles to index.css
    status: completed
    dependencies:
      - setup-vite
  - id: copy-data
    content: Copy all JSON data files from mobile/src/data to web/src/data
    status: completed
    dependencies:
      - setup-vite
  - id: setup-firebase
    content: Create firebase.js with same config as mobile, export auth and db instances
    status: completed
    dependencies:
      - setup-vite
  - id: create-components
    content: "Create global UI components: Navbar, Footer, Card, ResponsiveLayout"
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-3d-components
    content: "Create 3D components: ThreeScene, ModelViewer, HeroSection with React Three Fiber"
    status: completed
    dependencies:
      - setup-vite
  - id: setup-routing
    content: Configure React Router in App.jsx with all routes (Home, Beaches, Category, Place Details, AI Chat, etc.)
    status: completed
    dependencies:
      - create-components
  - id: create-pages
    content: "Create all page components: Home, Beaches, Parks, Temples, Restaurants, Nature, Photoshoot, Pubs, Transport, Emergency, AIChat, CategoryPage, PlaceDetails"
    status: completed
    dependencies:
      - setup-routing
      - copy-data
  - id: data-binding
    content: Create dataLoader utility and bind JSON data to pages, implement search and filtering
    status: completed
    dependencies:
      - create-pages
      - copy-data
  - id: add-animations
    content: "Add framer-motion animations to pages: fade-in, scroll reveal, hover effects, page transitions with AnimatePresence"
    status: completed
    dependencies:
      - create-pages
  - id: mobile-animations
    content: "Add React Native animations: WelcomeScreen logo animation, StackNavigator custom transitions, ScreenTransition component for all screens"
    status: completed
  - id: web-page-transitions
    content: Create PageTransition component with framer-motion, wrap all routes with AnimatePresence in App.jsx, add special Welcome→Home animation
    status: completed
    dependencies:
      - setup-routing
      - add-animations
  - id: responsive-design
    content: Ensure all pages are fully responsive with mobile-first approach using Tailwind classes
    status: completed
    dependencies:
      - create-pages
  - id: test-build
    content: Run npm run build and verify dist folder is created successfully, test all routes work
    status: completed
    dependencies:
      - create-pages
      - data-binding
      - add-animations
---

