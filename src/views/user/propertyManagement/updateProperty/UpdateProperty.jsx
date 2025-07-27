import React from 'react';
import { useParams } from 'react-router-dom';

function UpdateProperty() {
    const { id } = useParams();

    return (
        <div>
            <h1>Update Property</h1>
            <h1>comming soon</h1>
            <p>ID Properti: <strong>{id}</strong></p>
        </div>
    );
}

export default UpdateProperty;
