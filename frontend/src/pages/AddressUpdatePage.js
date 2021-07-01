import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Card } from 'react-bootstrap'
import { checkTokenValidation, getAllAddress, getSingleAddress, logout, updateUserAddress } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { UPDATE_USER_ADDRESS_RESET } from '../constants'


const AddressUpdatePage = ({ match }) => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [pinCode, setPinCode] = useState("")
    const [houseNumber, setHouseNumber] = useState("")
    const [landmark, setLandmark] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // get single address reducer    
    const getSingleAddressReducer = useSelector(state => state.getSingleAddressReducer)
    const { address, error: errorFetchingAddress } = getSingleAddressReducer

    // get single address reducer    
    const updateUserAddressReducer = useSelector(state => state.updateUserAddressReducer)
    const { success: addressUpdateSuccess } = updateUserAddressReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getSingleAddress(match.params.id))
        }
    }, [dispatch, history, userInfo, match])

    // token validation check
    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const addressSubmitHandler = (e) => {
        e.preventDefault()
        const updatedAddress = {
            "name": name,
            "phone_number": phoneNumber,
            "pin_code": pinCode,
            "house_no": houseNumber,
            "landmark": landmark,
            "city": city,
            "state": state,
        }
        dispatch(updateUserAddress(match.params.id, updatedAddress))
    }

    if(addressUpdateSuccess) {
        alert("Address updated successfully.")
        dispatch({
            type: UPDATE_USER_ADDRESS_RESET
        })
        history.push("/all-addresses/")
        dispatch(getAllAddress())
    }

    return (
        <div>
            <p className="text-center text-info"><em>Update Address</em></p>
            {errorFetchingAddress && <h3>Invalid Address Request</h3>}
            <Card
                className="mx-auto mb-4"
                style={{ width: "50%", border: "1px solid", borderColor: "#C6ACE7" }}
            >
                <Card.Body>
                    <Form onSubmit={addressSubmitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control
                                autoFocus={true}
                                type="text"
                                placeholder="enter your name"
                                defaultValue={address ? address.name : ""}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='phoneNumber'>
                            <Form.Label>
                                Phone Number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="phone number"
                                pattern="[0-9]+"
                                maxLength="10"
                                defaultValue={address ? address.phone_number : ""}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='pinCode'>
                            <Form.Label>
                                Pin Code
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="pin code"
                                defaultValue={address ? address.pin_code : ""}
                                pattern="[0-9]+"
                                maxLength="6"
                                onChange={(e) => setPinCode(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='houseNumber'>
                            <Form.Label>
                                House No./Address
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="house number"
                                defaultValue={address ? address.house_no : ""}
                                onChange={(e) => setHouseNumber(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='landmark'>
                            <Form.Label>
                                Landmark
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="landmark"
                                defaultValue={address ? address.landmark : ""}
                                onChange={(e) => setLandmark(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='city'>
                            <Form.Label>
                                City
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="city"
                                defaultValue={address ? address.city : ""}
                                onChange={(e) => setCity(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='state'>
                            <Form.Label>
                                State
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="state"
                                defaultValue={address ? address.state : ""}
                                onChange={(e) => setState(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>


                        <Button
                            style={{ width: "100%" }}
                            className="btn-sm"
                            type="submit"
                            variant="success"
                        >
                            Save Changes
                        </Button>

                        <Button
                            style={{ width: "100%" }}
                            className="btn-sm mt-2"
                            variant="primary"
                            onClick={() => history.push("/all-addresses/")}
                        >
                            Cancel
                        </Button>


                    </Form>

                </Card.Body>
            </Card>
        </div >
    )
}

export default AddressUpdatePage
