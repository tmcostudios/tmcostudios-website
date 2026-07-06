import SEO from '../components/SEO'
import ContactHero from '../components/sections/contact/ContactHero'
import ContactDetails from '../components/sections/contact/ContactDetails'
import ContactForm from '../components/sections/contact/ContactForm'
import ContactMap from '../components/sections/contact/ContactMap'
import ContactFAQ from '../components/sections/contact/ContactFAQ'
import ContactCTA from '../components/sections/contact/ContactCTA'

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Let's build something lasting. Get in touch with TM & Co. Studios — email, phone, or our office in Sector 65, Gurugram."
        path="/contact"
      />
      <ContactHero />
      <ContactDetails />
      <ContactForm />
      <ContactMap />
      <ContactFAQ />
      <ContactCTA />
    </>
  )
}
