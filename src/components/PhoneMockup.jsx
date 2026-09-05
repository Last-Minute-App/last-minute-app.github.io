/**
 * Phone mockups of the ACTUAL tiphop screens.
 *
 * WHY THIS EXISTS
 * ---------------
 * The landing page used four Unsplash stock photos, three of them with
 * alt="App screenshot N" underneath a heading that promised screenshots. One
 * was a meditation app reading "Add a new course" — nothing to do with this
 * product. Presenting unrelated stock imagery as the product is both
 * off-message and, for the three under that heading, not true.
 *
 * These are drawn from the app's REAL design tokens and real layout:
 *   primary #FF6B35 · background #F8F9FA · surface #FFFFFF
 *   text #0F1B2D · success #059669
 * (src/theme/colors.ts in the mobile repo — keep them in step if that changes.)
 *
 * Why not literal screenshots: a real capture of the live feed would publish
 * actual partners' offers, prices and shop names on a public marketing page,
 * which is their call and not ours. Seeding realistic-looking fake shops into
 * production to photograph them would break the "all test data is named
 * E2E Test_" rule that keeps the admin dashboard trustworthy. A faithful
 * illustration of our own UI has neither problem — and needs no external
 * image host, so nothing here can 404 or slow the page down.
 */

const C = {
  primary: "#FF6B35",
  bg: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#0F1B2D",
  muted: "#6B7280",
  faint: "#9CA3AF",
  success: "#059669",
  border: "#E5E7EB",
  chip: "#F3F4F6",
};

const COPY = {
  en: {
    explore: "Explore",
    near: "Near you",
    all: "All",
    food: "Food",
    bakery: "Sweets",
    left: "left",
    save: "Save",
    claim: "Claim offer",
    show: "SHOW THIS TO THE PARTNER",
    backup: "Backup code",
    ready: "Ready to redeem — hop over!",
    pickup: "Take-away",
    hm: (h, m) => `${h}h ${m}m`,
    shop1: "Bakery Stari", item1: "Butter croissants ×4",
    shop2: "Kouzina", item2: "Soup of the day",
    tabs: ["Explore", "Map", "My Offers", "Profile"],
    about: "About this offer",
    desc: "Fresh this morning, and too good to bin at closing.",
  },
  el: {
    explore: "Εξερεύνηση",
    near: "Κοντά σου",
    all: "Όλες",
    food: "Φαγητό",
    bakery: "Γλυκά",
    left: "απομένουν",
    save: "Εξοικονόμηση",
    claim: "Δέσμευση Προσφοράς",
    show: "ΔΕΙΞΤΕ ΑΥΤΟ ΣΤΟΝ ΣΥΝΕΡΓΑΤΗ",
    backup: "Εφεδρικός Κωδικός",
    ready: "Έτοιμη για εξαργύρωση — πέρνα!",
    pickup: "Παραλαβή",
    hm: (h, m) => `${h}ώ ${m}λ`,
    shop1: "Φούρνος Στάρι", item1: "Κρουασάν βουτύρου ×4",
    shop2: "Κουζίνα", item2: "Σούπα ημέρας",
    tabs: ["Εξερεύνηση", "Χάρτης", "Προσφορές μου", "Προφίλ"],
    about: "Σχετικά με την προσφορά",
    desc: "Φρέσκα από το πρωί — κρίμα να πάνε χαμένα.",
  },
};

/** Deterministic little QR-ish block. Decorative only — never a real code. */
function QrArt() {
  const cells = [];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      // Fixed pattern (no Math.random) so the mockup never flickers between
      // renders and looks identical to every visitor.
      const corner =
        (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
      const on = corner || (r * 7 + c * 5) % 3 === 0;
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * 9} y={r * 9} width="8" height="8" rx="1.5" fill={C.text} />);
    }
  }
  return (
    <svg viewBox="0 0 99 99" width="112" height="112" role="img" aria-label="">
      <rect width="99" height="99" fill="#fff" />
      {cells}
    </svg>
  );
}

function Chip({ children, active }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "4px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        color: active ? "#fff" : C.muted,
        background: active ? C.primary : C.chip,
      }}
    >
      {children}
    </span>
  );
}

