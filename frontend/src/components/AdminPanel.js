import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.css';

const AdminPanel = ({ token, refreshSweets, sweets }) => {
    // State for Adding
    const [newItem, setNewItem] = useState({ name: '', category: '', price: '', quantity: '' });
    
    // State for Restocking
    const [restockId, setRestockId] = useState('');
    const [restockAmount, setRestockAmount] = useState(10);

    // State for Updating Price (Simplified Update)
    const [updateId, setUpdateId] = useState('');
    const [newPrice, setNewPrice] = useState('');

    // 1. Add Sweet
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/sweets', newItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshSweets();
            setNewItem({ name: '', category: '', price: '', quantity: '' });
            alert('Sweet Added!');
        } catch (err) { alert('Failed to add'); }
    };

    // 2. Restock Sweet
    const handleRestock = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/sweets/${restockId}/restock`, { amount: restockAmount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshSweets();
            alert('Restock Successful!');
        } catch (err) { alert('Restock Failed'); }
    };

    // 3. Update Price
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/sweets/${updateId}`, { price: newPrice }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshSweets();
            alert('Price Updated!');
        } catch (err) { alert('Update Failed'); }
    };

    return (
        <div className={styles.panel}>
            {/* ADD SECTION */}
            <div className={styles.section}>
                <h3>Add New Item</h3>
                <form onSubmit={handleAdd}>
                    <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                    <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                    <input placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                    <input placeholder="Qty" type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required />
                    <button type="submit">Add</button>
                </form>
            </div>

            {/* RESTOCK SECTION */}
            <div className={styles.section}>
                <h3>Restock Inventory</h3>
                <form onSubmit={handleRestock}>
                    <select value={restockId} onChange={e => setRestockId(e.target.value)} required>
                        <option value="">Select Item...</option>
                        {sweets.map(s => <option key={s._id} value={s._id}>{s.name} (Qty: {s.quantity})</option>)}
                    </select>
                    <input type="number" placeholder="Amount" value={restockAmount} onChange={e => setRestockAmount(e.target.value)} />
                    <button type="submit">Restock</button>
                </form>
            </div>

            {/* UPDATE PRICE SECTION */}
            <div className={styles.section}>
                <h3>Update Price</h3>
                <form onSubmit={handleUpdate}>
                    <select value={updateId} onChange={e => setUpdateId(e.target.value)} required>
                        <option value="">Select Item...</option>
                        {sweets.map(s => <option key={s._id} value={s._id}>{s.name} (${s.price})</option>)}
                    </select>
                    <input type="number" placeholder="New Price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;