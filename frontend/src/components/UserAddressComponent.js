import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card } from 'react-bootstrap'
import { getAllAddress } from '../actions/userActions'
import { useHistory } from "react-router-dom";


function UserAddressComponent({ handleAddressId }) {

    let history = useHistory()
    const dispatch = useDispatch()

    const updatehandleAddressId = (id) => {
        handleAddressId(id)
    }

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get address list reducer
    const getAllAddressesOfUserReducer = useSelector(state => state.getAllAddressesOfUserReducer)
    const { addresses } = getAllAddressesOfUserReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(getAllAddress())
        }
    }, [dispatch, history, userInfo])


    return (
        <div>
            {addresses ? addresses.map((address, idx) => (
                <div key={idx}>
                    <Card
                        className="p-2 mb-2"
                        style={{ border: "1px solid", borderColor: "#C6ACE7" }}
                        key={address.id}

                    >
                        <input
                            type="radio"
                            name="addressId"
                            value={0}
                            onClick={() => updatehandleAddressId(address.id)}
                        />                        
                        <span><b>Name: </b>{address.name}</span>
                        <span><b>Address: </b>
                        {address.house_no}, {address.landmark}, {address.city}, 
                        {address.state}, {address.pin_code}</span>
                    </Card>
                </div>
            ))
                :
                "empty"
            }

        </div >
    )
}

export default UserAddressComponent
