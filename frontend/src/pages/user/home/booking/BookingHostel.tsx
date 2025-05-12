import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingHostel, hostelDetails } from "@/services/Api/userApi";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/global/Loading";
import { motion } from "framer-motion";

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

interface LocationState {
  hostelId: string;
  providerId: string;
  monthlyRent: number;
  depositAmount: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const { data: hostel, isLoading } = useQuery({
    queryKey: ["hostel", state?.hostelId],
    queryFn: () => hostelDetails(state?.hostelId),
    enabled: !!state?.hostelId,
  });

  useEffect(() => {
    if (!state) {
      navigate("/hostels");
      toast.error("Please select a hostel first");
    }
  }, [state, navigate]);

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: new Date().toISOString().split("T")[0],
    selectedMonths: 1,
    selectedFacilities: [],
    userProof: null,
    acceptedRules: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const monthlyRent = state?.monthlyRent || 0;
    const depositAmount = state?.depositAmount || 0;
    
    const facilityCost = hostel?.facilities
      ?.filter((facility: { _id: string; }) => 
        formData.selectedFacilities.some(f => f.id === facility._id))
      .reduce((total: number, facility: { _id: string; price: number; }) => {
        const selectedFacility = formData.selectedFacilities.find(f => f.id === facility._id);
        return total + (facility.price * (selectedFacility?.duration || 1));
      }, 0) || 0;

