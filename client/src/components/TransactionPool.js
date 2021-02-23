import React, { Component } from 'react';
import Transaction from "./Transaction";
import { Link } from "react-router-dom";

//interval to query the backend for data
const POLL_INTERVAL_MS = 10000;

export class TransactionPool extends Component {

    state = { TransactionPoolMap: {} }

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    TransactionPoolMap: json
                })
            });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(() => {
            this.fetchTransactionPoolMap();
        }, POLL_INTERVAL_MS);
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    render() {
        return (
            <div className='TransactionPool'>
                <div><Link to='/'>Home</Link></div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.TransactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default TransactionPool
