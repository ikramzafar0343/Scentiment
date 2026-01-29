import { useState } from 'react';
import { HiLockClosed } from 'react-icons/hi';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function CTASection() {
  const [subscribed, setSubscribed] = useState(false);
  const { cta } = useHomeConfig();

  return (
    <section id="cta" className="newsletter-gradient py-16 sm:py-20">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">{cta.eyebrow}</div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              {cta.description}
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 sm:mt-12">
          <div className="max-w-2xl mx-auto text-center">
            <form 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <input
                type="email"
                placeholder={cta.emailPlaceholder}
                required
                className="flex-1 rounded-md border border-white/15 bg-white/95 px-5 py-3.5 text-base text-gray-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                disabled={subscribed}
              />
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={subscribed}
                className="h-[52px] px-7 text-sm"
              >
                {subscribed ? cta.subscribedButtonText : cta.subscribeButtonText}
              </Button>
            </form>
            <p className="text-sm text-white/90 flex items-center justify-center gap-1.5">
              <HiLockClosed className="w-4 h-4 text-[color:var(--ds-gold)] shrink-0" />
              {cta.privacyText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
