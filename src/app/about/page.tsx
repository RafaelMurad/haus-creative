import React from 'react'

export default function About() {
  return (
    <main>
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-light mb-12">ABOUT</h1>
          
          <div className="prose prose-lg">
            <p>
              Studio Haus is a creative direction and design studio with a focus on branding, 
              digital design, and experiential projects for fashion, beauty, and lifestyle clients.
            </p>
            
            <p>
              We leverage our expertise across physical and digital channels to create cohesive
              brand experiences that tell compelling stories and build lasting connections with audiences.
            </p>
            
            <p>
              Founded in 2018, our team brings together diverse perspectives from design, technology,
              photography, and art direction to deliver holistic creative solutions.
            </p>

            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-light mb-6">Our Approach</h2>
              <p>
                We believe in a collaborative process that puts your brand story at the center.
                Through thoughtful design and strategic thinking, we create authentic experiences
                that resonate with your audience and elevate your brand presence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}