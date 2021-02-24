import React, { Component } from 'react'
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Block from './Block';

export class Blocks extends Component {

    state = {
        blocks: [],
        paginatedId: 1,
        blocksLength: 0
    };

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(response => response.json()
                .then(json => this.setState({ blocksLength: json }))
            )

        //this is how a function that returns another function is called
        this.fetchPaginatedBlocks(this.state.paginatedId)();
    }

    //we make it retrun a fuction to help wit inserting in JSX
    fetchPaginatedBlocks = paginatedId => () => {
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json()
                .then(json => this.setState({ blocks: json }))
            )
    }

    render() {
        return (
            <div>

                <div>
                    <Link to='/'>
                        Home
                    </Link>
                </div>

                <h3>Blocks</h3>

                <div>
                    {
                        //JavaScript Array creates a key value pair
                        //key is the position starting from 0
                        //value is the data not inputting a data makes the data "undefined"
                        [...Array(Math.ceil(this.state.blocksLength / 5)).keys()].map(key => {
                            const paginatedId = key + 1;

                            return (
                                // the {' '} add space at the end
                                <span key={key} onClick={this.fetchPaginatedBlocks(paginatedId)}>
                                    <Button bsSize="small" bsStyle="danger">
                                        {paginatedId}
                                    </Button>{' '}
                                </span>
                            )
                        })
                    }
                </div>

                {
                    this.state.blocks.map(block => {
                        return (
                            <Block key={block.hash} block={block} />
                        )
                    })
                }

            </div>
        )
    }
}

export default Blocks
