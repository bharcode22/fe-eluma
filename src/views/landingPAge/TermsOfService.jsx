import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavbarLandingPage from '../../components/NavbarLandingPage.jsx';
import FooterLandingPage from '../../components/FooterLandingPage.jsx';
import { Scale, FileCheck, AlertTriangle, ShieldCheck, ChevronLeft, Sparkles, Home, UserCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { translateNodes } from '../../utils/translator.js';

function TermsOfService() {
  const divRef = useRef(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 flex flex-col">
      <NavbarLandingPage />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 w-full">

        {/* Back Button */}
        <div>
          <Link
            to="/"
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:bg-base-200 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-base-100 rounded-3xl p-8 sm:p-12 border border-base-300 shadow-sm text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-primary" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-base-content tracking-tight">
            Terms of Service
          </h1>

          <p className="text-sm text-base-content/70 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using the Eluma Property platform or inquiring about luxury property listings.
          </p>

          <div className="text-xs text-base-content/50 pt-2 font-medium">
            Last Updated: July 2026 • Effective Date: January 2026
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-base-100 rounded-3xl p-8 sm:p-10 border border-base-300 shadow-sm space-y-8 text-base-content leading-relaxed">

          {/* Section 1 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">1. Acceptance of Terms</h2>
            </div>
            <p className="text-sm text-base-content/80">
              By accessing, browsing, or utilizing Eluma Property websites, mobile interfaces, or support hotlines, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue platform use immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                <Home className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">2. Property Listings & Pricing</h2>
            </div>
            <p className="text-sm text-base-content/80">
              All property descriptions, sizes, photos, amenities, and availability dates are provided in good faith by verified property owners and agents.
            </p>
            <ul className="list-disc list-inside text-sm text-base-content/80 space-y-2 pl-2">
              <td><strong>Price Currency:</strong> Property prices are quoted in Indonesian Rupiah (IDR) and converted dynamically to foreign currencies (USD, EUR, etc.) for reference purposes. Final rental contracts will specify the governing currency.</td>
              <td><strong>Availability:</strong> Property availability schedules are subject to confirmation upon inquiry.</td>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 text-accent rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">3. Property Owner & Host Obligations</h2>
            </div>
            <p className="text-sm text-base-content/80">
              Property owners listing villas, land, or apartments on Eluma Property must warrant that they hold valid ownership or legal power of attorney to lease or sell the property in accordance with Indonesian real estate regulations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 text-warning rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">4. Limitation of Liability</h2>
            </div>
            <p className="text-sm text-base-content/80">
              Eluma Property acts as a premier matchmaking and advisory platform connecting buyers/renters with verified hosts. Eluma Property shall not be held liable for third-party lease breaches or unforeseen natural incidents affecting properties.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 text-info rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">5. Governing Law & Contact</h2>
            </div>
            <p className="text-sm text-base-content/80">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of Indonesia. For questions regarding these terms, reach out to our legal department:
            </p>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-xs font-semibold text-primary w-fit">
              Email: legal@elumaproperty.com • Address: Seminyak, Badung, Bali - Indonesia
            </div>
          </section>

        </div>

      </main>

      <FooterLandingPage />
    </div>
  );
}

export default TermsOfService;
