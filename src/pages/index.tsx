import React from 'react';
import Image from 'next/image';
import { Heading, Subheading } from '~/components/heading';
import { Text, Strong } from '~/components/text';
import { Button } from '~/components/button';
import { Link } from '~/components/link';
import { Divider } from '~/components/divider';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-[#F7F7F7]" />
        
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight text-[#0B0B0D] mb-6 md:text-6xl">
              Meet <span className="text-indigo-600">Rooki</span>, Your AI Social Media Intern
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              24/7 social media monitoring and engagement for busy startup founders who are too focused building the next big thing.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:justify-center">
            <Button color="indigo" href="/dashboard">
              Get Started
            </Button>
            {/* <Button color="white" href="#how-it-works">
              Learn More
            </Button> */}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <Heading className="text-center mb-16">How Rooki Works For You</Heading>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <Subheading>Learns Your Business</Subheading>
              <Text className="mt-3">
                Rooki understands your positioning statement and tone characteristics to represent your brand authentically.
              </Text>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <Subheading>Monitors 24/7</Subheading>
              <Text className="mt-3">
                Continuously scans social media to identify key trends and conversations relevant to your business.
              </Text>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <Subheading>Communicates Via Email & Telegram</Subheading>
              <Text className="mt-3">
                Alerts you on both Email & Telegram when there's something important that needs your attention or response.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
            <div>
              <Heading className="mb-6">Focus on Building, Let Rooki Handle Your Social Presence</Heading>
              <Text className="mb-6">
                As a startup founder, your time is precious. You're focused on building products people want, not doom scrolling through social media. Yet, maintaining a social presence is crucial for growth.
              </Text>
              <Text className="mb-8">
                <Strong>That's where Rooki comes in.</Strong> Your AI intern works tirelessly to identify opportunities for engagement, draft responses, and keep you in the loop only when it matters.
              </Text>
              <Button color="indigo" href="/dashboard">
                Hire Your AI Intern Today
              </Button>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <h3 className="text-2xl font-bold mb-6">What Rooki Does For You:</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identifies trending topics relevant to your business</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Drafts engaging responses in your brand voice</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Alerts you only when human input is needed</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Works 24/7 so you don't have to</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <Heading className="text-center mb-16">Simple to Use, Powerful Results</Heading>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">1</div>
              <Subheading className="mb-3">Set Up Your Profile</Subheading>
              <Text>Define your business's positioning statement and tone characteristics.</Text>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">2</div>
              <Subheading className="mb-3">Connect Telegram</Subheading>
              <Text>Link your Telegram account to receive important notifications from Rooki.</Text>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">3</div>
              <Subheading className="mb-3">Rooki Starts Working</Subheading>
              <Text>Your AI intern begins monitoring social media for relevant conversations.</Text>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">4</div>
              <Subheading className="mb-3">Act on Insights</Subheading>
              <Text>Receive alerts when there's an opportunity to engage or respond.</Text>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button color="indigo" href="/dashboard">
              Start Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#F7F7F7] border-t border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600 mr-2">Rooki</span>
                <span className="text-zinc-500">AI</span>
              </div>
              <Text className="mt-2 text-sm">Your AI social media intern for busy founders</Text>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-zinc-500 hover:text-indigo-600">Terms</Link>
              <Link href="#" className="text-zinc-500 hover:text-indigo-600">Privacy</Link>
              <Link href="#" className="text-zinc-500 hover:text-indigo-600">Contact</Link>
            </div>
          </div>
          <Divider className="my-8" />
          <Text className="text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} RookiAI. All rights reserved.
          </Text>
        </div>
      </footer>
    </div>
  );
}
