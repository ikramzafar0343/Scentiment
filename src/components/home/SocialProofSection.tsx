import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function SocialProofSection() {
  const { socialProof } = useHomeConfig();
  const { section, testimonials, reviewStats } = socialProof;

  return (
    <HomeSection
      id="social-proof"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="bg-[color:var(--ds-surface-alt)]"
    >
      {/* Reviews Stats */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-12 p-8 bg-white rounded-xl max-w-3xl mx-auto shadow-sm">
        <div className="text-center sm:text-left">
          <div className="text-6xl font-bold text-[color:var(--ds-primary)] leading-none mb-3">{reviewStats.averageRating}</div>
          <div className="text-2xl text-[color:var(--ds-gold)] mb-3">★★★★★</div>
          <div className="text-sm text-gray-500">Based on {reviewStats.totalReviews.toLocaleString()} verified reviews</div>
        </div>
        <div className="flex flex-col gap-2.5">
          {reviewStats.ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3 text-sm">
              <span className="w-8">{dist.stars}★</span>
              <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[color:var(--ds-gold)] rounded-full" style={{ width: `${dist.percentage}%` }}></div>
              </div>
              <span className="w-10 text-left">{dist.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <FadeIn key={t.name} delay={0.05 * idx}>
            <div className="h-full rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-black/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[color:var(--ds-primary)] flex items-center justify-center font-semibold text-white text-base flex-shrink-0">
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-gray-900 mb-1">{t.name}</div>
                  <div className="text-xs text-[#22c55e] font-medium flex items-center gap-1">
                    ✓ Verified Purchase
                  </div>
                </div>
                <div className="text-[color:var(--ds-gold)] text-lg flex-shrink-0">★★★★★</div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-2.5 pt-4 border-t border-black/10">
                <div className="w-10 h-10 bg-[color:var(--ds-surface-alt)] rounded-sm flex items-center justify-center text-lg flex-shrink-0">
                  💨
                </div>
                <span className="text-xs text-gray-500">Mini Diffuser</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}
