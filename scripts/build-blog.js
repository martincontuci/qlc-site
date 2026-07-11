const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const OUTPUT_DIR = path.join(ROOT, 'blog');

const FONT_LINKS = `  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />`;

const HEADER = `  <header class="site-header">
    <div class="container">
      <a href="/" class="logo">
        <span class="logo-qlc">QLC</span>
      </a>
      <nav class="header-nav">
        <a href="/#como-funciona">Cómo funciona</a>
        <a href="/#privacidad">Privacidad</a>
        <a href="/contacto.html">Contacto</a>
        <a href="https://wa.me/13364899797" target="_blank" rel="noopener" class="header-whatsapp">
          <svg class="wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.054 23.486a.5.5 0 0 0 .609.61l5.801-1.527A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.877 9.877 0 0 1-5.031-1.378l-.36-.214-3.733.982.998-3.648-.235-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.466 0 9.9 4.434 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
          </svg>
          <span class="wa-label">Ir a WhatsApp</span>
        </a>
      </nav>
    </div>
  </header>`;

const FOOTER = `  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-logo">
        <span class="logo-qlc">QLC</span>
      </div>
      <nav class="footer-nav">
        <a href="/privacidad.html">Política de privacidad</a>
        <a href="/contacto.html">Contacto</a>
        <a href="https://wa.me/13364899797?text=Darme%20de%20baja" target="_blank" rel="noopener">Botón de Baja</a>
        <a href="https://wa.me/13364899797?text=Quiero%20cancelar%20mi%20suscripci%C3%B3n" target="_blank" rel="noopener">Botón de Arrepentimiento</a>
      </nav>
      <p class="footer-copy">© 2026 Quelecompramos</p>
    </div>
  </footer>`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date "${dateStr}" — expected YYYY-MM-DD`);
  }
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function pageShell({ title, description, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="stylesheet" href="/styles.css" />
${FONT_LINKS}
</head>
<body>

${HEADER}

  <main>

${bodyHtml}

  </main>

${FOOTER}

</body>
</html>
`;
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data, content } = matter(raw);

    const required = ['title', 'date', 'excerpt'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`${filename}: missing required front-matter field "${field}"`);
      }
    }

    return {
      slug,
      title: data.title,
      titleEn: data.title_en || null,
      date: data.date,
      phase: data.phase || null,
      excerpt: data.excerpt,
      tags: data.tags || [],
      bodyHtml: marked.parse(content),
    };
  }).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function buildPostPage(post) {
  const phaseBadge = post.phase ? `<div class="section-label">Fase ${escapeHtml(post.phase)}</div>` : '';

  const bodyHtml = `    <section class="page-hero">
      <div class="container">
        ${phaseBadge}
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(formatDate(post.date))}</p>
      </div>
    </section>

    <section class="page-content">
      <div class="container">
        <div class="prose">
${post.bodyHtml}
        </div>
      </div>
    </section>`;

  return pageShell({
    title: `${post.title} — Blog QLC`,
    description: post.excerpt,
    bodyHtml,
  });
}

function buildIndexPage(posts) {
  const listHtml = posts.length === 0
    ? `<p>Todavía no hay entradas.</p>`
    : posts.map((post) => `          <article class="prose" style="margin-bottom: 2.5rem;">
            <h2><a href="/blog/${escapeHtml(post.slug)}.html">${escapeHtml(post.title)}</a></h2>
            <p>${escapeHtml(formatDate(post.date))}</p>
            <p>${escapeHtml(post.excerpt)}</p>
          </article>`).join('\n');

  const bodyHtml = `    <section class="page-hero">
      <div class="container">
        <div class="section-label">Bitácora de progreso</div>
        <h1>Blog</h1>
      </div>
    </section>

    <section class="page-content">
      <div class="container">
${listHtml}
      </div>
    </section>`;

  return pageShell({
    title: 'Blog — QLC Quelecompramos',
    description: 'Bitácora de progreso de Quelecompramos: novedades y avances del producto.',
    bodyHtml,
  });
}

function build() {
  const posts = readPosts();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const post of posts) {
    const outPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
    fs.writeFileSync(outPath, buildPostPage(post), 'utf8');
    console.log(`Built ${path.relative(ROOT, outPath)}`);
  }

  const indexPath = path.join(OUTPUT_DIR, 'index.html');
  fs.writeFileSync(indexPath, buildIndexPage(posts), 'utf8');
  console.log(`Built ${path.relative(ROOT, indexPath)} (${posts.length} post${posts.length === 1 ? '' : 's'})`);
}

build();
