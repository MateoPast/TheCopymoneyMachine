import './UserOrders.css';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';

const UserOrders = () => {

  const [userOrdersList, setUserOrdersList] = useState([]);
  // const [userPositionsList, setUserPositionsList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const url = `${process.env.REACT_APP_API_URL}/user-orders`;
  // const urlTest = `${process.env.REACT_APP_API_URL}/user-positions`;

  
  async function getUserOrdersData() {
    try {
      const response = await axios.get(url, {headers: {
        'Authorization': userInfo.accessToken
    }
    });
      if (response.status === 200) {
        setUserOrdersList(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`Impossible de récupérer les données de l'utilisateur: ${error}`);
      setUserOrdersList([]);
      setIsLoading(false);
    }
  }

  // async function getUserPositionData() {
  //   try {
  //     const response = await axios.get(urlTest, {headers: {
  //       'Authorization': userInfo.accessToken
  //   }
  //   });
  //     if (response.status === 200) {
  //       console.log('position', response)
  //       setUserPositionsList(response.data);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error(`Impossible de récupérer les données de l'utilisateur: ${error}`);
  //     setUserPositionsList([]);
  //     setIsLoading(false);
  //   }
  // }

  useEffect(() => {
    getUserOrdersData();
    // getUserPositionData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    getUserOrdersData();
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
        <div className="orders-list">
          <h2>Mes ordres en cours</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Symbole</th>
                <th>Quantité</th>
                <th>Prix d'entrée</th>
                <th>Effet de levier</th>
                <th>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {userOrdersList.map((order, index) => (
                <tr key={index}>
                  <td className={order.amount > 0 ? "order-type-long" : "order-type-short"}>
                    {order.amount > 0 ? "LONG" : "SHORT"}
                  </td>
                  <td>{order.symbol}</td>
                  <td>{order.amount}</td>
                  <td>{Number(order.entryPrice).toFixed(2)}$</td>
                  <td>{order.leverage}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>                   
                </tr>
              ))}
            </tbody>
          </table>
          {userOrdersList.length === 0 && (
            <p className="no-orders">Aucune position ouverte</p>
          )}
        </div>
      )}
    </>
  );

  
  
          }  
   
export default UserOrders;
