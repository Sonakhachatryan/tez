import React from "react";
import PropTypes from "prop-types";

const RoleText = ({ role }) => {
    switch (role) {
        case "1":
            return 'Faculty Admin';
        case "2":
            return 'Administrative Employee';
        default:
            return '';
    }
};

RoleText.propTypes = {
    role: PropTypes.string
};

export default RoleText;
