import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy text-muted">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center">
              <div className="flex h-10 w-10 items-center justify-center">
                <img alt="RICOX Logo" width={40} height={40} className="h-10 w-10" src="/images/logo.png" />
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">RICOX</span>
            </div>
            <p className="mb-4 max-w-md text-sm">
              RICOX is a leading cryptocurrency investment platform that allows you to invest in vetted crypto
              projects, trade digital assets, and build a diversified portfolio with ease.
            </p>
            <div className="flex space-x-4">
              <a className="hover:text-accent-2" href="#">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a className="hover:text-accent-2" href="#">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a className="hover:text-accent-2" href="#">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a className="hover:text-accent-2" href="#">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a className="hover:text-accent-2" href="#">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-accent-2" href="/investment">
                  Investment
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/trade">
                  Trade
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/dashboard/portfolio">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-accent-2" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-accent-2" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/cookies">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent-2" href="/compliance">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-8 text-sm">
          <p>© {new Date().getFullYear()} RICOX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
