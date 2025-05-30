import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import React, { useState, useEffect } from "react";
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
    startDate: new Date().toISOString().split("T")[0],
    selectedMonths: 1,
    selectedFacilities: [],
    userProof: null,
    acceptedRules: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate min date (tomorrow)
  const tomorrow = addDays(new Date(), 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");

  const calculateEndDate = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.selectedMonths);
    return endDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalPrice = () => {
    const monthlyRent = hostel?.monthly_rent || 0;
    const depositAmount = hostel?.deposit_amount || 0;

    const facilityCost =
      hostel?.facilities
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
  };

  const calculatePaymentTotal = () => {
    const monthlyRent = hostel?.monthly_rent || 0;
    const depositAmount = hostel?.deposit_amount || 0;

    const firstMonthFacilityCost =
      hostel?.facilities
        ?.filter((facility: { _id: string }) =>
          formData.selectedFacilities.some((f) => f.id === facility._id)
        )
        .reduce(
          (total: number, facility: { price: number }) =>
            total + facility.price,
          0
        ) || 0;

    return monthlyRent + firstMonthFacilityCost + depositAmount;
  };

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

  const handleFileUpload = (file: File) => {
    setFormData({ ...formData, userProof: file });
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, userProof: null });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, startDate: date });
  };

  const handleMonthsChange = (
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
  };

  const handleRulesAcceptanceChange = (accepted: boolean) => {
    setFormData({ ...formData, acceptedRules: accepted });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

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

      // Log the data being sent
      console.log('Sending booking data:', {
        hostelId: hostel._id,
        providerId: hostel.providerId,
        startDate: formData.startDate,
        endDate: new Date(calculateEndDate()).toISOString(),
        months: formData.selectedMonths,
        facilities: formData.selectedFacilities
      });

      const bookingFormData = new FormData();
      bookingFormData.append("hostelId", hostel._id.toString());
      bookingFormData.append("providerId", hostel.provider_id._id.toString());
      bookingFormData.append("checkIn", formData.startDate);
      bookingFormData.append(
        "checkOut",
        new Date(calculateEndDate()).toISOString()
      );
      bookingFormData.append(
        "stayDurationInMonths",
        formData.selectedMonths.toString()
      );

      const facilitiesData = JSON.stringify(
        formData.selectedFacilities.map((f) => ({
          id: f.id.toString(),
          duration: f.duration.toString()
        }))
      );
      bookingFormData.append("selectedFacilities", facilitiesData);
      bookingFormData.append("proof", formData.userProof);

      const response = await bookingHostel(bookingFormData);
      
      if (response) {
        toast.success("Redirecting to payment...");
        // Add navigation to payment page if needed
        // navigate('/payment');
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Error processing your request");
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
              <FacilitiesSelection
                facilities={hostel?.facilities || []}
                selectedFacilities={formData.selectedFacilities}
                selectedMonths={formData.selectedMonths}
                onFacilityToggle={handleFacilityToggle}
                onFacilityDurationChange={handleFacilityDurationChange}
              />

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
              calculateTotalPrice={calculateTotalPrice}
              calculatePaymentTotal={calculatePaymentTotal}
            />
          </div>
          
          {/* Payment Section */}
          <div className="px-5 pb-5">
            <PaymentSection
              acceptedRules={formData.acceptedRules}
              isSubmitting={isSubmitting}
              calculatePaymentTotal={calculatePaymentTotal}
              calculateTotalPrice={calculateTotalPrice}
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