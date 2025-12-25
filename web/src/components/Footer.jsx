import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TrekBuddy</h3>
            <p className="text-gray-400">Your smart travel companion for Pondicherry</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/beaches" className="hover:text-white">Beaches</Link></li>
              <li><Link to="/parks" className="hover:text-white">Parks</Link></li>
              <li><Link to="/temples" className="hover:text-white">Temples</Link></li>
              <li><Link to="/restaurants" className="hover:text-white">Restaurants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/nature" className="hover:text-white">Nature</Link></li>
              <li><Link to="/photoshoot" className="hover:text-white">Photoshoot</Link></li>
              <li><Link to="/transport" className="hover:text-white">Transport</Link></li>
              <li><Link to="/emergency" className="hover:text-white">Emergency</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/ai-chat" className="hover:text-white">AI Chat</Link></li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TrekBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

