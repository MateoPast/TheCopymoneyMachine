import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ userInfo }) {

  if (!userInfo) {
    return null;
  }

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      <p>Bienvenue {userInfo.userId} !</p>
    </div>
  );
}
