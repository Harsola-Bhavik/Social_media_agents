import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Youtube, BookText, Twitter, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-20 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              About AI Agents Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Learn how our AI-powered platform can transform your workflow and boost productivity.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mission Section */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At AI Agents Platform, we're dedicated to making advanced AI technology accessible to everyone. Our mission is to empower users with intelligent tools that save time, enhance creativity, and provide valuable insights.
                </p>
                <p className="text-muted-foreground">
                  We believe that AI should be a collaborative partner in your work, not a replacement. Our agents are designed to augment your capabilities, helping you achieve more with less effort.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                  alt="Team working with AI" 
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Our AI Agents
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Youtube className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>YouTube Agent</CardTitle>
                  <CardDescription>
                    Extract insights from video content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Summarize any YouTube video</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Ask questions about video content</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Save and organize video insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Extract key points and timestamps</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BookText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Research AI Agent</CardTitle>
                  <CardDescription>
                    Generate comprehensive research papers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Create professional research papers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Access high-quality sources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Include citations and references</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Customize paper format and length</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Twitter className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Twitter Agent</CardTitle>
                  <CardDescription>
                    Create engaging social media content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Generate audience-specific tweets</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Customize tone and style</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Post directly to Twitter</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Schedule content for optimal engagement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Our Technology
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced AI Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We leverage state-of-the-art AI models like Mistral, BLOOM, and Open-Assistant to provide high-quality results.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secure Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your data is protected with industry-standard security protocols and OAuth integration.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>API Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Seamless connections with YouTube, Twitter, and research databases for comprehensive results.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Scalable Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built on modern cloud architecture to ensure reliability and performance at any scale.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Ready to Experience the Power of AI?
            </h2>
            <p className="mx-auto max-w-[600px] mb-8 text-primary-foreground/90">
              Join thousands of users who are already leveraging our AI agents to save time and create better content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="secondary" size="lg" className="px-8">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2025 AI Agents Platform. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}