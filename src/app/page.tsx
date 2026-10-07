import ResumeUpload from "@/components/resume-upload";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">
            AI Career Intelligence
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Resume Analyser
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Upload your resume and discover how well your skills align with
            available job opportunities.
          </p>
        </header>

        {/* Main Dashboard */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Resume Analysis Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Analyse your resume
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Upload a PDF resume to begin your analysis.
              </p>
            </div>

            {/* Functional Resume Upload */}
            <ResumeUpload />
          </div>

          {/* Matching Jobs Card */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Matching Jobs
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Your best job matches will appear here after analysis.
              </p>
            </div>

            <div className="flex min-h-56 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 px-6 text-center">
              <p className="text-sm text-slate-500">
                No job matches available yet.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}