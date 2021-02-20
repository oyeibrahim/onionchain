import React, { Component } from 'react'

class App extends Component {

    state = {
        walletInfo: { address: 'onionxv6', balance: 9999 }
    };

    render() {

        const { address, balance } = this.state.walletInfo;

        return (
            <div>
                Welcome to Onion blockchain...
            </div>
        )
    }
}

export default App;
