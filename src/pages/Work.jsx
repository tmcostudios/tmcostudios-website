import WorkHero from '../components/sections/work/WorkHero'
import Concert from '../components/sections/work/Concert'
import Services from '../components/sections/home/Services'

export default function Work() {
  return (
    <>
      <WorkHero />
      <Concert />
      {/* Reuse the services block — Work page shows no photo backgrounds */}
      <Services showImages={false} />
    </>
  )
}
