# Exclude derivative blog archives from the sitemap while keeping them browsable.
class SitemapExclusions < Jekyll::Generator
  safe true
  priority :low

  def generate(site)
    excluded_layouts = %w[archive-tag archive-year]

    site.pages.each do |page|
      page.data['sitemap'] = false if excluded_layouts.include?(page.data['layout'])
    end
  end
end
