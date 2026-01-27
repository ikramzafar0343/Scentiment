export function GuaranteesBar() {
  const guarantees = [
    { icon: '🌿', text: 'IFRA-certified formulas' },
    { icon: '🐰', text: 'Cruelty-free & not tested on animals' },
    { icon: '💨', text: 'Cold diffusion technology, no water needed' },
    { icon: '👶', text: 'Safe for children & pets' },
    { icon: '✨', text: 'Premium quality ingredients' }
  ];

  return (
    <section className="bg-[#faf8f5] border-t border-[#e0e0e0] border-b border-[#e0e0e0] py-5">
      <div className="container-custom">
        <div className="flex justify-center items-center gap-10 flex-wrap">
          {guarantees.map((g, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span className="text-xl">{g.icon}</span>
              <span className="text-sm text-gray-900 font-medium">{g.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
