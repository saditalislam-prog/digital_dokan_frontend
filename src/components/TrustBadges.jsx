import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const badges = [
  { icon: Truck, title: 'Free Shipping', desc: 'On All Orders', emoji: '🚚' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% Secure', emoji: '🔒' },
  { icon: RotateCcw, title: '7 Days Return', desc: 'Hassle Free', emoji: '🔄' },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex items-center gap-4 p-4 rounded-xl bg-surface hover:bg-white border border-transparent hover:border-accent/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-accent transition-colors duration-200">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
