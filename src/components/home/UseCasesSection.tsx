import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function UseCasesSection() {
  const { useCases, resolveIcon } = useHomeConfig();

  return (
    <HomeSection
      id="use-cases"
      eyebrow={useCases.section.eyebrow}
      title={useCases.section.title}
      description={useCases.section.description}
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.items.map((u, idx) => {
          const Icon = resolveIcon(u.iconId);
          return (
            <FadeIn key={u.title} delay={0.04 * idx}>
              <div className={`
                h-full rounded-xl border border-gray-200/50 p-6
                bg-gradient-to-br ${u.gradient}
                transition-all duration-300 
                hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
              `}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${u.iconBg} mb-4`}>
                  <Icon className={`h-6 w-6 ${u.iconColor}`} />
                </div>
                <div className="text-base font-bold text-gray-900 mb-2">{u.title}</div>
                <div className="text-sm leading-relaxed text-gray-700">{u.description}</div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </HomeSection>
  );
}

