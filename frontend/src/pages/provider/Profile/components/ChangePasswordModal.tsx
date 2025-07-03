import React, { useState } from "react";
import { Save, X } from "lucide-react";
import Modal from "@/components/global/modal";
import { toast } from "sonner";
import { changePassword } from "@/services/Api/providerApi";
import Loading from "@/components/global/loading";

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name in passwordErrors) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(
        email,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response && response.success) {
        onClose();
        toast.success("Password changed successfully");
      } else {
        toast.error(response?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={!isLoading ? onClose : () => {}} title="Change Password">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-200 outline-none ${
              passwordErrors.currentPassword ? "border-red-500" : ""
            }`}
          />
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-200 outline-none ${
              passwordErrors.newPassword ? "border-red-500" : ""
            }`}
          />
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.newPassword}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-200 outline-none ${
              passwordErrors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.confirmPassword}
            </p>
          )}
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-amber-200 rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loading size="small" text="" className="mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Update Password
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <X size={20} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal; 