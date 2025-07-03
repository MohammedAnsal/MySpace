import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/global/modal";
import { toast } from "sonner";
import { changePassword } from "@/services/Api/userApi";
import { z } from "zod";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onPasswordChange: () => void;
}

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#^]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  onPasswordChange,
}) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  
  React.useEffect(() => {
    if (isOpen) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      setValidationErrors({});
    }
  }, [isOpen]);

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
    
    // Also clear the general password error
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleSavePassword = async () => {
    try {
      // Validate password data using Zod
      passwordChangeSchema.parse(passwordData);
      
      // Clear validation errors
      setValidationErrors({});
      setPasswordError("");
      
      setIsLoading(true);
      try {
        const response = await changePassword(
          email,
          passwordData.currentPassword,
          passwordData.newPassword
        );

        if (response && response.success) {
          onPasswordChange();
          toast.success("Password changed successfully!");
        } else {
          setPasswordError(response?.message || "Failed to change password");
          toast.error(
            "Password change failed. Please check your current password."
          );
        }
      } catch (error) {
        console.error("Error changing password:", error);
        setPasswordError("An error occurred while changing password");
        toast.error("Password change failed. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Please fix the validation errors");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      title="Change Password"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border ${
              validationErrors.currentPassword ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089]`}
          />
          {validationErrors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border ${
              validationErrors.newPassword ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089]`}
          />
          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border ${
              validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089]`}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePassword}
            disabled={isLoading}
            className="bg-[#b9a089] text-white px-4 py-2 rounded-md hover:bg-[#a58e77] transition disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Password"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal; 