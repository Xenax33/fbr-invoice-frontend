import { ServiceCard, FeatureCard, CTAButton } from '@/components/ui/Cards';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-stone-900 to-blue-950 text-white">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-block animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 1000+ Businesses Across Pakistan
              </span>
            </div>
            
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl mb-8 animate-fade-in-up stagger-1">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Saad Traders</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-stone-300 max-w-3xl mx-auto animate-fade-in-up stagger-2">
              Your trusted partner for <span className="font-semibold text-white">FBR-compliant digital invoicing</span> solutions and <span className="font-semibold text-white">premium quality stitching threads</span> and dyeing materials. Excellence in every service we provide.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up stagger-3">
              <CTAButton href="/contact">
                Get Started Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </CTAButton>
              <CTAButton href="/login" variant="secondary">
                Login to Account
              </CTAButton>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-24 max-w-5xl animate-fade-in-up stagger-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <div className="font-display text-4xl font-bold text-emerald-400">100<span className="text-2xl">%</span></div>
                </div>
                <div className="text-sm text-stone-300 font-semibold uppercase tracking-wider">FBR Compliant</div>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <div className="font-display text-4xl font-bold text-amber-400">24<span className="text-2xl">/7</span></div>
                </div>
                <div className="text-sm text-stone-300 font-semibold uppercase tracking-wider">Support Available</div>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <div className="font-display text-4xl font-bold text-blue-400">1000<span className="text-2xl">+</span></div>
                </div>
                <div className="text-sm text-stone-300 font-semibold uppercase tracking-wider">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 text-stone-50" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">What We Offer</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl mb-6">
              Our Services
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Comprehensive solutions tailored to meet your business needs with precision and excellence
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
            <ServiceCard
              title="Digital Invoice Services"
              description="Create, manage, and validate FBR-compliant digital invoices seamlessly through our advanced platform. Ensure compliance and streamline your invoicing process with cutting-edge technology."
              href="/digital-invoice"
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            <ServiceCard
              title="Stitching Thread & Dyeing"
              description="Premium quality stitching threads, dyeing materials, and textile supplies. We provide everything you need for your garment and textile manufacturing business with unmatched quality."
              href="/stitching-services"
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Our Advantages</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl mb-6">
              Why Choose Saad Traders?
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We combine cutting-edge technology and premium quality to deliver exceptional results
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="FBR Compliance"
              description="All our digital invoice solutions are fully compliant with Federal Board of Revenue regulations, ensuring legal accuracy and peace of mind."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            <FeatureCard
              title="Premium Quality"
              description="We source and supply only the highest quality stitching threads and dyeing materials for your textile needs with rigorous quality control."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />

            <FeatureCard
              title="Reliable Support"
              description="Our dedicated support team is available 24/7 to assist you with any queries or concerns you may have. We're always here to help."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />

            <FeatureCard
              title="Fast Processing"
              description="Experience quick turnaround times for invoice generation and product deliveries without compromising on quality or accuracy."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <FeatureCard
              title="Competitive Pricing"
              description="Get the best value for your investment with our transparent and competitive pricing structure. No hidden costs, just honest pricing."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <FeatureCard
              title="Trusted Partner"
              description="Join thousands of satisfied clients who trust Saad Traders for their business needs across Pakistan. Your success is our priority."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-blue-950 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg5NHYyMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-100">
              Contact us today to learn more about our services and how we can help your business grow and succeed. Experience the Saad Traders difference.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <CTAButton href="/contact" variant="secondary">
                Contact Us Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </CTAButton>
              <a
                href="https://wa.me/923184489249"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 text-white hover:text-emerald-200 transition-colors font-semibold text-lg group"
              >
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span>WhatsApp Us</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

