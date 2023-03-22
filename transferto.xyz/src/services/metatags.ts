const CLASS_NAME = 'metadata'
const head = document.querySelector('head')

function getDefaultValues() {
  // facebook size: 1200 x 630
  const defaultImage = {
    url: 'https://transferto.xyz/placeholder.png',
    w: 900,
    h: 450,
  }
  const data = {
    title: 'LI.FI',
    description: 'Providing liquidity when and where needed',
    url: window.location.href,
    image: defaultImage,
    lang: 'en',
    og: {
      'og:type': 'website',
      'og:site_name': 'LI.FI',
      // og:locale - The locale these tags are marked up in. Of the format language_TERRITORY. Default is en_US.
      // og:locale:alternate - An array of other locales this page is available in.
    },
    tags: {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@lifiprotocol',
    },
    noIndex: false,
    statusCode: 200,
  }

  return data
}

function updateMetaTags(data: any) {
  // set url, title and description to all formats
  data.tags['twitter:title'] = data.title
  data.tags['twitter:description'] = data.description
  data.og['og:url'] = data.url
  data.og['og:title'] = data.title
  data.og['og:description'] = data.description

  // set image to all formats
  data.tags['twitter:image'] = data.image.url
  data.og['og:image'] = data.image.url
  data.og['og:image:url'] = data.image.url
  data.og['og:image:secure_url'] = data.image.url
  data.og['og:image:width'] = data.image.w
  data.og['og:image:height'] = data.image.h

  // title and language can be changed directly. they don't need to be deleted beforehand
  document.title = data.title
  document.documentElement.lang = data.lang

  // create new tags
  var nodes: Array<any> = []
  addMetaTag(nodes, 'description', data.description)
  addCanonicalUrlTag(data.url, data.forcedLanguage, nodes)
  addMetaTag(nodes, 'prerender-status-code', data.statusCode)
  if (data.noIndex) {
    addMetaTag(nodes, 'robots', 'noindex')
  }

  Object.keys(data.og).forEach((key: string) => {
    addMetaTag(nodes, key, data.og[key], true)
  })

  Object.keys(data.tags).forEach((key: string) => {
    addMetaTag(nodes, key, data.tags[key])
  })

  if (data.prerenderHeader) {
    addMetaTag(nodes, 'prerender-header', data.prerenderHeader)
  }

  // update tags in DOM
  removeAllTagsFromDOM()
  addTagsToDOM(nodes)
}

function addTagsToDOM(nodes: Array<any>) {
  head?.append(...nodes)
}

function removeAllTagsFromDOM() {
  var toDelete = document.querySelectorAll(`.${CLASS_NAME}`)
  toDelete.forEach((elm) => elm.remove())
}

function addCanonicalUrlTag(url: string, forcedLanguage: any, nodes: Array<any>) {
  nodes.push(createLinkTag('alternate', url, 'x-default'))
  nodes.push(createLinkTag('alternate', url, 'en'))

  // When adding multiple languages use:
  // var char = url.indexOf('?') === -1 ? '?' : '&';
  // if (forcedLanguage) {
  //   nodes.push(createLinkTag('canonical', url + char + 'lang=' + forcedLanguage));
  // } else {
  //   nodes.push(createLinkTag('canonical', url));
  // }
  // var languages = ['en']

  // languages.forEach((lang) => {
  //   nodes.push(createLinkTag('alternate', url + char + 'lang=' + lang, lang));
  // })
}

// eslint-disable-next-line max-params
function addMetaTag(
  nodes: Array<any>,
  name: string,
  content: string,
  propertyTag: boolean = false,
) {
  if (content) {
    nodes.push(createMetaTag(name, content, propertyTag))
  }
}

function createMetaTag(name: string, content: string, propertyTag: boolean = false) {
  const tag = document.createElement('meta')
  if (propertyTag) {
    tag.setAttribute('property', name)
  } else {
    tag.setAttribute('name', name)
  }
  tag.setAttribute('content', content)
  tag.setAttribute('class', CLASS_NAME)
  return tag
}

function createLinkTag(rel: string, href: string, hreflang: string | null = null) {
  const tag = document.createElement('link')
  tag.setAttribute('class', CLASS_NAME)
  tag.setAttribute('rel', rel)
  tag.setAttribute('href', href)
  if (hreflang) {
    tag.setAttribute('hreflang', hreflang)
  }
  return tag
}

function setMetatags(data: any) {
  const defaultValues = getDefaultValues()
  const values = Object.assign({}, defaultValues, data)
  updateMetaTags(values)
}

export default setMetatags
