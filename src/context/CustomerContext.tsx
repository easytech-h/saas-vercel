import React, { createContext, useState, useContext, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  loyaltyPoints: number;
}

interface CustomerContextType {
  customers: Customer[];
  getCustomer: (id: string) => Customer | undefined;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addLoyaltyPoints: (id: string, points: number) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem('customers');
    return savedCustomers ? JSON.parse(savedCustomers) : [
      { id: '1', name: 'John Doe', email: 'john@example.com', loyaltyPoints: 100 },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', loyaltyPoints: 50 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const getCustomer = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    setCustomers([...customers, newCustomer]);
  };

  const addLoyaltyPoints = (id: string, points: number) => {
    setCustomers(customers.map(customer => 
      customer.id === id 
        ? { ...customer, loyaltyPoints: customer.loyaltyPoints + points } 
        : customer
    ));
  };

  return (
    <CustomerContext.Provider value={{ customers, getCustomer, addCustomer, addLoyaltyPoints }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};