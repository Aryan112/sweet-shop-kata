import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SweetCard from './components/SweetCard';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import './App.css'; 

function App() {
  const [sweets, setSweets] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // 1. Persist Login
  useEffect(() => {
    if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        fetchSweets(); // Fetch sweets ONLY if token exists
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setSweets([]); // Clear sweets on logout
    }
  }, [token, role]);

  const fetchSweets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sweets');
      setSweets(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/sweets/${id}/purchase`, {}, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      fetchSweets(); 
      alert('Purchase Successful!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Admin: Delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sweets/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSweets();
    } catch (error) {
      alert('Delete Failed');
    }
  };

  return (
    <div className="container">
      <h1>🍭 Sweet Shop Manager</h1>
      
      {!token ? (
        // SHOW THIS ONLY WHEN LOGGED OUT
        <Login setToken={setToken} setRole={setRole} />
      ) : (
        // SHOW THIS ONLY WHEN LOGGED IN
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px'}}>
                <h3>Welcome, {role}!</h3>
                <button 
                  onClick={() => { setToken(null); setRole(null); }}
                  style={{background:'red', color:'white', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer'}}
                >
                  Logout
                </button>
            </div>
            
            {/* Admin Panel (Only for Admins) */}
            {role === 'admin' && <AdminPanel token={token} refreshSweets={fetchSweets} sweets={sweets} />}

            {/* Sweet List Grid (Hidden if not logged in) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {sweets.length === 0 ? <p>No sweets found...</p> : sweets.map((sweet) => (
                <div key={sweet._id} style={{position:'relative'}}>
                    <SweetCard 
                        sweet={sweet} 
                        onPurchase={handlePurchase} 
                        isAdmin={role === 'admin'}
                        onDelete={handleDelete}
                    />
                </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

export default App;