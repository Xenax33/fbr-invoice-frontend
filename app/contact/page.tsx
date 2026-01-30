'use client';

import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { FeatureCard } from '@/components/ui/Cards';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // EmailJS credentials (env overrides provided defaults)
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          date: new Date().toLocaleString(),
        },
        publicKey
      );

      if (result.status === 200) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try WhatsApp or try again later.');
      console.error('EmailJS error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-24 overflow-hidden -mt-25 pt-44">
        {/* Animated gradient mesh backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-white/90">Available 24/7</span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up animation-delay-100 text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            Get in Touch
          </h1>
          <p className="mt-6 text-xl text-stone-200/85 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Have questions? We&apos;re here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="animate-fade-in-up animation-delay-300">
              <h2 className="font-display text-4xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Contact Information
              </h2>
              <p className="text-lg text-stone-300/85 mb-10">
                Feel free to reach out through any of the following channels. We&apos;re always ready to assist you.
              </p>

              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-start group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-semibold text-white mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/923184489249"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium text-lg transition-colors"
                    >
                      +92 318 4489249
                    </a>
                    <p className="text-sm text-stone-400 mt-1">Available 24/7 for instant support</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300">
                      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-semibold text-white mb-1">Location</h3>
                    <p className="text-lg text-stone-300/85">Pakistan</p>
                    <p className="text-sm text-stone-400 mt-1">Serving businesses nationwide</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-hover:shadow-emerald-600/50 group-hover:scale-110 transition-all duration-300">
                      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-semibold text-white mb-1">Business Hours</h3>
                    <p className="text-lg text-stone-300/85">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-stone-400 mt-1">WhatsApp available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-shadow duration-300 animate-fade-in-up animation-delay-400">
                <h3 className="font-display text-2xl font-semibold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/923184489249?text=Hello, I'm interested in your services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-emerald-600/50 transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Message on WhatsApp
                    </span>
                  </a>
                  <a
                    href="tel:+923184489249"
                    className="group block w-full text-center bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-600/50 transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Us Now
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl shadow-emerald-900/20 p-10 border border-white/10 hover:shadow-emerald-900/40 transition-shadow duration-300 animate-fade-in-up animation-delay-500">
              <h2 className="font-display text-3xl font-bold text-white mb-8 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Send us a Message
              </h2>
              
              {status === 'success' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-emerald-800 font-semibold flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully!
                  </p>
                  <p className="text-emerald-700 text-sm mt-1">We&apos;ll get back to you soon.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 font-semibold flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Error sending message
                  </p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/5 backdrop-blur-sm text-white placeholder-stone-400 hover:bg-white/10"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/5 backdrop-blur-sm text-white placeholder-stone-400 hover:bg-white/10"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/5 backdrop-blur-sm text-white placeholder-stone-400 hover:bg-white/10"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                  >
                    <option value="">Select a subject</option>
                    <option value="Digital Invoice Services">Digital Invoice Services</option>
                    <option value="Stitching & Dyeing Materials">Stitching & Dyeing Materials</option>
                    <option value="Bulk Order Inquiry">Bulk Order Inquiry</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none bg-white/5 backdrop-blur-sm text-white placeholder-stone-400 hover:bg-white/10"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-600/50 transform hover:-translate-y-0.5 text-lg"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </button>

                <p className="text-sm text-stone-400 text-center">
                  Note: To use this form, you&apos;ll need to configure EmailJS with your credentials.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in-up">
            <h2 className="font-display text-4xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">Why Contact Us?</h2>
            <p className="text-xl text-stone-300/85">
              We&apos;re here to provide the best service and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up animation-delay-100">
              <FeatureCard
                title="Fast Response"
                description="We typically respond within 2 hours during business hours and are available 24/7 on WhatsApp."
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <FeatureCard
                title="Expert Guidance"
                description="Our team has years of experience and can help you choose the right solution for your needs."
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
            </div>
            <div className="animate-fade-in-up animation-delay-300">
              <FeatureCard
                title="Custom Solutions"
                description="Every business is unique. We offer tailored solutions to meet your specific requirements."
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
