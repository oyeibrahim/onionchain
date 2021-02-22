import React, { Component } from 'react'

export class Blocks extends Component {

    state = {
        blocks: []
    };

    componentDidMount() {
        fetch('http://localhost:3000/api/blocks')
            .then(response => response.json()
                .then(json => this.setState({ blocks: json }))
            )
    }

    render() {
        return (
            <div>
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {
                        return (
                            <div key={block.hash} className='Block'>
                                {block.hash}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Blocks
