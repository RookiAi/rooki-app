import { useState } from "react";
import { Heading } from "~/components/heading";
import { Text } from "~/components/text";
import { Input } from "~/components/input";
import { Button } from "~/components/button";
import { api } from "~/utils/api";
import Head from "next/head";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addToWaitlist = api.waitlist.addToWaitlist.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setEmail("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      setError(error.message || "An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    setError("");
    addToWaitlist.mutate({ email });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{
      backgroundColor: "#F5F5F0",
      backgroundImage: "url('data:image/png;base64,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')"
    }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 shadow-lg relative" 
           style={{
             backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.02) 100%)',
             transform: 'rotate(-0.5deg)',
             borderRadius: '2px',
             backgroundSize: '100% 1.2rem',
             boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 8px rgba(0,0,0,0.07)',
             position: 'relative',
           }}>
        {/* Corner fold effect */}
        <div 
          className="absolute top-0 right-0 w-0 h-0 z-20" 
          style={{
            borderTop: '70px solid #e6e6e0',
            borderLeft: '70px solid transparent',
            boxShadow: '-6px 6px 10px -6px rgba(0,0,0,0.15)',
            filter: 'brightness(1.1)',
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-0 h-0 z-10" 
          style={{
            borderTop: '66px solid transparent',
            borderLeft: '66px solid transparent',
          }}
        ></div>

        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABBpJREFUaEPtmW2OFDcQhp+i1/wA4QSYEwBO4HACzAmAE8CcADhBgBMAJ8CcADgBzA+QHzhlq9zV7emZ7el1Lxo0I61W6i77ebtsV7kVRzbbdHR87O12y2I+zyaLZeHcnZs36w+vQX7sKc5VW9AzZC7OrUG8IK7WIMvGg+Ozs9drs34CbLKFMlZHD0FY10Qjl5PJ6cNs9ulsNjsCfthMHmILaQwyFLlY4twdYz8Di+vZ7GJnYaYAP4zTZAsWK1qBuJubd86W12jgBjg+tPbDGvdBLgO5w7kfgItDDJk0M29C7KBUQNzNzZGx9jUwB/4FTg41ZH6NWHKXV6vH42x2AXxqQIytzjFWgAT39y8sX/uh8/i3j8zyU3JdxjrH2A5ktZC/YO0XYAEoXAYZMqsKKmPnGDuAtIVSvbGwWIGTklqA3JdFRo+FW2CrqSJJBPpcrSAuCMsVYv4Azg8xZKYjGWu2Yk0KxAUQeaLyuD4hTjFU0lQFnQJIXCjViyu02oRMHVpgzPdvzVbGbkFWC30G/Az8NSTPWJztKrb3A2OzHSzqQPJCmZNanKH1a1+yjbG92rTFVkAKQml5Bp6PdcxpMt6aVCnkISiA7CWUQ7bPmIomO4AEoVSXUNK8qkpmKNnOYn8lkMrQqoXmKrbVKfMdYy1aBUgvobTcAtYDTLOtsR1IayiNMGTGIKtMJpBBQtlT7O9K9scJZZ+d/bZxpRYkWyhjR1LsayKdm1RKaG2cA5MNmZJRrUF6C2XL6sPFfg0yTSgb+rQmxOojMlkoX5JkI4jXh1a2UE4f9fBa8hpkXGjptLtbLNLkEdO06dODDK3qzj6WJMcqn2aTx7aGVn4kqSaZQpLpo75Ygg2tGpC+hsycJLNhpJf9eklmkHyhjL2anmRKzLHJbLH/yoRWaKNPcqvuBEkm1mSGMBsktMYkmbWQCZ6oTTKDhNaYJFMrZHRCPCi0xiSZeq8Ukoy+HsUME1pjkky9V7YkmS3IDmTXVVqTzN7JG2PrIPuuZOokE29exxKDQqtLkqmVZAYJrS5JpqkkU0u2U0JrTJIZJJRdQquvJFMvZIyXJjO6vXJIkhlbk0lBjCSZPUNrtSTTXJNJCTGSZJIkO1b9TQmtWpLZgLSRZFJCDCSZXkmm2NSE0CrUZPYlGd1MJvUdXpJJbTglyWzF+PrQKl9dDkky6+bTpvqlzFBJZt0ReSG/oV2XCx95UxMfkRpk/bTrKq0lydRLMhshvgaZrMkMLMnUh1YLSaY+tCb1DeSU0BpIkvnokswQoZVJMu9LMkOFVgHJdCSZfiR76E39OPlIJZkhQmtfksk2JwdJMoOEVgbJxB/0+0kyQ4VWhSQTf9DvRZIZKrQKksz+JJOab1KSGSy0KkiyA0syQ4TWRklG1++z2TLFGP4H28N6iG4s5LAAAAAASUVORK5CYII=')",
            backgroundRepeat: 'repeat',
          }}
        ></div>
        <div className="mb-8 relative z-10">
          <div className="space-y-5 relative z-10" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.25rem', lineHeight: '1.7' }}>
            <div className="ml-2 mb-6" style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '2.2rem' }}>A letter from us...</div>
            
            <div className="text-xl">Hi there 👋 Jingles and Hinson here.</div>
            
            <div className="text-xl">Rooki started from a pain we kept running into. As founders, we spend all day building, talking to users, shipping code… and then realize our socials were dead quiet. Writing posts, catching trends, replying to mentions, honestly felt like a whole other job.</div>
            
            <div className="text-xl">At the YC AI Agents Hackathon, we decided to fix that for ourselves. In 24 hours we hacked together Rooki, your AI social media intern. It learns your voice, scrolls the timeline, and helps you stay visible while you stay focused on building.</div>
            
            <div className="text-xl">Rooki isn’t about chasing likes or vanity metrics. It’s about showing up consistently, in your own style. It’s about not missing that moment with a future customer, partner, or investor just because you were deep in code.</div>
            
            <div className="text-xl">We're now opening Rooki to more founders and teams. If you want early access + updates as we grow, drop your email below.</div>
            
            <div className="my-8 transform rotate-0.5 -mx-2 px-2 py-4" style={{ 
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderTop: '1px dashed rgba(0,0,0,0.1)',
              borderBottom: '1px dashed rgba(0,0,0,0.1)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow">
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full"
                      disabled={isSubmitting}
                      style={{ fontSize: '1.3rem' }}
                    />
                    {error && <div className="mt-1 text-red-600 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>{error}</div>}
                  </div>
                  <Button type="submit" color="blue" disabled={isSubmitting} className="font-medium" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem' }}>
                    {isSubmitting ? "Joining..." : "Join the waitlist"}
                  </Button>
                </form>
              ) : (
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="text-xl text-green-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.25rem' }}>Thank you for joining our waitlist! We'll be in touch soon.</div>
                </div>
              )}
            </div>
            
            <div className="text-xl">We'd love to have you along for the journey.</div>
            
            <div className="mt-10 ml-auto text-right" style={{ maxWidth: '200px' }}>
              <div className="text-xl mb-0">Cheers,</div>
              <div className="text-2xl mt-1 mb-0" style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '1.7rem', fontWeight: 600 }}>Jingles & Hinson</div>
              <div className="border-t border-gray-300 mt-1 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
