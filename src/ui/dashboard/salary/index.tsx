import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";
import { Input } from "~/components/input";
import { Fieldset, Field, Label } from "~/components/fieldset";
import { useSession } from "next-auth/react";

// Custom Range Slider component since there isn't one in the component library
interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  className = "",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
        style={{
          WebkitAppearance: "none",
          appearance: "none",
        }}
      />
      <div className="h-2 w-full rounded-full bg-gray-200 shadow-inner">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div
        className="absolute top-[-8px] h-6 w-6 rounded-full bg-white shadow-md ring-2 ring-blue-500"
        style={{ left: `calc(${percentage}% - 12px)` }}
      ></div>
    </div>
  );
};

type Salary = {
  id: string;
  amount: number;
};

export default function SalaryTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salary, setSalary] = useState<Salary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const { data: sessionData } = useSession();

  // Simulating data fetch since we don't have the actual API endpoint yet
  // Later, this will be replaced with an actual API call
  useEffect(() => {
    // Mock data for now
    const mockSalary = {
      id: "1",
      amount: 2500,
    };

    setSalary(mockSalary);
    setSliderValue(mockSalary.amount);
  }, []);

  // This would be the actual API call in a real implementation
  /*
  const {
    data: salaryData,
    isLoading: isLoadingSalary,
    refetch: refetchSalary,
  } = api.salary.getSalaryByUser.useQuery(undefined, {
    enabled: true,
  });

  const updateSalary = api.salary.updateSalary.useMutation({
    onSuccess: () => {
      refetchSalary();
    },
  });
  */

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSalaryUpdate = async () => {
    if (!salary) return;

    setLoading(true);
    setError(null);

    try {
      // Simulating API call
      // In a real implementation, this would call the mutation
      /*
      await updateSalary.mutateAsync({
        id: salary.id,
        amount: sliderValue,
        currency,
        paymentSchedule,
      });
      */

      // Mock update for now
      setTimeout(() => {
        setSalary({
          ...salary,
          amount: sliderValue,
        });
        setIsEditing(false);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error updating salary:", err);
      setError(err instanceof Error ? err.message : "Failed to update salary");
      setLoading(false);
    }
  };

  async function handleCheckout() {
    const response = await fetch("/api/autumn/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionData: sessionData,
        amount: sliderValue,
      }),
    });

    const data = await response.json();
    console.log("Checkout response:", data);

    // open new window
    const urlToOpen = data.data.url;
    window.open(urlToOpen, "_blank");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-8 w-8 rounded-full bg-gray-200"></div>
          <p className="text-xl font-medium text-gray-400">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {salary ? (
        <>
          {!isEditing ? (
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
              <div className="absolute top-8 right-8">
                <Button onClick={handleEditToggle}>Adjust Salary</Button>
              </div>

              <Heading
                level={2}
                className="mb-8 pr-36 text-3xl font-bold text-gray-900"
              >
                Intern's Salary
              </Heading>

              <Text className="mb-4 text-base text-gray-600">
                Adjust your intern's salary based on performance and your
                budget. Changes will take effect from the next payment cycle.
              </Text>

              <div className="mb-8">
                <div className="rounded-xl bg-gray-50 p-6 shadow-inner">
                  <div className="flex items-end gap-2">
                    <Text className="text-4xl font-bold text-gray-900">
                      {salary.amount.toLocaleString()}
                    </Text>
                    <Text className="mb-2 text-lg text-gray-500">
                      per month
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSalaryUpdate();
              }}
              className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl"
            >
              <Heading
                level={2}
                className="mb-8 text-3xl font-bold text-gray-900"
              >
                Adjust Intern's Salary
              </Heading>

              <div className="mb-10">
                <Strong className="mb-3 block text-lg text-gray-700">
                  Salary Amount
                </Strong>
                <div className="mb-6">
                  <RangeSlider
                    min={1000}
                    max={10000}
                    step={100}
                    value={sliderValue}
                    onChange={setSliderValue}
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-500">$1,000</Text>
                    <Text className="text-xl font-bold text-gray-900">
                      ${sliderValue.toLocaleString()}
                    </Text>
                    <Text className="text-sm text-gray-500">$10,000</Text>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center space-x-4">
                <Button
                  onClick={handleCheckout}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={handleEditToggle}
                  className="rounded-full border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl">
          <Heading level={2} className="mb-6 text-3xl font-bold text-gray-900">
            No Salary Information
          </Heading>
          <Text className="mb-8 text-lg text-gray-600">
            You haven't set up your intern's salary yet. Set it up now to start
            managing payments.
          </Text>
          <Button
            onClick={handleEditToggle}
            className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
          >
            Set Up Salary
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-lg text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex items-center space-x-4 rounded-2xl bg-white p-6 shadow-lg">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-900">Processing...</p>
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center justify-center">
        <a
          href="https://useautumn.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center opacity-70 transition-opacity hover:opacity-100"
        >
          <Text className="mr-2 text-sm text-gray-500">powered by</Text>
          <img
            src="/logos/autumn-dark.png"
            alt="Autumn"
            className="h-6 w-auto"
          />
        </a>
      </div>
    </>
  );
}
