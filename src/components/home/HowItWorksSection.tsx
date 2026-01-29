import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function HowItWorksSection() {
  const { howItWorks, resolveIcon } = useHomeConfig();

  return (
    <HomeSection
      id="how-it-works"
      eyebrow={howItWorks.section.eyebrow}
      title={howItWorks.section.title}
      description={howItWorks.section.description}
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.steps.map((step, idx) => {
          const Icon = resolveIcon(step.iconId);
          return (
            <FadeIn key={step.title} delay={0.05 * idx}>
              <div className={`
                group h-full rounded-2xl border border-gray-200/50 p-6 shadow-sm 
                bg-gradient-to-br ${step.gradient}
                transition-all duration-300 
                hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
              `}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.iconBg}`}>
                    <Icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <div className="text-sm font-bold tracking-widest text-gray-400">0{idx + 1}</div>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-2">{step.title}</div>
                <div className="text-sm leading-relaxed text-gray-700">{step.description}</div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </HomeSection>
  );
}