function OfferCard({ t, title, shop, was, now, off, time, tag }) {
  return (
    <div style={{ background: C.surface, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,27,45,.10)" }}>
      <div style={{ position: "relative", height: 58, background: "linear-gradient(135deg,#FFE8DE,#FFD2BF)" }}>
        <span style={{ position: "absolute", top: 6, left: 6, background: C.primary, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 6px", borderRadius: 6 }}>
          −{off}%
        </span>
        <span style={{ position: "absolute", top: 6, right: 6, background: "rgba(17,24,39,.72)", color: "#fff", fontSize: 8, fontWeight: 800, padding: "3px 6px", borderRadius: 999 }}>
          {time}
        </span>
      </div>
      <div style={{ padding: "7px 9px 9px" }}>
        <div style={{ fontSize: 8, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{shop}</div>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.text, marginTop: 1, lineHeight: 1.2 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: C.success }}>{now}</span>
          <span style={{ fontSize: 9, color: C.faint, textDecoration: "line-through" }}>{was}</span>
          <span style={{ marginLeft: "auto", fontSize: 8, color: C.muted, background: C.chip, padding: "2px 6px", borderRadius: 999 }}>{tag}</span>
        </div>
      </div>
    </div>
  );
}

/** One phone. `screen` = 'explore' | 'offer' | 'redeem'. */
export default function PhoneMockup({ screen = "explore", lang = "en", className = "" }) {
  const t = COPY[lang] || COPY.en;

  return (
    <div
      className={className}
      style={{
        width: 208,
        borderRadius: 30,
        padding: 7,
        background: "#0F1B2D",
        boxShadow: "0 18px 40px rgba(15,27,45,.28)",
        margin: "0 auto",
      }}
    >
      <div style={{ borderRadius: 24, overflow: "hidden", background: C.bg, position: "relative" }}>
        {/* notch */}
        <div style={{ height: 16, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 52, height: 5, borderRadius: 999, background: "#0F1B2D", opacity: .85 }} />
        </div>

        <div style={{ padding: 9, minHeight: 300 }}>
          {screen === "explore" && (
            <>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{t.explore}</div>
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 7 }}>{t.near}</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                <Chip active>{t.all}</Chip>
                <Chip>{t.food}</Chip>
                <Chip>{t.bakery}</Chip>
              </div>
              <div style={{ display: "grid", gap: 7 }}>
                <OfferCard t={t} title={t.item1} shop={t.shop1} was="8,00 €" now="4,80 €" off="40" time={t.hm(5, 43)} tag={`3 ${t.left}`} />
                <OfferCard t={t} title={t.item2} shop={t.shop2} was="6,50 €" now="3,25 €" off="50" time={t.hm(1, 12)} tag={t.pickup} />
              </div>
            </>
          )}

          {screen === "offer" && (
            <>
              <div style={{ height: 74, borderRadius: 12, background: "linear-gradient(135deg,#FFE8DE,#FFC7AE)", position: "relative", marginBottom: 9 }}>
                <span style={{ position: "absolute", bottom: 6, left: 6, background: C.primary, color: "#fff", fontSize: 10, fontWeight: 900, padding: "4px 8px", borderRadius: 7 }}>
                  −40%
                </span>
              </div>
              <div style={{ fontSize: 8, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.shop1}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: C.text, lineHeight: 1.2 }}>{t.item1}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: C.success }}>4,80 €</span>
                <span style={{ fontSize: 10, color: C.faint, textDecoration: "line-through" }}>8,00 €</span>
              </div>
              <div style={{ fontSize: 8, color: C.success, fontWeight: 700, background: "#ECFDF5", display: "inline-block", padding: "3px 7px", borderRadius: 999, marginTop: 5 }}>
                {t.save} 3,20 €
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, color: C.text, marginTop: 10 }}>{t.about}</div>
              <div style={{ fontSize: 8.5, color: C.muted, lineHeight: 1.45, marginTop: 2 }}>{t.desc}</div>
              <div style={{ marginTop: 12, background: C.primary, color: "#fff", textAlign: "center", fontSize: 11, fontWeight: 800, padding: "9px 0", borderRadius: 10 }}>
                {t.claim}
              </div>
            </>
          )}

          {screen === "redeem" && (
            <>
              <div style={{ background: "#FFF7ED", border: `1px solid ${C.primary}33`, borderRadius: 10, padding: 8, marginBottom: 9 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.primary, lineHeight: 1.25 }}>{t.ready}</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 12, padding: 10, textAlign: "center", boxShadow: "0 1px 3px rgba(15,27,45,.10)" }}>
                <div style={{ fontSize: 7.5, fontWeight: 800, color: C.muted, letterSpacing: .4, marginBottom: 7 }}>{t.show}</div>
                <div style={{ display: "inline-block", padding: 7, background: "#fff", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <QrArt />
                </div>
                <div style={{ fontSize: 7.5, color: C.faint, marginTop: 7 }}>{t.backup}</div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 3, color: C.text, background: C.chip, borderRadius: 7, padding: "5px 0", marginTop: 3 }}>
                  5VUVH9
                </div>
              </div>
            </>
          )}
        </div>

        {/* tab bar */}
        <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, background: C.surface, padding: "6px 2px 8px" }}>
          {t.tabs.map((label, i) => (
            <div key={label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 12, height: 12, margin: "0 auto 3px", borderRadius: 4, background: i === 0 ? C.primary : "#D1D5DB" }} />
              <div style={{ fontSize: 6.5, fontWeight: 700, color: i === 0 ? C.primary : C.faint }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
