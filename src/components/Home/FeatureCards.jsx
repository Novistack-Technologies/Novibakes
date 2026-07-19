import breadBasket from "../../assets/bread-basket.png";
import cupcake from "../../assets/cupcake.png";

export default function BakeryCards() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full pt-0">
        {/* Card 1 — Sweet Savings */}
        <div className="bg-[#f3e3cf] rounded-2xl p-6 flex flex-col justify-between h-[280px] shadow-sm">
          <div>
            <h3 className="text-[#3a2418] font-bold text-xl mb-2">
              Sweet Savings!
            </h3>
            <p className="text-[#5c3a28] text-sm leading-snug">
              Enjoy 20% Off On All Bakery Items This Weekend Only!
            </p>
          </div>
          <div className="flex items-end justify-between">
            <button className="bg-[#c44a2a] hover:bg-[#a83d20] text-white text-xs font-semibold px-4 py-2 rounded-full transition">
              Shop Now
            </button>
            <img
              src={breadBasket}
              alt="Basket of fresh breads"
              width={512}
              height={512}
              loading="lazy"
              className="w-30 h-30 object-contain -mb-2"
            />
          </div>
        </div>

        {/* Card 2 — Fresh Bakes Daily */}
        <div className="bg-[#3a1a12] rounded-2xl p-6 flex flex-col items-center justify-between h-[280px] shadow-sm text-center relative overflow-hidden">
          <div className="flex justify-between w-full text-2xl">
            <span>🧁</span>
            <span>🍰</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              Fresh Bakes Daily!
            </h3>
            <p className="text-[#e8d4c4] text-sm leading-snug">
              Visit Our Store For Freshly Baked Goods Every Morning.
            </p>
          </div>
          <button className="bg-[#c44a2a] hover:bg-[#a83d20] text-white text-xs font-semibold px-4 py-2 rounded-full transition">
            Order Now
          </button>
        </div>

        {/* Card 3 — Celebrate With Us */}
        <div className="bg-[#f3e3cf] rounded-2xl p-6 flex flex-col justify-between h-[280px] shadow-sm">
          <div>
            <h3 className="text-[#3a2418] font-bold text-xl mb-2">
              Celebrate With Us!
            </h3>
            <p className="text-[#5c3a28] text-sm leading-snug">
              Order Custom Cakes For Birthdays, Weddings, And Special Events.
            </p>
          </div>
          <div className="flex items-end justify-between">
            <button className="bg-[#c44a2a] hover:bg-[#a83d20] text-white text-xs font-semibold px-4 py-2 rounded-full transition">
              Order Now
            </button>
            <img
              src={cupcake}
              alt="Cupcake with sprinkles"
              width={512}
              height={512}
              loading="lazy"
              className="w-24 h-24 object-contain -mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
