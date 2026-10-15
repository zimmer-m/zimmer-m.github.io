# Shared metadata for HTML, social previews, and JSON-LD. No build-time network calls.
require 'json'
require 'cgi'
require 'date'
require 'time'

module SiteSEO
  module_function

  def present?(value)
    !value.nil? && value != false && !value.to_s.strip.empty?
  end

  def text(value)
    CGI.unescapeHTML(value.to_s.gsub(/<[^>]*>/, ' ')).gsub(/\s+/, ' ').strip
  end

  def absolute(config, path)
    return path if path.to_s.match?(%r{\Ahttps?://})
    return "https:#{path}" if path.to_s.start_with?('//')

    base = config['url'].to_s.sub(%r{/$}, '') + config['baseurl'].to_s.sub(%r{/$}, '')
    "#{base}/#{path.to_s.sub(%r{\A/}, '')}"
  end

  def site_name(config)
    return text(config['title']) if present?(config['title']) && config['title'] != 'blank'

    [config['first_name'], config['middle_name'], config['last_name']].select { |v| present?(v) }.join(' ')
  end

  def same_as(config)
    templates = {
      'orcid_id' => 'https://orcid.org/%s',
      'scholar_userid' => 'https://scholar.google.com/citations?user=%s',
      'semanticscholar_id' => 'https://www.semanticscholar.org/author/%s',
      'github_username' => 'https://github.com/%s',
      'gitlab_username' => 'https://gitlab.com/%s',
      'linkedin_username' => 'https://www.linkedin.com/in/%s',
      'twitter_username' => 'https://twitter.com/%s',
      'research_gate_profile' => 'https://www.researchgate.net/profile/%s',
      'wikidata_id' => 'https://www.wikidata.org/wiki/%s',
      'publons_id' => 'https://publons.com/a/%s/',
      'telegram_username' => 'https://telegram.me/%s',
      'medium_username' => 'https://medium.com/@%s',
      'quora_username' => 'https://www.quora.com/profile/%s',
      'strava_userid' => 'https://www.strava.com/athletes/%s',
      'keybase_username' => 'https://keybase.io/%s',
      'stackoverflow_id' => 'https://stackoverflow.com/users/%s',
      'kaggle_id' => 'https://www.kaggle.com/%s',
      'lastfm_id' => 'https://www.last.fm/user/%s',
      'spotify_id' => 'https://open.spotify.com/user/%s',
      'pinterest_id' => 'https://www.pinterest.com/%s',
      'unsplash_id' => 'https://unsplash.com/@%s',
      'instagram_id' => 'https://instagram.com/%s',
      'facebook_id' => 'https://facebook.com/%s',
      'discord_id' => 'https://discord.com/users/%s'
    }
    links = templates.filter_map do |key, template|
      value = config[key].to_s.strip
      next if value.empty?
      # A label or guessed URL must never become a Wikidata identifier.
      next if key == 'wikidata_id' && !value.match?(/\AQ[1-9]\d*\z/)

      format(template, value)
    end
    links.concat(%w[work_url dblp_url blogger_url].filter_map { |key| config[key] if present?(config[key]) }).uniq
  end

  def iso_date(value)
    return nil unless present?(value)
    return value.iso8601 if value.respond_to?(:iso8601)

    DateTime.parse(value.to_s).iso8601
  rescue ArgumentError
    nil
  end

  def author(name, config, url = nil)
    person = { '@type' => 'Person', 'name' => text(name) }
    if text(name) == site_name(config)
      person['@id'] = absolute(config, '/#person')
      person['url'] = absolute(config, '/')
    elsif present?(url)
      person['url'] = absolute(config, url)
    end
    person
  end

  def metadata(config, page)
    name = site_name(config)
    title = text(page['seo_title'] || page['title'])
    title = name if title.empty? || title == 'blank' || page['url'] == '/'
    title = "#{title} – #{name}" unless title == name
    description = [page['seo_description'], page['description'], config['description']].find { |v| present?(v) }
    image = page['og_image'] || config['og_image']
    {
      'site_name' => name,
      'title' => title,
      'description' => text(description),
      'canonical_url' => absolute(config, page['canonical_url'] || page['url'].to_s.sub(%r{index\.html\z}, '')),
      'is_post' => page['collection'] == 'posts' || page['path'].to_s.start_with?('_posts/'),
      'image' => present?(image) ? absolute(config, image) : nil,
      'image_alt' => text(page['og_image_alt'] || (page['og_image'] ? title : config['og_image_alt']) || title),
      'image_width' => page['og_image_width'] || (page['og_image'] ? nil : config['og_image_width']),
      'image_height' => page['og_image_height'] || (page['og_image'] ? nil : config['og_image_height']),
      'published' => iso_date(page['date']),
      'modified' => iso_date(page['last_modified_at'])
    }
  end

  def graph(config, page)
    meta = metadata(config, page)
    home = absolute(config, '/')
    person_id = "#{home}#person"
    site_id = "#{home}#website"
    page_id = "#{meta['canonical_url']}#webpage"
    person = {
      '@type' => 'Person', '@id' => person_id, 'name' => meta['site_name'],
      'url' => home, 'sameAs' => same_as(config)
    }
    person['image'] = absolute(config, config['og_image']) if present?(config['og_image'])
    website = {
      '@type' => 'WebSite', '@id' => site_id, 'url' => home, 'name' => meta['site_name'],
      'description' => text(config['description']), 'inLanguage' => config['lang'] || 'en',
      'publisher' => { '@id' => person_id }
    }
    web_page = {
      '@type' => page['url'] == '/' ? 'ProfilePage' : (page['schema_type'] || 'WebPage'),
      '@id' => page_id, 'url' => meta['canonical_url'], 'name' => meta['title'],
      'description' => meta['description'], 'inLanguage' => config['lang'] || 'en',
      'isPartOf' => { '@id' => site_id }
    }
    web_page['mainEntity'] = { '@id' => person_id } if page['url'] == '/'
    nodes = [person, website, web_page]
    if meta['is_post']
      # Match the byline actually displayed on the page; do not silently claim sole authorship.
      authors = Array(page['authors']).map { |a| author(a['name'], config, a['url']) }
      authors = [author(page['author'] || meta['site_name'], config, page['author_url'])] if authors.empty?
      article = {
        '@type' => 'BlogPosting', '@id' => "#{meta['canonical_url']}#article",
        'url' => meta['canonical_url'], 'headline' => text(page['title']),
        'description' => meta['description'], 'mainEntityOfPage' => { '@id' => page_id },
        'isPartOf' => { '@id' => site_id }, 'inLanguage' => config['lang'] || 'en',
        'author' => authors, 'publisher' => { '@id' => person_id }
      }
      article['datePublished'] = meta['published'] if meta['published']
      article['dateModified'] = meta['modified'] if meta['modified']
      article['image'] = meta['image'] if meta['image']
      article['keywords'] = page['tags'] if present?(page['tags'])
      article['citation'] = page['paper_url'] if present?(page['paper_url'])
      web_page['mainEntity'] = { '@id' => article['@id'] }
      nodes << article
    end
    { '@context' => 'https://schema.org', '@graph' => nodes }
  end

  def publication(config, entry)
    # Jekyll Scholar supplies already-parsed authors and LaTeX-filtered display fields.
    url = absolute(config, "/publications/##{entry['key']}")
    item = {
      '@context' => 'https://schema.org', '@type' => 'ScholarlyArticle', '@id' => url,
      'url' => url, 'name' => text(entry['title']),
      'author' => Array(entry['author_array']).map do |a|
        author([a['first'], a['prefix'], a['last'], a['suffix']].compact.join(' ').gsub(/[¶*†^]/, ''), config)
      end
    }
    item['datePublished'] = entry['year'].to_s if present?(entry['year']) # Preserve year-only precision.
    item['abstract'] = text(entry['abstract']) if present?(entry['abstract'])
    item['sameAs'] = []
    item['sameAs'] << "https://doi.org/#{entry['doi'].to_s.sub(%r{\Ahttps?://(?:dx\.)?doi\.org/}, '')}" if present?(entry['doi'])
    item['sameAs'] << "https://arxiv.org/abs/#{entry['arxiv']}" if present?(entry['arxiv'])
    %w[url html pdf].each do |key|
      next unless present?(entry[key])

      link = entry[key]
      link = "/assets/pdf/#{link}" if key == 'pdf' && !link.match?(%r{\A(?:https?://|/)})
      item['sameAs'] << absolute(config, link)
    end
    item['sameAs'].uniq!
    item.delete('sameAs') if item['sameAs'].empty?
    venue = entry['journal'] || entry['booktitle']
    item['isPartOf'] = { '@type' => 'CreativeWork', 'name' => text(venue) } if present?(venue)
    item
  end

  def json_ld(value)
    # JSON escaping alone does not prevent </script> from ending an HTML script element.
    JSON.generate(value).gsub('<', '\\u003c').gsub('>', '\\u003e').gsub('&', '\\u0026')
        .gsub("\u2028", '\\u2028').gsub("\u2029", '\\u2029')
  end
end

module SiteSEOFilters
  def seo_metadata(page)
    SiteSEO.metadata(@context.registers[:site].config, page)
  end

  def seo_graph(page)
    site = @context.registers[:site]
    SiteSEO.graph(site.config, page)
  end

  def publication_schema(entry)
    SiteSEO.publication(@context.registers[:site].config, entry)
  end

  def json_ld(value)
    SiteSEO.json_ld(value)
  end
end

Liquid::Template.register_filter(SiteSEOFilters) if defined?(Liquid::Template)
