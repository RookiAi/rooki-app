import { useState } from "react";
import { Heading } from "~/components/heading";
import { Text } from "~/components/text";
import { Button } from "~/components/button";

// Icons for each category
const StartupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-emerald-500"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    <path d="M14.5 2v4" />
    <path d="M20 2v4" />
    <path d="M8.5 18l4 4" />
    <path d="M2 18l4 4" />
  </svg>
);

const AIIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-violet-500"
  >
    <path d="M12 2a5 5 0 0 0-5 5v14a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="m19 15 3 3" />
    <path d="m19 9 3-3" />
    <path d="m5 15-3 3" />
    <path d="m5 9-3-3" />
  </svg>
);

const FinanceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-blue-500"
  >
    <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
    <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
    <path d="M7 14v3" />
    <path d="M17 14v3" />
  </svg>
);

const Web3Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-amber-500"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m7 15 5-6 5 6" />
    <path d="M7 9h10" />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-red-500"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Category data
const categories = [
  {
    id: "startup",
    title: "Startup",
    description:
      "Discuss the latest startup trends, funding, and strategies for growth.",
    icon: StartupIcon,
  },
  {
    id: "ai",
    title: "AI",
    description:
      "Explore artificial intelligence innovations, use cases, and emerging technologies.",
    icon: AIIcon,
  },
  {
    id: "finance",
    title: "Finance",
    description:
      "Review market trends, investment strategies, and financial management topics.",
    icon: FinanceIcon,
  },
  {
    id: "web3",
    title: "Web3",
    description:
      "Delve into blockchain technologies, decentralized applications, and crypto ecosystems.",
    icon: Web3Icon,
  },
];

// Category Card component
interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.FC;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:translate-y-[-4px] hover:transform hover:shadow-xl"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 p-3 shadow-inner">
        <Icon />
      </div>
      <Text className="mb-2 text-xl font-bold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-600">{description}</Text>
    </div>
  );
};

export default function StandupTab() {
  const [copySuccess, setCopySuccess] = useState(false);
  const internEmail = "intern@rooki.ai";

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Category clicked: ${categoryId}`);
    // TODO: Implement category click handling, triggers a conversation with intern to generate a new post
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(internEmail)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy email: ', err);
      });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
      <Heading level={2} className="mb-8 text-3xl font-bold text-gray-900">
        Select trending topic to post about
      </Heading>

      <Text className="mb-4 text-base text-gray-600">
        These topics are relevant to you and its currently trending, shall we
        post a tweet about one of these?
      </Text>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            description={category.description}
            icon={category.icon}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200">
        <Heading level={2} className="mb-6 text-2xl font-bold text-gray-900">
          Email your intern
        </Heading>
        
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 p-3 shadow-inner">
                <EmailIcon />
              </div>
            </div>
            
            <div className="flex-1">
              <Text className="mb-3 text-base text-gray-600">
                Need something specific? Email your intern directly to request custom content, 
                change voice settings, or for any other task.
              </Text>
              
              <div className="mb-4 flex items-center">
                <div 
                  onClick={copyEmailToClipboard}
                  className="cursor-pointer flex items-center rounded-md bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                  <Text className="font-mono text-lg font-semibold text-gray-900">
                    {internEmail}
                  </Text>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-2 h-5 w-5 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                
                {copySuccess && (
                  <span className="ml-3 text-sm text-green-600">
                    Copied!
                  </span>
                )}
              </div>
              
              <a
                href="https://agentmail.to/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center opacity-70 transition-opacity hover:opacity-100"
              >
                <Text className="text-xs text-gray-500 mr-1">powered by</Text>
                <img
                  src="/logos/agentmail.png"
                  alt="AgentMail"
                  className="h-5 w-auto"
                />
                <Text className="text-xs text-gray-700 ml-1 font-medium">AgentMail</Text>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
