import Layout from '../components/Layout';
import { UtensilsCrossed, MapPin, QrCode, Bell, ArrowRight, Leaf } from 'lucide-react';

const steps = [
  {
    icon: UtensilsCrossed,
    title: '1. Canteen Posts Leftovers',
    desc: 'Vendors list surplus food packs at 60% off, set a 15‑min pickup window, and instantly notify nearby students.',
    color: 'from-green-400 to-emerald-400',
  },
  {
    icon: MapPin,
    title: '2. Students Discover Nearby Deals',
    desc: 'The app uses geolocation to sort packs by distance. Switch between list and map views for quick browsing.',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    icon: QrCode,
    title: '3. One‑Tap Claim & QR Token',
    desc: 'A single tap reserves a meal. A unique QR code token is generated—show it at the canteen to collect.',
    color: 'from-teal-400 to-cyan-400',
  },
  {
    icon: Bell,
    title: '4. Real‑Time Alerts',
    desc: 'Socket.io updates appear instantly. Optional push notifications ensure you never miss a deal.',
    color: 'from-cyan-400 to-blue-400',
  },
];

export default function ServicesPage() {
  return (
    <Layout>
      <div className="px-4 py-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Our <span className="text-green-400">Services</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A seamless, real‑time platform that connects campus canteens with hungry students,
            turning food waste into affordable meals.
          </p>
        </div>

        {/* Step cards */}
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`glass-card group flex flex-col md:flex-row items-center gap-6 p-8 hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Icon with gradient background */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-4 flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
                <step.icon className="w-full h-full text-white" />
              </div>
              <div className="text-left md:flex-1">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
            </div>
          ))}
        </div>

        {/* Additional interactive feature: a CTA */}
        <div className="mt-20 text-center">
          <div className="glass-card inline-block p-10 max-w-lg">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">Ready to Save Food?</h3>
            <p className="text-gray-300 mb-6">Join your campus community today and make a difference.</p>
            <a
              href="/login"
              className="inline-block bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg shadow-green-900/30"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}