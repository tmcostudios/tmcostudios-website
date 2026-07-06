import SEO from '../components/SEO'
import ProcessHero from '../components/sections/process/ProcessHero'
import ProcessSteps from '../components/sections/process/ProcessSteps'

export default function Process() {
  return (
    <>
      <SEO
        title="Our Process"
        description="Rigorous process, unexpected results. See the five-stage process TM & Co. Studios follows on every branding and campaign engagement."
        path="/process"
      />
      <ProcessHero />
      <ProcessSteps />
    </>
  )
}
