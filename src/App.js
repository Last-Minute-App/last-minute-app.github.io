import { useState, useEffect } from "react";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Bell, TrendingDown, Smartphone, Heart, UtensilsCrossed, Bookmark, Share2, ShieldCheck, Languages, Gift, Megaphone } from "lucide-react";
import tiphopLogo from "@/assets/tiphop_logo.png";
import { translations } from "@/translations";
import PhoneMockup from "@/components/PhoneMockup";

// Root-relative on purpose: this site is served from BOTH
// last-minute-app.github.io and the custom domain tiphop.gr, and the app
// lives at /dashboard/ on each. The previous hard-coded github.io URL
// pushed every tiphop.gr visitor onto a different origin, which
// (a) split localStorage, so a session started on tiphop.gr didn't carry
// over, and (b) meant the "Add to Home Screen" prompt — and therefore the
// installed app — belonged to github.io rather than tiphop.gr.
const MOBILE_APP_URL = "/dashboard/";

// Contact form delivery. Posts to OUR OWN API's public /contact endpoint, which
// reuses the app's existing SMTP + support inbox (SUPPORT_INBOX = the address
// below) and also stores the message in the admin Feedback tab. No third party.
// On any network/API error we fall back to the visitor's mail client so a
// message is never silently lost.
const CONTACT_EMAIL = "tiphop.app@gmail.com";
const CONTACT_ENDPOINT = "https://last-minute-app-904761941913.europe-west1.run.app/api/contact";

// Landing traffic — OUR OWN API, no third party. Replaces the PostHog snippet
// removed on 2026-09-05. Aggregate-only on the server: a day counter, never a
// row per person, so there is no identifier to store or consent to collect.
//
// `sessionStorage` is what makes "unique visits" possible without tracking. It
// is cleared when the tab closes, never leaves the browser, and is not sent
// anywhere — we transmit only the BOOLEAN "is this the first hit of this
// session". Nothing here can recognise a returning visitor tomorrow, which is
// exactly the property that keeps this consent-free.
const VISIT_ENDPOINT = "https://last-minute-app-904761941913.europe-west1.run.app/api/landing/visit";
const VISIT_SESSION_KEY = "tiphop_visit_session";

/** Where this visitor came from — a UTM tag we control, else the referring
 *  HOSTNAME (never the full URL, which can carry personal data in its query
 *  string), else nothing, which the server files as "(direct)".
 *
 *  Expect a lot of "(direct)": Instagram, Facebook and most apps strip the
 *  referrer header, so UTM tags on our own links are the reliable signal. */
