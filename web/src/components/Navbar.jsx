import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-teal">
            TrekBuddy
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-teal transition">Home</Link>
            <Link to="/beaches" className="text-gray-700 hover:text-teal transition">Beaches</Link>
            <Link to="/parks" className="text-gray-700 hover:text-teal transition">Parks</Link>
            <Link to="/temples" className="text-gray-700 hover:text-teal transition">Temples</Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-teal transition">Restaurants</Link>
            <Link to="/ai-chat" className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal/90 transition">
              AI Chat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-teal">Home</Link>
            <Link to="/beaches" className="block py-2 text-gray-700 hover:text-teal">Beaches</Link>
            <Link to="/parks" className="block py-2 text-gray-700 hover:text-teal">Parks</Link>
            <Link to="/temples" className="block py-2 text-gray-700 hover:text-teal">Temples</Link>
            <Link to="/restaurants" className="block py-2 text-gray-700 hover:text-teal">Restaurants</Link>
            <Link to="/ai-chat" className="block py-2 bg-teal text-white rounded-lg text-center">AI Chat</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

