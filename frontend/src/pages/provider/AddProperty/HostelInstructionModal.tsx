export const HostelInstructionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="flex bg-black bg-opacity-50 justify-center p-4 fixed inset-0 items-center z-50">
      <div className="bg-white border border-amber-200 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-6 text-center">
          <h2 className="text-2xl text-gray-800 font-semibold mb-4">Welcome to the Add Hostel Accommodation Page!</h2>
          
          <p className="text-gray-700 mb-4">
            Here, you can list your hostel rooms or spaces and offer facilities to enhance
            the tenant's experience. Providing accurate and detailed information about
            your hostel ensures a smooth booking process for clients
          </p>
          
          <h3 className="text-gray-800 text-lg font-medium mb-2">Things to Keep in Mind:</h3>
          
          <ul className="text-left mb-6 space-y-2">
            <li className="flex items-start">
              <span className="bg-amber-400 h-2 rounded-full w-2 inline-block mr-2 mt-2"></span>
              <span className="text-gray-700">Provide a clear and descriptive name for your hostel (e.g., <strong>Blue Horizon Hostel</strong>).</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-400 h-2 rounded-full w-2 inline-block mr-2 mt-2"></span>
              <span className="text-gray-700">Upload high-quality images to attract more clients.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-400 h-2 rounded-full w-2 inline-block mr-2 mt-2"></span>
              <span className="text-gray-700">Ensure the location details are accurate, as clients will rely on this to find your property.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-400 h-2 rounded-full w-2 inline-block mr-2 mt-2"></span>
              <span className="text-gray-700">Specify the maximum occupancy, rent, and deposit details clearly to avoid confusion.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-400 h-2 rounded-full w-2 inline-block mr-2 mt-2"></span>
              <span className="text-gray-700">Use the 'Features and Amenities' section to highlight the unique aspects of your property (e.g., <strong>WiFi, Parking</strong>).</span>
            </li>
          </ul>
          
          <p className="text-gray-700 mb-6">
            Once you submit the form, your accommodation will be listed and visible to clients. You can
            always edit or update the details later in the 'Manage Accommodations' section.
          </p>
          
          <h3 className="text-gray-800 text-xl font-medium mb-6">Let's get started and make your property stand out!</h3>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="bg-amber-400 rounded-lg text-gray-800 font-medium hover:bg-amber-500 px-8 py-2 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 