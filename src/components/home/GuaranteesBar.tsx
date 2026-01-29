import { useHomeConfig } from '@/hooks/useHomeConfig';

export function GuaranteesBar() {
  const { guarantees, resolveIcon } = useHomeConfig();

  return (
    <section className="bg-[color:var(--ds-surface-alt)] border-y border-black/10 py-4">
      <div className="container-custom">
        <div className="flex justify-center items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-hide">
          {guarantees.map((g, idx) => {
            const Icon = resolveIcon(g.iconId);
            return (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <Icon className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-sm text-gray-900 font-medium whitespace-nowrap">{g.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
