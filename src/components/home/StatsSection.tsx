import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function StatsSection() {
  const { stats, resolveIcon } = useHomeConfig();

  return (
    <HomeSection
      id="stats"
      eyebrow={stats.section.eyebrow}
      title={stats.section.title}
      description={stats.section.description}
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.items.map((s, idx) => {
          const Icon = resolveIcon(s.iconId);
          return (
            <FadeIn key={s.label} delay={0.05 * idx}>
              <div className={`
                rounded-xl border border-gray-200/50 p-6 shadow-sm
                bg-gradient-to-br ${s.gradient}
                transition-all duration-300 
                hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
              `}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  <div className="text-3xl font-bold tracking-tight text-gray-900">{s.value}</div>
                </div>
                <div className="text-sm text-gray-700 font-medium">{s.label}</div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </HomeSection>
  );
}

