import type { Metadata } from 'next';
import { CTAButton, FeatureCard } from '@/components/ui/Cards';

export const metadata: Metadata = {
  title: 'Stitching Thread & Dyeing Services | Saad Traders - Premium Quality Materials',
  description: 'Premium quality stitching threads, dyeing materials, and textile supplies from Saad Traders. Everything you need for garment and textile manufacturing.',
  keywords: 'stitching thread Pakistan, dyeing materials, textile supplies, garment supplies, thread wholesale Pakistan',
  openGraph: {
    title: 'Stitching Thread & Dyeing Services - Saad Traders',
    description: 'Premium quality materials for your textile and garment business',
    type: 'website',
  },
};

export default function StitchingServicesPage() {
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
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium Quality Since Day One
              </span>
            </div>
            
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl mb-8 animate-fade-in-up stagger-1 text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Stitching Thread</span> & Dyeing Materials
            </h1>
            
            <p className="text-lg sm:text-xl leading-relaxed text-stone-200/85 animate-fade-in-up stagger-2">
              Your one-stop solution for high-quality stitching threads, dyeing materials, and all textile supplies. We provide everything you need for your garment and textile manufacturing business.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up stagger-3">
              <CTAButton href="/contact" variant="secondary">
                Request Quote
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </CTAButton>
              <a
                href="https://wa.me/923184489249"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-white hover:text-amber-200 transition-colors font-bold group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Product Range</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Our Product Range
            </h2>
            <p className="text-lg text-stone-300/85 leading-relaxed">
              Premium quality materials for all your textile needs
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Stitching Threads"
              description="Wide variety of high-quality stitching threads in all colors and sizes. Perfect for garments, embroidery, and industrial applications."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            />

            <FeatureCard
              title="Dyeing Materials"
              description="Professional-grade dyeing chemicals and materials. Vibrant, long-lasting colors for all types of fabrics and textiles."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            />

            <FeatureCard
              title="Industrial Supplies"
              description="Complete range of industrial textile supplies including bobbins, needles, and accessories for manufacturing."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />

            <FeatureCard
              title="Embroidery Thread"
              description="Specialized embroidery threads with exceptional sheen and durability. Perfect for decorative and detailed work."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />

            <FeatureCard
              title="Fabric Accessories"
              description="Complete range of buttons, zippers, elastics, and other garment accessories to complement your products."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
            />

            <FeatureCard
              title="Bulk Orders"
              description="Special pricing and services for bulk orders. We cater to manufacturers, wholesalers, and large-scale buyers."
              icon={
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-square rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-emerald-900/20 overflow-hidden group hover:shadow-emerald-900/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all"></div>
                <svg className="h-64 w-64 text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-400/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-400/30 rounded-full blur-2xl"></div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block mb-4">
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Quality Assurance</span>
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Quality You Can Trust
              </h2>
              <p className="text-lg text-stone-300/85 mb-8 leading-relaxed">
                At Saad Traders, quality is our top priority. We source our materials from trusted manufacturers and conduct rigorous quality checks to ensure you receive only the best.
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
                      <strong className="font-bold text-white">100% Authentic:</strong> All products are genuine and sourced from reputable manufacturers
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
                      <strong className="font-bold text-white">Quality Tested:</strong> Every batch undergoes strict quality control procedures
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
                      <strong className="font-bold text-white">Fast Delivery:</strong> Quick and reliable delivery services across Pakistan
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
                      <strong className="font-bold text-white">Competitive Pricing:</strong> Best prices without compromising on quality
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">For Businesses</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Why Textile Businesses Choose Us
            </h2>
            <p className="text-lg text-stone-300/85 leading-relaxed">
              Trusted by manufacturers and retailers across Pakistan
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="group hover-lift rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg className="h-6 w-6 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white ml-4">For Manufacturers</h3>
                </div>
                <ul className="space-y-4 text-stone-300/85">
                  <li className="flex items-start">
                    <span className="font-bold text-emerald-400 mr-3">•</span>
                    <span>Consistent quality for large production runs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-emerald-400 mr-3">•</span>
                    <span>Bulk pricing and attractive volume discounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-emerald-400 mr-3">•</span>
                    <span>Reliable supply chain management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-emerald-400 mr-3">•</span>
                    <span>Technical support and expert guidance</span>
                  </li>
                </ul>
              </div>

              <div className="group hover-lift rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 transition-all">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                    <svg className="h-6 w-6 text-cyan-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white ml-4">For Retailers</h3>
                </div>
                <ul className="space-y-4 text-stone-300/85">
                  <li className="flex items-start">
                    <span className="font-bold text-cyan-400 mr-3">•</span>
                    <span>Wide variety of products and color options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-cyan-400 mr-3">•</span>
                    <span>Flexible order quantities to suit your needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-cyan-400 mr-3">•</span>
                    <span>Quick restocking and replenishment services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-cyan-400 mr-3">•</span>
                    <span>Competitive retail pricing and margins</span>
                  </li>
                </ul>
              </div>
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
              Ready to Order Premium Materials?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-200/85">
              Contact us today for quotes, bulk orders, or to discuss your specific requirements. Our team is ready to help you succeed.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <CTAButton href="/contact" variant="secondary">
                Request a Quote
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </CTAButton>
              <a
                href="https://wa.me/923184489249"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 text-white hover:text-amber-200 transition-colors font-semibold text-lg group"
              >
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span>+92 318 4489249</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
