import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingHostel, hostelDetails } from "@/services/Api/userApi";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/global/Loading";
import { addDays, format } from "date-fns";

// Import components
import IdentityVerification from "./components/IdentityVerification";
import StayDuration from "./components/StayDuration";
import FacilitiesSelection from "./components/FacilitiesSelection";
import RulesSection from "./components/RulesSection";
import BookingSummary from "./components/BookingSummary";
import PaymentSection from "./components/PaymentSection";

interface BookingFormData {
  startDate: string;
  selectedMonths: number;
  selectedFacilities: {
    id: string;
    name: string;
    duration: number;
  }[];
  userProof: File | null;
  acceptedRules: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const { hostelId } = useParams();

  if (!hostelId) return null;

  const { data: hostel, isLoading } = useQuery({
    queryKey: ["hostel", hostelId],
    queryFn: () => hostelDetails(hostelId),
    enabled: !!hostelId,
  });

  useEffect(() => {
    if (!hostelId) {
      navigate("/hostels");
      toast.error("Please select a hostel first");
    }
  }, [hostelId, navigate]);

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    selectedMonths: 1,
    selectedFacilities: [],
    userProof: null,
    acceptedRules: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate min date (tomorrow)
  const tomorrow = addDays(new Date(), 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");

  // const calculateEndDate = () => {
  //   const startDate = new Date(formData.startDate);
  //   const endDate = new Date(startDate);

  //   // Properly handle month addition that crosses year boundaries
  //   const currentYear = endDate.getFullYear();
  //   const currentMonth = endDate.getMonth();
  //   const newMonth = currentMonth + formData.selectedMonths;

  //   endDate.setFullYear(
  //     currentYear + Math.floor(newMonth / 12),
  //     newMonth % 12,
  //     endDate.getDate()
  //   );

  //   return endDate.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  const calculateEndDate = useMemo(() => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);

    const currentYear = endDate.getFullYear();
    const currentMonth = endDate.getMonth();
    const newMonth = currentMonth + formData.selectedMonths;

    endDate.setFullYear(
      currentYear + Math.floor(newMonth / 12),
      newMonth % 12,
      endDate.getDate()
    );

    return endDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [formData.startDate, formData.selectedMonths]);

  // const calculateTotalPrice = () => {
  //   const monthlyRent = hostel?.monthly_rent || 0;
  //   const depositAmount = hostel?.deposit_amount || 0;

  //   const facilityCost =
  //     hostel?.facilities
  //       ?.filter((facility: { _id: string }) =>
  //         formData.selectedFacilities.some((f) => f.id === facility._id)
  //       )
  //       .reduce((total: number, facility: { _id: string; price: number }) => {
  //         const selectedFacility = formData.selectedFacilities.find(
  //           (f) => f.id === facility._id
  //         );
  //         return total + facility.price * (selectedFacility?.duration || 1);
  //       }, 0) || 0;

  //   return monthlyRent * formData.selectedMonths + facilityCost + depositAmount;
  // };

  const totalPrice = useMemo(() => {
    if (!hostel) return 0;

    const monthlyRent = hostel.monthly_rent || 0;
    const depositAmount = hostel.deposit_amount || 0;

    const facilityCost =
      hostel.facilities
        ?.filter((facility: { _id: string }) =>
          formData.selectedFacilities.some((f) => f.id === facility._id)
        )
        .reduce((total: number, facility: { _id: string; price: number }) => {
          const selectedFacility = formData.selectedFacilities.find(
            (f) => f.id === facility._id
          );
          return total + facility.price * (selectedFacility?.duration || 1);
        }, 0) || 0;

    return monthlyRent * formData.selectedMonths + facilityCost + depositAmount;
  }, [hostel, formData.selectedFacilities, formData.selectedMonths]);

  // const calculatePaymentTotal = () => {
  //   const monthlyRent = hostel?.monthly_rent || 0;
  //   const depositAmount = hostel?.deposit_amount || 0;

  //   const firstMonthFacilityCost =
  //     hostel?.facilities
  //       ?.filter((facility: { _id: string }) =>
  //         formData.selectedFacilities.some((f) => f.id === facility._id)
  //       )
  //       .reduce(
  //         (total: number, facility: { price: number }) =>
  //           total + facility.price,
  //         0
  //       ) || 0;

