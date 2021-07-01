import React from 'react'
import { Card } from 'react-bootstrap'
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'
import Message from "./Message"

const PaymentStatus = () => {
    const location = useLocation()

    const renderData = () => {

        try {
            const boughtData = location.state.detail

            return (
                <div>
                    <h3 className="text-success">Payment was Successfull</h3>
                    <Card className="p-3">
                        Successfully bought
                        <br />
                        <span className="mb-2" style={{ display: "flex" }}>
                            {boughtData.name},
                            ₹{boughtData.price} <i className="text-primary ml-1 mt-1 fas fa-check-circle"></i>
                        </span>
                        <Link to="/all-orders/">Go to orders page</Link>
                    </Card>
                </div>
            )
        } catch (error) {
            return <Message variant='info'>Payment status not available.</Message>
        }
    }

    return renderData()
}

export default PaymentStatus