    return (monthlyRent * formData.selectedMonths) + facilityCost + depositAmount;
  };

  const calculatePaymentTotal = () => {
    const monthlyRent = state?.monthlyRent || 0;
    const depositAmount = state?.depositAmount || 0;
    
    const firstMonthFacilityCost = hostel?.facilities
      ?.filter((facility: { _id: string; }) => 
        formData.selectedFacilities.some(f => f.id === facility._id))
      .reduce((total: number, facility: { price: number; }) => total + facility.price, 0) || 0;

    return monthlyRent + firstMonthFacilityCost + depositAmount;
  };

  const handleFacilityToggle = (facilityId: string, facilityName: string) => {
    const updatedFacilities = formData.selectedFacilities.some(f => f.id === facilityId)
      ? formData.selectedFacilities.filter((item) => item.id !== facilityId)
      : [...formData.selectedFacilities, { id: facilityId, name: facilityName, duration: 1 }];

    setFormData({ ...formData, selectedFacilities: updatedFacilities });
  };

  const handleFacilityDurationChange = (facilityId: string, duration: number) => {
    // Don't allow facility duration to exceed stay duration
    if (duration > formData.selectedMonths) {
      toast.error("Facility duration cannot exceed your stay duration");
      // Set the duration to match the stay duration instead
      duration = formData.selectedMonths;
    }
    
    const updatedFacilities = formData.selectedFacilities.map(facility => 
      facility.id === facilityId 
        ? { ...facility, duration: duration }
        : facility
    );
    setFormData({ ...formData, selectedFacilities: updatedFacilities });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, userProof: file });
    }
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

      const bookingFormData = new FormData();
      bookingFormData.append("hostelId", state.hostelId);
      bookingFormData.append("providerId", state.providerId);
      bookingFormData.append("checkIn", formData.startDate);
      bookingFormData.append("checkOut", new Date(calculateEndDate()).toISOString());
      bookingFormData.append("stayDurationInMonths", formData.selectedMonths.toString());
      
      const facilitiesData = JSON.stringify(
        formData.selectedFacilities.map(f => ({
          id: f.id,
          duration: f.duration
        }))
      );
      bookingFormData.append("selectedFacilities", facilitiesData);
      bookingFormData.append("proof", formData.userProof);

      await bookingHostel(bookingFormData);
      
      toast.success("Redirecting to payment...");
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Error processing your request");
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
              {/* Identity Proof Section */}
              <section className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
                  Step 1 - Identity Verification
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  {formData.userProof ? (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {formData.userProof.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            File uploaded successfully
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, userProof: null }))
                        }
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <label className="block">
                        <span className="sr-only">Choose ID proof</span>
                        <input
                          type="file"
                          name="proof"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Accepted formats: PDF, JPG, PNG
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Stay Period Section */}
              <section className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
                  Step 2 - Stay Duration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select
                      value={formData.selectedMonths}
                      onChange={(e) => {
                        const newDuration = parseInt(e.target.value);
                        
                        // Update any facility durations that exceed the new stay duration
                        const updatedFacilities = formData.selectedFacilities.map(facility => {
                          if (facility.duration > newDuration) {
                            return { ...facility, duration: newDuration };
                          }
                          return facility;
                        });
                        
                        setFormData({
                          ...formData,
                          selectedMonths: newDuration,
                          selectedFacilities: updatedFacilities,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                        <option key={month} value={month}>
                          {month} {month === 1 ? "Month" : "Months"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Facilities Section */}
              <section className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
                  Step 3 - Select Facilities
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {hostel?.facilities?.map(
                    (facility: {
                      _id: string;
                      name: string;
                      price: number;
                    }) => (
                      <div
                        key={facility._id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex flex-col space-y-2">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.selectedFacilities.some(
                                  (f) => f.id === facility._id
                                )}
                                onChange={() =>
                                  handleFacilityToggle(
                                    facility._id,
                                    facility.name
                                  )
                                }
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                {facility.name}
                              </span>
                            </div>
                            <span className="text-sm text-main-color font-medium">
                              ${facility.price}/month
                            </span>
                          </label>

                          {/* Duration selector - Only show when facility is selected */}
                          {formData.selectedFacilities.some(
                            (f) => f.id === facility._id
                          ) && (
                            <div className="ml-6 mt-2">
                              <div className="flex items-center space-x-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Duration:
                                </label>
                                <select
                                  value={
                                    formData.selectedFacilities.find(
                                      (f) => f.id === facility._id
                                    )?.duration || 1
                                  }
                                  onChange={(e) =>
                                    handleFacilityDurationChange(
                                      facility._id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm"
                                >
                                  {/* Only show options up to the selected stay duration */}
                                  {Array.from({ length: formData.selectedMonths }, (_, i) => i + 1).map(
                                    (month) => (
                                      <option key={month} value={month}>
                                        {month}{" "}
                                        {month === 1 ? "Month" : "Months"}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* Rules Section - Show actual hostel rules */}
              <section className="mb-8">
                <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
                  Important Rules and Guidelines
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">
                        Hostel Rules
                      </h3>
                    </div>
                    <div className="p-4">
                      {hostel?.rules ? (
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {hostel.rules}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No rules specified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rules Acceptance */}
                  <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.acceptedRules}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            acceptedRules: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        I have read, understood, and agree to follow all hostel
                        rules and policies
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right side panel - Keep existing code but update with dynamic calculations */}
            <div className="md:w-2/5 p-5 bg-gray-50">
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
                    Available Space: {hostel?.available_space} of{" "}
                    {hostel?.total_space}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 mb-5 shadow-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Check-in</span>
                  <span>
                    {new Date(formData.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Check-out</span>
                  <span>{calculateEndDate()}</span>
                </div>
                {/* <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Selected Space</span>
                  <span>{state.selectedSpace}</span>
                </div> */}
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Selected Facilities</span>
                  <div className="flex flex-col gap-2 items-end">
                    {formData.selectedFacilities.map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-center gap-2"
                      >
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                          {facility.name} ({facility.duration}{" "}
                          {facility.duration === 1 ? "month" : "months"})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Duration</span>
                  <span>
                    {formData.selectedMonths}{" "}
                    {formData.selectedMonths === 1 ? "Month" : "Months"}
                  </span>
                </div>
                {hostel?.facilities && (
                  <div className="flex justify-between py-2 text-sm">
                    <span>Facility Cost</span>
                    <span>
                      {hostel.facilities
                        .filter((facility: { _id: string; name: string }) =>
                          formData.selectedFacilities.some(
                            (f) => f.id === facility._id
                          )
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
                  <span>${state.monthlyRent}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span>Deposit-Amount</span>
                  <span>${state.depositAmount}</span>
                </div>

                {/* First payment details */}
                <div className="mt-4 mb-2">
                  <h4 className="font-medium text-sm text-gray-800">
                    First Payment
                  </h4>
                  <div className="bg-[#384f9514] rounded-md p-3 mt-2">
                    <div className="flex justify-between py-1 text-sm">
                      <span>Deposit Amount</span>
                      <span>${state.depositAmount}</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm">
                      <span>First Month Rent</span>
                      <span>${state.monthlyRent}</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm">
                      <span>First Month Facilities</span>
                      <span>
                        $
                        {hostel?.facilities
                          ?.filter((facility: { _id: string }) =>
                            formData.selectedFacilities.some(
                              (f) => f.id === facility._id
                            )
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
                      <span>${calculatePaymentTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Overall total for entire booking period */}
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-800">
                    Entire Stay
                  </h4>
                  <div className="flex justify-between py-2 mt-2 font-medium text-base border-t border-gray-200 pt-3">
                    <span>Total Price</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    (Includes rent for {formData.selectedMonths}{" "}
                    {formData.selectedMonths === 1 ? "month" : "months"} and all
                    selected facilities for their respective durations)
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <motion.button
                  disabled={!formData.acceptedRules || isSubmitting}
                  onClick={handleSubmit}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group ${
                    formData.acceptedRules && !isSubmitting
                      ? "bg-main-color text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {formData.acceptedRules ? (
                        <>
                          Pay Now: ${calculatePaymentTotal()}
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      ) : (
                        "Accept Rules to Continue"
                      )}
                    </div>
                  )}
                </motion.button>
                {formData.acceptedRules && !isSubmitting && (
                  <p className="text-xs text-center mt-2 text-gray-600">
                    This is your first payment. Total booking value: $
                    {calculateTotalPrice()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Checkout;
