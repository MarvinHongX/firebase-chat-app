import React from 'react'
import styles from '../styles/UserBox.module.css'

export default function UserBox({user: {photoURL, displayName, email}}) {
  return (
    <div className={styles.userBoxWrapper}>
        <div className={styles.userWrapper}>
            <img className={styles.img} src={photoURL} alt={displayName} />
            <div className={styles.userInfo}>
                <div className={styles.userId}>  {displayName} </div>
                <div className={styles.userName}>  {email} </div>
            </div>
        </div>
    </div>  
  )
}
