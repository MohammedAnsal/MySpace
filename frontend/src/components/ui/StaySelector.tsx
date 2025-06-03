import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

interface StaySelectorProps {
  onGenderChange: (gender: string) => void;
}

export default function StaySelector({ onGenderChange }: StaySelectorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
      <Tabs
        defaultValue="all"
        className="w-full flex"
        onValueChange={onGenderChange}
      >
        <TabsList className="w-full max-w-full sm:max-w-md mx-auto h-10 md:h-12 bg-[#E1DDD5] p-4 md:p-8 rounded-full">
          <TabsTrigger
            value="male"
            className="flex-1 rounded-full text-xs md:text-sm data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            Men's
          </TabsTrigger>
          <TabsTrigger
            value="female"
            className="flex-1 rounded-full text-xs md:text-sm data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            Women's
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex-1 rounded-full text-xs md:text-sm data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
