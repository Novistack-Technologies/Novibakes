import React from 'react';
import Header from './Header';
import Footer from './Footer';

const WHATSAPP = import.meta.env.VITE_BAKERY_WHATSAPP;
const WA_MSG   = encodeURIComponent("Hi NoviBakes! I'd like to place an order.");

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${WA_MSG}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* WhatsApp SVG */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.469 2.027 7.77L0 32l8.466-2.004A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.74-1.845l-.483-.287-4.99 1.181 1.213-4.864-.316-.5A13.22 13.22 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.887c-.398-.199-2.355-1.162-2.72-1.295-.366-.132-.632-.199-.898.2-.265.398-1.03 1.295-1.262 1.56-.232.266-.465.3-.863.1-.398-.199-1.68-.619-3.2-1.974-1.183-1.055-1.982-2.357-2.213-2.756-.232-.398-.025-.614.174-.812.18-.179.398-.465.597-.697.2-.232.266-.398.398-.664.133-.265.067-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.672-.898-.684l-.765-.013c-.266 0-.698.1-.1063.498-.365.398-1.395 1.362-1.395 3.322s1.428 3.854 1.627 4.12c.199.265 2.81 4.29 6.81 6.018.952.411 1.695.656 2.274.84.955.304 1.824.261 2.511.158.766-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.1-.166-.365-.265-.763-.465z"/>
        </svg>
      </a>
    </div>
  );
};

export default Layout;
