#!/usr/bin/env python3
"""Gera index.html (build PWA) a partir de banco.html (fonte de verdade).

banco.html é o ficheiro editado no Claude Artifact — um <body> solto, sem
<head> fechado, pensado para correr dentro do preview do Artifact. Este
script envolve esse mesmo conteúdo (sem o tocar) com a estrutura HTML e as
tags PWA (manifest, ícones, theme-color) que só fazem sentido na app
instalada, e acrescenta o registo do service worker.

Uso:
    python3 rebuild_pwa.py

Depois de correr, confirma o diff do index.html e, se o conteúdo da app
mudou de facto (não só este wrapper), incrementa a constante CACHE em sw.js
antes de fazer commit — caso contrário o telemóvel pode continuar a mostrar
uma versão em cache de ficheiros estáticos.
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "banco.html"
OUT = ROOT / "index.html"

OLD_HEAD_PREFIX = (
    '<!doctype html><html><head><meta charset=utf8>'
    '<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '<style>:root{color-scheme:light;box-sizing:border-box;'
    'padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
    'html{scroll-padding-top:env(safe-area-inset-top,0px)}'
    'body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;'
    'background:#faf9f5;color:#141413}img{max-width:100%}'
    '[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n'
    '<title>Banco Sub-15</title>'
)
NEW_HEAD_PREFIX = (
    '<!doctype html>\n<html lang="pt">\n<head>\n'
    '<meta charset="utf-8">\n<title>Banco Sub-15</title>'
)

STYLE_END_MARKER = '.list-row .lsub{font-size:11.5px; color:var(--ink-dim);}\n</style>\n'
PWA_HEAD_TAGS = (
    '\n\n\n<link rel="manifest" href="./manifest.json">\n'
    '<meta name="theme-color" content="#1F7A4D">\n'
    '<meta name="apple-mobile-web-app-capable" content="yes">\n'
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
    '<meta name="apple-mobile-web-app-title" content="Banco Sub-15">\n'
    '<link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">\n'
    '</head>\n<body>'
)

SW_REGISTER_SCRIPT = (
    '<script>\n'
    'if ("serviceWorker" in navigator) {\n'
    '  window.addEventListener("load", function () {\n'
    '    navigator.serviceWorker.register("./sw.js").catch(function(){});\n'
    '  });\n'
    '}\n'
    '</script>\n'
)


def main():
    src = SRC.read_text(encoding="utf-8")

    if not src.startswith(OLD_HEAD_PREFIX):
        raise SystemExit(
            "banco.html não começa com o preâmbulo esperado do Artifact — "
            "confirma se a fonte mudou de formato antes de ajustar este script."
        )
    body = NEW_HEAD_PREFIX + src[len(OLD_HEAD_PREFIX):]

    if STYLE_END_MARKER not in body:
        raise SystemExit("Não encontrei o fim do bloco <style> da app — banco.html mudou?")
    body = body.replace(STYLE_END_MARKER, STYLE_END_MARKER.rstrip("\n") + PWA_HEAD_TAGS, 1)

    if not body.endswith("</body></html>"):
        raise SystemExit("banco.html não termina em </body></html> como esperado.")
    body = body[: -len("</body></html>")] + SW_REGISTER_SCRIPT + "\n</body>\n</html>\n"

    OUT.write_text(body, encoding="utf-8")
    print(f"OK — {OUT.name} gerado a partir de {SRC.name} ({len(body)} bytes).")


if __name__ == "__main__":
    main()
