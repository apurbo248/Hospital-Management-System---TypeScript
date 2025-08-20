import React, { useState } from "react";
import { Menu, X, User, CalendarDays, Stethoscope, Home, Pill, Phone } from "lucide-react";
import RegisterForm from "./Register";
import LoginForm from "./Login";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const leftLinks: NavLink[] = [
  { label: "Discover Heaven", href: "/"  },
  { label: "Health Library", href: "/health_library",  },
];

const rightLinks: NavLink[] = [
  { label: "Medical Services", href: "/medical_services",  },
  { label: "Contact Us", href: "/contact_us", icon: <Phone size={18} /> },
];

const Navbar = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28 items-center">
          

          {/* Desktop Menu */}
           {/* Left Nav */}
          <div className="hidden md:flex  items-center">
            {leftLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
               className="px-4 py-2 flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>

          {/* The Heaven - Big Icon Center */}
          <a
            href="/"
            className="text-2xl font-extrabold text tracking-wide hover:scale-110 transition-transform"
          >w
            🌟 The Heaven 🌟
          </a>

          {/* Right Nav */}
          <div className="hidden md:flex  items-center">
            {rightLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          {/* <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-1"
            >
              <User size={18} /> Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
     {isOpen && (
        <div className="md:hidden bg-white shadow-md animate-slide-down">
          <div className="space-y-2 px-4 py-3">
            {leftLinks.concat(rightLinks).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {link.icon} {link.label}
              </a>
            ))}
            {/* The Heaven center in mobile too */}
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xl font-bold text-blue-600 py-2"
            >
              🌟 The Heaven 🌟
            </a>
            <button
              onClick={() => { setShowLogin(true); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 border border-blue-600 text-blue-600 rounded-lg"
            >
              Login
            </button>
            <button
              onClick={() => { setShowRegister(true); setIsOpen(false); }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <RegisterForm onClose={() => setShowRegister(false)}
           onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
           />
      
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <LoginForm onClose={() => setShowLogin(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
