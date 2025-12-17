export default function About() {
  return (
    <main className="min-h-screen bg-white text-black pt-20 md:pt-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-20">
        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 pt-16 md:pt-20">
          {/* Left column - Content */}
          <div className="space-y-16 md:space-y-20">
            {/* About section */}
            <div>
              <h1 className="text-sm font-semibold uppercase tracking-wide text-black mb-8">
                About Studio Haus
              </h1>
              <div className="space-y-8 text-lg md:text-[19px] leading-relaxed">
                <p>
                  Over 15 years of extensive experience creating compelling 360° campaigns, branded content and design.
                </p>
                <p>
                  Working at the intersection of advertising, branding, and experiences, my projects are marked by a refined and precise style with an editorially driven approach, where every detail is considered.
                </p>
                <p>
                  My client roster includes industry leaders such as Rolex, Swarovski, Mercedes-Benz, Bucherer, Hublot, Breitling, Victoria Beckham, Harrods, John Lewis to name a few.
                </p>
              </div>
            </div>

            {/* Contact section */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black mb-4">
                Contact
              </h2>
              <div className="space-y-2 text-[15px]">
                <p>contact@studiohauscreative.com</p>
                <div className="flex gap-4">
                  <span>Instagram</span>
                  <span>Linkedin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-sm overflow-hidden">
              <img
                src="https://www.figma.com/api/mcp/asset/f82e44f2-c742-4ab6-b971-498c8f0ab0ed"
                alt="Studio Haus portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom social links */}
        <div className="flex justify-end gap-6 pt-16 md:pt-20 pb-8 text-[15px]">
          <span>Instagram</span>
          <span>Linkedin</span>
        </div>
      </div>
    </main>
  );
}
