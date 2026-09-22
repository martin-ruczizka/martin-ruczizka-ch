import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "..");
const templatePath = resolve(repoDir, "shared", "site-header.html");
const template = readFileSync(templatePath, "utf8").trim();

const startMarker = "<!-- shared:site-header:start -->";
const endMarker = "<!-- shared:site-header:end -->";

const portalHref = "https://mandate.martin-ruczizka.com/login";

const pages = [
  {
    file: resolve(repoDir, "index.html"),
    homeHref: "#top",
    sectionHrefPrefix: "",
    logoSrc: "/assets/brand/mr-logo-progress-05-mark.svg",
    mandateHref: "https://martin-ruczizka.com/#mandat-einordnen",
    portalHref,
    portalLabel: "Mandatsbereich",
  },
  {
    file: resolve(repoDir, "mandatsunterlagen", "index.html"),
    homeHref: "/",
    sectionHrefPrefix: "/",
    logoSrc: "/assets/brand/mr-logo-progress-05-mark.svg",
    mandateHref: "https://martin-ruczizka.com/#mandat-einordnen",
    portalHref,
    portalLabel: "Mandatsbereich",
  },
];

function renderHeader(values) {
  const portalLink = values.portalHref
    ? `<a href="${escapeHtml(values.portalHref)}">${escapeHtml(values.portalLabel ?? "Mandatsbereich")}</a>`
    : "";

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === "portalLink") {
      return portalLink;
    }

    if (!(key in values)) {
      throw new Error(`Missing template value: ${key}`);
    }

    return escapeHtml(values[key]);
  });
}

function replaceHeader(page) {
  if (!existsSync(page.file)) {
    throw new Error(`Page not found: ${page.file}`);
  }

  const html = readFileSync(page.file, "utf8");
  const rendered = `${startMarker}\n${renderHeader(page)}\n${endMarker}`;
  const markerPattern = new RegExp(`${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`);
  const headerPattern = /<header class="topbar">[\s\S]*?<\/header>/;

  let nextHtml;
  if (markerPattern.test(html)) {
    nextHtml = html.replace(markerPattern, rendered);
  } else if (headerPattern.test(html)) {
    nextHtml = html.replace(headerPattern, rendered);
  } else {
    throw new Error(`No topbar header found in ${page.file}`);
  }

  writeFileSync(page.file, nextHtml, "utf8");
  console.log(`synced ${page.file}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

for (const page of pages) {
  replaceHeader(page);
}
