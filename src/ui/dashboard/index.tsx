import { useState } from "react";
import { Text } from "~/components/text";
import { Heading } from "~/components/heading";
import VoiceTab from "./voice";
import SalaryTab from "./salary";

type TabType = "voice" | "standup" | "salary";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("voice");

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-12 flex justify-center">
          <nav className="flex space-x-12" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("voice")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "voice"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Intern's Voice
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "voice"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>

            <button
              onClick={() => setActiveTab("standup")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "standup"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Daily Standup with Intern
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "standup"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>

            <button
              onClick={() => setActiveTab("salary")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "salary"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Intern's Salary
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "salary"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>
          </nav>
        </div>

        {/* Tab Content with Animation */}
        <div className="relative">
          {/* Voice Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "voice"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
            <VoiceTab />
          </div>

          {/* Standup Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "standup"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
              <Heading
                level={2}
                className="mb-6 text-3xl font-bold text-gray-900"
              >
                Standup
              </Heading>
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-8">
                <svg
                  className="mb-4 h-16 w-16 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <Text className="mb-2 text-center text-xl font-medium text-gray-600">
                  Standup features coming soon
                </Text>
                <Text className="max-w-md text-center text-gray-500 dark:text-gray-400">
                  We're working on new features to make your standups more
                  efficient and insightful.
                </Text>
              </div>
            </div>
          </div>

          {/* Salary Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "salary"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
            <SalaryTab />
          </div>
        </div>
      </div>
    </main>
  );
}
