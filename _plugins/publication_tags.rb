module Jekyll
  class TagPublicationPageGenerator < Generator
    safe true

    def generate(site)
      return unless site.layouts.key? 'tag-publications'

      site.data['publication_tags'].each do |tag|
        site.pages << TagPublicationPage.new(site, site.source, tag)
      end
    end
  end

  class TagPublicationPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir  = "publications/tag/#{tag['tag']}"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag-publications.html')
      self.data['tag'] = tag['tag']
      self.data['title'] = "Publications tagged \"#{tag['name']}\""
    end
  end
end
