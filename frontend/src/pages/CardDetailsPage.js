import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savedCardsList } from '../actions/cardActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import Message from "../components/Message"
import DeleteCardComponent from '../components/DeleteCardComponent'
import { useHistory } from 'react-router-dom'


const CardDetailsPage = () => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [userId, setUserId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [deleteCardNumber, setDeleteCardNumber] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // saved cards list reducer
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { stripeCards, loading } = savedCardsListReducer

    // saved cards list reducer
    const deleteSavedCardReducer = useSelector(state => state.deleteSavedCardReducer)
    const { success } = deleteSavedCardReducer


    // toggle run card delete handler
    const toggleRunCardDeleteHandler = () => {
        setRunCardDeleteHandler(!runCardDeleteHandler)
    }

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(savedCardsList())
        }
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    // card deletion message
    if (success) {
        alert("Card successfully deleted.")
        window.location.reload()

    }

    return (
        <div>
            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Card Information</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}

            {/* Modal Start*/}
            <div>
                <>
                    <DeleteCardComponent
                        userId={userId}
                        deleteCardNumber={deleteCardNumber}
                        runCardDeleteHandler={runCardDeleteHandler}
                        toggleRunCardDeleteHandler={toggleRunCardDeleteHandler}
                    />
                </>
            </div>

            {stripeCards.length > 0 ? stripeCards.map((each, idx) => (
                <div key={idx}>
                    <Container>
                        <Row className="mr-6 mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Name on Card:</Col>
                            <Col className="p-3">
                                {each.name_on_card ? <span>
                                    {each.name_on_card}
                                </span>
                                    : "Not Set"}
                            </Col>

                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Exp Month:</Col>
                            <Col className="p-3">{each.exp_month ? each.exp_month : "Not Set"}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Exp Year:</Col>
                            <Col className="p-3">{each.exp_year ? each.exp_year : "Not Set"}</Col>
                        </Row>
                        <Row className="mr-6 mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Address City:</Col>
                            <Col className="p-3">{each.address_city ? each.address_city : "Not Set"}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Address Country:</Col>
                            <Col className="p-3">{each.address_country ? each.address_country : "Not Set"}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Address State:</Col>
                            <Col className="p-3">{each.address_state ? each.address_state : "Not Set"}</Col>
                        </Row>
                        <Row className="mb-2 border border-dark">
                            <Col xs={2} className="p-3 bg-info text-white">Address Zip:</Col>
                            <Col className="p-3">{each.address_zip ? each.address_zip : "Not Set"}</Col>
                        </Row>
                    </Container>
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/stripe-card-update/">Update Card details</Link>
                        <span className="ml-1 text-primary">| </span>
                        <span className="ml-1"></span>

                        <Link to="#"
                            onClick={() => {
                                setDeleteCardNumber(each.card_number)
                                setUserId(each.user)
                                setRunCardDeleteHandler(!runCardDeleteHandler)
                            }}
                        >Delete Card</Link>
                    </span>
                </div>
            )) :
                <div>
                    <Message variant='info'>Card details not available.</Message>
                </div>
            }
        </div>
    )
}

export default CardDetailsPage