  //   return monthlyRent + firstMonthFacilityCost + depositAmount;
  // };

  const paymentTotal = useMemo(() => {
    if (!hostel) return 0;

    const monthlyRent = hostel.monthly_rent || 0;
    const depositAmount = hostel.deposit_amount || 0;

    const firstMonthFacilityCost =
      hostel.facilities
        ?.filter((facility: { _id: string }) =>
          formData.selectedFacilities.some((f) => f.id === facility._id)
        )
        .reduce(
          (total: number, facility: { price: number }) =>
            total + facility.price,
          0
        ) || 0;

    return monthlyRent + firstMonthFacilityCost + depositAmount;
  }, [hostel, formData.selectedFacilities]);

  const handleFacilityToggle = (facilityId: string, facilityName: string) => {
    const updatedFacilities = formData.selectedFacilities.some(
      (f) => f.id === facilityId
    )
      ? formData.selectedFacilities.filter((item) => item.id !== facilityId)
      : [
          ...formData.selectedFacilities,
          { id: facilityId, name: facilityName, duration: 1 },
        ];

    setFormData({ ...formData, selectedFacilities: updatedFacilities });
  };

  const handleFacilityDurationChange = (
    facilityId: string,
    duration: number
  ) => {
    const updatedFacilities = formData.selectedFacilities.map((facility) =>
      facility.id === facilityId
        ? { ...facility, duration: duration }
        : facility
    );
    setFormData({ ...formData, selectedFacilities: updatedFacilities });
  };

  // const handleFileUpload = (file: File) => {
  //   setFormData({ ...formData, userProof: file });
  // };

  const handleFileUpload = useCallback((file: File) => {
    setFormData((prev) => ({ ...prev, userProof: file }));
  }, []);

  // const handleRemoveFile = () => {
  //   setFormData({ ...formData, userProof: null });
  // };

  const handleRemoveFile = useCallback(() => {
    setFormData((prev) => ({ ...prev, userProof: null }));
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
  }, []);

  const handleMonthsChange = useCallback(
    (
      months: number,
      updatedFacilities: {
        id: string;
        name: string;
        duration: number;
      }[]
    ) => {
      setFormData({
        ...formData,
        selectedMonths: months,
        selectedFacilities: updatedFacilities,
      });
    },
    []
  );

  const handleRulesAcceptanceChange = (accepted: boolean) => {
    setFormData({ ...formData, acceptedRules: accepted });
  };

  // Helper function to properly add months to a date
  const addMonthsToDate = (date: Date, months: number) => {
    const newDate = new Date(date);
    const currentYear = newDate.getFullYear();
    const currentMonth = newDate.getMonth();
    const newMonth = currentMonth + months;

    newDate.setFullYear(
      currentYear + Math.floor(newMonth / 12),
      newMonth % 12,
      newDate.getDate()
    );

    return newDate;
  };

  // Validate booking dates and duration
  const validateBookingDates = (checkIn: string, duration: number) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = addMonthsToDate(checkInDate, duration);

    // Check if checkout date is at least 1 month from check-in
    const oneMonthFromCheckIn = addMonthsToDate(checkInDate, 1);

    if (checkOutDate < oneMonthFromCheckIn) {
      return {
        isValid: false,
        message:
          "Minimum stay duration is 1 month. Please select a longer duration.",
      };
    }

