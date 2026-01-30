import type { Metadata } from 'next';
import { CTAButton, FeatureCard } from '@/components/ui/Cards';

export const metadata: Metadata = {
  title: 'Digital Invoice Services | Saad Traders - FBR Compliant Invoicing',
  description: 'Create, manage, and validate FBR-compliant digital invoices with Saad Traders. Streamline your invoicing process with our advanced digital invoice platform.',
  keywords: [
    'FBR invoice Pakistan',
    'FBR compliant invoicing',
    'digital invoice Pakistan',
    'Pakistan e-invoicing',
    'create FBR invoice',
    'sales tax invoice FBR',
  ],
  alternates: {
    canonical: 'https://saadtraders.com/digital-invoice',
  },
  openGraph: {
    title: 'Digital Invoice Services - Saad Traders',
    description: 'FBR-compliant digital invoicing solutions for your business',
    type: 'website',
  },
};

export default function DigitalInvoicePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white -mt-25 pt-20">
        {/* Animated gradient mesh backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300 border border-white/20 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% FBR Compliant Solutions
              </span>
            </div>
            
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl mb-8 animate-fade-in-up stagger-1 text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              FBR-Compliant <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Digital Invoice</span> Solutions
            </h1>
            
            <p className="text-lg sm:text-xl leading-relaxed text-stone-200/85 animate-fade-in-up stagger-2">
              Streamline your invoicing process with our advanced platform. Create, manage, and validate digital invoices that are fully compliant with Federal Board of Revenue regulations.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up stagger-3">
              <CTAButton href="/contact" variant="secondary">
                Get Started Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </CTAButton>
              <a
                href="https://wa.me/923184489249"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-white hover:text-emerald-200 transition-colors font-bold group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Platform Features</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Comprehensive Invoice Management
            </h2>
            <p className="text-lg text-stone-300/85 leading-relaxed">
              Everything you need to manage your invoices efficiently and compliantly
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="FBR Compliance"
              description="All invoices generated through our platform are 100% compliant with Federal Board of Revenue (FBR) regulations and standards."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            <FeatureCard
              title="Easy Invoice Creation"
              description="Create professional invoices in minutes with our intuitive interface. No technical knowledge required, just simple and efficient."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
            />

            <FeatureCard
              title="Real-time Validation"
              description="Instantly validate your invoices against FBR standards before submission. Catch errors before they become problems."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />

            <FeatureCard
              title="Secure Storage"
              description="Your invoice data is encrypted and securely stored. Access your invoices anytime, anywhere with complete peace of mind."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <FeatureCard
              title="Automated Reports"
              description="Generate comprehensive reports for your business. Track invoice history and payment status effortlessly with detailed analytics."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            <FeatureCard
              title="Multi-format Export"
              description="Export invoices in PDF, Excel, or other formats. Share and print with ease for maximum flexibility."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Simple Process</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              How It Works
            </h2>
            <p className="text-lg text-stone-300/85 leading-relaxed">
              Get started with digital invoicing in three simple steps
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/30 group-hover:shadow-xl group-hover:shadow-emerald-900/50 transition-all group-hover:scale-110">
                      <span className="font-display text-3xl font-bold">1</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full"></div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">Register Your Business</h3>
                  <p className="text-stone-300/85 leading-relaxed">
                    Sign up and provide your business details to get started with our platform. Quick and easy setup.
                  </p>
                </div>
                {/* Connector line - hidden on mobile */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-400/50 to-transparent"></div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/30 group-hover:shadow-xl group-hover:shadow-emerald-900/50 transition-all group-hover:scale-110">
                      <span className="font-display text-3xl font-bold">2</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full"></div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">Create Invoices</h3>
                  <p className="text-stone-300/85 leading-relaxed">
                    Use our easy-to-use interface to create professional, FBR-compliant invoices in minutes.
                  </p>
                </div>
                {/* Connector line - hidden on mobile */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-400/50 to-transparent"></div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/30 group-hover:shadow-xl group-hover:shadow-emerald-900/50 transition-all group-hover:scale-110">
                      <span className="font-display text-3xl font-bold">3</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full"></div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">Validate & Send</h3>
                  <p className="text-stone-300/85 leading-relaxed">
                    Validate your invoices against FBR standards and send them to clients with complete confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Why Choose Our Digital Invoice Service?
              </h2>
              <p className="text-lg text-stone-300/85 mb-8 leading-relaxed">
                Our platform is designed specifically for Pakistani businesses, ensuring full compliance with local regulations while providing modern, efficient tools.
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-colors border border-emerald-400/30">
                    <svg className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <span className="text-stone-300/85 leading-relaxed">
                      <strong className="font-bold text-white">Save Time:</strong> Create invoices in minutes instead of hours with our streamlined interface
                    </span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-colors border border-emerald-400/30">
                    <svg className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <span className="text-stone-300/85 leading-relaxed">
                      <strong className="font-bold text-white">Reduce Errors:</strong> Automated validation prevents costly mistakes and ensures accuracy
                    </span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-colors border border-emerald-400/30">
                    <svg className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <span className="text-stone-300/85 leading-relaxed">
                      <strong className="font-bold text-white">Stay Compliant:</strong> Always up-to-date with latest FBR requirements and regulations
                    </span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-colors border border-emerald-400/30">
                    <svg className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <span className="text-stone-300/85 leading-relaxed">
                      <strong className="font-bold text-white">Professional Image:</strong> Impress clients with polished, professional invoices every time
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-emerald-900/20 overflow-hidden group hover:shadow-emerald-900/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all"></div>
                <svg className="h-64 w-64 text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-400/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-400/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-slate-900/50 overflow-hidden border-y border-white/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Ready to Modernize Your Invoicing?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-200/85">
              Join thousands of businesses across Pakistan who trust Saad Traders for their digital invoicing needs. Experience the difference today.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <CTAButton href="/contact" variant="secondary">
                Contact Us Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
