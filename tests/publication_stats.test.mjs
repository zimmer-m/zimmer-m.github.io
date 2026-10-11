import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const plugin = join(root, '_plugins/publication_stats.rb');

// The real Ruby implementation is exercised without installing Jekyll, Liquid or BibTeX gems.
function stats(bibtex) {
  const result = spawnSync('ruby', ['-EUTF-8', '-r', plugin, '-rjson', '-e',
    'puts JSON.generate(PublicationStats.from_bibtex(JSON.parse(STDIN.read)))'],
    { cwd: root, input: JSON.stringify(bibtex), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  return JSON.parse(result.stdout);
}

const sample = `@inproceedings{a,
  abbr={ICML25},
  title={A}
}

@inproceedings{b,
  abbr={ICML24},
  title={B}
}

@inproceedings{c,
  abbr={NeurIPS25},
  title={C}
}

@inproceedings{d,
  abbr={Workshop @ ICML},
  title={D}
}

@article{e,
  abbr={Preprint},
  title={E}
}

@article{f,
  abbr={Journal},
  title={F}
}

@inproceedings{g,
  abbr={ICMS26},
  title={G}
}
`;

test('groups venues, counts totals and peer-reviewed entries', () => {
  const data = stats(sample);
  assert.equal(data.total, 7);
  assert.equal(data.peer_reviewed, 4); // ICML x2 + NeurIPS + Journal
  const byName = Object.fromEntries(data.venues.map(v => [v.name, v.count]));
  assert.deepEqual(byName, {
    NeurIPS: 1, ICML: 2, Journals: 1, Workshops: 1, Preprints: 1, Others: 1,
  });
  assert.deepEqual(data.venues.map(v => v.name),
    ['ICML', 'NeurIPS', 'Workshops', 'Journals', 'Preprints', 'Others']);
  assert.ok(data.venues.every(v => v.count > 0));
});

test('real bibliography yields a consistent, ordered breakdown', () => {
  const data = stats(readFileSync(join(root, '_bibliography/papers.bib'), 'utf8'));
  assert.equal(data.total, 35);
  assert.equal(data.venues.reduce((n, v) => n + v.count, 0), data.total);
  assert.ok(data.peer_reviewed > 0 && data.peer_reviewed <= data.total);
  assert.ok(data.venues.every(v => v.count > 0));
  assert.deepEqual(data.venues.map(v => v.name),
    ['ICML', 'ICLR', 'NeurIPS', 'AISTATS', 'Preprints', 'Workshops', 'Journals', 'Others']);
  assert.deepEqual(data.venues.map(v => v.count), [8, 5, 2, 1, 11, 4, 3, 1]);
});

test('compact counter sits above the filters on both publication lists', () => {
  const page = readFileSync(join(root, '_pages/publications.md'), 'utf8');
  const selected = readFileSync(join(root, '_includes/selected_papers.html'), 'utf8');
  const about = readFileSync(join(root, '_pages/about.md'), 'utf8');
  const styles = readFileSync(join(root, '_sass/_publications.scss'), 'utf8');

  assert.match(page, /\{% include publication_stats\.html %\}\s*<div class="publication-search">/);
  assert.match(selected, /\{% include publication_stats\.html %\}\s*<div class="publication-search">/);
  assert.doesNotMatch(about, /\{% include publication_stats\.html %\}/);
  assert.match(styles, /\.publication-stats \{[\s\S]*?flex-wrap: nowrap;[\s\S]*?overflow-x: auto;/);
});
