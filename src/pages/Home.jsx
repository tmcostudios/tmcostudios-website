import SEO from '../components/SEO'
import Hero from '../components/sections/home/Hero'
import Manifesto from '../components/sections/home/Manifesto'
import Services from '../components/sections/home/Services'
import Sectors from '../components/sections/home/Sectors'

export default function Home() {
  return (
    <>
      <SEO
        title="Branding & Marketing Studio in Gurugram"
        description="TM & Co. Studios is a full-service branding and marketing studio. We craft identities with depth, campaigns with intention, and strategies that move people — not just metrics."
        path="/"
      />
      <Hero />
      <Manifesto />
      <Services />
      <Sectors />
    </>
  )
}
