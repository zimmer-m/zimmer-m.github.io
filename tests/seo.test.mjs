import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const plugin = join(root, '_plugins/seo_metadata.rb');
const config = {
  title: 'Max Zimmer', first_name: 'Max', last_name: 'Zimmer',
  url: 'https://maxzimmer.org', baseurl: '', lang: 'en',
  description: 'Research on efficient deep learning.',
  og_image: '/assets/img/prof_pic.png', og_image_width: 470, og_image_height: 478,
  scholar_userid: 'WmWwh1kAAAAJ', wikidata_id: null,
};
function ruby(code, input = {}) {
  const result = spawnSync('ruby', ['-EUTF-8', '-r', plugin, '-e', code], {
    cwd: root, input: JSON.stringify(input), encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  return result.stdout;
}
function call(method, ...args) {
  return JSON.parse(ruby(`puts JSON.generate(SiteSEO.${method}(*JSON.parse(STDIN.read)))`, args));
}
function sourceConfig() {
  return JSON.parse(ruby('require "yaml"; puts JSON.generate(YAML.safe_load(File.read("_config.yml")))'));
}
function frontMatter(path) {
  return JSON.parse(ruby(`require 'yaml'; path = JSON.parse(STDIN.read); puts JSON.generate(YAML.safe_load(File.read(path).split(/^---\s*$\n?/, 3)[1], permitted_classes: [Date, Time]))`, path));
}

// The real Ruby implementation is exercised without installing Liquid/Jekyll or any gems.
test('homepage graph has stable, connected Person, WebSite and ProfilePage identities', () => {
  const data = call('graph', config, { url: '/' });
  const [person, website, page] = data['@graph'];
  assert.deepEqual(Object.keys(person).sort(), ['@id', '@type', 'image', 'name', 'sameAs', 'url'].sort());
  assert.equal(person['@id'], 'https://maxzimmer.org/#person');
  assert.deepEqual(person.sameAs, ['https://scholar.google.com/citations?user=WmWwh1kAAAAJ']);
  assert.equal(website.publisher['@id'], person['@id']);
  assert.equal(page['@type'], 'ProfilePage');
  assert.equal(page.mainEntity['@id'], person['@id']);
  assert.equal(page.isPartOf['@id'], website['@id']);
});

test('only explicitly configured, syntactically valid Wikidata IDs are emitted', () => {
  assert.equal(call('same_as', { wikidata_id: 'Max Zimmer' }).length, 0);
  assert.equal(call('same_as', { wikidata_id: '   ' }).length, 0);
  assert.deepEqual(call('same_as', { wikidata_id: 'Q123' }), ['https://www.wikidata.org/wiki/Q123']);
});

test('metadata is plain text; search descriptions override visible descriptions', () => {
  const meta = call('metadata', config, {
    url: '/research/index.html', title: 'A "quoted" title & more',
    description: 'Visible long introduction', seo_description: '<b>Short</b> &amp; clear.\nNext line.',
  });
  assert.equal(meta.title, 'A "quoted" title & more – Max Zimmer');
  assert.equal(meta.description, 'Short & clear. Next line.');
  assert.equal(meta.canonical_url, 'https://maxzimmer.org/research/');
  assert.equal(call('metadata', config, { url: '/', title: 'about' }).title, 'Max Zimmer');
  assert.equal(call('metadata', config, { url: '/cv/', seo_description: '  ' }).description, config.description);
});

test('canonical URLs and images support base paths and absolute overrides', () => {
  const meta = call('metadata', { ...config, baseurl: '/preview' }, {
    url: '/post/', canonical_url: 'https://example.org/original/', og_image: 'https://example.org/image.png',
  });
  assert.equal(meta.canonical_url, 'https://example.org/original/');
  assert.equal(meta.image, 'https://example.org/image.png');
  assert.equal(meta.image_width, null, 'never reuse portrait dimensions for a post image');
  assert.equal(call('absolute', { ...config, baseurl: '/preview' }, '/cv/'), 'https://maxzimmer.org/preview/cv/');
});

test('blog metadata matches all displayed authors, real dates, and original paper link', () => {
  const page = {
    path: '_posts/2026-04-12-example.md', url: '/example/', title: 'A paper explainer',
    authors: [{ name: 'Co Author' }, { name: 'Max Zimmer' }],
    date: '2026-04-12', paper_url: 'https://arxiv.org/abs/2603.15914', tags: ['agentic-ai'],
  };
  const graph = call('graph', config, page)['@graph'];
  const article = graph.at(-1);
  assert.equal(article['@type'], 'BlogPosting');
  assert.deepEqual(article.author.map(a => a.name), ['Co Author', 'Max Zimmer']);
  assert.equal(article.author[1]['@id'], graph[0]['@id']);
  assert.equal(article.mainEntityOfPage['@id'], graph[2]['@id']);
  assert.equal(graph[2].mainEntity['@id'], article['@id']);
  assert.match(article.datePublished, /^2026-04-12/);
  assert.equal(article.dateModified, undefined, 'do not invent modification dates');
  assert.equal(article.citation, page.paper_url);
  assert.equal(call('iso_date', 'not a date'), null);
});

test('single-author posts honor an explicit byline instead of the site owner', () => {
  const article = call('graph', config, {
    collection: 'posts', url: '/guest/', title: 'Guest post', author: 'Guest Author', author_url: 'https://example.org/',
  })['@graph'].at(-1);
  assert.deepEqual(article.author, [{ '@type': 'Person', name: 'Guest Author', url: 'https://example.org/' }]);
});

test('publication schema keeps every full author, venue, year and original identifiers', () => {
  const entry = {
    key: 'sample2026', title: '<i>A paper</i>', year: 2026, booktitle: 'A Conference',
    author_array: [...Array.from({ length: 8 }, (_, i) => ({ first: `Author ${i}`, last: 'Family' })), { first: 'Max', last: 'Zimmer' }],
    doi: 'https://doi.org/10.1234/example', arxiv: '2601.00001', pdf: 'paper.pdf', abstract: 'An abstract.',
  };
  const data = call('publication', config, entry);
  assert.equal(data['@type'], 'ScholarlyArticle');
  assert.equal(data['@id'], 'https://maxzimmer.org/publications/#sample2026');
  assert.equal(data.name, 'A paper');
  assert.equal(data.author.length, 9);
  assert.equal(data.author[8]['@id'], 'https://maxzimmer.org/#person');
  assert.equal(data.datePublished, '2026');
  assert.equal(data.isPartOf.name, 'A Conference');
  assert.deepEqual(data.sameAs, ['https://doi.org/10.1234/example', 'https://arxiv.org/abs/2601.00001', 'https://maxzimmer.org/assets/pdf/paper.pdf']);
});

test('minimal publication fields do not produce empty or fabricated links and dates', () => {
  const data = call('publication', config, { key: 'minimal', title: 'Minimal', author_array: [] });
  assert.equal(data.sameAs, undefined);
  assert.equal(data.datePublished, undefined);
  assert.equal(data.isPartOf, undefined);
});

test('JSON-LD round-trips quotes, Unicode and script-ending payloads safely', () => {
  const value = { text: '"quoted" \\ München & </script><script>alert(1)</script>\u2028\u2029' };
  const encoded = ruby('puts SiteSEO.json_ld(JSON.parse(STDIN.read))', value).trim();
  assert.deepEqual(JSON.parse(encoded), value);
  assert.doesNotMatch(encoded, /[<>&\u2028\u2029]/);
});

test('real top-level pages and published posts have distinct, nonempty plain-text descriptions', () => {
  const paths = ['about', 'publications', 'blog', 'cv', 'talks', 'ai_news', 'teaching/index'].map(p => `_pages/${p}.md`);
  paths.push(...readdirSync(join(root, '_posts')).map(p => `_posts/${p}`));
  const descriptions = [];
  for (const path of paths) {
    const data = frontMatter(path);
    if (data.published === false) continue;
    assert.equal(typeof data.seo_description, 'string', path);
    assert.ok(data.seo_description.trim().length > 0, path);
    assert.equal(data.seo_description, data.seo_description.trim(), path);
    assert.doesNotMatch(data.seo_description, /<\/?[a-z][^>]*>/i, path);
    descriptions.push(data.seo_description);
  }
  assert.equal(new Set(descriptions).size, descriptions.length);
});

test('source wiring preserves crawl policy and excludes development resources', () => {
  const config = sourceConfig();
  assert.notEqual(config.title, 'blank', 'the Atom feed must not be named blank');
  assert.ok(!config.wikidata_id || /^Q[1-9]\d*$/.test(config.wikidata_id));
  for (const path of ['tests', 'AGENTS.md']) assert.ok(config.exclude.includes(path));
  const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*\s+Disallow: \/intro\//);
  assert.equal((robots.match(/User-agent:/g) || []).length, 1, 'avoid bot-specific groups overriding /intro/');
  const head = readFileSync(join(root, '_includes/head.html'), 'utf8');
  assert.match(head, /assign seo = page \| seo_metadata/);
  assert.match(head, /rel="canonical" href="{{ seo.canonical_url \| escape }}"/);
  const metadata = readFileSync(join(root, '_includes/metadata.html'), 'utf8');
  assert.match(metadata, /name="description" content="{{ seo.description \| escape }}"/);
  assert.match(metadata, /page \| seo_graph \| json_ld/);
  assert.match(readFileSync(join(root, '_layouts/bib.html'), 'utf8'), /entry \| publication_schema \| json_ld/);
  assert.match(head, /rel="alternate" type="application\/atom\+xml"/);
  assert.ok(head.includes("'/feed.xml' | absolute_url"));
});
