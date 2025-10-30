import React from "react";

interface Hostel {
  photos: string[];
  hostel_name: string;
  gender: string;
  location: {
    address: string;
  };
  available_space: number;
  total_space: number;
  monthly_rent: number;
  deposit_amount: number;
  facilities: {
    _id: string;
    name: string;
    price: number;
  }[];
}

interface BookingSummaryProps {
  hostel: Hostel;
  startDate: string;
  selectedMonths: number;
  selectedFacilities: {
    id: string;
    name: string;
    duration: number;
  }[];
  calculateEndDate: string;
  calculateTotalPrice: number;
  calculatePaymentTotal: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  hostel,
  startDate,
  selectedMonths,
  selectedFacilities,
  calculateEndDate,
  calculateTotalPrice,
  calculatePaymentTotal,
}) => {
  return (
    <div className="p-4 bg-gray-50 flex-grow">
      <div className="rounded-lg overflow-hidden mb-5 shadow-md">
        {hostel?.photos && hostel.photos.length > 0 && (
          <img
            src={hostel.photos[0]}
            alt={hostel.hostel_name}
            className="w-full h-44 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-serif text-xl font-medium mb-2">
            {hostel?.hostel_name}{" "}
            <span className="bg-blue-50 text-blue-500 text-xs px-2 py-0.5 rounded-full ml-1 font-normal">
              ({hostel?.gender})
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {hostel?.location?.address}
          </p>
          <p className="text-sm text-gray-600">
            Available Space: {hostel?.available_space} of {hostel?.total_space}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5 shadow-sm">
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Check-in</span>
          <span>
            {new Date(startDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Check-out</span>
          <span>{calculateEndDate}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Selected Facilities</span>
          <div className="flex flex-col gap-2 items-end">
            {selectedFacilities.length > 0 ? (
              selectedFacilities.map((facility) => (
                <div key={facility.id} className="flex items-center gap-2">
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                    {facility.name} ({facility.duration}{" "}
                    {facility.duration === 1 ? "month" : "months"})
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-xs italic">
                None selected
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Duration</span>
          <span>
            {selectedMonths} {selectedMonths === 1 ? "Month" : "Months"}
          </span>
        </div>
        {hostel?.facilities && (
          <div className="flex justify-between py-2 text-sm">
            <span>Facility Cost</span>
            <span>
              ₹
              {hostel.facilities
                .filter((facility: { _id: string; name: string }) =>
                  selectedFacilities.some((f) => f.id === facility._id)
                )
                .reduce(
                  (total: any, facility: { price: any }) =>
                    total + facility.price,
                  0
                )}
              /month
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-md p-4 mb-5 shadow-sm">
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Monthly-Rent</span>
          <span>₹{hostel.monthly_rent}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
          <span>Deposit-Amount</span>
          <span>₹{hostel.deposit_amount}</span>
        </div>

        {/* First payment details */}
        <div className="mt-4 mb-2">
          <h4 className="font-medium text-sm text-gray-800">First Payment</h4>
          <div className="bg-[#384f9514] rounded-md p-3 mt-2">
            <div className="flex justify-between py-1 text-sm">
              <span>Deposit Amount</span>
              <span>₹{hostel.deposit_amount}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>First Month Rent</span>
              <span>₹{hostel.monthly_rent}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>First Month Facilities</span>
              <span>
                ₹
                {hostel?.facilities
                  ?.filter((facility: { _id: string }) =>
                    selectedFacilities.some((f) => f.id === facility._id)
                  )
                  .reduce(
                    (total: number, facility: { price: number }) =>
                      total + facility.price,
                    0
                  ) || 0}
              </span>
            </div>
            <div className="flex justify-between pt-2 mt-1 border-t border-white font-medium text-black">
              <span>Payment Total</span>
              <span>₹{calculatePaymentTotal}</span>
            </div>
          </div>
        </div>

        {/* Overall total for entire booking period */}
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-800">Entire Stay</h4>
          <div className="flex justify-between py-2 mt-2 font-medium text-base border-t border-gray-200 pt-3">
            <span>Total Price</span>
            <span>₹{calculateTotalPrice}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            (Includes rent for {selectedMonths}{" "}
            {selectedMonths === 1 ? "month" : "months"} and all selected
            facilities for their respective durations)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
