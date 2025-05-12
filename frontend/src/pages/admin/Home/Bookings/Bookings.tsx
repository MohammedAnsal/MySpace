import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, Home, MapPin, Phone, User, FileCheck, AlertCircle, Building, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CookingPot, Utensils, WashingMachine, Briefcase, CheckCircle, Search, Sliders } from 'lucide-react';
import Loading from '@/components/global/Loading';
import { useProviderBookings } from '@/hooks/admin/useAdminQueries';

interface Facility {
  facilityId: {
    _id: string;
    name: string;
    description?: string;
    price?: number;
  };
  type: string;
  ratePerMonth: number;
  totalCost: number;
  duration: string;
  startDate: string;
  endDate: string;
}

interface Location {
  _id: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface Booking {
  _id: string;
  hostelId: {
    _id: string;
    hostel_name: string;
    location: Location;
  };
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  providerId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  bookingDate: string;
  checkIn: string;
  checkOut: string;
  stayDurationInMonths: number;
  firstMonthRent: number;
  monthlyRent: number;
  totalPrice: number;
  depositAmount: number;
  paymentStatus: string;
  proof: string;
  selectedFacilities: Facility[];
}

export const Bookings = () => {
  const { data: bookings = [], isLoading, error } = useProviderBookings();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  if (isLoading) {
    return (
      <div className="p-6 mt-4 max-w-7xl mx-auto flex items-center justify-center h-[600px] bg-[#242529]">
        <Loading
          text="Loading bookings..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-4 max-w-7xl mx-auto bg-[#242529] rounded-lg shadow-md h-[600px]">
        <div className="text-center text-red-400 py-10">
          <h3 className="text-xl font-medium">Error loading bookings</h3>
          <p className="mt-2">{(error as Error).message}</p>
          <button 
            className="mt-4 bg-[#C8ED4F] hover:bg-[#B9DE40] text-[#242529] px-4 py-2 rounded-md transition-colors font-medium"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter((booking: { paymentStatus: string; userId: { fullName: string; }; hostelId: { hostel_name: string; }; providerId: { fullName: string; }; _id: string; }) => {
    // First, ensure the booking object and its expected properties exist
    if (!booking || !booking.paymentStatus) return false;
    
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'completed' ? booking.paymentStatus === 'completed' :
      booking.paymentStatus === 'pending';

    if (!searchTerm) return matchesTab;

    const searchLower = searchTerm.toLowerCase();
    
    // Safely check each property before accessing toLowerCase()
    const userNameMatch = booking.userId?.fullName ? booking.userId.fullName.toLowerCase().includes(searchLower) : false;
    const hostelNameMatch = booking.hostelId?.hostel_name ? booking.hostelId.hostel_name.toLowerCase().includes(searchLower) : false;
    const providerNameMatch = booking.providerId?.fullName ? booking.providerId.fullName.toLowerCase().includes(searchLower) : false;
    const bookingIdMatch = booking._id ? booking._id.toLowerCase().includes(searchLower) : false;
    
    const matchesSearch = userNameMatch || hostelNameMatch || providerNameMatch || bookingIdMatch;

    return matchesTab && matchesSearch;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-300 border border-green-800';
      case 'pending': return 'bg-[#3d3f45] text-[#C8ED4F] border border-[#4a4c52]';
      case 'cancelled': return 'bg-red-900 text-red-300 border border-red-800';
      default: return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateFacilityDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      
      return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : 'Less than a month';
    } catch (error) {
      return 'Duration unavailable';
    }
  };

  const getFacilityIcon = (facilityType: string) => {
    const type = facilityType.toLowerCase();
    
    if (type.includes('catering') || type.includes('food')) {
      return <Utensils className="text-[#C8ED4F] mr-2" size={16} />;
    } else if (type.includes('laundry') || type.includes('washing')) {
      return <WashingMachine className="text-[#C8ED4F] mr-2" size={16} />;
    } else if (type.includes('cleaning') || type.includes('clean')) {
      return <Briefcase className="text-[#C8ED4F] mr-2" size={16} />;
    } else {
      return <CheckCircle className="text-[#C8ED4F] mr-2" size={16} />;
    }
  };

  const getHostelAddress = (booking: Booking) => {
    if (booking.hostelId?.location?.address) {
      return booking.hostelId.location.address;
    }
    return null;
  };

  return (
    <div className="p-6 mt-4 max-w-7xl mx-auto bg-[#242529] rounded-lg shadow-md h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-dm_sans font-semibold text-[#C8ED4F]">Booking Management</h2>
        
        {/* Search Bar */}
        <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2A2B2F] border border-[#3d3f45] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-[#3d3f45]">
        <button 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'all' 
            ? 'text-[#C8ED4F] border-b-2 border-[#C8ED4F]' 
            : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
        <button 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'completed' 
            ? 'text-[#C8ED4F] border-b-2 border-[#C8ED4F]' 
            : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'pending' 
            ? 'text-[#C8ED4F] border-b-2 border-[#C8ED4F]' 
            : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
      </div>
      
      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 bg-[#2A2B2F] rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-300">No bookings found</h3>
          <p className="mt-2 text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'No bookings match your current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <div key={booking._id} className="bg-[#2A2B2F] rounded-lg shadow-sm overflow-hidden border border-[#3d3f45] hover:shadow-md transition-all duration-300">
              {/* Header with Booking Summary - Horizontal Layout */}
              <div className="border-b border-[#3d3f45]">
                <div className="grid grid-cols-12 gap-2 items-center p-4">
                  {/* Hostel Info */}
                  <div className="col-span-3 flex items-center">
                    <div className="bg-[#3d3f45] p-2 rounded-full mr-3">
                      <Building className="text-[#C8ED4F]" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base truncate text-white">{booking.hostelId?.hostel_name || 'Unknown Hostel'}</h3>
                      <div className="text-xs text-gray-400">
                        ID: #{booking._id.substring(booking._id.length - 6)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer */}
                  <div className="col-span-2 flex items-center">
                    <User className="text-[#C8ED4F] mr-2" size={14} />
                    <div className="text-sm truncate text-gray-300" title={booking.userId?.fullName || 'Unknown User'}>
                      {booking.userId?.fullName || 'Unknown User'}
                    </div>
                  </div>
                  
                  {/* Provider */}
                  <div className="col-span-2 flex items-center">
                    <Home className="text-[#C8ED4F] mr-2" size={14} />
                    <div className="text-sm truncate text-gray-300" title={booking.providerId?.fullName || 'Unknown Provider'}>
                      {booking.providerId?.fullName || 'Unknown Provider'}
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <Calendar className="text-[#C8ED4F] mr-2" size={14} />
                    <div className="text-sm text-gray-300">{formatDate(booking.checkIn)}</div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-1 text-sm font-medium text-[#C8ED4F]">
                    ₹{booking.totalPrice}
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1 text-right">
                    <button 
                      onClick={() => toggleBookingDetails(booking._id)}
                      className="inline-flex items-center justify-center px-2 py-1 bg-[#3d3f45] hover:bg-[#4a4c52] rounded-md transition-colors text-xs font-medium text-[#C8ED4F]"
                    >
                      {expandedBookingId === booking._id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Address Section - Add this right after the header section */}
              {getHostelAddress(booking) && (
                <div className="px-4 py-2 bg-[#2F3033] border-b border-[#3d3f45]">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="text-[#C8ED4F] mr-2" size={14} />
                    <div className="text-sm truncate" title={getHostelAddress(booking)}>
                      {getHostelAddress(booking)}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Expanded Details */}
              {expandedBookingId === booking._id && (
                <div className="bg-[#2A2B2F] p-4 border-t border-[#3d3f45]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Customer & Provider Details Side-by-Side */}
                    <div className="bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45]">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <User className="text-[#C8ED4F] mr-2" size={16} />
                        Customer Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Name:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.userId?.fullName || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Email:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.userId?.email || 'No email available'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Phone:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.userId?.phone || 'No phone available'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Provider Details */}
                    <div className="bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45]">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <Home className="text-[#C8ED4F] mr-2" size={16} />
                        Provider Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Name:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.providerId?.fullName || 'Unknown Provider'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Email:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.providerId?.email || 'No email available'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-20 text-sm">Phone:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.providerId?.phone || 'No phone available'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stay Details */}
                    <div className="bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45]">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <Calendar className="text-[#C8ED4F] mr-2" size={16} />
                        Stay Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24 text-sm">Check-in:</span>
                          <span className="text-gray-200 text-sm font-medium">{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24 text-sm">Check-out:</span>
                          <span className="text-gray-200 text-sm font-medium">{formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24 text-sm">Duration:</span>
                          <span className="text-gray-200 text-sm font-medium">{booking.stayDurationInMonths} months</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Details - Wider */}
                    <div className="bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45] md:col-span-3">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <CreditCard className="text-[#C8ED4F] mr-2" size={16} />
                        Payment Details
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="flex flex-col items-start">
                          <span className="text-gray-400 text-xs">Monthly Rent</span>
                          <span className="text-gray-200 text-sm font-medium">₹{booking.monthlyRent}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-400 text-xs">Deposit</span>
                          <span className="text-gray-200 text-sm font-medium">₹{booking.depositAmount}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-400 text-xs">First Month</span>
                          <span className="text-gray-200 text-sm font-medium">₹{booking.firstMonthRent}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-400 text-xs">Total Amount</span>
                          <span className="text-gray-200 text-sm font-medium">₹{booking.totalPrice}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-400 text-xs">Status</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-md mt-1 ${getStatusClass(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected Facilities */}
                    <div className="bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45] md:col-span-3">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <CookingPot className="text-[#C8ED4F] mr-2" size={16} />
                        Selected Facilities
                      </h4>
                      {booking.selectedFacilities && booking.selectedFacilities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {booking.selectedFacilities.map((facility, index) => (
                            <div key={index} className="bg-[#3d3f45] p-3 rounded-md border border-[#4a4c52]">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  {getFacilityIcon(facility.type)}
                                  <span className="text-gray-200 text-sm font-medium">{facility.type}</span>
                                </div>
                                <span className="text-[#C8ED4F] text-sm font-medium">₹{facility.totalCost}</span>
                              </div>
                              <div className="ml-7 flex flex-wrap gap-x-4 text-xs text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  <span>{formatDate(facility.startDate)} - {formatDate(facility.endDate)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>{calculateFacilityDuration(facility.startDate, facility.endDate)}</span>
                                </div>
                                <div className="flex items-center">
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  <span>₹{facility.ratePerMonth}/month</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No additional facilities selected</p>
                      )}
                    </div>
                    
                    {/* Proof Document */}
                    <div className="col-span-1 md:col-span-3 bg-[#323338] p-4 rounded-lg shadow-sm border border-[#3d3f45]">
                      <h4 className="font-medium text-[#C8ED4F] mb-3 flex items-center pb-2 border-b border-[#3d3f45]">
                        <FileCheck className="text-[#C8ED4F] mr-2" size={16} />
                        Documentation
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Proof Document:</span>
                        <a 
                          href={booking.proof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center bg-[#3d3f45] text-[#C8ED4F] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#4a4c52] transition-colors"
                        >
                          <FileCheck className="mr-2" size={14} />
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-[#3d3f45]'}`}
          >
            <ChevronLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                currentPage === page 
                  ? 'bg-[#C8ED4F] text-[#242529] font-medium' 
                  : 'text-gray-300 hover:bg-[#3d3f45]'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-[#3d3f45]'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Bookings;
