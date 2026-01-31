export default function WaymoInviteScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between py-2">
          {/* Back button or empty space */}
          <div className="w-6" />

          {/* Title - "More about Waymo" is actually the page title, but usually minimal centered or left */}
          {/* Looking at the image, "More about Waymo" is a large heading below standard header area */}
          <div className="w-6 flex justify-end">
            {/* ... icon could go here */}
            <span className="text-xl font-bold tracking-widest pb-2">...</span>
          </div>
        </header>

        <section className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-slate-900">More about Waymo</h1>

          {/* Invite Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Have an invite code?</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter it now to ride in one of our active service areas
              </p>
              <button className="w-full py-3.5 px-4 rounded-xl border border-gray-200 text-slate-900 font-semibold hover:bg-gray-50 transition-colors active:bg-gray-100">
                Enter invite code
              </button>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {/* Map Image Placeholder */}
            <div className="relative h-48 bg-gray-200 w-full">
              <img
                src="https://placehold.co/800x400/e2e8f0/94a3b8?text=Map+Area"
                alt="Map Area"
                className="w-full h-full object-cover"
              />
              {/* Blue dots simulation */}
              <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-blue-500 rounded-full border-4 border-blue-200 shadow-lg opacity-80" />
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-blue-500 rounded-full border-4 border-blue-200 shadow-lg opacity-80" />
              <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-blue-500 rounded-full border-4 border-blue-200 shadow-lg opacity-80" />
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Where you can find us</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Ride today with Waymo in San Francisco, Los Angeles, and Phoenix! You can also find
                us in Austin and Atlanta on the Uber app.
              </p>
              <button className="w-full py-3.5 px-4 rounded-xl border border-gray-200 text-slate-900 font-semibold hover:bg-gray-50 transition-colors active:bg-gray-100">
                See service areas
              </button>
            </div>
          </div>
        </section>

        {/* Footer/Branding */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-400 rounded-md flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-semibold text-slate-700">Waymo</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>curated by</span>
            <span className="font-bold text-gray-600">Mobbin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