    // Check if check-in date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return {
        isValid: false,
        message:
          "Check-in date cannot be in the past. Please select a future date.",
      };
    }

    return { isValid: true };
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate dates first
      const dateValidation = validateBookingDates(
        formData.startDate,
        formData.selectedMonths
      );
      if (!dateValidation.isValid) {
        toast.error(dateValidation.message);
        return;
      }

      if (!formData.userProof) {
        toast.error("Please upload proof document");
        return;
      }

      if (!formData.acceptedRules) {
        toast.error("Please accept the rules to continue");
        return;
      }

      if (!hostel?._id || !hostel?.provider_id._id) {
        toast.error("Invalid hostel data");
        return;
      }

      const bookingFormData = new FormData();
      bookingFormData.append("hostelId", hostel._id.toString());
      bookingFormData.append("providerId", hostel.provider_id._id.toString());
      bookingFormData.append("checkIn", formData.startDate);

      // Calculate proper checkout date
      const checkInDate = new Date(formData.startDate);
      const checkOutDate = addMonthsToDate(
        checkInDate,
        formData.selectedMonths
      );
      bookingFormData.append("checkOut", checkOutDate.toISOString());
      bookingFormData.append(
        "stayDurationInMonths",
        formData.selectedMonths.toString()
      );

      const facilitiesData = JSON.stringify(
        formData.selectedFacilities.map((f) => ({
          id: f.id.toString(),
          duration: f.duration.toString(),
        }))
      );
      bookingFormData.append("selectedFacilities", facilitiesData);
      bookingFormData.append("proof", formData.userProof);

      const response = await bookingHostel(bookingFormData);

      if (response) {
        toast.success("Redirecting to payment...");
      }
    } catch (error: any) {
      console.error("Booking error:", error);

      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message;

      if (errorMessage) {
        // Check for specific error patterns and provide better messages
        if (errorMessage.includes("No beds available")) {
          const checkInMonth = new Date(formData.startDate).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          );
          toast.error(
            `No beds available for ${checkInMonth}. Please choose a different month or check-in date.`
          );
        } else if (errorMessage.includes("Minimum stay duration")) {
          toast.error(
            "Minimum stay duration is 1 month. Please select a longer duration."
          );
        } else if (errorMessage.includes("date")) {
          toast.error("Please select valid dates for your stay.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Error processing your request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#E2E1DF] min-h-screen">
      <Navbar />
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loading
            text="Loading details..."
            color="#b9a089"
            className="text-black"
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto my-5 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="text-center py-8 border-b border-gray-200">
            <h1 className="font-serif font-light text-4xl tracking-wide text-gray-800">
              Complete Your Booking
            </h1>
            <div className="mt-2 text-gray-600">Booking as: {"ansalshaah"}</div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="flex-grow p-5 border-r border-gray-200">
              {/* Identity Verification Section */}
              <IdentityVerification
                userProof={formData.userProof}
                onFileUpload={handleFileUpload}
                onRemoveFile={handleRemoveFile}
              />

              {/* Stay Duration Section */}
              <StayDuration
                startDate={formData.startDate}
                selectedMonths={formData.selectedMonths}
                selectedFacilities={formData.selectedFacilities}
                minDate={minDate}
                onDateChange={handleDateChange}
                onMonthsChange={handleMonthsChange}
              />

              {/* Facilities Section */}
              {hostel?.facilities && hostel.facilities.length > 0 ? (
                <FacilitiesSelection
                  facilities={hostel.facilities}
                  selectedFacilities={formData.selectedFacilities}
                  selectedMonths={formData.selectedMonths}
                  onFacilityToggle={handleFacilityToggle}
                  onFacilityDurationChange={handleFacilityDurationChange}
                />
              ) : (
                <div className="my-8 text-center text-blue-400">
                  This hostel does not provide any additional facilities.
                </div>
              )}

              {/* Rules Section */}
              <RulesSection
                rules={hostel?.rules || null}
                acceptedRules={formData.acceptedRules}
                onRulesAcceptanceChange={handleRulesAcceptanceChange}
              />
            </div>

            {/* Right side panel - Booking Summary */}
            <BookingSummary
              hostel={hostel}
              startDate={formData.startDate}
              selectedMonths={formData.selectedMonths}
              selectedFacilities={formData.selectedFacilities}
              calculateEndDate={calculateEndDate}
              calculateTotalPrice={totalPrice}
              calculatePaymentTotal={paymentTotal}
            />
          </div>

          {/* Payment Section */}
          <div className="px-5 pb-5">
            <PaymentSection
              acceptedRules={formData.acceptedRules}
              isSubmitting={isSubmitting}
              calculatePaymentTotal={paymentTotal}
              calculateTotalPrice={totalPrice}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Checkout;
