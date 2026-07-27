import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Heart,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

function FooterLandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-base-900 text-base-content border-t border-base-300/40 relative overflow-hidden pt-16 pb-8">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">

          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-md group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Eluma Property
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed max-w-sm font-light">
              Your premier gateway to handpicked luxury villas, modern architectural residences, and high-yield real estate investments in Bali and beyond.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-base-200 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-base-300 text-base-content/70" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-base-200 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-base-300 text-base-content/70" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-base-200 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-base-300 text-base-content/70" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-base-200 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-base-300 text-base-content/70" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content border-b border-base-300/60 pb-2 w-fit">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-base-content/70 font-medium">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Explore Properties</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Our Services</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>About Eluma</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Contact Support</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Property Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content border-b border-base-300/60 pb-2 w-fit">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-base-content/70 font-medium">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Luxury Villas</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Modern Apartments</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Beachfront Estates</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Prime Investment Land</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Residential Houses</span></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content border-b border-base-300/60 pb-2 w-fit">
              Office HQ
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-base-content/70 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Ubud, Bali - Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:support@elumaproperty.com" className="hover:text-primary transition-colors">
                  support@elumaproperty.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
                <span>Licensed Real Estate Agency</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-base-300/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60 font-light">
          <p>© {new Date().getFullYear()} Eluma Property. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-base-content transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-base-content transition-colors">Terms of Service</Link>
            <span className="hover:text-base-content cursor-pointer transition-colors">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer >
  );
}

export default FooterLandingPage;
