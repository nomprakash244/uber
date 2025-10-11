import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Star, Settings, Info, HelpCircle, LogOut } from 'lucide-react';

const UserSettings = () => {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([{ id: 1, name: 'Home', address: '123 Main St' }]);
  const [newFav, setNewFav] = useState({ name: '', address: '' });

  const addFav = () => {
    if (!newFav.name || !newFav.address) return;
    setFavs([...favs, { id: Date.now(), ...newFav }]);
    setNewFav({ name: '', address: '' });
  };

  const removeFav = id => {
    setFavs(favs.filter(f => f.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col max-w-sm mx-auto border rounded-lg shadow-md" style={{ height: '667px', width: '375px' }}>
      {/* Header */}
      <header className="bg-white shadow-sm flex items-center px-4 py-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          ←
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">Settings</h1>
        <button onClick={() => navigate('/help')} className="text-gray-600 flex items-center">
          <HelpCircle size={18} className="mr-1" /> Help
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Profile Link */}
        <div
          onClick={() => navigate('/profile')}
          className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-100"
        >
          <div className="flex items-center space-x-3">
            <User className="text-gray-600" size={20} />
            <span className="font-medium text-gray-900">Profile</span>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        {/* Favourites */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="text-yellow-500" size={20} />
            <h2 className="font-medium text-gray-800">Favourites</h2>
          </div>
          {favs.map(f => (
            <div key={f.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-900">{f.name}</p>
                <p className="text-sm text-gray-500">{f.address}</p>
              </div>
              <button onClick={() => removeFav(f.id)} className="text-red-600 text-lg font-bold">
                ×
              </button>
            </div>
          ))}
          <div className="flex space-x-2 mt-3">
            <input
              placeholder="Name"
              value={newFav.name}
              onChange={e => setNewFav({ ...newFav, name: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg flex-1 text-sm"
            />
            <input
              placeholder="Address"
              value={newFav.address}
              onChange={e => setNewFav({ ...newFav, address: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg flex-1 text-sm"
            />
            <button onClick={addFav} className="bg-green-600 text-white px-3 rounded-lg text-sm">
              +
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="text-blue-500" size={20} />
            <div>
              <h2 className="font-medium text-gray-800">Preferences</h2>
              <p className="text-gray-500 text-sm">Manage preferences (demo)</p>
            </div>
          </div>
        </div>

        {/* App Shortcuts */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Star className="text-purple-500" size={20} />
            <div>
              <h2 className="font-medium text-gray-800">App Shortcuts</h2>
              <p className="text-gray-500 text-sm">Create shortcuts (demo)</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Info className="text-gray-500" size={20} />
            <div>
              <h2 className="font-medium text-gray-800">About</h2>
              <p className="text-gray-500 text-sm">Version 8.80.0 (demo)</p>
            </div>
          </div>
        </div>

        {/* Beta */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Info className="text-indigo-500" size={20} />
            <div>
              <h2 className="font-medium text-gray-800">Subscribe to Beta</h2>
              <p className="text-gray-500 text-sm">Early access (demo)</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom section (Fixed but not floating) */}
      <footer className="bg-white p-4 border-t shadow-sm">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium text-sm"
        >
          Logout
        </button>
      </footer>
    </div>
  );
};

export default UserSettings;
