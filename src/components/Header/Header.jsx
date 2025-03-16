import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <header
      className={`header py-4 md:py-5 bg-gradient-to-b from-white to-[#f8f9fa] backdrop-blur-sm bg-opacity-90 transition-all duration-300 sticky top-0 left-0 right-0 z-[999] ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="container-fluid flex items-center justify-between px-5 md:px-[60px] lg:px-[80px]">
        <Link href="/" className="header-logo transform transition-transform duration-300 hover:scale-105">
          <Image 
            src="/meetme.png" 
            width={120} 
            height={45} 
            alt="PocketCV" 
            className="h-auto w-auto"
            priority
          />
        </Link>
        
        <div className="relative">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span className={`block h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? 'w-6 opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
            </div>
          </button>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={closeMenu}
              aria-hidden="true"
            />
          )}

          <nav
            className={`md:static md:translate-x-0 md:w-auto md:h-auto md:bg-transparent md:shadow-none md:flex
              fixed top-0 right-0 h-screen w-[280px] bg-gradient-to-b from-white to-[#f8f9fa] shadow-2xl z-50 
              transform transition-transform duration-300 ease-in-out
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="flex justify-between items-center p-5 md:hidden">
              <Link href="/" className="block">
                <Image 
                  src="/meetme.png" 
                  width={100} 
                  height={40} 
                  alt="PocketCV" 
                  className="h-auto w-auto"
                />
              </Link>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors duration-200"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center px-5 md:px-0 py-5 md:py-0 space-y-4 md:space-y-0 md:space-x-8">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="relative text-gray-700 hover:text-[#1a73e8] transition-colors duration-200 group cursor-pointer"
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a73e8] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;