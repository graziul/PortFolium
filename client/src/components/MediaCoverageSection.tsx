import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';
import { MediaCoverage } from '@/api/projects';

interface MediaCoverageSectionProps {
  mediaCoverage?: MediaCoverage[];
}

const MediaCoverageSection: React.FC<MediaCoverageSectionProps> = ({ mediaCoverage }) => {
  if (!mediaCoverage || mediaCoverage.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Media Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mediaCoverage.map((coverage) => (
            <div
              key={coverage._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg leading-tight">
                      {coverage.title}
                    </h4>
                    <a
                      href={coverage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={`Read article: ${coverage.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {coverage.publication}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(coverage.publishedDate)}
                    </div>
                  </div>

                  {coverage.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {coverage.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCoverageSection;