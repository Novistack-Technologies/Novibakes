import { Link } from "react-router-dom";
import { CakeSlice, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
// import { useSanity } from "../../hooks/useSanity.js";
// import { SITE_SETTINGS_QUERY } from "../../lib/queries.js";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // const { data: settings } = useSanity(SITE_SETTINGS_QUERY, null);

  const bakeryName   = "NoviBakes";
  const description  = "Handcrafted cakes and desserts made with love in Salem, Tamil Nadu. Every order is baked fresh, just for you.";
  const phone        = import.meta.env.VITE_BAKERY_PHONE;
  const email        = import.meta.env.VITE_BAKERY_EMAIL;
  const city         = "Salem, Tamil Nadu, India";
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? "#";
  const facebookUrl  = import.meta.env.VITE_FACEBOOK_URL  ?? "#";
  const twitterUrl   = import.meta.env.VITE_TWITTER_URL   ?? "#";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-10">

          {/* Brand */}
          <div className="lg:col-span-5 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: "#ec4899" }}>
                <CakeSlice className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">{bakeryName}</span>
            </Link>

            <p className="text-white/55 leading-relaxed mb-6 text-sm max-w-sm mx-auto md:mx-0 md:max-w-xs">
              {description}
            </p>

            <div className="flex justify-center md:justify-start gap-3">
              {[
                { Icon: Instagram, href: instagramUrl, label: "Instagram" },
                { Icon: Facebook,  href: facebookUrl,  label: "Facebook" },
                { Icon: Twitter,   href: twitterUrl,   label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ec4899"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-5 text-center md:text-left">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "About Us", path: "/aboutus" },
                { name: "Services", path: "/services" },
                { name: "Contact", path: "/contactus" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/50 text-sm flex items-center justify-center md:justify-start gap-2 group transition-colors duration-200"
                    onMouseEnter={e => e.currentTarget.style.color = "#ec4899"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]/40 group-hover:bg-[#ec4899] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 space-y-5 text-center md:text-left">
            <h3 className="text-base font-semibold text-white">Legal Terms</h3>
            <ul className="space-y-3">
              {[{ name: "Terms of Service", path: "/terms" }, { name: "Privacy Policy", path: "/privacy" }].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/50 text-sm flex items-center justify-center md:justify-start gap-2 group transition-colors duration-200"
                    onMouseEnter={e => e.currentTarget.style.color = "#ec4899"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]/40 group-hover:bg-[#ec4899] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-5 text-center md:text-left">
            <h3 className="text-base font-semibold text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#ec4899" }} />
                <span className="text-white/50 text-sm leading-relaxed max-w-xs">{city}</span>
              </li>
              {phone && (
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "#ec4899" }} />
                  <a href={`tel:${phone}`} className="text-white/50 hover:text-[#ec4899] transition-colors text-sm">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "#ec4899" }} />
                  <a href={`mailto:${email}`} className="text-white/50 hover:text-[#ec4899] transition-colors text-sm">{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="text-center">
          <p className="text-white/40 text-sm">© {currentYear} {bakeryName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
