import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';

const STATS = [
  { value: '50k+', label: 'Happy customers' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '2–4 days', label: 'Typical delivery' },
  { value: '24/7', label: 'Order tracking' }
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, idx) => (
          <FadeIn key={s.label} delay={0.05 * idx}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-3xl font-semibold tracking-tight text-gray-900">{s.value}</div>
              <div className="mt-2 text-sm text-gray-600">{s.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

