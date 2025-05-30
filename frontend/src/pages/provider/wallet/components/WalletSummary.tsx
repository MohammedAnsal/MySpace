import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useProviderWallet } from '@/hooks/provider/wallet/useWallet';
import { format } from 'date-fns';

const WalletSummary: React.FC = () => {
  const navigate = useNavigate();
  const { data: wallet, isLoading } = useProviderWallet();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <Wallet size={20} className="mr-2 text-amber-500" />
          My Wallet
        </h3>
        <p className="text-gray-500 text-sm mb-4">Your wallet will be created when you receive your first booking payment</p>
        <button 
          onClick={() => navigate('/provider/wallet')}
          className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
        >
          View wallet details <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
    );
  }

  const getRecentTransaction = () => {
    if (!wallet.transactions || wallet.transactions.length === 0) {
      return null;
    }
    return wallet.transactions[0];
  };

  const recentTransaction = getRecentTransaction();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <Wallet size={20} className="mr-2 text-amber-500" />
        My Wallet
      </h3>
      <div className="mb-4">
        <p className="text-sm text-gray-500 font-medium">Available Balance</p>
        <p className="text-2xl font-bold text-amber-600">₹{wallet.balance.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-1">Receives 70% of each booking payment</p>
      </div>
      
      {recentTransaction && (
        <div className="pt-3 border-t border-gray-100 mb-4">
          <p className="text-sm text-gray-500 font-medium mb-2">Last Transaction</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {recentTransaction.type === 'credit' ? (
                <ArrowDownRight size={18} className="text-green-500 mr-2" />
              ) : (
                <ArrowUpRight size={18} className="text-red-500 mr-2" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {recentTransaction.type === 'credit' ? '+' : '-'}₹{recentTransaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{formatDate(recentTransaction.createdAt)}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              recentTransaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
              recentTransaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {recentTransaction.status}
            </span>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate('/provider/wallet')}
        className="w-full py-2 mt-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg text-sm flex items-center justify-center transition-colors"
      >
        View complete wallet <ArrowRight size={14} className="ml-2" />
      </button>
    </div>
  );
};

export default WalletSummary;
