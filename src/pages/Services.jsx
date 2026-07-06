import SEO from '../components/SEO'
import ServicesHero from '../components/sections/services/ServicesHero'
import CoreServices from '../components/sections/services/CoreServices'
import Differentiators from '../components/sections/services/Differentiators'

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Brand identity, creative strategy, campaigns, digital marketing, content production, and brand consulting — every discipline, one studio."
        path="/services"
      />
      <ServicesHero />
      <CoreServices />
      <Differentiators />
    </>
  )
}
