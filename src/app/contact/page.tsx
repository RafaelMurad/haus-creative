export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-20 md:pt-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-20">
        {/* Contact section */}
        <div className="pt-16 md:pt-20">
          <div className="flex flex-col md:flex-row md:gap-20">
            <div className="w-full md:w-60 flex-shrink-0 mb-4 md:mb-0">
              <h1 className="text-sm font-semibold uppercase tracking-wide text-black">
                Contact
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-[15px]">contact@studiohauscreative.com</p>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-gray-300 my-16 md:my-20"></div>

        {/* New Business section */}
        <div className="mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:gap-20">
            <div className="w-full md:w-60 flex-shrink-0 mb-4 md:mb-0">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black">
                New Business
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-lg md:text-[23px] leading-relaxed">
                We operate globally with hubs in London and São Paulo, building and scaling up bespoke teams to provide the best talent for each client. From strategy, creative direction, design through Production and Post Production. Get in touch to discuss how we can collaborate together.
              </p>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-gray-300 mb-16 md:mb-20"></div>

        {/* For Talent section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:gap-20">
            <div className="w-full md:w-60 flex-shrink-0 mb-4 md:mb-0">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black">
                For Talent
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-lg md:text-[23px] leading-relaxed">
                We are always looking to connect with creatives globally. We operate hybrid in remote between London and São Paulo. Reach out via contact@studiohauscreative.com at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom social links */}
        <div className="flex gap-6 pb-8 text-[15px]">
          <span>Instagram</span>
          <span>Linkedin</span>
        </div>
      </div>
    </main>
  );
}
