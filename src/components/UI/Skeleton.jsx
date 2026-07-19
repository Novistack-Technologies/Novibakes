import React from "react";

/* ── Base shimmer block ── */
export const Skeleton = ({ className = "", style = {} }) => (
  <div className={`relative overflow-hidden rounded-lg bg-slate-100 ${className}`} style={style}>
    <div
      className="absolute inset-0 -translate-x-full animate-shimmer"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)" }}
    />
  </div>
);

/* ── Shared: Navbar placeholder (keeps spacing, navbar is always visible) ── */
const NavSpacer = () => <div className="h-16" />;

/* ════════════════════════════════════
   HOME PAGE
════════════════════════════════════ */
export const HomeSkeleton = () => (
  <div className="min-h-screen bg-white">
    <NavSpacer />
    {/* Hero */}
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fdf2f8 0%,#fff5fb 100%)" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </div>
        <Skeleton className="w-full lg:w-[420px] aspect-square rounded-3xl flex-shrink-0" />
      </div>
    </div>

    {/* Feature cards */}
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Skeleton className="h-8 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 w-64 mx-auto mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <Skeleton className="w-10 h-10 rounded-xl mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Featured products */}
    <div className="bg-[#fdf2f8] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-52 mx-auto mb-2" />
        <Skeleton className="h-4 w-72 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>

    {/* Testimonials strip */}
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Skeleton className="h-8 w-48 mx-auto mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex gap-0.5">{Array.from({length:5}).map((_,j)=><Skeleton key={j} className="w-4 h-4 rounded" />)}</div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   PRODUCT CARD (reusable)
════════════════════════════════════ */
export const ProductCardSkeleton = () => (
  <div className="bg-white border border-rose-50 rounded-2xl shadow-md p-3 flex flex-col">
    <Skeleton className="w-full h-40 mb-3 rounded-lg" />
    <Skeleton className="w-20 h-4 mb-3 mx-auto rounded-full" />
    <Skeleton className="w-3/4 h-4 mb-2 mx-auto" />
    <Skeleton className="w-full h-3 mb-1.5" />
    <Skeleton className="w-5/6 h-3 mb-4 mx-auto" />
    <Skeleton className="w-24 h-4 mb-3 mx-auto rounded-full" />
    <Skeleton className="w-20 h-5 mb-4 mx-auto" />
    <Skeleton className="w-full h-9 rounded-full" />
  </div>
);

