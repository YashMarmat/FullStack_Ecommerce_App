import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Modal, Button, Spinner } from 'react-bootstrap'
import { deleteUserAddress, getAllAddress, checkTokenValidation, logout } from '../actions/userActions'
import { DELETE_USER_ADDRESS_RESET, GET_SINGLE_ADDRESS_RESET } from '../constants'
import { useHistory } from 'react-router-dom'
import CreateAddressComponent from '../components/CreateAddressComponent'


function AllAddressesOfUserPage() {

    let history = useHistory()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer


    const dispatch = useDispatch()
    const [deleteAddress, setDeleteAddress] = useState("")
    const [createAddress, setCreateAddress] = useState(false)

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get address list reducer
    const getAllAddressesOfUserReducer = useSelector(state => state.getAllAddressesOfUserReducer)
    const { addresses, loading: loadingAllAddresses } = getAllAddressesOfUserReducer

    // get address list reducer
    const deleteUserAddressReducer = useSelector(state => state.deleteUserAddressReducer)
    const { success: addressDeletionSuccess } = deleteUserAddressReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllAddress())
            dispatch({
                type: GET_SINGLE_ADDRESS_RESET
            })
        }
    }, [dispatch, history, userInfo, addressDeletionSuccess])


    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    if (addressDeletionSuccess) {
        alert("Address successfully deleted.")
        dispatch({
            type: DELETE_USER_ADDRESS_RESET
        })
        dispatch(getAllAddress())
    }

    // address deletion handler
    const deleteAddressHandler = (address) => {
        setDeleteAddress(address)
        handleShow()
    }

    // address delete confirmation
    const confirmDelete = (id) => {
        dispatch(deleteUserAddress(id))
        handleClose()
    }

    // toggle Create Address Button
    const toggleCreateAddress = () => {
        setCreateAddress(!createAddress)
    }


    return (
        <div>

            {/* Modal Start*/}
            <div>
                <>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                                {" "}
                                Delete Confirmation
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this address
                            {" "}<em>"{deleteAddress.house_no}, {deleteAddress.city}, {deleteAddress.state}"</em>?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => confirmDelete(deleteAddress.id)}>
                                Confirm Delete
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            </div>

            {/* Modal End */}

            {/* loading spinner conditions */}

            {loadingAllAddresses && <span style={{ display: "flex" }}>
                <h5>Getting addresses</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}

            {/* Create Address */}
            {createAddress ?
                <div>
                    <CreateAddressComponent toggleCreateAddress={toggleCreateAddress} />
                </div>
                :
                <button
                    className="btn btn-sm btn-primary mb-2 button-focus-css"
                    onClick={() => toggleCreateAddress()}
                >
                    Add new address +
                </button>
            }

            {addresses && !createAddress ? addresses.map((address, idx) => (
                <div key={idx}>
                    <Card
                        className="p-2 mb-2"

                        style={{ border: "1px solid", borderColor: "#C6ACE7" }}
                        key={address.id}

                    >
                        <span><b>Name: </b>{address.name}</span>
                        <span><b>Phone No: </b>+91 {address.phone_number}</span>
                        <span><b>Address: </b>{address.house_no},
                            near {address.landmark}, {address.city}, {address.state},
                            {address.pin_code}

                            {/* Delete Address Buttton */}

                            <span
                                onClick={() => deleteAddressHandler(address)}>
                                <i
                                    title="delete address"
                                    className="mt-2 fas fa-trash-alt fa-lg delete-button-css"
                                ></i>
                            </span>

                            {/* Edit Address Buttton */}

                            <span
                                onClick={() => history.push(`/all-addresses/${address.id}/`)}>
                                <i
                                    title="edit address"
                                    className="mt-2 mr-2 fas fa-edit fa-lg edit-button-css"
                                ></i>
                            </span>

                        </span>

                    </Card>
                </div>
            ))
                :
                ""
            }

        </div >
    )
}

export default AllAddressesOfUserPage
