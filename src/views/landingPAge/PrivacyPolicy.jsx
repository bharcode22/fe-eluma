import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavbarLandingPage from '../../components/NavbarLandingPage.jsx';
import FooterLandingPage from '../../components/FooterLandingPage.jsx';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { translateNodes } from '../../utils/translator.js';

function PrivacyPolicy() {
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Data Protection & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-base-content tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-base-content/70 max-w-2xl mx-auto">
            At Eluma Property, your trust and data security are our top priorities. This policy outlines how we collect, protect, and use your information.
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
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">1. Information We Collect</h2>
            </div>
            <p className="text-sm text-base-content/80">
              When you browse our platform, submit an inquiry, or interact with property hosts, we may collect the following data:
            </p>
            <ul className="list-disc list-inside text-sm text-base-content/80 space-y-2 pl-2">
              <td><strong>Personal Contact Details:</strong> Full name, phone number, WhatsApp number, and email address provided during property inquiries.</td>
              <td><strong>Property Search Preferences:</strong> Saved property listings, target locations (e.g., Seminyak, Ubud, Canggu), and price budget range.</td>
              <td><strong>Technical Data:</strong> Anonymized IP addresses, browser type, device information, and session cookies for user experience optimization.</td>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">2. How We Use Your Information</h2>
            </div>
            <p className="text-sm text-base-content/80">
              Your information is used strictly to deliver an exceptional real estate experience:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 text-xs space-y-1">
                <div className="font-bold text-base-content flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Connecting Inquiries</span>
                </div>
                <p className="text-base-content/70">Facilitating direct communication between you and verified property hosts or agents.</p>
              </div>

              <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 text-xs space-y-1">
                <div className="font-bold text-base-content flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Personalized Property Recommendations</span>
                </div>
                <p className="text-base-content/70">Tailoring villa and apartment suggestions matching your budget and location criteria.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 text-accent rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">3. Data Security & Storage</h2>
            </div>
            <p className="text-sm text-base-content/80">
              We implement enterprise-grade security protocols to protect your personal information against unauthorized access, loss, or alteration. All database connections are protected by SSL/TLS encryption and stored on secure cloud infrastructure.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b border-base-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 text-info rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">4. Third-Party Sharing</h2>
            </div>
            <p className="text-sm text-base-content/80">
              We do <strong>not</strong> sell, rent, or trade your personal information to third-party marketers. Your contact details are shared only with property agents or owners associated with specific listings you explicitly inquire about.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 text-warning rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">5. Privacy Rights & Support</h2>
            </div>
            <p className="text-sm text-base-content/80">
              You have the right to request access to your personal data, update your information, or request complete deletion of your account and inquiry history. For privacy concerns, please contact our Data Protection Officer:
            </p>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-xs font-semibold text-primary w-fit">
              Email: privacy@elumaproperty.com • Hotline: +62 812-3456-7890
            </div>
          </section>

        </div>

      </main>

      <FooterLandingPage />
    </div>
  );
}

export default PrivacyPolicy;
