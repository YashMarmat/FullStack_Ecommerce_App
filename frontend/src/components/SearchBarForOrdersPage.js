import React, { useState } from 'react'

const SearchBarForOrdersPage = ({ handleSearchTerm, placeholderValue }) => {

    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearchTerm(searchTerm);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <span
                    style={{ display: "flex" }}
                    className=""
                >
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder={placeholderValue}
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary ml-2 button-focus-css"
                    ><i className="fas fa-search"></i>
                    </button>
                </span>
            </form>
        </div>
    )
}

export default SearchBarForOrdersPage
