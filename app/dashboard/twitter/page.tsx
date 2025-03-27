"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Twitter, Copy, Send, Clock, CheckCircle2, Trash2, Wand2, History, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { toast } from 'react-hot-toast';

interface GeneratedTweet {
  content: string;
  timestamp: string;
}

interface ThreadTweet {
  content: string;
  timestamp: string;
}

interface ThreadGeneration {
  tweets: string[];
  topic: string;
  timestamp: string;
}

export default function TwitterAIPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("general");
  const [tone, setTone] = useState("professional");
  const [count, setCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tweetIdeas, setTweetIdeas] = useState<string[]>([]);
  const [savedTweets, setSavedTweets] = useState<string[]>([]);
  const [recentTopics, setRecentTopics] = useState([
    {
      id: 1,
      title: "Tech Industry Updates",
      audience: "Tech Professionals",
      date: "3 days ago",
    },
    {
      id: 2,
      title: "Digital Marketing Tips",
      audience: "Marketers",
      date: "Last week",
    },
    {
      id: 3,
      title: "Productivity Hacks",
      audience: "Professionals",
      date: "2 weeks ago",
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTweets, setGeneratedTweets] = useState<GeneratedTweet[]>([]);
  const [selectedTweet, setSelectedTweet] = useState<string>('');
  const [threadTopic, setThreadTopic] = useState('');
  const [threadCount, setThreadCount] = useState(3);
  const [isGeneratingThread, setIsGeneratingThread] = useState(false);
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [threadHistory, setThreadHistory] = useState<ThreadGeneration[]>([]);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [generatedTweet, setGeneratedTweet] = useState('');

  useEffect(() => {
    const checkTwitterConnection = async () => {
      try {
        const res = await fetch('/api/twitter/verify');
        const data = await res.json();
        setIsTwitterConnected(data.connected);
      } catch (error) {
        console.error('Error checking Twitter connection:', error);
        toast.error('Failed to check Twitter connection');
      } finally {
        setIsCheckingConnection(false);
      }
    };

    if (session) {
      checkTwitterConnection();
    }
  }, [session]);

  const handleConnectTwitter = () => {
    signIn('twitter');
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTweetIdeas([]);

    try {
      if (!topic.trim()) {
        throw new Error("Please enter a topic for your tweets");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock response
      const mockTweets = [
        `Just published a new article on ${topic}! Check out the latest trends and insights that are shaping the industry in 2025. #${topic.replace(/\s+/g, "")} #TrendWatch`,
        `Did you know? 73% of companies investing in ${topic} reported increased ROI within the first year. The numbers don't lie - it's time to get on board! #ROI #BusinessGrowth`,
        `"The best time to start with ${topic} was yesterday. The second best time is today." Don't miss out on the opportunities this technology offers. #Innovation #FutureReady`,
        `Looking for ways to implement ${topic} in your business? Join our free webinar next Tuesday where we'll share practical strategies and real-world case studies. Link in bio! #Webinar #LearningTogether`,
        `The 3 biggest misconceptions about ${topic} that are holding businesses back. Thread 🧵👇 #MythBusting #FactCheck`,
      ];

      setTweetIdeas(mockTweets.slice(0, count));
    } catch (err: any) {
      setError(err.message || "An error occurred while generating tweets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (tweet: string) => {
    navigator.clipboard.writeText(tweet);
  };

  const handleSave = (tweet: string) => {
    setSavedTweets([...savedTweets, tweet]);
  };

  const handleRemove = (index: number) => {
    const newSavedTweets = [...savedTweets];
    newSavedTweets.splice(index, 1);
    setSavedTweets(newSavedTweets);
  };

  const handlePost = (tweet: string) => {
    // In a real app, this would connect to Twitter API
    alert("This would post to Twitter in a real implementation!");
  };

  const handleGenerateTweet = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt for tweet generation',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/twitter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate tweet');
      }

      setGeneratedTweet(data.tweet);
      toast({
        title: 'Success',
        description: 'Tweet generated successfully',
      });
    } catch (error) {
      console.error('Error generating tweet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate tweet',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostTweet = async () => {
    if (!generatedTweet) {
      toast({
        title: 'Error',
        description: 'Please generate a tweet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: generatedTweet }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to post tweet');
      }

      toast({
        title: 'Success',
        description: 'Tweet posted successfully',
      });

      // Clear the generated tweet after posting
      setGeneratedTweet('');
      setPrompt('');
    } catch (error) {
      console.error('Error posting tweet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post tweet',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateThread = async () => {
    if (!threadTopic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for the thread',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingThread(true);

    try {
      const res = await fetch('/api/twitter/generate-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ 
          topic: threadTopic,
          tweetCount: threadCount 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate thread');
      }

      setGeneratedThread(data.tweets);
      setThreadHistory(prev => [{
        tweets: data.tweets,
        topic: threadTopic,
        timestamp: new Date().toISOString()
      }, ...prev]);

      toast({
        title: 'Success',
        description: 'Thread generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate thread',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingThread(false);
    }
  };

  const handlePostThread = async (tweets: string[]) => {
    try {
      const res = await fetch('/api/twitter/post-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ tweets }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to post thread');
      }

      toast({
        title: 'Success',
        description: 'Thread posted successfully',
      });

      // Clear the generated thread after posting
      setGeneratedThread([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post thread',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container p-4 md:p-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Twitter AI Assistant</h1>
          <p className="text-muted-foreground">
            Generate engaging tweets tailored to your audience
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Twitter Content Generator</CardTitle>
            <CardDescription>
              Create engaging tweets tailored to your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generate">
              <TabsList className="mb-4">
                <TabsTrigger value="generate">Generate Tweets</TabsTrigger>
                <TabsTrigger value="saved">Saved Tweets ({savedTweets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="generate">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Keywords</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Artificial Intelligence, Digital Marketing, etc."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select
                        value={audience}
                        onValueChange={setAudience}
                      >
                        <SelectTrigger id="audience">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="professionals">Professionals</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="executives">Executives</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select
                        value={tone}
                        onValueChange={setTone}
                      >
                        <SelectTrigger id="tone">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="count">Number of Tweets ({count})</Label>
                    </div>
                    <Slider
                      id="count"
                      min={1}
                      max={5}
                      step={1}
                      value={[count]}
                      onValueChange={(value) => setCount(value[0])}
                      className="w-full"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading || !topic.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        <Twitter className="mr-2 h-4 w-4" />
                        Generate Tweets
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
                      Crafting engaging tweets for your audience...
                    </p>
                  </div>
                )}

                {tweetIdeas.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Generated Tweets</h3>
                    <div className="space-y-4">
                      {tweetIdeas.map((tweet, index) => (
                        <div key={index} className="rounded-md border p-4">
                          <p className="mb-3">{tweet}</p>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(tweet)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSave(tweet)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePost(tweet)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Post
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved">
                {savedTweets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No saved tweets yet. Generate and save some tweets to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedTweets.map((tweet, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <p className="mb-3">{tweet}</p>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(tweet)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemove(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handlePost(tweet)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Post
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Topics</CardTitle>
              <CardDescription>
                Your recently generated tweet topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="rounded-md bg-primary/10 p-2">
                      <Twitter className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{topic.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {topic.audience}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {topic.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Topics
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twitter Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Keep tweets concise and focused</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Use relevant hashtags (1-2 per tweet)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Include a call to action when appropriate</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Post consistently for better engagement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tweet Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Tweet</CardTitle>
          <CardDescription>
            Describe what you want to tweet about and our AI will help you craft the perfect message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g., Write a tweet about the latest developments in AI technology"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateTweet}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Tweet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Tweet Preview */}
      {generatedTweet && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Tweet</CardTitle>
            <CardDescription>Review and post your generated tweet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <p>{generatedTweet}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(generatedTweet)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={handlePostTweet} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Post Tweet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation History */}
      {generatedTweets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Generated Tweets History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedTweets.map((tweet, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedTweet(tweet.content)}
                >
                  <p className="text-sm">{tweet.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Generated at {new Date(tweet.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thread Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Twitter Thread</CardTitle>
          <CardDescription>
            Create an engaging thread about your topic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="Enter the topic for your thread"
              value={threadTopic}
              onChange={(e) => setThreadTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Number of Tweets ({threadCount})</Label>
            </div>
            <Slider
              min={2}
              max={5}
              step={1}
              value={[threadCount]}
              onValueChange={(value) => setThreadCount(value[0])}
            />
          </div>
          <Button
            onClick={handleGenerateThread}
            disabled={isGeneratingThread}
            className="w-full"
          >
            {isGeneratingThread ? (
              'Generating Thread...'
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Thread
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Thread Preview */}
      {generatedThread.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thread Preview</CardTitle>
            <CardDescription>Review and post your generated thread</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedThread.map((tweet, index) => (
              <div key={index} className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm">{tweet}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(generatedThread.join('\n\n'))}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
              <Button
                onClick={() => handlePostThread(generatedThread)}
                className="flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                Post Thread
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thread History */}
      {threadHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Generated Threads History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threadHistory.map((thread, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setGeneratedThread(thread.tweets)}
                >
                  <p className="font-medium mb-2">{thread.topic}</p>
                  {thread.tweets.map((tweet, tweetIndex) => (
                    <p key={tweetIndex} className="text-sm text-muted-foreground mb-2">
                      {tweet}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Generated at {new Date(thread.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}