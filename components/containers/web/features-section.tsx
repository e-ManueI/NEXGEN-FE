export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold">NexGen AI</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2D83C6]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D83C6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Automated sample analysis using cutting-edge AI technologies for
              accurate results.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2D83C6]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D83C6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Comprehensive Reports
            </h3>
            <p className="text-gray-600">
              Detailed reports with visualizations and actionable insights for
              your materials.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2D83C6]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D83C6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Guided Onboarding</h3>
            <p className="text-gray-600">
              Multi-step onboarding process for easy sample submission and
              setup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
