import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/20 hover:shadow-emerald-900/30 hover:border-emerald-400/30 transition-all duration-500 h-full hover-lift">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-[100px] opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative flex flex-col h-full">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50 group-hover:text-emerald-200 transition-all duration-300 shadow-lg shadow-emerald-900/20 group-hover:scale-110 backdrop-blur-sm">
            {icon}
          </div>
          <h3 className="font-display mb-4 text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {title}
          </h3>
          <p className="text-stone-300/85 leading-relaxed flex-grow mb-6">
            {description}
          </p>
          <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300 group-hover:gap-3 gap-2 transition-all">
            <span>Explore Service</span>
            <svg className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-amber-400 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="group flex flex-col items-start p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 shadow-lg shadow-black/10">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50 group-hover:text-emerald-200 transition-all duration-300 shadow-md shadow-emerald-900/20 group-hover:scale-105 backdrop-blur-sm">
        {icon}
      </div>
      <h3 className="font-display mb-3 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
        {title}
      </h3>
      <p className="text-stone-300/85 leading-relaxed">{description}</p>
    </div>
  );
}

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function CTAButton({ href, children, variant = 'primary', className = '' }: CTAButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-lg hover:shadow-2xl transform hover:-translate-y-1";
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus-visible:outline-emerald-400 shadow-emerald-900/30 hover:shadow-emerald-900/50",
    secondary: "border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50"
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
