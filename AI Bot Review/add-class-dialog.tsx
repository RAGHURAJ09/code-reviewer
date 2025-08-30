import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CodeSubmission } from "@shared/schema";

export function AdminSubmissionList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: submissions, isLoading } = useQuery<CodeSubmission[]>({
    queryKey: ["/api/submissions"],
  });

  const getStatusBadge = (submission: CodeSubmission) => {
    switch (submission.status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "analyzing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Analyzing
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
        <div className="text-center text-gray-500 py-8">
          No code submissions found. Submit some code to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
      
      {submissions.slice(0, 5).map((submission) => (
        <Card 
          key={submission.id} 
          className="border border-gray-200 hover:bg-gray-50 transition-colors"
          data-testid={`admin-submission-${submission.id}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900" data-testid={`admin-submission-title-${submission.id}`}>
                  {submission.fileName}
                </h4>
                <p className="text-sm text-gray-600" data-testid={`admin-submission-details-${submission.id}`}>
                  {formatDate(submission.createdAt!)} • {submission.language} • {submission.submittedBy}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(submission)}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "View submission",
                      description: "Submission viewer coming soon!",
                    });
                  }}
                  data-testid={`button-view-${submission.id}`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
