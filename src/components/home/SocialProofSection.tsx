import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';

const TESTIMONIALS = [
  {
    quote:
      'The scents are clean, premium, and the experience feels truly elevated. Setup was effortless and the packaging is beautiful.',
    name: 'Ayesha',
    meta: 'Verified customer'
  },
  {
    quote:
      'We use it in our studio space—guests constantly ask what the fragrance is. It’s become part of our brand experience.',
    name: 'Daniel',
    meta: 'Small business owner'
  },
  {
    quote:
      'Fast shipping, great support, and the fragrance lasts. Everything feels well-designed and premium.',
    name: 'Mina',
    meta: 'Verified customer'
  }
];

export function SocialProofSection() {
  return (
    <HomeSection
      id="social-proof"
      eyebrow="Customer Reviews"
      title="What our customers say"
      description="Join thousands of satisfied customers who trust Scentiment"
      className="bg-[#f5f5f5]"
    >
      {/* Reviews Stats */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-12 p-8 bg-white rounded-xl max-w-3xl mx-auto shadow-sm">
        <div className="text-center sm:text-left">
          <div className="text-6xl font-bold text-[#0066cc] leading-none mb-3">4.9</div>
          <div className="text-2xl text-[#d4af37] mb-3">★★★★★</div>
          <div className="text-sm text-gray-500">Based on 2,847 verified reviews</div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8">5★</span>
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#d4af37] rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="w-10 text-left">92%</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8">4★</span>
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#d4af37] rounded-full" style={{ width: '6%' }}></div>
            </div>
            <span className="w-10 text-left">6%</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8">3★</span>
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#d4af37] rounded-full" style={{ width: '2%' }}></div>
            </div>
            <span className="w-10 text-left">2%</span>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <FadeIn key={t.name} delay={0.05 * idx}>
            <div className="h-full rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#0066cc] flex items-center justify-center font-semibold text-white text-base flex-shrink-0">
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-gray-900 mb-1">{t.name}</div>
                  <div className="text-xs text-[#22c55e] font-medium flex items-center gap-1">
                    ✓ Verified Purchase
                  </div>
                </div>
                <div className="text-[#d4af37] text-lg flex-shrink-0">★★★★★</div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-2.5 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-[#f5f5f5] rounded-sm flex items-center justify-center text-lg flex-shrink-0">
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

