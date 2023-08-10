import { useState } from "react";
import axios from "axios";

const UserData = ({ users, token, path }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState();

  const showSuccessAlertAndReload = () => {
    setShowAlert(true);

    window.location.reload();
  };

  const openModal = (user, actionType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setActionType(actionType);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setUtrNumber("");
    setRemark("");
  };
  const acceptRequests = async (
    id,
    user_id,
    utrNumber,
    amount,
    token,
    remark
  ) => {
    try {
      // let token = await login();
      let data = JSON.stringify({
        uid: user_id,
        balance: amount,
        withdraw_req_id: id,
        utr_number: utrNumber,
        remark: remark,
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
        "https://adminapi.bestlive.io/api/app-user/action/withdrawal-balance",
        data,
        config
      );
      if (response.status !== 200) {
        throw new Error("Request failed with status: " + response.status);
      } else if (response.data.status === 1) {
        console.log(JSON.stringify(response.data));
        alert("Withdrawal successfully!");
        showSuccessAlertAndReload();
      } else {
        throw new Error("Invalid response data format");
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };
  const rejectRequests = async (id, token, remark) => {
    try {
      // let token = await login();
      let data = JSON.stringify({
        id: id,
        notification_status: 2,
        is_accepted: 2,
        remark: remark,
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
        "https://adminapi.bestlive.io/api/bank-account/notification",
        data,
        config
      );
      if (response.status !== 200) {
        throw new Error("Request failed with status: " + response.status);
      } else if (response.data.status === 1) {
        console.log(response.data);
        alert("Request Rejected");
        showSuccessAlertAndReload();
      } else {
        throw new Error("Invalid response data format");
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <>
      {users.map((user) => {
        const {
          id,
          username,
          user_id,
          account_number,
          ifsc_code,
          utr_number,
          amount,
          balance,
          pl_balance,
          image_name,
          created_on,
        } = user;

        return (
          <tr key={id}>
            <td>{username}</td>
            <td>{amount}</td>
            <td>{account_number}</td>
            <td>{ifsc_code}</td>
            <td>{pl_balance}</td>
            <td>{created_on}</td>
            <td className="td-button">
              <button
                className="action-button accept"
                onClick={() => openModal(user, "accept")}
              >
                Accept
              </button>
              &nbsp;
              <button
                className="action-button reject"
                onClick={() => openModal(user, "reject")}
              >
                Reject
              </button>
            </td>
          </tr>
        );
      })}
      {/* Modal */}
      {selectedUser && isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {actionType === "accept" && (
              <>
                <label>UTR Number:</label>
                <input
                  type="number"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                />
              </>
            )}
            <label>Remark:</label>
            <textarea
              value={remark}
              required
              onChange={(e) => setRemark(e.target.value)}
            />
            {actionType === "accept" && (
              <button
                className="accept"
                onClick={() =>
                  acceptRequests(
                    selectedUser.id,
                    selectedUser.user_id,
                    utrNumber,
                    selectedUser.amount,
                    token,
                    remark
                  )
                }
              >
                Accept
              </button>
            )}
            {actionType === "reject" && (
              <button
                className="accept"
                onClick={() => rejectRequests(selectedUser.id, token, remark)}
              >
                Reject
              </button>
            )}
            <button className="reject" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default UserData;
