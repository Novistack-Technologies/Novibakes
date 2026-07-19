import { useFirestore } from "../../hooks/useFirestore";

const DEFAULT_MESSAGES = [
  'Free Delivery on Orders Above ₹500',
  'Fresh Baked Daily',
  'Custom Cakes Available',
  'Order via WhatsApp',
  '10% Off on First Order',
];

const ScrollingBanner = () => {
  const { data: fsTexts } = useFirestore("scrollingTexts", [], "order");

  const messages = fsTexts.length
    ? fsTexts.filter(t => t.active !== false).map(t => t.text)
    : DEFAULT_MESSAGES;

  // Repeat messages multiple times for seamless loop
  const repeated = [...messages];

    return (
    <div className="bg-[#ec4899] overflow-hidden">
      <div className="flex w-max animate-marquee py-2.5">
        {[...messages].map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-6 text-white text-sm font-medium tracking-wide whitespace-nowrap"
          >
            {msg}
            <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;
