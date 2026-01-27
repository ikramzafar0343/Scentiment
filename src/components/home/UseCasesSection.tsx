import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Building2, Home, Sparkles, Users } from 'lucide-react';

const USE_CASES = [
  { title: 'Homes', description: 'Create a signature atmosphere for everyday living.', Icon: Home },
  { title: 'Boutiques', description: 'Turn visitors into customers with a memorable vibe.', Icon: Sparkles },
  { title: 'Offices', description: 'Elevate focus and comfort with subtle fragrance.', Icon: Building2 },
  { title: 'Hospitality', description: 'Deliver a premium guest experience with consistency.', Icon: Users }
];

export function UseCasesSection() {
  return (
    <HomeSection
      id="use-cases"
      eyebrow="Use Cases"
      title="Made for modern spaces"
      description="Whether you're building a calm home or a premium customer experience, fragrance changes how a space feels."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map((u, idx) => (
          <FadeIn key={u.title} delay={0.04 * idx}>
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-900">
                <u.Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-base font-semibold text-gray-900">{u.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-gray-600">{u.description}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

