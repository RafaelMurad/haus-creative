import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-5 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-normal mb-8">Get in Touch</h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl">
            We&apos;re always interested in hearing about new projects and opportunities.
            Drop us a line and let&apos;s create something amazing together.
          </p>

          {/* Contact info */}
          <div className="space-y-8">
            {/* Email */}
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                Email
              </h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-2xl md:text-3xl hover:opacity-50 transition-opacity duration-250"
              >
                {siteConfig.email}
              </a>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-4">
                Follow Us
              </h2>
              <div className="flex gap-6">
                {siteConfig.socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:opacity-50 transition-opacity duration-250"
                  >
                    {social.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Careers section */}
            <div id="careers" className="pt-12 border-t border-gray-200">
              <h2 className="text-2xl md:text-3xl font-normal mb-4">Careers</h2>
              <p className="text-gray-600 mb-4">
                We&apos;re always looking for talented individuals to join our team.
                If you&apos;re passionate about design and technology, we&apos;d love to hear from you.
              </p>
              <a
                href={`mailto:${siteConfig.email}?subject=Career Inquiry`}
                className="inline-flex items-center gap-2 text-black hover:opacity-50 transition-opacity duration-250"
              >
                Send your portfolio
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8H13M13 8L8 3M13 8L8 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
