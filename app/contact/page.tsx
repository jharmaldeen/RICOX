import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contactFaqs } from "@/lib/data";
import { FaqList } from "@/components/FaqList";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | RICOX",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Contact Us</h1>
          <p className="mt-6 text-lg text-muted">
            Have questions or need assistance? Our team is here to help you with any inquiries about our platform
            or services.
          </p>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
            <h3 className="mt-6 text-lg font-semibold text-white">Contact Information</h3>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-accent-2" />
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="text-muted">123 Blockchain Avenue Suite 456 New York, NY 10001</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-accent-2" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-muted">+1 (555) 123-4567</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-accent-2" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-muted">support@RICOX.com</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-accent-2" />
                <div>
                  <p className="font-medium text-white">Hours</p>
                  <p className="text-muted">
                    Monday - Friday: 9AM - 6PM
                    <br />
                    Saturday: 10AM - 4PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <ContactForm />
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-3 text-center text-muted">
            Find answers to common questions about RICOX. If you can&apos;t find what you&apos;re looking for, please
            contact our support team.
          </p>
          <div className="mt-8">
            <FaqList items={contactFaqs} />
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Still have questions? Contact our support team (support@RICOX.com)
          </p>
        </section>
      </div>
    </div>
  );
}
