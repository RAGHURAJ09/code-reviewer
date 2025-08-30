import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SearchHero } from "@/components/search-hero";
import { FilterBar } from "@/components/filter-bar";
import { SubmissionCard } from "@/components/class-card";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { CodeSubmission } from "@shared/schema";
import type { ReviewFilters } from "@/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    language: "All Languages",
    severity: "All Severities",
    status: "All Status",
  });

  const { data: submissions, isLoading, refetch } = useQuery<CodeSubmission[]>({
    queryKey: ["/api/submissions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.language !== "All Languages") params.append('language', filters.language);
      if (filters.status !== "All Status") params.append('status', filters.status);
      
      const response = await fetch(`/api/submissions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
  });

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleSearch = (query: string, language: string) => {
    setFilters(prev => ({ 
      ...prev, 
      search: query || prev.search,
      language: language || prev.language
    }));
  };

  const handleFiltersChange = (newFilters: ReviewFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchHero onSearch={handleSearch} />
      <FilterBar 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
        resultCount={submissions?.length || 0}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recent Code Submissions
          </h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : submissions && submissions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="lg" data-testid="button-load-more">
                Load More Submissions
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or submit some code for review.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
