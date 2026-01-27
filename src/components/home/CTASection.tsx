import { HomeSection } from '@/components/home/HomeSection';

export function CTASection() {
  return (
    <HomeSection
      id="cta"
      eyebrow="Newsletter"
      title="Get 10% off your first order"
      description="Subscribe to receive exclusive offers, new arrivals, and fragrance tips delivered to your inbox."
      className="newsletter-gradient"
    >
      <div className="max-w-2xl mx-auto text-center text-white">
        <form 
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            const button = e.currentTarget.querySelector('button');
            if (button) {
              button.textContent = '✓ Subscribed!';
              button.style.background = '#22c55e';
            }
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="flex-1 px-5 py-3.5 border-none rounded-md text-base outline-none text-gray-900"
          />
          <button
            type="submit"
            className="px-7 py-3.5 bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white border-none rounded-md font-semibold text-sm cursor-pointer transition-all duration-150 whitespace-nowrap hover:from-[#333] hover:to-[#4a4a4a] hover:-translate-y-0.5 hover:shadow-lg"
          >
            Subscribe
          </button>
        </form>
        <p className="text-sm opacity-80">🔒 No spam. Unsubscribe anytime with one click.</p>
      </div>
    </HomeSection>
  );
}

