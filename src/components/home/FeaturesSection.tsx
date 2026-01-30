import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Marquee } from '@/components/ui/motion/Marquee';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function FeaturesSection() {
  const { features, resolveIcon, resolveBannerImage } = useHomeConfig();

  return (
    <HomeSection
      id="features"
      eyebrow={features.section.eyebrow}
      title={features.section.title}
      description={features.section.description}
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.items.slice(0, 4).map((f, idx) => {
          const Icon = resolveIcon(f.iconId);
          return (
            <FadeIn key={f.title} delay={0.04 * idx}>
              <div className={`
                group h-full rounded-xl border border-gray-200/50 p-6 text-left
                bg-gradient-to-br ${f.gradient}
                transition-all duration-300 
                hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
              `}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${f.iconBg} mb-4`}>
                  <Icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h4 className="text-base font-bold mb-2 text-gray-900">{f.title}</h4>
                <p className="text-sm leading-relaxed text-gray-700">{f.description}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white/80 py-4 shadow-sm">
        <Marquee direction="right" speed={42} className="px-4">
          {features.banners.map((b) => (
            <div
              key={b.title}
              className="relative h-[150px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-gray-100 sm:h-[170px] sm:w-[320px]"
            >
              <img
                src={resolveBannerImage(b.imagePrompt)}
                alt={b.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-black/0" />
              <div className="relative flex h-full flex-col justify-end p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
                  AROMAZUR
                </div>
                <div className="mt-1 text-base font-semibold leading-tight text-white sm:text-[17px]">
                  {b.title}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-white/85">{b.description}</div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </HomeSection>
  );
}
