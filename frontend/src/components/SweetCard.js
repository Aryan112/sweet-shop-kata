import React from 'react';
import styles from './SweetCard.module.css';

const SweetCard = ({ sweet, onPurchase, onDelete, isAdmin }) => {
  return (
    <div className={styles.card}>
      {isAdmin && <button className={styles.delete} onClick={() => onDelete(sweet._id)}>×</button>}
      <div>
        <h3 className={styles.title}>{sweet.name}</h3>
        <span className={styles.badge}>{sweet.category}</span>
        <p className={styles.desc}>{sweet.description || "A delicious treat."}</p>
        <div className={styles.price}>${sweet.price}</div>
      </div>
      <div>
        {sweet.quantity > 0 ? <p className={styles.stock}>In Stock: {sweet.quantity}</p> : <p className={styles.out}>Sold Out</p>}
        <button 
          className={styles.buyBtn} 
          onClick={() => onPurchase(sweet._id)}
          disabled={sweet.quantity === 0 || isAdmin}
        >
          {isAdmin ? 'Admin View' : (sweet.quantity === 0 ? 'Sold Out' : 'Buy Now')}
        </button>
      </div>
    </div>
  );
};
export default SweetCard;