function visitSource() {
  try {
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    if (utm) return utm.slice(0, 120);
    const ref = document.referrer;
    if (!ref) return null;
    const host = new URL(ref).hostname;
    // Our own pages are not a traffic source.
    if (host === window.location.hostname) return null;
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

/** Fire-and-forget. Never awaited, never surfaced: a counter must not be able
 *  to slow the page down or show a visitor an error. `keepalive` lets the
 *  request outlive the click that navigates away. */
function recordVisit(kind, newSession) {
  try {
    fetch(VISIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, source: visitSource(), new_session: !!newSession }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* never breaks the page */ }
}

function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("tiphop_lang");
      if (saved === "en" || saved === "el") return saved;
      if (typeof navigator !== "undefined" && (navigator.language || "").toLowerCase().startsWith("el")) return "el";
    } catch { /* storage blocked */ }
    return "en";
  });

  const t = (key) => (translations[lang] && translations[lang][key]) || translations.en[key] || key;

  const switchLang = (next) => {
    setLang(next);
    try { localStorage.setItem("tiphop_lang", next); } catch { /* noop */ }
  };

  useEffect(() => {
    try { document.documentElement.lang = lang; } catch { /* noop */ }
  }, [lang]);

  // One count per page load; `new_session` only on the first load of a browser
  // session, which is what makes the admin's "unique visits" figure meaningful.
  // Empty dep array: this must fire once per load, never on a language switch.
  useEffect(() => {
    let firstOfSession = false;
    try {
      if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
        sessionStorage.setItem(VISIT_SESSION_KEY, "1");
        firstOfSession = true;
      }
    } catch {
      // Private mode / storage blocked: still count the view, just never claim
      // it is a distinct session. Undercounting sessions beats inventing them.
    }
    recordVisit("view", firstOfSession);
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", message: "", company: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          company: formData.company || "", // honeypot — real users leave it empty
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      alert(t("form_thanks"));
      setFormData({ name: "", email: "", message: "", company: "" });
    } catch {
      // Network/API problem → don't lose the message: hand off to the mail client.
      const subject = encodeURIComponent(`tiphop — message from ${formData.name || "website"}`);
      const body = encodeURIComponent(`${formData.message}\n\n—\n${formData.name} <${formData.email}>`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary shrink-0">
            <img src={tiphopLogo} alt="tiphop" className="h-9 w-9 rounded-lg object-contain" />
            {/* Wordmark hidden on small screens so the logo + language toggle +
                CTA never collide on narrow phones (esp. the longer Greek CTA). */}
            <span className="hidden sm:inline">tiphop</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#features" className="hover:text-primary transition-colors">{t("nav_features")}</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">{t("nav_how")}</a>
            <a href="#faq" className="hover:text-primary transition-colors">{t("nav_faq")}</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border overflow-hidden" role="group" aria-label="Language">
              {["en", "el"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchLang(l)}
                  aria-pressed={lang === l}
                  data-testid={`lang-${l}`}
                  className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l === "en" ? "EN" : "ΕΛ"}
                </button>
              ))}
            </div>
            <Button asChild data-testid="nav-download-btn">
              <a href={MOBILE_APP_URL} onClick={() => recordVisit("app_click", false)}>{t("nav_cta")}</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4" data-testid="hero-section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                {t("hero_title_1")}
                <span className="block text-primary">{t("hero_title_2")}</span>
              </h1>
              <p className="text-xl text-muted-foreground">{t("hero_sub")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg" data-testid="hero-download-btn">
                  <a href={MOBILE_APP_URL} onClick={() => recordVisit("app_click", false)}>{t("nav_cta")}</a>
                </Button>
              </div>
            </div>
            {/* Was a stock photo of an unrelated app. This is our own Explore
                screen, drawn from the app's real design tokens — on-message,
                and it cannot 404 or slow the page like a hotlinked image. */}
            <div className="relative flex justify-center">
              <PhoneMockup screen="explore" lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/30" data-testid="features-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("features_title")}</h2>
            <p className="text-xl text-muted-foreground">{t("features_sub")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, tid: "feature-location", t: "feat_location_t", d: "feat_location_d" },
              { icon: Clock, tid: "feature-realtime", t: "feat_realtime_t", d: "feat_realtime_d" },
              { icon: Bell, tid: "feature-notifications", t: "feat_notifications_t", d: "feat_notifications_d" },
              { icon: Heart, tid: "feature-follow", t: "feat_follow_t", d: "feat_follow_d" },
              { icon: UtensilsCrossed, tid: "feature-dinein", t: "feat_dinein_t", d: "feat_dinein_d" },
              { icon: Bookmark, tid: "feature-bookmark", t: "feat_bookmark_t", d: "feat_bookmark_d" },
              { icon: Share2, tid: "feature-share", t: "feat_share_t", d: "feat_share_d" },
              { icon: ShieldCheck, tid: "feature-merchants", t: "feat_verified_t", d: "feat_verified_d" },
              { icon: TrendingDown, tid: "feature-savings", t: "feat_savings_t", d: "feat_savings_d" },
              { icon: Smartphone, tid: "feature-easy", t: "feat_qr_t", d: "feat_qr_d" },
              { icon: Languages, tid: "feature-localization", t: "feat_localization_t", d: "feat_localization_d" },
              { icon: Gift, tid: "feature-free", t: "feat_free_t", d: "feat_free_d" },
              { icon: Megaphone, tid: "feature-reverse", t: "feat_reverse_t", d: "feat_reverse_d" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.tid} data-testid={f.tid}>
                  <CardHeader>
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{t(f.t)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{t(f.d)}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4" data-testid="how-it-works-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("how_title")}</h2>
            <p className="text-xl text-muted-foreground">{t("how_sub")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", tid: "step-1", t: "step1_t", d: "step1_d" },
              { n: "2", tid: "step-2", t: "step2_t", d: "step2_d" },
              { n: "3", tid: "step-3", t: "step3_t", d: "step3_d" },
            ].map((s) => (
              <div key={s.tid} className="text-center space-y-4" data-testid={s.tid}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {s.n}
                </div>
                <h3 className="text-2xl font-semibold">{t(s.t)}</h3>
                <p className="text-muted-foreground">{t(s.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 px-4 bg-muted/30" data-testid="screenshots-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("shots_title")}</h2>
            <p className="text-xl text-muted-foreground">{t("shots_sub")}</p>
          </div>
          {/* These were three Unsplash photos with alt="App screenshot N" under a
              heading promising screenshots — one of them a meditation app. Now
              the three real screens: find an offer, see what you save, show the
              code. */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { screen: "explore", cap: "shot1" },
              { screen: "offer", cap: "shot2" },
              { screen: "redeem", cap: "shot3" },
            ].map((s) => (
              <div key={s.cap} className="space-y-4">
                <PhoneMockup screen={s.screen} lang={lang} />
                <p className="text-center font-medium">{t(s.cap)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4" data-testid="faq-section">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("faq_title")}</h2>
            <p className="text-xl text-muted-foreground">{t("faq_sub")}</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <AccordionItem key={n} value={`item-${n}`} data-testid={`faq-${n}`}>
                <AccordionTrigger className="text-left">{t(`faq${n}_q`)}</AccordionTrigger>
                <AccordionContent>{t(`faq${n}_a`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section className="py-16 px-4 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">{t("cta_title")}</h2>
              <p className="text-xl opacity-90">{t("cta_sub")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg" data-testid="cta-download-btn">
                  <a href={MOBILE_APP_URL} onClick={() => recordVisit("app_click", false)}>{t("nav_cta")}</a>
                </Button>
              </div>
            </div>

            <Card className="bg-white text-foreground" data-testid="contact-form">
              <CardHeader>
                <CardTitle className="text-2xl">{t("contact_title")}</CardTitle>
                <CardDescription>{t("contact_sub")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder={t("form_name")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={t("form_email")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder={t("form_message")}
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      data-testid="contact-message-input"
                    />
                  </div>
                  {/* Honeypot: off-screen + hidden from assistive tech. Real
                      users never touch it; bots that autofill it get dropped
                      server-side. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
                  <Button type="submit" className="w-full" disabled={sending} data-testid="contact-submit-btn">
                    {sending ? t("form_sending") : t("form_send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted" data-testid="footer">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                <img src={tiphopLogo} alt="tiphop" className="h-9 w-9 rounded-lg object-contain" />
                <span>tiphop</span>
              </div>
              <p className="text-muted-foreground">{t("footer_tagline")}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer_product")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">{t("nav_features")}</a></li>
                <li><a href="#faq" className="hover:text-primary">{t("nav_faq")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer_company")}</h3>
              {/* Careers and Blog were href="#" — a footer that lists pages
                  which do not exist and never open is worse than a shorter
                  footer, because every dead link reads as a broken site. What
                  remains points somewhere real. */}
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">{t("footer_about")}</a></li>
                <li><a href="#contact" className="hover:text-primary">{t("nav_cta")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer_legal")}</h3>
              {/* These were href="#". Advertising a Privacy Policy that does
                  not open is worse than not listing one, especially for a
                  product handling personal data in the EU — so they now open
                  the app's real terms-and-privacy screen. That screen states
                  plainly that it is a pilot summary and that full legal
                  documents replace it before general release. */}
              <ul className="space-y-2 text-muted-foreground">
                <li><a href={`${MOBILE_APP_URL}terms`} className="hover:text-primary">{t("footer_privacy")}</a></li>
                <li><a href={`${MOBILE_APP_URL}terms`} className="hover:text-primary">{t("footer_terms")}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>{t("footer_rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
