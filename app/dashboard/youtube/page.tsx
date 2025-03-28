"use client";

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Youtube, Save, Copy, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useToast } from '@/components/ui/use-toast';

interface VideoSummary {
  summary: string;
  videoTitle: string;
  videoId: string;
}

interface VideoQuestion {
  question: string;
  answer: string;
}

export default function YouTubePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [question, setQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [questions, setQuestions] = useState<VideoQuestion[]>([]);
  const [error, setError] = useState("");
  const [recentSummaries, setRecentSummaries] = useState([
    {
      id: 1,
      title: "How to Build a Next.js Application",
      url: "https://www.youtube.com/watch?v=example1",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Understanding React Hooks",
      url: "https://www.youtube.com/watch?v=example2",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Advanced CSS Techniques",
      url: "https://www.youtube.com/watch?v=example3",
      date: "3 days ago",
    },
  ]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/youtube/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to analyze video");
      }

      setVideoSummary(data);
      toast({
        title: 'Success',
        description: 'Video analyzed successfully',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !videoSummary?.videoId) {
      toast({
        title: 'Error',
        description: 'Please enter a question and analyze a video first',
        variant: 'destructive',
      });
      return;
    }

    setIsAskingQuestion(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/youtube/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          videoId: videoSummary.videoId,
          question: question.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to get answer");
      }

      setQuestions([{ question: question.trim(), answer: data.answer }, ...questions]);
      setQuestion("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(videoSummary?.summary || "");
  };

  const handleSave = () => {
    // In a real app, you would save to a database
    alert("Summary saved successfully!");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen ">
        <div className="max-w-4xl mx-auto">
          <div className=" shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 mt-44 text-white">YouTube Video Analysis</h1>

            {/* URL Input Form */}
            <form onSubmit={handleAnalyze} className="mb-8">
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2 text-white">
                  YouTube Video URL
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full"
                    required
                    disabled={isAnalyzing}
                  />
                  <Button type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Youtube className="mr-2 h-4 w-4" />
                        Analyze Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Summary Section */}
            {videoSummary && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{videoSummary.videoTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Summary:</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{videoSummary.summary}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Q&A Section */}
            {videoSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Ask Questions</CardTitle>
                  <CardDescription>Ask questions about the video content</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAskQuestion} className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question about the video..."
                        disabled={isAskingQuestion}
                      />
                      <Button type="submit" disabled={isAskingQuestion || !question.trim()}>
                        {isAskingQuestion ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Asking...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Ask
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {questions.length > 0 && (
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-sm">Q: {q.question}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">A: {q.answer}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}