import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { useMutation, useQuery } from 'react-query';

// Contexts.
import { UserContext } from '../contexts/userContext';

import { API } from '../config/api';

// Styles.
import styles from '../styles/Transaction.module.css';

const Transaction = () => {
  const [state] = useContext(UserContext);

  // Queries.
  const { data, error, loading, refetch } = useQuery(
    'transactionCache',
    async () => {
      const res = await API.get(`/orders/${state.user.id}`);
      return res.data.data;
    }
  );

  const updateOrder = useMutation(async (props) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(props);

    const body = JSON.stringify({
      status: props.status,
    });

    const res = await API.patch(`/order/${props.id}`, body, config);
    refetch();
  });

  // Renders.
  const renderStatus = (status) => {
    switch (status) {
      case 'approval':
        return (
          <div className={styles.statusApproval}>Waiting For Approval</div>
        );
      case 'success':
        return <div className={styles.statusSuccess}>Success</div>;
      case 'cancel':
        return <div className={styles.statusCancel}>Cancel</div>;
    }
    return null;
  };
  return (
    <>
      {!(state.user.role === 'user') ? (
        <Container style={{ marginTop: 60, marginBottom: 60 }}>
          <div className="app__header">Income Transaction</div>
          <div>
            <table className={styles.table}>
              <tr className={styles.tableHeader}>
                <th>No.</th>
                <th>Name</th>
                <th>Address</th>
                <th>Products Order</th>
                <th>Status</th>
                <th style={{ width: 240 }}>Action</th>
              </tr>
              {data?.orders?.map(({ id, customer, products, status }) => (
                <tr className={styles.tableRow} key={id}>
                  <td>{id}</td>
                  <td>{customer.name}</td>
                  <td>Address</td>
                  <td>{products.map(({ name }) => name + ',')}</td>
                  <td>{renderStatus(status)}</td>
                  {status === 'approval' ? (
                    <td>
                      <button
                        className={`${styles.button} ${styles.buttonCancel}`}
                        onClick={(e) => {
                          e.preventDefault();
                          updateOrder.mutate({ id, status: 'cancel' });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${styles.button} ${styles.buttonApprove}`}
                        onClick={(e) => {
                          e.preventDefault();
                          updateOrder.mutate({ id, status: 'success' });
                        }}
                      >
                        Approve
                      </button>
                    </td>
                  ) : (
                    <td>
                      {status === 'success' ? (
                        <img
                          className={styles.statusIcon}
                          src="/assets/success.svg"
                          alt="success"
                        />
                      ) : (
                        <img
                          className={styles.statusIcon}
                          src="/assets/cancel.svg"
                          alt="cancel"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </table>
          </div>
        </Container>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default Transaction;
