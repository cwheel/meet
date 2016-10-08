import React from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
    };
}

class KnowledgeItem extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
    }

    render() {
        return (
			<div>
                Componenet
            </div>
		);
    }
}

export default connect(mapStateToProps)(KnowledgeItem);
