# TrekBuddy Web Application

A modern, responsive web application for TrekBuddy built with React + Vite + TailwindCSS + Firebase + Three.js.

## Features

- 🎨 Modern UI with TailwindCSS
- 🎭 Smooth page transitions with Framer Motion
- 🎯 3D animations with React Three Fiber
- 🔥 Firebase Authentication & Firestore
- 📱 Fully responsive design
- ⚡ Fast build with Vite

## Project Structure

```
web/
├── src/
│   ├── pages/          # All page components
│   ├── components/     # Reusable UI components
│   ├── data/           # JSON data files (copied from mobile)
│   ├── models/         # 3D model files (.glb)
│   ├── firebase.js     # Firebase configuration
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
├── public/             # Static assets
└── dist/              # Build output
```

## Getting Started

### Install Dependencies
```bash
cd web
npm install
```

### Development
```bash
npm run dev
```
Runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Output: `web/dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Pages

- `/` - Home (with 3D hero section)
- `/beaches` - Beaches listing
- `/parks` - Parks listing
- `/temples` - Temples listing
- `/restaurants` - Restaurants listing
- `/nature` - Nature spots
- `/photoshoot` - Photoshoot locations
- `/pubs` - Pubs & bars
- `/transport` - Transport information
- `/emergency` - Emergency contacts
- `/ai-chat` - AI Chatbot
- `/category/:name` - Dynamic category page
- `/place/:id` - Place details page

## Animations

- **Page Transitions**: Fade + slide (0.4s duration)
- **Card Hover**: Scale + shadow effect
- **Stagger Animations**: Category pages with staggered children
- **3D Models**: Auto-rotate with hover interactions

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
# Select dist folder
firebase deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
- Drag `dist/` folder to Netlify dashboard
- Or connect GitHub repository

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Three Fiber** - 3D graphics
- **Firebase** - Backend & Auth
- **React Router DOM** - Routing

## Notes

- This is a separate web application
- Mobile app remains completely untouched
- Uses same Firebase config as mobile
- Data files copied from mobile/src/data
