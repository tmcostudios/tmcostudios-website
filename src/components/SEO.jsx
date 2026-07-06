import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://tmcostudios.com'
const SITE_NAME = 'TM & Co. Studios'
const DEFAULT_IMAGE = `${SITE_URL}/images/home-2nd.webp`

/**
 * Per-page SEO: unique title/description, canonical URL, and Open Graph /
 * Twitter Card tags so link previews (WhatsApp, LinkedIn, Slack, iMessage)
 * show real content instead of a bare fallback.
 */
export default function SEO({ title, description, path = '/', image = DEFAULT_IMAGE }) {
  const fullTitle = `${title} — ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
