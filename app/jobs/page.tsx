'use client';

/**
 * Job Listings Page
 * Displays all available job postings with search and filter capabilities
 * Users can click on a job to view details and start the application process
 */

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHireLinkStore } from '@/lib/store';
import { MapPin, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function JobsPage() {
  // Get job postings and selection functions from our state store
  const jobPostings = useHireLinkStore((state) => state.jobPostings);
  const setSelectedJobId = useHireLinkStore((state) => state.setSelectedJobId);

  // Local state for search filtering
  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on search query (title, location, or department)
  const filteredJobs = jobPostings.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Available Positions</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Search by title, location, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Job Information */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        {job.experience}
                      </div>
                    </div>
                    <p className="text-foreground text-sm line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <Link
                    href={`/apply/${job.id}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <Button className="w-full md:w-auto">
                      Apply Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // No Results State
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {searchQuery
                ? 'No jobs match your search. Try different keywords.'
                : 'No positions available at the moment.'}
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
