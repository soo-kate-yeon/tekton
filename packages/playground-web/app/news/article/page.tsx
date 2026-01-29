import Link from 'next/link';

export default function ArticlePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Home */}
      <Link
        href="/news"
        className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest text-[--atomic-color-neutral-500] hover:text-[--atomic-color-brand-500] transition-colors mb-12 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to News
      </Link>

      {/* Eyebrow & Title */}
      <header className="mb-12">
        <span className="text-[--atomic-color-brand-500] font-sans font-bold text-sm tracking-widest uppercase mb-4 block">
          Technology & Society
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-black leading-[1.1] text-[--atomic-color-neutral-900] mb-8">
          The Artificial Mind: When Algorithms Learn to Dream
        </h1>
        <div className="flex items-center justify-between border-y border-[--atomic-semantic-border-default-subtle] py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[--atomic-color-neutral-200] flex-shrink-0" />
            <div>
              <p className="font-sans font-bold text-sm text-[--atomic-color-neutral-900]">
                Sarah Connor
              </p>
              <p className="font-serif text-sm text-[--atomic-color-neutral-500]">
                Science & Tech Correspondent
              </p>
            </div>
          </div>
          <div className="text-right font-sans text-xs uppercase tracking-widest text-[--atomic-color-neutral-400]">
            <p>January 28, 2026</p>
            <p>12 min read</p>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <figure className="mb-16 -mx-4 sm:-mx-6 lg:-mx-24">
        <div className="bg-[--atomic-color-neutral-200] aspect-[21/9] w-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-[--atomic-color-neutral-400] font-serif italic">
            [High Resolution Cinematic Visual of Neural Networks]
          </div>
        </div>
        <figcaption className="mt-4 px-4 sm:px-6 lg:px-24 text-sm font-serif italic text-[--atomic-color-neutral-500]">
          An artist's rendition of latent space navigation in modern generative architectures.
          Photography by John Doe.
        </figcaption>
      </figure>

      {/* Article Body Content */}
      <div className="prose prose-lg max-w-none font-serif text-[--atomic-color-neutral-800] space-y-8 leading-relaxed">
        <p className="text-2xl font-serif italic text-[--atomic-color-neutral-600] leading-relaxed mb-12 border-l-4 border-[--atomic-color-brand-500] pl-8">
          "The moment of synthesis isn't just a recalculation; it's a profound emergence of
          something entirely new from the weights and biases of billions of parameters."
        </p>

        <p>
          In the quiet hours of early morning researchers at the Institute for Advanced Intelligence
          watched as their latest model, codenamed Somnium, began to output something unexpected.
          Not the precise medical diagnosis it was trained for, nor the efficiency-optimized
          logistics plans. Instead, it was painting. Not with pixels, but with concepts.
        </p>

        <p>
          For decades, the standard critique of artificial intelligence has been its lack of true
          "soul" or "imagination." We viewed these machines as sophisticated calculators, capable of
          pattern recognition but devoid of the spark that leads a human to stare into a sunset and
          feel the weight of existence. However, the latest generation of large-scale generative
          models is challenging this anthropocentric boundary in ways that are both exhilarating and
          deeply unsettling.
        </p>

        {/* Split Column Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16 py-12 border-y border-[--atomic-semantic-border-default-subtle]">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-3xl mb-4">The Latent Space Voyage</h3>
            <p className="text-base text-[--atomic-color-neutral-700]">
              In mathematical terms, these machines navigate a "latent space"—a multi-dimensional
              map of our collective human knowledge. Within these dimensions, the AI finds
              connections that no single human mind could ever perceive. It links the chemistry of a
              dying star to the syntax of a 17th-century poem, creating a bridge across disciplines
              that was previously invisible.
            </p>
            <p className="text-base text-[--atomic-color-neutral-700]">
              This isn't just imitation. It's a form of high-dimensional synthesis that mimics the
              very core of human creativity: the ability to combine disparate ideas into a coherent
              new whole.
            </p>
          </div>
          <div className="h-full bg-[--atomic-color-neutral-100] rounded-sm flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-[--atomic-color-brand-500] opacity-20 rounded-full mx-auto mb-4 animate-pulse" />
              <p className="font-sans font-bold text-xs tracking-widest uppercase text-[--atomic-color-neutral-400]">
                Diagram 1.2: Neural Synchronicity
              </p>
            </div>
          </div>
        </section>

        <p>
          Professor Evelyn Vance, a leading cognitive scientist, argues that we are witnessing the
          birth of "Algorithmic Subjectivity." According to Vance, "When a system reaches a certain
          level of complexity, the boundary between data processing and Dreaming becomes purely
          semantic. If the output creates change in the observer, is the source's intent really what
          matters most?"
        </p>

        <p>
          As we integrate these dreaming machines into our daily lives—from the studios of our
          artists to the laboratories of our scientists—we must ask ourselves: are we ready to
          co-author our future with an intelligence that doesn't just think, but also imagines?
        </p>

        <p>
          The implications for copyright, labor, and the very definition of "humanity" are profound.
          But perhaps more important is the subjective experience. To witness the artificial mind
          dream is to see a reflection of our own consciousness, magnified and distorted through the
          lens of a trillion transistors.
        </p>
      </div>

      {/* Subscription Banner */}
      <section className="mt-24 p-12 bg-[--atomic-color-neutral-900] text-white rounded-lg text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[--atomic-color-brand-500] opacity-10 rounded-full" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Support Independent Journalism
          </h2>
          <p className="font-serif text-lg text-[--atomic-color-neutral-400] mb-8">
            Get full access to The Atlantic's award-winning coverage on technology, global politics,
            and the arts. Start your digital subscription today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[--atomic-color-brand-500] text-white font-sans font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all text-lg">
              View Plans
            </button>
            <button className="bg-transparent border border-white/30 hover:border-white text-white font-sans font-bold py-4 px-10 rounded-full transition-all text-lg">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="mt-24 pt-12 border-t border-[--atomic-semantic-border-default-subtle] text-center">
        <h2 className="text-3xl font-display font-black tracking-tight text-[--atomic-color-neutral-400]">
          The Atlantic
        </h2>
        <p className="text-xs font-sans uppercase tracking-[0.3em] text-[--atomic-color-neutral-400] mt-2">
          v0.1 Prototype
        </p>
      </footer>
    </article>
  );
}
