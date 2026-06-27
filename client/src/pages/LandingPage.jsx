import { Link } from 'react-router-dom';
import { Leaf, UtensilsCrossed, MapPin, QrCode, Bell, Mail } from 'lucide-react';
import Layout from '../components/Layout';

export default function LandingPage() {
  return (
    <Layout>
      {/* HERO */}
      <section className="pt-24 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Turn <span className="text-green-400">Leftovers</span> into
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Lunch for Everyone
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Canteens post surplus food at 60% off. Students grab a meal in minutes.
            We rescue food, save money, and protect the planet—one pack at a time.
          </p>
          <Link
            to="/login"
            className="inline-block bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition shadow-lg shadow-green-900/30"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* SERVICES CARDS */}
      <section id="services" className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It <span className="text-green-400">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[ 
            { icon: UtensilsCrossed, title: 'Canteens Post Leftovers', desc: 'Vendors list surplus packs at 60% off with a 15‑min pickup window.' },
            { icon: MapPin, title: 'Find Nearby Deals', desc: 'The app shows available packs sorted by distance using real‑time geolocation.' },
            { icon: QrCode, title: 'Claim & Get a QR Code', desc: 'One tap reserves your meal. You receive a unique token as a QR code.' },
            { icon: Bell, title: 'Instant Notifications', desc: 'Real‑time alerts via Socket.io and push notifications when new food is posted.' }
          ].map((card, i) => (
            <div key={i} className="glass-card group">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <card.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-300">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4 bg-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            About <span className="text-green-400">Rescue Bite</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Born on campus to fight food waste. Every day, canteens throw away perfectly good meals.  
            We connect them with hungry students—saving money, reducing waste, and building community.  
            No payment, just an honour system. Good for your wallet, great for the planet.
          </p>
        </div>
      </section>

      {/* CONTACT (simple section) */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Get in <span className="text-green-400">Touch</span>
          </h2>
          <div className="glass-card inline-block mx-auto max-w-md p-8">
            <Mail className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Have questions or want to bring rescue bite to your campus?</p>
            <a href="mailto:hello@leftoverlunch.com" className="text-green-400 hover:underline font-medium">
              hello@rescuebite.com
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-green-900/30 py-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Rescue Bite. Built with ❤️ for campuses.</p>
      </footer>
    </Layout>
  );
}