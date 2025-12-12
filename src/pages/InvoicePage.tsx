import Layout from '@/components/layout/Layout';
import InvoiceGenerator from '@/components/invoice/InvoiceGenerator';
import AdminLogin from '@/components/admin/AdminLogin';
import { useState, useEffect } from 'react';

const InvoicePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <Layout>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <InvoiceGenerator />
    </Layout>
  );
};

export default InvoicePage;
