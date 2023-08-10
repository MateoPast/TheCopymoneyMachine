import './OpenOrdersTable.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import React from 'react';

const OpenOrdersTable = ({ userData }) => {
  const { nickName, openPositions, pfValue } = userData;

  return (
    <>
      {openPositions ? (
        <div className="portfolio">
          <h2 className="portfolio__title">{nickName}</h2>
          {pfValue ? (<>
            <p className="portfolio__value">
              Estimated portfolio value: {parseInt(pfValue).toFixed(2)}$
            </p>
          </>
          ) : null}
          {openPositions && openPositions.length > 0 ? (
            <div className="portfolio__table-wrapper">
              <table className="portfolio__table">
                <thead>
                  <tr>
                    <th>Strategy</th>
                    <th>Amount</th>
                    <th>Symbol</th>
                    <th>PNL</th>
                    <th>Entry Price</th>
                    <th>Leverage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((position) => (
                    <tr key={position.symbol}>
                      <td className={position.amount < 0 ? "short" : "long"}>
                        {position.amount < 0 ? (
                          <span className="red">SHORT</span>
                        ) : (
                          <span className="green">LONG</span>
                        )}
                      </td>
                      <td>{position.amount.toFixed(2)}</td>
                      <td>{position.symbol}</td>
                      <td className={position.pnl >= 0 ? 'positive' : 'negative'}>
                        {position.pnl.toFixed(2)} $
                      </td>
                      <td>{position.entryPrice.toFixed(5)} $</td>
                      <td>x{position.leverage}</td>
                      <td>{new Date(position.updateTimeStamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="portfolio__no-orders">No orders found.</p>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default OpenOrdersTable;
