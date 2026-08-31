import { useState, useEffect } from "react";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Bell, TrendingDown, Smartphone, Heart, UtensilsCrossed, Bookmark, Share2, ShieldCheck, Languages, Gift } from "lucide-react";
import tiphopLogo from "@/assets/tiphop_logo.png";
import { translations } from "@/translations";

// Root-relative on purpose: this site is served from BOTH
// last-minute-app.github.io and the custom domain tiphop.gr, and the app
// lives at /dashboard/ on each. The previous hard-coded github.io URL
// pushed every tiphop.gr visitor onto a different origin, which
// (a) split localStorage, so a session started on tiphop.gr didn't carry
// over, and (b) meant the "Add to Home Screen" prompt — and therefore the
// installed app — belonged to github.io rather than tiphop.gr.
const MOBILE_APP_URL = "/dashboard/";

// Contact destination + delivery. Messages go to this inbox. When a Web3Forms
// access key (free, https://web3forms.com — created against tiphop.app@gmail.com)
// is set, the form silently POSTs and the visitor never leaves the page. Until
// then it gracefully falls back to the visitor's mail client, pre-filled to the
// same address, so no message is ever lost.
const CONTACT_EMAIL = "tiphop.app@gmail.com";
const CONTACT_ACCESS_KEY = ""; // ← paste the Web3Forms access key here to enable silent email delivery

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

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // No form-service key yet → hand off to the visitor's mail client, pre-filled
    // to CONTACT_EMAIL, so the message still reaches us.
    if (!CONTACT_ACCESS_KEY) {
      const subject = encodeURIComponent(`tiphop — message from ${formData.name || "website"}`);
      const body = encodeURIComponent(`${formData.message}\n\n—\n${formData.name} <${formData.email}>`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: CONTACT_ACCESS_KEY,
          subject: `tiphop website — message from ${formData.name || "visitor"}`,
          from_name: "tiphop website",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        alert(t("form_thanks"));
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(t("form_error"));
      }
    } catch {
      alert(t("form_error"));
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
              <a href={MOBILE_APP_URL}>{t("nav_cta")}</a>
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
                  <a href={MOBILE_APP_URL}>{t("nav_cta")}</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBtYXJrZXRwbGFjZXxlbnwwfHx8fDE3Nzk1MzI5NzN8MA&ixlib=rb-4.1.0&q=85"
                alt="Mobile marketplace app"
                className="rounded-2xl shadow-2xl"
              />
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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { src: "https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f", cap: "shot1" },
              { src: "https://images.unsplash.com/photo-1601972602237-8c79241e468b", cap: "shot2" },
              { src: "https://images.unsplash.com/photo-1609921141835-710b7fa6e438", cap: "shot3" },
            ].map((s, i) => (
              <div key={s.cap} className="space-y-4">
                <img src={s.src} alt={`App screenshot ${i + 1}`} className="rounded-xl shadow-lg w-full" />
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
                  <a href={MOBILE_APP_URL}>{t("nav_cta")}</a>
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
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("footer_about")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer_careers")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer_blog")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer_legal")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("footer_privacy")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer_terms")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer_cookies")}</a></li>
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
