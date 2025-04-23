import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'user' | 'provider') => {
    if (role === 'user') {
      navigate('/auth/signIn');
    } else {
      navigate('/provider/signIn');
    }
  };

  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="font-italiana text-3xl mb-4">MySpace</h3>
            <p className="text-gray-400 max-w-xs">
              Your trusted platform for finding the perfect accommodations that feel like home.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRoleSelection('user')} className="hover:text-white transition-colors">Find Accommodation</button></li>
                <li><button className="hover:text-white transition-colors">How It Works</button></li>
                <li><button className="hover:text-white transition-colors">FAQs</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRoleSelection('provider')} className="hover:text-white transition-colors">List Property</button></li>
                <li><button className="hover:text-white transition-colors">Owner Dashboard</button></li>
                <li><button className="hover:text-white transition-colors">Resources</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} MySpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
