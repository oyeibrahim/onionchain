import React, { Component } from 'react'
import { Button } from "react-bootstrap";
import Transaction from './Transaction';

export class Block extends Component {

    state = {
        displayTransaction: false
    }

    toggleDisplayTransaction = () => {
        this.setState({
            displayTransaction: !this.state.displayTransaction
        })
    }

    //get computer property
    //it is the type of what it returns
    get displayTransaction() {
        const { data } = this.props.block

        const stringifiedData = JSON.stringify(data);
        //only display first 15 chaacters in the data
        const dataDisplay = stringifiedData.length > 15 ?
            `${stringifiedData.substring(0, 35)}...` :
            stringifiedData;

        if (this.state.displayTransaction) {
            return (
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }
                    <br />
                    <Button
                        bsStyle='danger'
                        bsSize='small'
                        onClick={this.toggleDisplayTransaction}
                    >Show Less</Button>
                </div>
            )
        }

        return (
            <div>
                <div>Data: {dataDisplay}</div>
                <Button
                    bsStyle='danger'
                    bsSize='small'
                    onClick={this.toggleDisplayTransaction}
                >Show More</Button>
            </div>
        )
    }

    render() {

        const { timestamp, hash } = this.props.block

        //only display first 15 chaacters in the hash
        const hashDisplay = `${hash.substring(0, 15)}...`;

        return (
            <div className='Block'>
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                {this.displayTransaction}
            </div>
        )
    }
}

export default Block
