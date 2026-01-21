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
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200 h-full hover-lift">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-[100px] opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative flex flex-col h-full">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-110">
            {icon}
          </div>
          <h3 className="font-display mb-4 text-2xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <p className="text-stone-600 leading-relaxed flex-grow mb-6">
            {description}
          </p>
          <div className="flex items-center text-emerald-700 font-semibold group-hover:text-emerald-600 group-hover:gap-3 gap-2 transition-all">
            <span>Explore Service</span>
            <svg className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-600 to-amber-500 group-hover:w-full transition-all duration-500"></div>
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
    <div className="group flex flex-col items-start p-6 rounded-xl hover:bg-stone-50 transition-all duration-300">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105">
        {icon}
      </div>
      <h3 className="font-display mb-3 text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
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
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1";
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline-emerald-600",
    secondary: "bg-white text-emerald-700 border-2 border-white hover:bg-emerald-50 hover:border-emerald-100"
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
