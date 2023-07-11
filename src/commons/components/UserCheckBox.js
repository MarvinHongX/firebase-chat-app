import React from 'react'
import styles from '../styles/UserCheckBox.module.css'

export default function UserCheckBox({user: {photoURL, displayName, uid, email}, onCheckboxChange, checked}) {
  const handleCheckboxChange = e => {
    const { checked } = e.target;
    onCheckboxChange(uid, checked);
  };
  return (
    <div className={styles.checkBoxWrapper}>
      <input 
        className={styles.input} 
        type='checkbox'
        id={uid} 
        value=""
        checked ={checked}
        onChange={handleCheckboxChange}
      />
      <label className={styles.label} htmlFor={uid}>
        <div className={styles.labelWrapper}>
          <div className={styles.userWrapper}>
            <img className={styles.img} src={photoURL} alt={displayName} />
            <div className={styles.userInfo}>
              <div className={styles.userId}>  {displayName} </div>
              <div className={styles.userName}>  {email} </div>
            </div>
          </div>
        </div>
        <span className={styles.span}></span>
      </label>
    </div>  
  )
}
