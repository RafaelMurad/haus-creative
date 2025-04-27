import { Instagram, Linkedin, Mail } from 'lucide-react'

export default function About() {
  return (
    <main className="pt-20">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1758845/pexels-photo-1758845.jpeg"
                alt="Studio Profile"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-medium mb-6">About Studio Haus</h2>
              <p className="text-gray-600 mb-6">
                With over a decade of experience in creative direction and design, we specialize in crafting visual narratives that resonate with purpose and precision.
              </p>
              <p className="text-gray-600 mb-8">
                Based in New York City, we work with clients worldwide, bringing their visions to life through thoughtful design and strategic creative direction.
              </p>
              
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3" />
                  contact@studiohaus.com
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="text-gray-700 hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-700 hover:text-black transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}