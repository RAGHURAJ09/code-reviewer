import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileCode, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { CodeSubmission } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface SubmissionCardProps {
  submission: CodeSubmission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const { data: review } = useQuery({
    queryKey: ["/api/reviews/submission", submission.id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/submission/${submission.id}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: submission.status === "completed",
  });

  const getStatusBadge = () => {
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
            <FileCode className="w-3 h-3 mr-1" />
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
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getScoreBadge = () => {
    if (!review) return null;
    
    const score = review.overallScore;
    let variant = "secondary";
    let color = "bg-gray-100 text-gray-800";
    
    if (score >= 90) {
      color = "bg-green-100 text-green-800";
    } else if (score >= 70) {
      color = "bg-yellow-100 text-yellow-800";
    } else {
      color = "bg-red-100 text-red-800";
    }
    
    return (
      <Badge className={color}>
        Score: {score}/100
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden" data-testid={`card-submission-${submission.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge()}
          {getScoreBadge()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`text-filename-${submission.id}`}>
          {submission.fileName}
        </h3>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <code className="text-sm text-gray-700 font-mono block whitespace-pre-wrap" data-testid={`text-code-${submission.id}`}>
            {submission.fileContent.length > 200 
              ? submission.fileContent.substring(0, 200) + "..." 
              : submission.fileContent}
          </code>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FileCode className="w-4 h-4 mr-2" />
          <span data-testid={`text-language-${submission.id}`}>
            {submission.language}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <User className="w-4 h-4 mr-2" />
          <span data-testid={`text-submitter-${submission.id}`}>
            {submission.submittedBy}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Clock className="w-4 h-4 mr-2" />
          <span data-testid={`text-date-${submission.id}`}>
            {formatDate(submission.createdAt!)}
          </span>
        </div>
        
        {review && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Issues Found:</span>
              <div className="flex space-x-2">
                {review.criticalIssues > 0 && (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {review.criticalIssues} Critical
                  </Badge>
                )}
                {review.warningIssues > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    {review.warningIssues} Warning
                  </Badge>
                )}
                {review.infoIssues > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {review.infoIssues} Info
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full mt-4"
          variant={submission.status === "completed" ? "default" : "secondary"}
          disabled={submission.status !== "completed"}
          data-testid={`button-view-${submission.id}`}
        >
          {submission.status === "completed" ? "View Review" : "Analysis in Progress"}
        </Button>
      </CardContent>
    </Card>
  );
}
