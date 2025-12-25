import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ResponsiveLayout from './components/ResponsiveLayout';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Beaches from './pages/Beaches';
import Parks from './pages/Parks';
import Temples from './pages/Temples';
import Restaurants from './pages/Restaurants';
import Nature from './pages/Nature';
import Photoshoot from './pages/Photoshoot';
import Pubs from './pages/Pubs';
import Transport from './pages/Transport';
import Emergency from './pages/Emergency';
import AIChat from './pages/AIChat';
import CategoryPage from './pages/CategoryPage';
import PlaceDetails from './pages/PlaceDetails';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/beaches" element={<PageTransition><Beaches /></PageTransition>} />
        <Route path="/parks" element={<PageTransition><Parks /></PageTransition>} />
        <Route path="/temples" element={<PageTransition><Temples /></PageTransition>} />
        <Route path="/restaurants" element={<PageTransition><Restaurants /></PageTransition>} />
        <Route path="/nature" element={<PageTransition><Nature /></PageTransition>} />
        <Route path="/photoshoot" element={<PageTransition><Photoshoot /></PageTransition>} />
        <Route path="/pubs" element={<PageTransition><Pubs /></PageTransition>} />
        <Route path="/transport" element={<PageTransition><Transport /></PageTransition>} />
        <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />
        <Route path="/ai-chat" element={<PageTransition><AIChat /></PageTransition>} />
        <Route path="/category/:name" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/place/:id" element={<PageTransition><PlaceDetails /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <ResponsiveLayout>
              <AppRoutes />
            </ResponsiveLayout>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
