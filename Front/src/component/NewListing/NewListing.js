import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import './NewListing.css';

function NewListing() {
  const [coinList, setCoinList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/new-listing`);
        const data = response.data;
        setCoinList(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="coin-list">
      {loading ? (
        <LoadingSpinner/>
      ) : (
        <>
        <h1>Liste des cryptomonnaies</h1>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Nom</th>
              <th>Market Cap</th>
              <th>Date de début d'achat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coinList.map((coin) => (
              <tr key={coin.symbol}>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>{coin.name}</td>
                <td>{coin.marketcap}</td>
                <td>{coin.buy_start_timest}</td>
                <td>
                  <a href={coin.trade_url} target="_blank" rel="noreferrer">
                    Acheter
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
            }

export default NewListing;
