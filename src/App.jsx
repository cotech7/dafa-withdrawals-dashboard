import { useEffect, useState } from "react";
import axios from "axios";
import UserData from "./components/UserData.jsx";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState();
  const [path, setPath] = useState();

  const login = async () => {
    try {
      let data = JSON.stringify({
        username: "Dafaexch9",
        password: "Piou1234",
        systemId: 10001,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        headers: {
          authority: "adminapi.bestlive.io",
          accept: "application/json, text/plain, */*",
          "accept-language": "en-IN,en;q=0.9,mr;q=0.8,lb;q=0.7",
          "cache-control": "no-cache, no-store",
          "content-type": "application/json",
          encryption: "false",
        },
        data: data,
      };
      const response = await axios.post(
        "https://adminapi.bestlive.io/api/login",
        data,
        config
      );
      if (response.status !== 200) {
        response_value = {
          success: false,
          message: response.status,
        };
      } else {
        // console.log(response.data);
        setToken(response.data.data.token);
        return response.data.data.token;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      let token = await login();
      // console.log(token);
      let data = JSON.stringify({
        type: "",
        nType: "withdraw",
        start_date: "",
        end_date: "",
        isFirst: 1,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        headers: {
          authority: "adminapi.bestlive.io",
          accept: "application/json, text/plain, */*",
          "accept-language": "en-IN,en;q=0.9,mr;q=0.8,lb;q=0.7",
          authorization: `Bearer ${token}`,
          "cache-control": "no-cache, no-store",
          "content-type": "application/json",
          encryption: "false",
        },
        data: data,
      };
      const response = await axios.post(
        "https://adminapi.bestlive.io/api/bank-account/request",
        data,
        config
      );
      setUsers(response.data.data);
      setPath(response.data.path);
      // console.log(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div>
        <h1>Dafa withdrawals</h1>
        <button
          className="action-button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Amount</th>
              <th>Account No.</th>
              <th>IFSC Code</th>
              <th>User P/L</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <UserData users={users} token={token} path={path} />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
