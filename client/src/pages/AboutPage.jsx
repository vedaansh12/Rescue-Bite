import Layout from '../components/Layout';
import { Users, TrendingUp, Heart, Globe, Award } from 'lucide-react';

const team = [
  { name: 'Aarav Sharma', role: 'Founder & CEO', img: 'https://i.pravatar.cc/150?img=1', color: 'border-green-400' },
  { name: 'Priya Patel', role: 'CTO', img: 'https://i.pravatar.cc/150?img=5', color: 'border-emerald-400' },
  { name: 'Rohan Gupta', role: 'Head of Product', img: 'https://i.pravatar.cc/150?img=3', color: 'border-teal-400' },
  { name: 'Sneha Iyer', role: 'Community Manager', img: 'https://i.pravatar.cc/150?img=9', color: 'border-cyan-400' },
];

const stats = [
  { icon: TrendingUp, value: '10,000+', label: 'Meals Saved' },
  { icon: Users, value: '5,000+', label: 'Active Users' },
  { icon: Globe, value: '20+', label: 'Campuses' },
  { icon: Heart, value: '99%', label: 'Positive Feedback' },
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="px-4 py-20 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            About <span className="text-green-400">Rescue Bite</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            We’re a small team of students and developers who believe no edible food should end up in the bin.
            Our mission is to connect surplus food with hungry minds—affordably, quickly, and sustainably.
          </p>
        </div>

        {/* Stats with animated counters (simulated) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card text-center group hover:scale-105 transition-transform">
              <stat.icon className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:animate-pulse" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team section */}
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet the <span className="text-green-400">Team</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="glass-card text-center group hover:scale-105 transition-transform">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 ${member.color} group-hover:border-green-300 transition-colors`}>
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-green-400 text-sm">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20 glass-card p-10 text-center max-w-3xl mx-auto">
          <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-green-400 mb-1">🌱 Sustainability</h4>
              <p className="text-gray-300 text-sm">We reduce food waste one meal at a time, lowering the carbon footprint of campuses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">🤝 Community</h4>
              <p className="text-gray-300 text-sm">Built on trust and the honour system, we foster a sharing culture among students.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">⚡ Innovation</h4>
              <p className="text-gray-300 text-sm">Real‑time geolocation, QR tokens, and push notifications—modern tech for a good cause.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}