export const ProductGridSkeleton = ({ count = 9 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
  </div>
);

/* ════════════════════════════════════
   SHOP PAGE (/shop)
════════════════════════════════════ */
export const ShopSkeleton = () => (
  <div className="min-h-screen bg-white">
    <NavSpacer />
    {/* Scrolling banner strip */}
    <Skeleton className="w-full h-10 rounded-none" />
    {/* Banner carousel */}
    <Skeleton className="w-full h-48 sm:h-64 rounded-none mt-1" />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
      <Skeleton className="h-9 w-48 mx-auto mb-3" />
      <Skeleton className="h-4 w-80 mx-auto mb-10" />
      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ProductGridSkeleton count={9} />
      <div className="flex justify-center mt-12 mb-8">
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   SHOP ALL PAGE (/shop/all)
════════════════════════════════════ */
export const SidebarSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-2xl py-5 shadow-sm px-4 space-y-4">
    <Skeleton className="w-24 h-3" />
    <Skeleton className="w-16 h-5" />
    <div className="pt-2 space-y-2">
      {[90, 70, 75, 65].map((w, i) => <Skeleton key={i} className="h-9 rounded-xl" style={{ width: `${w}%` }} />)}
    </div>
    <div className="border-t border-slate-100 pt-4 space-y-2">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="h-8 rounded-xl w-full" />
      <Skeleton className="h-5 w-full rounded-full mt-2" />
    </div>
    <div className="border-t border-slate-100 pt-4 space-y-2">
      <Skeleton className="w-16 h-3" />
      {[90, 80, 85, 75, 80].map((w, i) => <Skeleton key={i} className="h-9 rounded-xl" style={{ width: `${w}%` }} />)}
    </div>
  </div>
);

export const ShopAllSkeleton = () => (
  <div className="min-h-screen bg-[#f8fafc]">
    <NavSpacer />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-6 w-36" />
      </div>
      <Skeleton className="h-9 w-64 rounded-full" />
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex gap-6">
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <SidebarSkeleton />
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <ProductGridSkeleton count={9} />
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   PRODUCT DETAIL PAGE (/product/:id)
════════════════════════════════════ */
export const ProductPageSkeleton = () => (
  <div className="min-h-screen bg-white pt-16 pb-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
      <div className="pt-6 pb-4">
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <Skeleton className="w-full aspect-square rounded-2xl" />
        {/* Details */}
        <div className="space-y-5 pt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="flex gap-1.5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-5 h-5 rounded" />)}
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-16 rounded-full" />)}
            </div>
          </div>
          <Skeleton className="h-14 w-28 rounded-full" />
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   ABOUT PAGE
════════════════════════════════════ */
export const AboutSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    {/* Hero */}
    <Skeleton className="w-full h-64 rounded-none" />

    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      {/* Heading */}
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-1 w-20 mx-auto rounded-full" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-4 w-5/6 max-w-xl mx-auto" />
      </div>

      {/* Two col content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Skeleton className="w-full aspect-video rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-10 w-24 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 text-center space-y-3 shadow-sm">
            <Skeleton className="w-20 h-20 rounded-full mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   CONTACT PAGE
════════════════════════════════════ */
export const ContactSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center space-y-3 mb-14">
        <Skeleton className="h-10 w-56 mx-auto" />
        <Skeleton className="h-1 w-20 mx-auto rounded-full" />
        <Skeleton className="h-4 w-72 mx-auto" />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 text-center space-y-3 shadow-sm">
            <Skeleton className="w-10 h-10 rounded-xl mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        ))}
      </div>

      {/* Form + map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
        <Skeleton className="w-full h-72 lg:h-full rounded-2xl" />
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   SERVICES PAGE
════════════════════════════════════ */
export const ServicesSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    {/* Hero */}
    <Skeleton className="w-full h-72 rounded-none" />

    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center space-y-3 mb-14">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-1 w-20 mx-auto rounded-full" />
        <Skeleton className="h-4 w-72 mx-auto" />
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <Skeleton className="w-11 h-11 rounded-xl mx-auto" />
            <Skeleton className="h-5 w-40 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6 mx-auto" />
            <Skeleton className="h-3 w-4/6 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto rounded-full mt-2" />
          </div>
        ))}
      </div>

      {/* Process steps */}
      <div className="mt-20 text-center mb-10">
        <Skeleton className="h-8 w-48 mx-auto mb-3" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-3">
            <Skeleton className="w-14 h-14 rounded-full mx-auto" />
            <Skeleton className="h-4 w-28 mx-auto" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   CART PAGE
════════════════════════════════════ */
export const CartSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <Skeleton className="h-8 w-24 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-4">
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-24 rounded-full" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 h-fit">
          <Skeleton className="h-6 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <Skeleton className="h-px w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-12 w-full rounded-full mt-2" />
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   CHECKOUT PAGE
════════════════════════════════════ */
export const CheckoutSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <Skeleton className="h-8 w-36 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Form */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, section) => (
            <div key={section} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-11 rounded-xl" />
                <Skeleton className="h-11 rounded-xl" />
              </div>
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
        {/* Order summary */}
        <div className="space-y-4 h-fit">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   TRACK ORDER PAGE
════════════════════════════════════ */
export const TrackOrderSkeleton = () => (
  <div className="min-h-screen bg-white pt-16 flex items-center justify-center px-4">
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="w-14 h-14 rounded-full mx-auto" />
        <Skeleton className="h-7 w-40 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   PRIVACY / TERMS (text pages)
════════════════════════════════════ */
export const TextPageSkeleton = () => (
  <div className="min-h-screen bg-white pt-16">
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-1 w-20 rounded-full" />
      <Skeleton className="h-4 w-48" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2 pt-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
