import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'
import Message from '../components/Message'


function OrdersListPage() {

    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Search orders by Customer Name, Address or by Ordered Item"

    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))

    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get all orders reducer
    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    // change delivery status reducer
    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllOrders())
        }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "Not Delivered"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Delivery status changed successfully")
        dispatch({
            type: CHANGE_DELIVERY_STATUS_RESET
        })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => {
        setCloneSearchTerm(term)
    };


    return (
        <div>
            {loadingOrders && <span style={{ display: "flex" }}>
                <h5>Getting Orders</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {userInfo.admin && <SearchBarForOrdersPage handleSearchTerm={handleSearchTerm} placeholderValue={placeholderValue} />}
                {orders.length > 0 ?
                <Table className="mt-2" striped bordered>
                    <thead>
                        <tr className="p-3 bg-info text-white text-center">
                            <th>Order Id</th>
                            <th>Customer Name</th>
                            <th>Card Used</th>
                            <th>Delivery Address</th>
                            <th>Ordered Item</th>
                            <th>Paid Status</th>
                            <th>Paid On</th>
                            <th>Total Amount</th>
                            <th>Delivered Status</th>
                            <th>Delivered On</th>
                            {userInfo.admin &&
                                <th>Delivery Status</th>
                            }
                        </tr>
                    </thead>

                    {/* filter orders by name, address or ordered item */}

                    {orders.filter((item) => (

                        item.name.toLowerCase().includes(cloneSearchTerm)
                        ||
                        item.ordered_item.toLowerCase().includes(cloneSearchTerm)
                        ||
                        item.address.toLowerCase().includes(cloneSearchTerm)
                    )

                    ).map((order, idx) => (
                        <tbody key={idx}>
                            <tr className="text-center">
                                <td>
                                    {order.id}
                                </td>
                                <td>{order.name}</td>
                                <td>{order.card_number}</td>
                                <td>{order.address}</td>
                                <td>{order.ordered_item}</td>
                                <td>{order.paid_status ?
                                    <i className="fas fa-check-circle text-success"></i>
                                    :
                                    <i className="fas fa-times-circle text-danger"></i>
                                }</td>
                                <td>{dateCheck(order.paid_at)}</td>
                                <td>{order.total_price} INR</td>
                                <td>{order.is_delivered ?
                                    <i className="fas fa-check-circle text-success"></i>
                                    :
                                    <i className="fas fa-times-circle text-danger"></i>
                                }</td>
                                <td>{order.delivered_at}</td>
                                {userInfo.admin &&
                                    <td>
                                        {order.is_delivered ?
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => changeDeliveryStatusHandler(order.id, false)}
                                            >
                                                {deliveryStatusChangeSpinner
                                                    &&
                                                    idOfchangeDeliveryStatus === order.id
                                                    ?
                                                    <Spinner animation="border" />
                                                    :
                                                    "Mark as Undelivered"}
                                            </button>
                                            :
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => changeDeliveryStatusHandler(order.id, true)}
                                            >
                                                {deliveryStatusChangeSpinner
                                                    &&
                                                    idOfchangeDeliveryStatus === order.id
                                                    ?
                                                    <Spinner animation="border" />
                                                    :
                                                    "Mark as delivered"}
                                            </button>
                                        }
                                    </td>
                                }
                            </tr>
                        </tbody>
                    ))}
                </Table>
                : <Message variant="info">No orders yet.</Message> }
        </div>
    )
}

export default OrdersListPage