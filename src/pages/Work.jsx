import SEO from '../components/SEO'
import WorkHero from '../components/sections/work/WorkHero'
import Concert from '../components/sections/work/Concert'
import Services from '../components/sections/home/Services'

export default function Work() {
  return (
    <>
      <SEO
        title="Selected Explorations"
        description="A set of concept explorations and speculative rebrands from TM & Co. Studios — a look at how we think about branding, campaigns, and digital strategy."
        path="/work"
      />
      <WorkHero />
      <Concert />
      <Services />
    </>
  )
}
