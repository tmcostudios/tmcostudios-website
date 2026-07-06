import ContactHero from '../components/sections/contact/ContactHero'
import ContactDetails from '../components/sections/contact/ContactDetails'
import ContactForm from '../components/sections/contact/ContactForm'
import ContactMap from '../components/sections/contact/ContactMap'
import ContactFAQ from '../components/sections/contact/ContactFAQ'
import ContactCTA from '../components/sections/contact/ContactCTA'

export default function Contact() {
  return (
    <>
      <ContactHero />
      <ContactDetails />
      <ContactForm />
      <ContactMap />
      <ContactFAQ />
      <ContactCTA />
    </>
  )
}
