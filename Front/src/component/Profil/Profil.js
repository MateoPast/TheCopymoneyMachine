import "./Profil.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function Profil() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [inputDisabled, setInputDisabled] = useState({
    input1: true,
    input2: true,
    input3: true,
  });
  const [modifications, setModifications] = useState({});
  const [traders, setTraders] = useState([]);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [lastSavedTrader, setLastSavedTrader] = useState(null);
  const [tradersCoef, setTradersCoef] = useState([]);
  const [userCoef, setUserCoef] = useState(null);
  const [lastSavedCoef, setLastSavedCoef] = useState(null);
  const [infosUser, setInfosUser] = useState({
    username: "",
    bybitapikey: "",
    bybitsecretkey: "",
  });

  const toggleInput = (inputName) => {
    setInputDisabled((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  const sendNewInfos = async (e) => {
    e.preventDefault();
    //console.log('call sendNewInfos');
    //console.log('je suis dans sendNewInfos', {modifications});
    if (
      Object.keys(modifications).length === 0 &&
      selectedTrader === lastSavedTrader
    ) {
      // Pas de modifications, donc on ne fait rien
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/profil`,
        modifications,
        {
          headers: {
            Authorization: userInfo.accessToken,
          },
        }
      );
      //console.log('response: ', response);
      // Réinitialisez les modifications après que la requête a réussi
      setModifications({});

      // Si le trader a changé, mettez à jour le trader enregistré
      if (selectedTrader !== lastSavedTrader) {
        // Envoyer une requête DELETE pour supprimer l'ancien trader
        if (lastSavedTrader) {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/user_trader/${lastSavedTrader}`,
            {
              headers: {
                Authorization: userInfo.accessToken,
              },
            }
          );
        }

        // Envoyer une requête POST pour ajouter le nouveau trader, seulement si un trader est sélectionné
        if (selectedTrader && selectedTrader !== "") {
          console.log(userCoef);
          await axios.post(
            `${process.env.REACT_APP_API_URL}/user_trader`,
            { traders_uid: selectedTrader, coef: userCoef },
            {
              headers: {
                Authorization: userInfo.accessToken,
              },
            }
          );
        }

        setLastSavedTrader(selectedTrader);
      }
      getData();
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  };

  const getData = async () => {
    let urls = [
      `${process.env.REACT_APP_API_URL}/profil`,
      `${process.env.REACT_APP_API_URL}/traders`,
      `${process.env.REACT_APP_API_URL}/user_trader`,
      `${process.env.REACT_APP_API_URL}/coef_traders`,
    ];

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/login");
        return;
      }
      const token = userInfo.accessToken;
      const response = await axios.all(
        urls.map((url) =>
          axios.get(url, {
            headers: {
              Authorization: token,
            },
          })
        )
      );
      if (response.every((r) => r.status === 200)) {
        // console.log(response[0].data)
        // console.log(response[1].data)
        setTraders(response[1].data);
        setInfosUser({
          username: response[0].data.username,
          bybitapikey: response[0].data.hasBybitApiKey ? "**************" : "",
          bybitsecretkey: response[0].data.hasBybitSecretKey
            ? "**************"
            : "",
        });
        //console.log(response[2].data)
        setSelectedTrader(response[2].data[0].traders_uid);
        setLastSavedTrader(response[2].data[0].traders_uid);
        setUserCoef(response[2].data[0].coef);
        setLastSavedCoef(response[2].data[0].coef);
        setTradersCoef(response[3].data);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("error: on est logout !");
      } else {
        console.log("error: ", error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="profil">
          <h1 className="title_profil">
            Profil{" "}
            <span className="userName_title">
              {modifications.username ?? infosUser.username ?? ""}
            </span>
          </h1>
          <form
            action=""
            method="post"
            className="userInfos-form"
            onSubmit={sendNewInfos}
          >
            <div className="input_container">
              <label className="userInfos-label">
                Pseudo
                <input
                  disabled={inputDisabled.input1}
                  id="userName_input"
                  name="username"
                  type="text"
                  className="userName_input input"
                  value={modifications.username ?? infosUser.username ?? ""}
                  onChange={(e) =>
                    setModifications((prevState) => ({
                      ...prevState,
                      username: e.target.value,
                    }))
                  }
                />
              </label>
              <button
                className="toggle_button"
                type="button"
                onClick={() => toggleInput("input1")}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>

            <div className="input_container">
              <label className="userInfos-label">
                Bybit API Key
                <input
                  disabled={inputDisabled.input2}
                  required="required"
                  id="bybitapikey_input"
                  name="bybitapikey"
                  type="password"
                  className="bybitapikey_input input"
                  value={
                    modifications.bybit_api_key ?? infosUser.bybitapikey ?? ""
                  }
                  onChange={(e) =>
                    setModifications((prevState) => ({
                      ...prevState,
                      bybit_api_key: e.target.value,
                    }))
                  }
                />
              </label>
              <button
                className="toggle_button"
                type="button"
                onClick={() => toggleInput("input2")}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>

            <div className="input_container">
              <label className="userInfos-label">
                Bybit Secret Key
                <input
                  disabled={inputDisabled.input3}
                  id="bybitsecretkey_input"
                  name="bybitsecretkey"
                  type="password"
                  className="bybitsecretkey_input input"
                  value={
                    modifications.bybit_secret_key ??
                    infosUser.bybitsecretkey ??
                    ""
                  }
                  onChange={(e) =>
                    setModifications((prevState) => ({
                      ...prevState,
                      bybit_secret_key: e.target.value,
                    }))
                  }
                />
              </label>
              <button
                className="toggle_button"
                type="button"
                onClick={() => toggleInput("input3")}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>

            <div className="trader-container">
              <label className="userInfos-label">
                Choisir un trader à copier :
                <select
                  name="trader"
                  value={selectedTrader ?? ""}
                  onChange={(e) => {
                    setSelectedTrader(e.target.value);
                  }}
                  className="trader-select"
                >
                  {traders.map((trader) => (
                    <option key={trader.uid} value={trader.uid}>
                      {trader.name}
                    </option>
                  ))}
                  <option value="">Aucun</option>
                </select>
              </label>
              <div className="trader-coef-input-container">
                <label className="userInfos-label">
                  Coefficient
                  <input
                    id="userCoef_input"
                    name="userCoef"
                    type="number"
                    className="userCoef_input input"
                    value={userCoef ?? ""}
                    onChange={(e) => setUserCoef(e.target.value)}
                  />
                                <div className="trader-coef-container">
  <span className="trader-coef-label">
    Coef du trader sélectionné pour un PF à 1000$:
  </span>
  <span className="trader-coef-value">
    {tradersCoef
      ?.find((trader) => trader.uid === selectedTrader)
      ?.coef?.toFixed(5) ?? "N/A"}
  </span>
</div>
                </label>
              </div>
            </div>
            <div className="buttons_container">
              <button
                type="submit"
                className="submitUserInfoForm-button"
                onClick={() =>
                  setInputDisabled({ input1: true, input2: true, input3: true })
                }
              >
                Enregister
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default memo(Profil);
