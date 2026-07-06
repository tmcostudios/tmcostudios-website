import SEO from '../components/SEO'
import AboutHero from '../components/sections/about/AboutHero'
import StudioStory from '../components/sections/about/StudioStory'
import BrandPhilosophy from '../components/sections/about/BrandPhilosophy'

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Not an agency. A studio. Meet TM & Co. Studios — the philosophy, the story, and the values behind our branding and marketing work."
        path="/about"
      />
      <AboutHero />
      <StudioStory />
      <BrandPhilosophy />
    </>
  )
}
