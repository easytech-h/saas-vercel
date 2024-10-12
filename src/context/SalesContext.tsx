import React, { createContext, useState, useContext, useEffect } from 'react';

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  discount: number;
  paymentReceived: number;
  change: number;
  date: Date;
  cashier: string;
  storeLocation: string;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  getSaleById: (id: string) => Sale | undefined;
  clearSales: () => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>(() => {
    const savedSales = localStorage.getItem('sales');
    return savedSales ? JSON.parse(savedSales) : [];
  });

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = {
      ...sale,
      id: `SALE-${Date.now()}`,
      date: new Date(),
    };
    setSales(prevSales => [...prevSales, newSale]);
  };

  const getSaleById = (id: string) => {
    return sales.find(sale => sale.id === id);
  };

  const clearSales = () => {
    setSales([]);
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, getSaleById, clearSales }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};