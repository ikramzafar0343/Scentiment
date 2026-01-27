import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';

const STATS = [
  { 
    value: '50k+', 
    label: 'Happy customers',
    gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40'
  },
  { 
    value: '4.9/5', 
    label: 'Average rating',
    gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40'
  },
  { 
    value: '2–4 days', 
    label: 'Typical delivery',
    gradient: 'from-emerald-200/30 via-green-100/30 to-emerald-50/40'
  },
  { 
    value: '24/7', 
    label: 'Order tracking',
    gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40'
  }
];

export function StatsSection() {
  return (
    <HomeSection
      id="stats"
      eyebrow="Credibility"
      title="Premium experience, proven"
      description="Numbers that reflect trust, consistency, and service quality."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, idx) => (
          <FadeIn key={s.label} delay={0.05 * idx}>
            <div className={`
              rounded-xl border border-gray-200/50 p-6 shadow-sm
              bg-gradient-to-br ${s.gradient}
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
            `}>
              <div className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{s.value}</div>
              <div className="text-sm text-gray-700 font-medium">{s.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

