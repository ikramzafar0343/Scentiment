import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Building2, Home, Sparkles, Users } from 'lucide-react';

const USE_CASES = [
  { 
    title: 'Residential', 
    description: 'Transform your home into a luxury retreat. Create signature scents for every room that welcome you and your guests daily.', 
    Icon: Home,
    gradient: 'from-amber-200/30 via-amber-100/30 to-amber-50/40',
    iconBg: 'bg-amber-200/20',
    iconColor: 'text-amber-700'
  },
  { 
    title: 'Retail & Boutiques', 
    description: 'Enhance the shopping experience with memorable fragrance. Create an atmosphere that turns visitors into loyal customers.', 
    Icon: Sparkles,
    gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
    iconBg: 'bg-purple-200/20',
    iconColor: 'text-purple-700'
  },
  { 
    title: 'Workplaces', 
    description: 'Improve focus and well-being in office spaces. Subtle, professional fragrances that enhance productivity and comfort.', 
    Icon: Building2,
    gradient: 'from-blue-200/30 via-blue-100/30 to-blue-50/40',
    iconBg: 'bg-blue-200/20',
    iconColor: 'text-blue-700'
  },
  { 
    title: 'Hospitality', 
    description: 'Deliver consistent, premium experiences for hotels, spas, and venues. Professional-grade solutions for guest satisfaction.', 
    Icon: Users,
    gradient: 'from-teal-200/30 via-teal-100/30 to-teal-50/40',
    iconBg: 'bg-teal-200/20',
    iconColor: 'text-teal-700'
  }
];

export function UseCasesSection() {
  return (
    <HomeSection
      id="use-cases"
      eyebrow="Use Cases"
      title="Perfect for every space"
      description="From residential homes to commercial spaces, our premium fragrances enhance any environment with luxury scents."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map((u, idx) => (
          <FadeIn key={u.title} delay={0.04 * idx}>
            <div className={`
              h-full rounded-xl border border-gray-200/50 p-6
              bg-gradient-to-br ${u.gradient}
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
            `}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${u.iconBg} mb-4`}>
                <u.Icon className={`h-6 w-6 ${u.iconColor}`} />
              </div>
              <div className="text-base font-bold text-gray-900 mb-2">{u.title}</div>
              <div className="text-sm leading-relaxed text-gray-700">{u.description}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

