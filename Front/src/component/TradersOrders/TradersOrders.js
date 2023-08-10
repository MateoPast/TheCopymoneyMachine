import React, { useState, useEffect } from 'react';
import OpenOrdersTable from '../OpenOrdersTable/OpenOrdersTable';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import './TradersOrders.css';

const TradersOrders = () => {

  const [userDataList, setUserDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const url = `${process.env.REACT_APP_API_URL}/traders-orders`;

  async function getUserData() {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setUserDataList(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`Impossible de récupérer les données de l'utilisateur: ${error}`);
      setUserDataList([]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    getUserData();
  };

  const getLastRefreshDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return now.toLocaleDateString('fr-FR', options);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
        <div className="refresh">
            <button className='refresh-button' onClick={handleRefresh}>Actualiser</button>
            <div className="last-refresh">Dernière actualisation : {getLastRefreshDate()}</div>
          </div>
          {userDataList.filter((userData) => userData.openPositions.length > 0).map((userData) => (
            <OpenOrdersTable key={userData.nickName} userData={userData} />
          ))}
          {userDataList.filter((userData) => userData.openPositions.length === 0).map((userData) => (
            <OpenOrdersTable key={userData.nickName} userData={userData} />
          ))}
        </>
      )}
    </>
  );
};

export default TradersOrders;
