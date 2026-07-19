import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, CakeSlice, Truck } from "lucide-react";
import { navItems } from "../../data/data";

const PRIMARY = "#ec4899";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled && !isOpen;

  const navBg = isTransparent
    ? "bg-transparent"
    : scrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100"
      : "bg-white/80 backdrop-blur-sm";

  const linkColor = "text-slate-700 hover:text-slate-800";
  const brandColor = "text-slate-800";
  const hamburger  = "text-slate-800";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="h-16 md:h-18 flex items-center justify-between lg:grid lg:grid-cols-[220px_1fr_220px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: PRIMARY }}
              >
                <CakeSlice size={18} strokeWidth={2} className="text-white" />
              </div>
              <span className={`text-base sm:text-lg font-bold transition-colors duration-300 ${brandColor}`}>
                NoviBakes
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    location.pathname === item.path ? "text-[#ec4899]" : linkColor
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              <Link
                to="/track-order"
                className="inline-flex h-10 px-5 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Truck size={15} />
                Track Order
              </Link>
              <Link
                to="/cart"
                className="inline-flex h-10 px-5 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: PRIMARY }}
              >
                <ShoppingCart size={16} />
                Cart
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-md"
                style={{ backgroundColor: PRIMARY }}
              >
                <ShoppingCart size={15} strokeWidth={2.2} />
                Cart
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close Menu" : "Open Menu"}
                className={`transition-colors duration-300 focus:outline-none ${hamburger}`}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-16 z-40 bg-white border-t border-gray-100 lg:hidden h-[calc(100vh-4rem)] transition-all duration-300 ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-3.5 text-base font-medium transition-all ${
                location.pathname === item.path ? "text-white" : "text-slate-700 hover:bg-gray-50"
              }`}
              style={location.pathname === item.path ? { backgroundColor: PRIMARY } : {}}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/track-order" onClick={() => setIsOpen(false)}>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-white shadow-md transition-all"
                style={{ backgroundColor: PRIMARY }}
              >
                <Truck size={18} />
                Track Order
              </button>
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-white shadow-lg transition-all"
                style={{ backgroundColor: PRIMARY }}
              >
                <ShoppingCart size={20} />
                View Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
