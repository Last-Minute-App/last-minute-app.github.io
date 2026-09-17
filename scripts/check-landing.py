#!/usr/bin/env python3
"""Guard: past landing-page bugs stay fixed. Runs before every deploy.

Owner rule (2026-09-17): every bug ever found gets a permanent automated check.
Each rule carries its regression-inventory id:

  L002  shared links showed no preview (Open Graph / Twitter tags missing), and
        footer links went nowhere — incl. a `#contact` link to a section with
        no such id (found by this guard's first run, 2026-09-17)
  L003  footer URLs had a double slash (`/dashboard//terms`)
  L004  the word "deal" on the page — the product says "offer"
  L006  a bare `.env` was not git-ignored

NEGATIVE-CONTROLLED: every run first re-introduces each bug in memory and
requires the rule to catch it, so a rule that went blind fails loudly.

    python3 scripts/check-landing.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_META = ["og:title", "og:description", "og:image", "og:url", "twitter:card", "twitter:image"]


def read(rel, over):
    if rel in over:
        return over[rel]
    p = ROOT / rel
    return p.read_text(encoding="utf-8") if p.exists() else ""


def l002_preview_tags(over):
    html = read("public/index.html", over)
    return [f"public/index.html lost <meta {k}> (no link preview)" for k in REQUIRED_META
            if not re.search(r'(property|name)="%s"\s+content="[^"]+"' % re.escape(k), html)]


def _strip_comments(src):
    """Blank out JSX/JS comments but keep line numbers (comments quote old bugs)."""
    blank = lambda m: re.sub(r"[^\n]", " ", m.group(0))
    return re.sub(r"//[^\n]*", blank, re.sub(r"/\*.*?\*/", blank, src, flags=re.S))


def l002_anchors(over):
    app = _strip_comments(read("src/App.js", over))
    ids = set(re.findall(r'(?<![-\w])id="([\w-]+)"', app))
    bad = []
    for m in re.finditer(r'href="(#[^"]*)"', app):
        target = m.group(1)[1:]
        if not target:
            bad.append(f'src/App.js:{app.count(chr(10), 0, m.start()) + 1} href="#" goes nowhere')
        elif target not in ids:
            bad.append(f'src/App.js:{app.count(chr(10), 0, m.start()) + 1} href="#{target}" but no element has id="{target}"')
    return bad


def l003_double_slash(over):
    bad = []
    app = read("src/App.js", over)
    base = re.search(r'const MOBILE_APP_URL = "([^"]*)"', app)
    if base and base.group(1).endswith("/") and re.search(r"\$\{MOBILE_APP_URL\}/", app):
        bad.append("src/App.js: `${MOBILE_APP_URL}/…` doubles the slash (MOBILE_APP_URL already ends in /)")
    for rel in ("src/App.js", "public/index.html"):
        for m in re.finditer(r"https?://[^\s\"'`<>]+", read(rel, over)):
            if "//" in m.group(0).split("://", 1)[1]:
                bad.append(f"{rel}: double slash in {m.group(0)}")
    return bad


def l004_deal(over):
    bad = []
    for rel in ("src/translations.js", "public/index.html", "src/App.js"):
        for i, line in enumerate(read(rel, over).splitlines(), 1):
            if re.search(r"\bdeals?\b", line, re.I):
                bad.append(f'{rel}:{i} says "deal" — the product word is "offer"')
    return bad


def l006_env_ignored(over):
    lines = [ln.strip() for ln in read(".gitignore", over).splitlines()]
    return [] if ".env" in lines else [".gitignore does not ignore a bare .env (secrets could be committed)"]


RULES = [("L002", l002_preview_tags), ("L002b", l002_anchors), ("L003", l003_double_slash),
         ("L004", l004_deal), ("L006", l006_env_ignored)]


def _mut(rel, old, new):
    real = read(rel, {})
    return {rel: real.replace(old, new, 1)} if old in real else None


CONTROLS = {
    "L002": lambda: _mut("public/index.html", 'property="og:image"', 'property="og:img"'),
    "L002b": lambda: _mut("src/App.js", '<section id="contact"', '<section id="contact-x"'),
    "L003": lambda: _mut("src/App.js", "${MOBILE_APP_URL}terms", "${MOBILE_APP_URL}/terms"),
    "L004": lambda: {"src/translations.js": read("src/translations.js", {}) + "\n// Last-minute deals near you\n"},
    "L006": lambda: {".gitignore": "\n".join(ln for ln in read(".gitignore", {}).splitlines() if ln.strip() != ".env")},
}


def main():
    broken, problems = [], []
    for rid, rule in RULES:
        over = CONTROLS[rid]()
        if not over:
            broken.append(f"{rid}: negative control could not be built (anchor text moved)")
        elif not rule(over):
            broken.append(f"{rid}: rule did NOT catch its re-introduced bug")
        problems += [f"[{rid}] {p}" for p in rule({})]
    for title, items in (("SELF-TEST FAILED", broken), ("past bugs coming back", problems)):
        if items:
            print(f"check-landing: {title}")
            for x in items:
                print("  " + x)
    if broken or problems:
        sys.exit(1)
    print(f"check-landing: OK — {len(RULES)} past-bug rules hold, each proven against its re-introduced bug")


if __name__ == "__main__":
    main()
