// import React, { useState, useEffect } from 'react';

// const dummyData = [
//   {
//     name: 'Virat Gangwar',
//     email: 'LzyCrazy@Mnc.Software',
//     phone: '+919999999999',
//     message: 'Hello! Welcome to Service Page',
//     date: '2025-05-30',
//   },
//   {
//     name: 'Pawan Kumar',
//     email: 'pawan@example.com',
//     phone: '+918888888888',
//     message: 'Need information about products',
//     date: '2025-06-20',
//   },
//   {
//     name: 'Amit Singh',
//     email: 'amit.singh@gmail.com',
//     phone: '+917777777777',
//     message: "I'm interested in hiring",
//     date: '2025-06-27',
//   },
// ];

// const ClientEnquiry = () => {
//   const [data] = useState(dummyData);
//   const [filtered, setFiltered] = useState(dummyData);
//   const [filters, setFilters] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     date: '',
//   });

//   useEffect(() => {
//     filterTable();
//   }, [filters]);

//   const handleInputChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const filterTable = () => {
//     const { name, email, phone, date } = filters;
//     const result = data.filter((entry) =>
//       entry.name.toLowerCase().includes(name.toLowerCase()) &&
//       entry.email.toLowerCase().includes(email.toLowerCase()) &&
//       entry.phone.includes(phone) &&
//       (date === '' || entry.date === date)
//     );
//     setFiltered(result);
//   };

//   const downloadCSV = () => {
//     let csv = 'First Name,Email,Phone Number,Message,Date\n';
//     data.forEach((row) => {
//       csv += `"${row.name}","${row.email}","${row.phone}","${row.message}","${row.date}"\n`;
//     });

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'client_enquiries.csv';
//     a.click();
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: 'Segoe UI', background: '#f9f9f9', minHeight: '100vh' }}>
//       <h2 style={{ marginBottom: 20 }}>Client Enquiry</h2>

//       {/* Filters */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={filters.name}
//           onChange={handleInputChange}
//           style={inputStyle}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={filters.email}
//           onChange={handleInputChange}
//           style={inputStyle}
//         />
//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone No."
//           value={filters.phone}
//           onChange={handleInputChange}
//           style={inputStyle}
//         />
//         <input
//           type="date"
//           name="date"
//           value={filters.date}
//           onChange={handleInputChange}
//           style={inputStyle}
//         />
//         <button onClick={filterTable} style={searchBtnStyle}>🔍 Search</button>
//         <button onClick={downloadCSV} style={downloadBtnStyle}>⬇️ Download</button>
//       </div>

//       {/* Table */}
//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
//           <thead>
//             <tr>
//               {['First Name', 'Email', 'Phone Number', 'Message', 'Date', 'Action'].map(header => (
//                 <th key={header} style={thStyle}>{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((entry, i) => (
//               <tr key={i}>
//                 <td style={tdStyle}>{entry.name}</td>
//                 <td style={tdStyle}>{entry.email}</td>
//                 <td style={tdStyle}>{entry.phone}</td>
//                 <td style={tdStyle}>{entry.message}</td>
//                 <td style={tdStyle}>{entry.date}</td>
//                 <td style={tdStyle}><span style={{ color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>📩</span></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // Styles
// const inputStyle = {
//   padding: '8px 10px',
//   border: '1px solid #ccc',
//   borderRadius: '5px'
// };

// const searchBtnStyle = {
//   ...inputStyle,
//   backgroundColor: '#d83ebf',
//   color: '#fff',
//   cursor: 'pointer'
// };

// const downloadBtnStyle = {
//   ...inputStyle,
//   backgroundColor: '#c12ddb',
//   color: '#fff',
//   cursor: 'pointer'
// };

// const thStyle = {
//   border: '1px solid #ddd',
//   padding: '12px 10px',
//   backgroundColor: '#f2f2f2',
//   fontSize: '14px',
//   textAlign: 'left'
// };

// const tdStyle = {
//   border: '1px solid #ddd',
//   padding: '12px 10px',
//   fontSize: '14px',
//   textAlign: 'left'
// };

// export default ClientEnquiry;


import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios/axiosInstance'; // Adjust path if needed

const ClientEnquiry = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterTable();
  }, [filters, data]);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('/admin/enquiry');
      setData(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterTable = () => {
    const { name, email, phone, date } = filters;
    const result = data.filter((entry) => {
      const entryDate = entry.createdAt?.slice(0, 10);
      return (
        entry.name?.toLowerCase().includes(name.toLowerCase()) &&
        entry.email?.toLowerCase().includes(email.toLowerCase()) &&
        entry.phone?.includes(phone) &&
        (date === '' || entryDate === date)
      );
    });
    setFiltered(result);
  };

  const downloadCSV = (row) => {
    const csv = `ID,Name,Email,Phone,Message,Service ID,Service Title,Created At\n"${row._id}","${row.name}","${row.email}","${row.phone}","${row.message}","${row.service}","${row.serviceTitle}","${row.createdAt}"\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiry_${row.name.replace(/\s+/g, '_')}_${row._id}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI', background: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 20 }}>Client Enquiry</h2>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone No."
          value={filters.phone}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <button onClick={filterTable} style={searchBtnStyle}>🔍 Search</button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr>
              {['Name', 'Email','Enquiry-For', 'Phone', 'Message', 'Date', 'Action'].map(header => (
                <th key={header} style={thStyle}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={i}>
                <td style={tdStyle}>{entry.name}</td>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.serviceTitle}</td>
                <td style={tdStyle}>{entry.phone}</td>
                <td style={tdStyle}>{entry.message}</td>
                <td style={tdStyle}>{entry.createdAt?.slice(0, 10)}</td>
                <td style={tdStyle}>
                  <button
                    style={{ ...actionBtn }}
                    onClick={() => downloadCSV(entry)}
                  >
                    ⬇️ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: '5px'
};

const searchBtnStyle = {
  ...inputStyle,
  backgroundColor: '#d83ebf',
  color: '#fff',
  cursor: 'pointer'
};

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px 10px',
  backgroundColor: '#f2f2f2',
  fontSize: '14px',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px 10px',
  fontSize: '14px',
  textAlign: 'left'
};

const actionBtn = {
  backgroundColor: '#3b82f6',
  border: 'none',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ClientEnquiry;
