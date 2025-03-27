"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, BookText, Download, FileText, Clock, CheckCircle2 } from "lucide-react";

export default function ResearchAIPage() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [researchPaper, setResearchPaper] = useState<string | null>(null);
  const [paperType, setPaperType] = useState("academic");
  const [wordCount, setWordCount] = useState("1500");
  const [includeSources, setIncludeSources] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(false);
  const [recentPapers, setRecentPapers] = useState([
    {
      id: 1,
      title: "Artificial Intelligence in Healthcare",
      type: "Academic",
      date: "Yesterday",
    },
    {
      id: 2,
      title: "Climate Change: Current Trends",
      type: "Research",
      date: "3 days ago",
    },
    {
      id: 3,
      title: "Blockchain Technology Applications",
      type: "Technical",
      date: "Last week",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResearchPaper(null);

    try {
      if (!topic.trim()) {
        throw new Error("Please enter a research topic");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Mock response
      setResearchPaper(
        `# ${topic}: A Comprehensive Analysis

## Abstract
This research paper examines the current state and future implications of ${topic}. Through a systematic review of literature and analysis of recent developments, this study provides insights into key trends, challenges, and opportunities in this field.

## 1. Introduction
${topic} has emerged as a significant area of interest in recent years, attracting attention from researchers, practitioners, and policymakers alike. This paper aims to provide a comprehensive overview of the current landscape, historical context, and future directions.

## 2. Literature Review
The existing literature on ${topic} reveals several key themes and perspectives. Smith (2023) argues that technological advancements have accelerated progress in this field, while Johnson (2022) emphasizes the importance of regulatory frameworks to guide ethical implementation.

## 3. Methodology
This research employs a mixed-methods approach, combining qualitative analysis of expert interviews with quantitative data from recent surveys and studies. Data was collected from multiple sources including academic databases, industry reports, and government publications.

## 4. Findings
The analysis reveals several significant findings:

- Trend 1: Increasing adoption across multiple sectors
- Trend 2: Emerging challenges related to implementation
- Trend 3: Evolving best practices and standards
- Trend 4: Regional variations in approach and outcomes

## 5. Discussion
The findings suggest that ${topic} is undergoing rapid evolution, with implications for various stakeholders. The integration of new technologies appears to be a key driver of innovation in this space, while regulatory considerations remain important for sustainable development.

## 6. Conclusion
This research contributes to the understanding of ${topic} by synthesizing current knowledge and identifying future research directions. The findings highlight the dynamic nature of this field and the need for continued investigation.

## References
1. Smith, J. (2023). Advances in ${topic}. Journal of Modern Research, 45(2), 112-128.
2. Johnson, A. (2022). Regulatory Frameworks for ${topic}. Policy Studies Review, 18(3), 201-215.
3. Williams, R. et al. (2023). Comparative Analysis of ${topic} Applications. International Journal of Applied Sciences, 12(4), 345-360.
4. Brown, M. (2021). The Evolution of ${topic}: A Historical Perspective. Technology Review, 33(1), 78-92.
5. Davis, S. & Wilson, T. (2022). Challenges and Opportunities in ${topic}. Strategic Management Journal, 29(5), 412-430.`
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the research paper");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!researchPaper) return;

    const element = document.createElement("a");
    const file = new Blob([researchPaper], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, "_")}_research_paper.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container p-4 md:p-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research AI Agent</h1>
          <p className="text-muted-foreground">
            Generate professional research papers on any topic
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Research Paper Generator</CardTitle>
            <CardDescription>
              Enter a topic to generate a comprehensive research paper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Research Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Artificial Intelligence in Healthcare"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paperType">Paper Type</Label>
                  <Select
                    value={paperType}
                    onValueChange={setPaperType}
                  >
                    <SelectTrigger id="paperType">
                      <SelectValue placeholder="Select paper type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="review">Literature Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wordCount">Word Count</Label>
                  <Select
                    value={wordCount}
                    onValueChange={setWordCount}
                  >
                    <SelectTrigger id="wordCount">
                      <SelectValue placeholder="Select word count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">~1000 words</SelectItem>
                      <SelectItem value="1500">~1500 words</SelectItem>
                      <SelectItem value="2000">~2000 words</SelectItem>
                      <SelectItem value="3000">~3000 words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Additional Options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSources"
                      checked={includeSources}
                      onCheckedChange={(checked) => setIncludeSources(checked as boolean)}
                    />
                    <Label htmlFor="includeSources" className="cursor-pointer">
                      Include citations and references
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                    />
                    <Label htmlFor="includeCharts" className="cursor-pointer">
                      Include data visualizations (where applicable)
                    </Label>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading || !topic.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Paper
                  </>
                ) : (
                  <>
                    <BookText className="mr-2 h-4 w-4" />
                    Generate Research Paper
                  </>
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="mt-8 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Researching and generating your paper...
                </p>
                <div className="mt-4 w-full max-w-md">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Gathering sources...</p>
                    <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-primary w-4/5 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <p className="text-xs text-muted-foreground">Analyzing data...</p>
                    <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-primary w-3/5 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <p className="text-xs text-muted-foreground">Writing paper...</p>
                    <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-primary w-2/5 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {researchPaper && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated Research Paper</h3>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Paper
                  </Button>
                </div>
                <div className="rounded-md border p-4 bg-muted/50 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">{researchPaper}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Papers</CardTitle>
              <CardDescription>
                Your recently generated research papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="rounded-md bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{paper.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {paper.type}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {paper.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Papers
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Research Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Be specific with your research topic</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Choose the appropriate paper type for your needs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Always verify sources and citations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Use the generated paper as a starting point</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}