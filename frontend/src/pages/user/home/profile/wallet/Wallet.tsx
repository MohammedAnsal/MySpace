import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserWallet, useWalletTransactions } from '@/hooks/user/useUserQueries';
import { FaWallet, FaMoneyBillWave, FaExchangeAlt, FaHistory, FaUndo } from 'react-icons/fa';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  amount: number;
  type: 'credit' | 'debit' | 're-fund';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
}

export const Wallet: React.FC = () => {
  const { data: wallet, isLoading: isWalletLoading } = useUserWallet();
  const { data: transactions, isLoading: isTransactionsLoading } = useWalletTransactions();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 }},
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 }}
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 }}
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, delay: 0.1 + (i * 0.05) } 
    })
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'credit':
        return <FaMoneyBillWave className="text-emerald-500" />;
      case 'debit':
        return <FaExchangeAlt className="text-rose-500" />;
      case 're-fund':
        return <FaUndo className="text-blue-500" />;
      default:
        return <FaExchangeAlt className="text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch(type) {
      case 'credit':
        return 'text-emerald-500';
      case 'debit':
        return 'text-rose-500';
      case 're-fund':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isWalletLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-96"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a58e77] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet data...</p>
        </div>
      </motion.div>
    );
  }

  if (!wallet) {
    return (
      <motion.div 
        className="text-center py-12 px-4"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <FaWallet className="mx-auto text-5xl text-[#a58e77] mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Wallet Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your wallet hasn't been created yet. It will be created automatically when you book a hostel.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div 
        className="bg-gradient-to-r from-[#a58e77] to-[#a58e77]/80 rounded-2xl p-6 mb-8 text-white shadow-lg"
        variants={cardVariants}
      >
        <div className="flex items-center mb-2">
          <FaWallet className="text-2xl mr-2" />
          <h2 className="text-2xl font-semibold">My Wallet</h2>
        </div>
        <div className="mt-6">
          <p className="text-sm text-[#a58e77]">Available Balance</p>
          <h1 className="text-4xl font-bold mt-1">₹{wallet.balance.toFixed(2)}</h1>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-[#a58e77]" /> Transaction History
          </h3>
        </div>

        <div className="p-4">
          {isTransactionsLoading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-[#a58e77] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading transactions...</p>
            </div>
          ) : wallet.transactions && wallet.transactions.length > 0 ? (
            <div className="divide-y">
              {wallet.transactions.map((transaction: Transaction, index: number) => (
                <motion.div
                  key={transaction._id}
                  className="py-4 flex items-start"
                  custom={index}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate max-w-xs">
                          {transaction.description}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                          transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'credit' || transaction.type === 're-fund' ? '+' : '-'}
                        ₹{transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FaHistory className="mx-auto text-3xl text-gray-300 mb-3" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Wallet;
