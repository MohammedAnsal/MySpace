import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";

export default function StaySelector() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Tabs defaultValue="boys" className="w-full flex">
        <TabsList className="w-full max-w-md mx-auto h-12 bg-[#E1DDD5] p-8 rounded-full">
          <TabsTrigger
            value="boys"
            className="flex-1 rounded-full data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            Boy&apos;s
          </TabsTrigger>
          <TabsTrigger
            value="girls"
            className="flex-1 rounded-full data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            Girls&apos;s
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex-1 rounded-full data-[state=active]:bg-[#EAE8E4] data-[state=active]:text-black data-[state=active]:shadow-sm text-[#8B8B8B] hover:text-black transition-colors"
          >
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
