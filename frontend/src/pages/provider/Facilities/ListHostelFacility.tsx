import { useNavigate } from "react-router-dom";
import {
  Building,
  Utensils,
  WashingMachine,
  Briefcase,
  ChevronRight,
  Info,
} from "lucide-react";
import { useProviderHostels } from "@/hooks/provider/hostel/useHostel";
import Loading from "@/components/global/Loading";

export const ListHostelFacility = () => {
  const navigate = useNavigate();
  const { data: hostels = [], isLoading } = useProviderHostels();

  const getFacilityIcon = (facilityType: string) => {
    const type = facilityType.toLowerCase();
    if (type.includes("food") || type.includes("catering")) {
      return {
        icon: <Utensils className="text-amber-500" size={20} />,
        description: "Food & Catering Services",
      };
    } else if (type.includes("laundry") || type.includes("washing")) {
      return {
        icon: <WashingMachine className="text-amber-500" size={20} />,
        description: "Laundry & Washing Services",
      };
    } else if (type.includes("cleaning")) {
      return {
        icon: <Briefcase className="text-amber-500" size={20} />,
        description: "Cleaning Services",
      };
    }
    return null;
  };

  const handleManageFacility = (
    hostelId: string,
    facility: any,
    facilityType: string
  ) => {
    // Extract the ID from the facility object
    const facilityId = facility._id?.toString() || facility._id;
    
    if (facilityType.includes("Catering Service")) {
      navigate(
        `/provider/manage-facility/${hostelId}/${facilityId}/catering-service`
      );
    } else if (facilityType.includes("Deep Cleaning Service")) {
      navigate(`/provider/manage-facility/${hostelId}/deep-cleaning-service`);
    } else {
      navigate(`/provider/manage-facility/${hostelId}/laundry-service`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="">
          <Loading text="Facilities loading..." color="#FFB300" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Hostel Facilities
            </h1>
            <div className="group relative">
              <Info size={18} className="text-gray-400 cursor-help" />
              <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-sm rounded-md -left-1/2 mt-2">
                Manage all your hostel facilities including catering, laundry,
                and cleaning services
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Manage facilities for all your hostels
          </p>
        </div>

        <div className="grid gap-6">
          {hostels?.map((hostel: any) => (
            <div
              key={hostel._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Building className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {hostel.hostel_name}
                    </h2>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {hostel.location?.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  Available Facilities
                  <span className="text-sm font-normal text-gray-500">
                    ({hostel.facilities?.length || 0} services)
                  </span>
                </h3>

                {hostel.facilities?.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {hostel.facilities.map((facility: any) => {
                      const facilityInfo = getFacilityIcon(facility.name);
                      return (
                        <div
                          key={facility._id}
                          className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer"
                          onClick={() =>
                            handleManageFacility(
                              hostel._id,
                              { _id: facility._id },
                              facility.name
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative group">
                              {facilityInfo?.icon}
                              {/* <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded-md -left-1/2 mt-2">
                                {facilityInfo?.description}
                              </div> */}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {facility.name}
                              </h4>
                              <p className="text-sm text-amber-600 font-medium">
                                ${facility.price}/month
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-amber-500 group-hover:bg-amber-100 rounded-lg flex items-center gap-2 transition-colors">
                            Manage
                            <ChevronRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">
                      No facilities available for this hostel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {(!hostels || hostels.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-4">
                <Building className="text-amber-600" size={48} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Hostels Found
              </h3>
              <p className="text-gray-500">
                You haven't added any hostels yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
