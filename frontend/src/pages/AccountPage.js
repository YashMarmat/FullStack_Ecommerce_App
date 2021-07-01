import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
//import { UPDATE_USER_ACCOUNT_RESET } from '../constants'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'


function AccountPage() {


    let history = useHistory()
    const dispatch = useDispatch()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // user details reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            try {
                dispatch(checkTokenValidation())
                dispatch(userDetails(userInfo.id))
            } catch (error) {
                history.push("/")
            }
        }
    }, [history, userInfo, dispatch])

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
      }

    const renderData = () => {
        try {

            return (
                <div>
                    {loading && <span style = {{ display: "flex" }}><h5>Getting User Information</h5><span className = "ml-2"><Spinner animation="border" /></span></span>}
                    <Container>
                        <Row className="mr-6 mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Name:</Col>
                            <Col className="p-3">{userAccDetails.username}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Email:</Col>
                            <Col className="p-3">{userAccDetails.email}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Admin Privileges:</Col>
                            <Col className="p-3">{userAccDetails.admin ? "Yes" : "No"}</Col>
                        </Row>
                    </Container>
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to={`/account/update`}>Update Account details</Link>
                        <span className="ml-1 text-primary">| </span>
                        <span className="ml-1"></span>

                        <Link to={`/account/delete/`}>Delete Account</Link>
                    </span>
                </div>
            )
        } catch (error) {
            return <Message variant='danger'>Something went wrong, go back to <Link
                onClick={logoutHandler} to={`/login`}
            > Login</Link> page.</Message>
        }
    }


    return renderData()

}

export default AccountPage
