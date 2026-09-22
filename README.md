# martin-ruczizka-ch

Statische GitHub-Pages-Ausgabe fuer `martin-ruczizka.ch`.

## Gemeinsame Top-Navi

Die Top-Navi wird aus einer gemeinsamen Partial-Datei gepflegt:

```text
shared\site-header.html
shared\site-header.css
```

Nach Aenderungen an der Header-Quelle den Header in alle statischen HTML-Ausgaben synchronisieren:

```powershell
node C:\Projects\martin-ruczizka-ch\scripts\sync-site-header.mjs
```

Das Skript aktualisiert aktuell:

```text
index.html
mandatsunterlagen\index.html
```

Die gerenderten Header-Bloecke sind mit `shared:site-header`-Kommentaren markiert.

### Stabile Header-Geometrie

Das gesamte Header-CSS inklusive Desktop-, Tablet- und Mobile-Breakpoints liegt in:

```text
shared\site-header.css
```

Keine einzelne Seite soll eigene Regeln fuer `.topbar`, `.nav`, `.brand`, `.brand img`, `.nav-links` oder Header-Button-Geometrie fuehren. Neue Seiten werden im `pages`-Array von `scripts\sync-site-header.mjs` eingetragen und danach synchronisiert.

Die Abschnittslinks im Header tragen die Klasse `nav-section-link`. Responsive Sichtbarkeit wird ueber diese Klasse gesteuert, nicht ueber unterschiedliche `href`-Praefixe.
