import { Header } from "@/components/header";
import { brand } from "@/lib/brand";

const LIVE_TOOLS = [
  {
    label: "Pattern Generator",
    desc: "Seamless tiling. Damask to deco. KDP-ready.",
    href: "https://shebuilds-pattern-generator.vercel.app",
  },
  {
    label: "Chibi Generator",
    desc: "AI prompts for kawaii character art.",
    href: "https://shebuilds-chibi-generator.vercel.app",
  },
];

export default function Page() {
  return (
    <>
      <Header />

      <section className="mx-auto max-w-[1600px] px-6 pt-12 pb-6 lg:px-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
            In the lab
          </span>
        </div>

        <p className="label mb-3">SheBuilds Toolkit · {brand.toolNoun}</p>
        <h1 className="font-display text-display-lg leading-[0.95] tracking-tight">
          <span className="text-foil">{brand.toolNoun}</span>,{" "}
          <em className="font-display font-light italic text-cream-muted">soon</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-muted">
          {brand.subTagline}
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-10">
        <div className="paper rounded-lg border border-cream/[0.06] p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="label mb-3">What's coming</p>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-cream">
                {brand.tagline}
              </h2>
              <p className="mt-4 text-cream-muted">
                Scaffolded, branded, and queued behind the SheBuilds toolkit
                rollout. We ship one tool at a time so each one is genuinely
                useful — not bloated, not paywalled, not cluttered with login
                walls. Same editorial-luxe aesthetic. Same zero-watermark
                exports. No login, no limits.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={brand.links.school}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gold-shimmer bg-[length:200%_200%] px-5 py-2.5 text-sm font-medium text-ink shadow-gold-soft transition-all hover:shadow-gold hover:bg-[position:100%_50%]"
                >
                  Join the School · $33/mo ↗
                </a>
                <a
                  href={brand.links.home}
                  className="rounded-full border border-gold/40 px-5 py-2.5 text-sm text-cream transition-all hover:border-gold hover:bg-gold/5"
                >
                  All tools
                </a>
              </div>

              <p className="mt-5 font-mono text-[11px] leading-relaxed text-cream-muted/70">
                Members get tools as they ship — plus the templates,
                step-by-step guides, and live coaching that turn a generator
                into a sellable product.
              </p>
            </div>

            <div>
              <p className="label mb-3">Live today</p>
              <ul className="space-y-3">
                {LIVE_TOOLS.map((t) => (
                  <li key={t.label}>
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-md border border-cream/[0.08] bg-surface/40 p-4 transition-all hover:border-gold/40 hover:bg-gold/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-lg leading-tight tracking-tight text-cream">
                            {t.label}
                          </p>
                          <p className="mt-1 text-sm text-cream-muted">
                            {t.desc}
                          </p>
                        </div>
                        <span className="font-mono text-[11px] text-gold transition-transform group-hover:translate-x-1">
                          ↗
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-md border border-cream/[0.06] bg-bg/40 p-4">
                <p className="label mb-2">Built for</p>
                <p className="text-sm leading-relaxed text-cream-muted">
                  Etsy sellers, KDP authors, sticker shops, Payhip stores,
                  TikTok shop creators — anyone turning ideas into digital
                  income.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] tracking-wider text-cream-muted/60">
          Made by SheBuilds Digital · Free, forever ·{" "}
          <a
            href={brand.links.school}
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:text-gold-light"
          >
            See the school
          </a>
        </p>
      </section>
    </>
  );
}
