import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions {key, label}
 * @param {String} filename - Name of the file
 */
export const exportToCSV = (data, columns, filename = 'export') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Helper function to replace ₹ with Rs for CSV compatibility
  const replaceCurrencySymbol = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/₹/g, 'Rs');
  };

  // Create CSV header - replace ₹ with Rs
  const headers = columns.map(col => replaceCurrencySymbol(col.label || col.key));
  const csvRows = [headers.join(',')];

  // Add data rows
  data.forEach(row => {
    const values = columns.map(col => {
      let value = row[col.key];
      
      // Handle nested objects and arrays
      if (value === null || value === undefined) {
        value = '';
      } else if (Array.isArray(value)) {
        value = value.join('; ');
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else {
        // Replace ₹ with Rs for CSV compatibility
        value = replaceCurrencySymbol(String(value));
        // Escape commas and quotes in strings
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
      }
      
      return value;
    });
    csvRows.push(values.join(','));
  });

  // Create blob with UTF-8 BOM for better Excel compatibility
  const BOM = '\uFEFF';
  const csvContent = BOM + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to PDF format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions {key, label, width}
 * @param {String} title - Title of the document
 * @param {String} filename - Name of the file
 */
export const exportToPDF = (data, columns, title = 'Report', filename = 'export') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 30);
  doc.setTextColor(0, 0, 0);
  
  // Prepare table data
  const tableData = data.map(row => 
    columns.map(col => {
      let value = row[col.key];
      
      if (value === null || value === undefined) {
        value = '';
      } else if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      
      return String(value);
    })
  );

  const tableColumns = columns.map(col => ({
    header: col.label || col.key,
    dataKey: col.key,
    ...(col.width && { width: col.width })
  }));

  // Add table using autoTable function
  autoTable(doc, {
    head: [columns.map(col => col.label || col.key)],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 35, left: 14, right: 14 },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width };
      }
      return acc;
    }, {})
  });

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export Users data
 */
export const exportUsers = (users, format = 'csv') => {
  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'hasUsedAI', label: 'AI Used', transform: (val) => val ? 'Yes' : 'No' },
    { key: 'createdAt', label: 'Joined Date', transform: (val) => new Date(val).toLocaleDateString('en-IN') }
  ];

  // Transform data
  const transformedData = users.map(user => ({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || 'Not provided',
    hasUsedAI: user.hasUsedAI ? 'Yes' : 'No',
    createdAt: new Date(user.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }));

  if (format === 'csv') {
    exportToCSV(transformedData, columns, 'users_report');
  } else {
    exportToPDF(transformedData, columns, 'Users Report', 'users_report');
  }
};

/**
 * Export Orders data
 */
export const exportOrders = (orders, format = 'csv') => {
  const columns = [
    { key: '_id', label: 'Order ID', width: 30 },
    { key: 'customerName', label: 'Customer Name', width: 40 },
    { key: 'email', label: 'Email', width: 50 },
    { key: 'phone', label: 'Phone', width: 30 },
    { key: 'items', label: 'Items', transform: (val) => Array.isArray(val) ? val.length : 0 },
    { key: 'totalAmount', label: 'Total Amount (Rs)', width: 30 },
    { key: 'status', label: 'Status', width: 25 },
    { key: 'paymentMethod', label: 'Payment Method', width: 30 },
    { key: 'createdAt', label: 'Order Date', width: 40 }
  ];

  // Transform data
  const transformedData = orders.map(order => ({
    _id: order._id?.slice(-8).toUpperCase() || '',
    customerName: order.customerName || '',
    email: order.email || '',
    phone: order.phone || '',
    items: `${order.items?.length || 0} item(s)`,
    totalAmount: `Rs ${order.totalAmount?.toLocaleString('en-IN') || 0}`,
    status: (order.status || order.shipment?.status || 'Pending').charAt(0).toUpperCase() + 
            (order.status || order.shipment?.status || 'Pending').slice(1),
    paymentMethod: order.paymentMethod || 'N/A',
    createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }));

  if (format === 'csv') {
    exportToCSV(transformedData, columns, 'orders_report');
  } else {
    exportToPDF(transformedData, columns, 'Orders Report', 'orders_report');
  }
};

/**
 * Export Contacts data
 */
export const exportContacts = (contacts, format = 'csv') => {
  const columns = [
    { key: 'name', label: 'Name', width: 40 },
    { key: 'email', label: 'Email', width: 50 },
    { key: 'phone', label: 'Phone', width: 30 },
    { key: 'subject', label: 'Subject', width: 50 },
    { key: 'message', label: 'Message', width: 80 },
    { key: 'status', label: 'Status', width: 25 },
    { key: 'createdAt', label: 'Submitted Date', width: 40 }
  ];

  // Transform data
  const transformedData = contacts.map(contact => ({
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || 'Not provided',
    subject: contact.subject || 'No subject',
    message: (contact.message || '').substring(0, 100) + (contact.message?.length > 100 ? '...' : ''),
    status: (contact.status || 'new').charAt(0).toUpperCase() + (contact.status || 'new').slice(1),
    createdAt: new Date(contact.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  if (format === 'csv') {
    exportToCSV(transformedData, columns, 'contacts_report');
  } else {
    exportToPDF(transformedData, columns, 'Contacts Report', 'contacts_report');
  }
};

/**
 * Export Products data
 */
export const exportProducts = (products, format = 'csv') => {
  const columns = [
    { key: 'name', label: 'Product Name', width: 50 },
    { key: 'category', label: 'Category', width: 30 },
    { key: 'originalPrice', label: 'Original Price (Rs)', width: 30 },
    { key: 'price', label: 'Price (Rs)', width: 30 },
    { key: 'quantity', label: 'Total Quantity', width: 25 },
    { key: 'sizes', label: 'Sizes', width: 40 },
    { key: 'createdAt', label: 'Created Date', width: 40 }
  ];

  // Transform data
  const transformedData = products.map(product => {
    // Calculate total quantity from sizes
    const totalQuantity = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || product.quantity || 0;
    
    // Format sizes
    const sizesStr = product.sizes?.map(s => `${s.size}: ${s.stock || 0}`).join(', ') || 'N/A';

    return {
      name: product.name || '',
      category: product.category || '',
      originalPrice: `Rs ${product.originalPrice?.toLocaleString('en-IN') || 0}`,
      price: `Rs ${product.price?.toLocaleString('en-IN') || 0}`,
      quantity: totalQuantity,
      sizes: sizesStr,
      createdAt: new Date(product.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
  });

  if (format === 'csv') {
    exportToCSV(transformedData, columns, 'products_report');
  } else {
    exportToPDF(transformedData, columns, 'Products Report', 'products_report');
  }
};

