import Link from "next/link";
import { projects } from "@/config/projects";

export default function WorkPage() {
  return (
    <main className="min-h-screen">
      {/* Header section */}
      <section className="px-4 md:px-5 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-normal mb-4">Our Work</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          A selection of projects showcasing our expertise in digital experiences,
          brand identity, and creative design.
        </p>
      </section>

      {/* Projects grid */}
      <section className="px-4 md:px-5 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group relative aspect-[4/3] bg-gray-100 overflow-hidden"
            >
              {/* Project thumbnail */}
              {project.heroVideo ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={project.heroVideo.desktop}
                  poster={project.heroVideo.poster}
                  muted
                  playsInline
                  loop
                  autoPlay
                />
              ) : project.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.heroImage.desktop}
                  alt={project.heroImage.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Project info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h2 className="text-lg font-medium">{project.title}</h2>
                  {project.subtitle && (
                    <p className="text-sm text-gray-600">{project.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
