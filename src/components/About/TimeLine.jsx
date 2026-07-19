import React from "react";

const timeline = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Kiruthika Santhoshni starts NoviBakes from her home kitchen in Salem — baking custom cakes for friends and family with a whole lot of love.",
  },
  {
    year: "2020",
    title: "Word Spreads",
    description:
      "What began as birthday cakes for neighbours quickly gained a reputation. WhatsApp orders started flowing in from across Salem.",
  },
  {
    year: "2021",
    title: "Full Custom Menu",
    description:
      "The menu expands to include brownies, cupcakes, jar desserts, and fully themed custom cakes — all made fresh for every order.",
  },
  {
    year: "2022",
    title: "Weddings & Events",
    description:
      "NoviBakes becomes a trusted name for wedding cakes and corporate events, delivering multi-tier cakes across Salem and nearby districts.",
  },
  {
    year: "2023",
    title: "Online Ordering",
    description:
      "A seamless online store and WhatsApp-based ordering system makes it easier than ever for customers to place, track, and customise their orders.",
  },
  {
    year: "2024",
    title: "Growing Strong",
    description:
      "Hundreds of happy customers, countless celebrations sweetened, and the same homemade quality that started it all — still baked with love.",
  },
];

const TimeLine = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-800">Our Journey</h2>
          <div className="mx-auto mb-4 h-1 w-20 rounded-full" style={{ backgroundColor: "#ec4899" }} />
          <p className="mx-auto max-w-2xl text-slate-800">
            From a small kitchen dream to a beloved bakery known for creating
            memorable sweet experiences.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Mobile line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 md:hidden" style={{ backgroundColor: "#E8D5A0" }} />
          {/* Desktop center line */}
          <div className="absolute left-1/2 top-0 bottom-0 hidden w-0.5 -translate-x-1/2 md:block" style={{ backgroundColor: "#E8D5A0" }} />

          <div className="space-y-8 md:space-y-0">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-10 md:grid md:grid-cols-2 md:gap-12 md:items-center ${
                  index % 2 !== 0 ? "md:rtl" : ""
                }`}
              >
                {/* Desktop Year Circle */}
                <div
                  className="absolute left-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full shadow-lg md:flex"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  <span className="text-xs font-bold text-white">{item.year}</span>
                </div>

                {/* Mobile Dot */}
                <div
                  className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full md:hidden"
                  style={{ backgroundColor: "#ec4899" }}
                />

                {/* Content */}
                <div
                  className={`pl-12 md:pl-0 ${
                    index % 2 === 0
                      ? "md:pr-10 md:text-right"
                      : "md:col-start-2 md:pl-10 md:text-left"
                  }`}
                >
                  <div className="rounded-2xl border border-rose-50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                    {/* Mobile Year Badge */}
                    <span
                      className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold text-white md:hidden"
                      style={{ backgroundColor: "#ec4899" }}
                    >
                      {item.year}
                    </span>

                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-800">
                      {item.description}
                    </p>
                  </div>
                </div>

                {index % 2 === 0 && <div className="hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeLine;
