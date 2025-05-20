// app/page.tsx (Next.js App Router with TypeScript + Tailwind)
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Snapshot {
  name: string;
  ageHours: number;
  sizeGB: number;
}

interface FailedBackup {
  job: string;
  error: string;
}

interface Report {
  generatedAt: string;
  snapshots: Snapshot[];
  failedBackups: FailedBackup[];
}

export default function HomePage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/reports/latest');
        setReport(res.data);
      } catch (err) {
        console.error('Failed to fetch report:', err);
      }
    };

    fetchReport();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Snapshot & Backup Dashboard</h1>

        {!report ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-400">
              <span className="font-semibold text-white">Generated at:</span> {report.generatedAt}
            </p>

            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-2">🧨 Failed Backups</h2>
              {report.failedBackups?.length > 0 ? (
                <ul className="space-y-2">
                  {report.failedBackups.map((job, i) => (
                    <li key={i} className="bg-red-800/50 border border-red-600 p-3 rounded-md">
                      <span className="font-semibold text-red-300">{job.job}</span>: {job.error}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-400">None 🎉</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">💾 Snapshots Over 24h</h2>
              {report.snapshots?.filter(vm => vm.ageHours > 24).length > 0 ? (
                <ul className="space-y-2">
                  {report.snapshots.filter(vm => vm.ageHours > 24).map((vm, i) => (
                    <li key={i} className="bg-yellow-800/40 border border-yellow-600 p-3 rounded-md">
                      <span className="font-semibold text-yellow-300">{vm.name}</span> - {vm.ageHours}h old ({vm.sizeGB} GB)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-400">None 🎉</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
