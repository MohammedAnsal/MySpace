import React from "react";

interface RulesSectionProps {
  rules: string | null;
  acceptedRules: boolean;
  onRulesAcceptanceChange: (accepted: boolean) => void;
}

const RulesSection: React.FC<RulesSectionProps> = ({
  rules,
  acceptedRules,
  onRulesAcceptanceChange,
}) => {
  return (
    <section className="mb-8">
      <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
        Important Rules and Guidelines
      </h2>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Hostel Rules</h3>
          </div>
          <div className="p-4">
            {rules ? (
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {rules}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No specific rules specified
              </p>
            )}
          </div>
        </div>

        {/* Rules Acceptance */}
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={acceptedRules}
              onChange={(e) => onRulesAcceptanceChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors"
            />
            <label className="ml-3 text-sm text-gray-900 leading-relaxed">
              I have read, understood, and agree to follow all hostel rules and
              policies. I understand that violation of these rules may result in
              termination of my stay.
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;