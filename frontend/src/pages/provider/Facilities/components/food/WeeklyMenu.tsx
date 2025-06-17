import { DayMealCard } from "./DayMealCard";

interface WeeklyMenuProps {
  facilityId: string;
  hostelId: string;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


export const WeeklyMenu = ({ facilityId, hostelId }: WeeklyMenuProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Weekly Menu</h2>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          return (
            <DayMealCard
              facilityId={facilityId}
              hostelId={hostelId}
              key={day}
              day={day}
            />
          );
        })}
      </div>
    </div>
  );
};
