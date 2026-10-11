# Publication statistics derived from the generated BibTeX bibliography.
#
# Kept dependency-free (no Jekyll, Liquid or BibTeX gems) so the counting logic
# can be unit tested with plain Ruby.
module PublicationStats
  # Canonical venue families, matched against the start of the BibTeX `abbr` field.
  # Conferences are shown first; both conference and non-conference groups are sorted by count.
  # The `order` is only a stable tie-breaker; unknown venues are grouped under "Others".
  FAMILIES = [
    { name: 'NeurIPS',   pattern: /\ANeurIPS/i,   kind: :conference, order: 1 },
    { name: 'ICML',      pattern: /\AICML/i,      kind: :conference, order: 2 },
    { name: 'ICLR',      pattern: /\AICLR/i,      kind: :conference, order: 3 },
    { name: 'AISTATS',   pattern: /\AAISTATS/i,   kind: :conference, order: 4 },
    { name: 'Workshops', pattern: /\AWorkshop/i,  kind: :workshop,   order: 5 },
    { name: 'Journals',  pattern: /\AJournal/i,   kind: :journal,    order: 6 },
    { name: 'Preprints', pattern: /\APreprint/i,  kind: :preprint,   order: 7 }
  ].freeze

  OTHERS = { name: 'Others', kind: :other, order: 8 }.freeze

  module_function

  # Returns a hash suitable for `site.data['publication_stats']`.
  def from_bibtex(text)
    abbrs = abbrs(text)
    venues = tally(abbrs)
    {
      'total' => abbrs.length,
      'peer_reviewed' => venues
        .select { |venue| %w[conference journal].include?(venue['kind']) }
        .sum { |venue| venue['count'] },
      'venues' => venues
    }
  end

  # Extract the `abbr` field from every BibTeX entry, in file order.
  def abbrs(text)
    text.split(/^@/).drop(1).map do |entry|
      match = entry[/\babbr\s*=\s*\{([^}]*)\}/, 1]
      match&.strip
    end.compact.reject(&:empty?)
  end

  def tally(abbrs)
    counts = Hash.new(0)
    abbrs.each { |abbr| counts[family(abbr)] += 1 }
    counts
      .map { |family, count| family.merge('count' => count) }
      .sort_by do |family|
        conference_rank = family['kind'] == 'conference' ? 0 : 1
        [conference_rank, -family['count'], family['order']]
      end
  end

  def family(abbr)
    FAMILIES.each do |family|
      next unless family[:pattern].match?(abbr)
      return { 'name' => family[:name], 'kind' => family[:kind].to_s, 'order' => family[:order] }
    end
    { 'name' => OTHERS[:name], 'kind' => OTHERS[:kind].to_s, 'order' => OTHERS[:order] }
  end
end

# Expose the counts to Liquid as `site.data.publication_stats`.
if defined?(Jekyll::Generator)
  module Jekyll
    class PublicationStatsGenerator < Generator
      safe true
      priority :low

      def generate(site)
        path = File.join(site.source, '_bibliography', 'papers.bib')
        return unless File.exist?(path)

        site.data['publication_stats'] = PublicationStats.from_bibtex(File.read(path))
      end
    end
  end
end
