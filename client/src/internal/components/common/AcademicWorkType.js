import React from "react";

class AcademicWorkType extends React.Component {
    constructor(props) {
        super(props);
        this.types = [
            {
                id: 1,
                name: "Diploma"
            },
            {
                id: 2,
                name: "Referat"
            },
            {
                id: 3,
                name: "Master's thesis"
            },
            {
                id: 4,
                name: "Doctoral work"
            },
            {
                id: 5,
                name: "Candidacy work"
            },
            {
                id: 6,
                name: "Article"
            }
        ];

        this.state = {
            typeId: this.props.type
        };
    }
}

export default AcademicWorkType;
