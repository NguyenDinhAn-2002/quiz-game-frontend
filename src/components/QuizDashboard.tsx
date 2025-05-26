import React from 'react';
import styles from './UserDashboard.module.css'; // Import CSS Modules

const UserDashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
          style={{ width: 80 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className={styles.username}>user_badf646a4a7af5600596</span>
      </div>

      <div className={styles.navigation}>
        <button className={styles['active-button']}>My Quizzes</button>
        <button className={styles['inactive-button']}>
          My Reports
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            style={{ width: 20 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        </button>
        <button className={styles['inactive-button']}>Settings</button>
      </div>

      <div className={styles.content}>
        <div className={styles['quiz-box']}>
          <button className={styles['quiz-button']}>Create Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
