import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const UserData = ({
  users,
  token,
  path,
  refreshData,
  count,
  fetchCount,
  baseUrl,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [showPayConfirmationModal, setShowPayConfirmationModal] =
    useState(false);

  const openModal = (user, actionType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setActionType(actionType);
    setModalSuccess(false); // Reset modal success state
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setUtrNumber("");
    setRemark("");
    setModalSuccess(false);
    setShowPayConfirmationModal(false); // Close the pay confirmation modal
  };

  const handleModalSuccess = () => {
    setModalSuccess(true);
    setTimeout(() => {
      closeModal();
      refreshData();
    }, 2000);
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
        // console.log(`amount:${amount} remark:${remark}`);
        // console.log(JSON.stringify(response.data));
        handleModalSuccess();
      } else {
        console.log(response);
        throw new Error("Invalid response data format");
      }
    } catch (error) {
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
        // console.log(response.data);
        // alert("Request Rejected");
        handleModalSuccess();
        // showSuccessAlertAndReload();
      } else {
        throw new Error("Invalid response data format");
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const handlePayButtonClick = (user) => {
    setSelectedUser(user);
    setShowPayConfirmationModal(true);
  };

  const payoutRequest = async (
    account_name,
    account_number,
    ifsc_code,
    amount
  ) => {
    try {
      let data = JSON.stringify({
        api_key: "3e546reer6642wd56ew42edw423r564e",
        bene_name: account_name,
        bene_acc: account_number,
        bene_ifsc: ifsc_code.toUpperCase(),
        amount: amount,
      });
      const response = await axios.post(`${baseUrl}/api/dopayout`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data.count);
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handlePayConfirmation = async () => {
    await acceptRequests(
      selectedUser.id,
      selectedUser.user_id,
      utrNumber,
      selectedUser.amount,
      token,
      "superfast"
    );

    await payoutRequest(
      selectedUser.account_name,
      selectedUser.account_number,
      selectedUser.ifsc_code,
      selectedUser.amount
    );
    fetchCount();
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

        const rowClassName =
          pl_balance < 25000
            ? "green-row"
            : pl_balance > 25000
            ? "red-row"
            : "";

        // Check if count is greater than or equal to 2 and account number starts with '0'
        const shouldHidePayButton =
          count >= 2 || account_number.startsWith("0");

        return (
          <tr key={id} className={rowClassName}>
            <td>{username}</td>
            <td>
              {amount}
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(amount);
                }}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              {!shouldHidePayButton && amount <= 3000 && (
                <button
                  className="action-button"
                  onClick={() => handlePayButtonClick(user)}
                >
                  Pay
                </button>
              )}
            </td>
            <td>
              {account_number}
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(account_number);
                }}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </td>
            <td>
              {ifsc_code}
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(ifsc_code);
                }}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </td>
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
            {modalSuccess && (
              <div className="modal-success">
                Request successfully processed
              </div>
            )}
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

      {/* Pay Confirmation Modal */}
      {selectedUser && showPayConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-content">
              {modalSuccess && (
                <div className="modal-success">
                  Request successfully processed
                </div>
              )}
              <p>Are you sure you want to pay?</p>
              <button className="accept" onClick={handlePayConfirmation}>
                Yes
              </button>
              <button className="reject" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserData;
