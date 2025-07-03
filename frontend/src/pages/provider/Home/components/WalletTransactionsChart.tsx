import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWalletTransactions } from '@/services/Api/providerApi';
import Loading from '@/components/global/loading';

interface TransactionData {
  month: string;
  credits: number;
  debits: number;
}

const WalletTransactionsChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await getWalletTransactions();
        
        if (response && response.success) {
          processTransactions(response.data);
        } else {
          setError('Failed to load wallet transactions');
        }
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const processTransactions = (transactions: any[]) => {
    // Generate last 6 months data
    const months: Array<{
      month: string;
      numericMonth: number;
      year: number;
      credits: number;
      debits: number;
    }> = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentDate.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        numericMonth: d.getMonth(),
        year: d.getFullYear(),
        credits: 0,
        debits: 0
      });
    }

    // Process transactions
    transactions.forEach(tx => {
      try {
        const txDate = new Date(tx.created_at);
        // Validate date
        if (isNaN(txDate.getTime())) {
          console.warn('Invalid date found:', tx.created_at);
          return; // Skip this transaction
        }

        const txMonth = txDate.getMonth();
        const txYear = txDate.getFullYear();
        
        // Find matching month in our data
        const monthIndex = months.findIndex(m => 
          m.numericMonth === txMonth && m.year === txYear
        );
        
        if (monthIndex !== -1 && tx.status === 'completed') {
          if (tx.type === 'credit') {
            months[monthIndex].credits += tx.amount;
          } else if (tx.type === 'debit') {
            months[monthIndex].debits += tx.amount;
          }
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
      }
    });

    // Format the data for the chart
    const formattedData = months.map(({ month, credits, debits }) => ({
      month,
      credits,
      debits
    }));
    
    setTransactionData(formattedData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loading color="#FFB300" text="Loading wallet data" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p className="font-medium">Error loading wallet data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm col-span-1 lg:col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Wallet Transactions (Last 6 Months)</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transactionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value}`, '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey="credits" name="Income" fill="#22C55E" />
            <Bar dataKey="debits" name="Expenses" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WalletTransactionsChart; 