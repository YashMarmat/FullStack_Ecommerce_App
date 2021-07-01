import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails } from '../actions/productActions'
import CreateCardComponent from '../components/CreateCardComponent'
import ChargeCardComponent from '../components/ChargeCardComponent'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { savedCardsList } from '../actions/cardActions'
import UserAddressComponent from '../components/UserAddressComponent'
import { checkTokenValidation, logout } from '../actions/userActions'
import {CHARGE_CARD_RESET} from '../constants/index'

const CheckoutPage = ({ match }) => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [addressSelected, setAddressSelected] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState(0)

    // set address id handler
    const handleAddressId = (id) => {
        if (id) {
            setAddressSelected(true)
        }
        setSelectedAddressId(id)
    }
      
    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    // create card reducer
    const createCardReducer = useSelector(state => state.createCardReducer)
    const { error: cardCreationError, success, loading: cardCreationLoading } = createCardReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // saved cards list reducer
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { stripeCards } = savedCardsListReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getProductDetails(match.params.id))
            dispatch(savedCardsList())
            dispatch({
                type: CHARGE_CARD_RESET
            })
        }
    }, [dispatch, match, history, success, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
      }

    return (
        <div>
            {cardCreationError ? <Message variant='danger'>{cardCreationError}</Message> : ""}
            {loading
                &&
                <span style={{ display: "flex" }}>
                    <h5>Getting Checkout Info</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span>}
            {!loading && cardCreationLoading ?
                <span style={{ display: "flex" }}>
                    <h5>Checking your card</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span> : ""}
            {error ? <Message variant='danger'>{error}</Message> :
                <Container>
                    <Row>
                        <Col xs={6}>
                            <h3>Checkout Summary</h3>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <Image src={product.image} alt="image" height="180" />
                                            </Col>
                                            <Col>
                                                <h5 className="card-title text-capitalize">
                                                    {product.name}
                                                </h5>
                                                <span className="card-text text-success">₹ {product.price}</span>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>

                            <span style={{ display: "flex" }}>
                                <h3>Billing Address</h3>
                                <Link
                                    className="ml-2 mt-2"
                                    to="/all-addresses/"
                                >
                                    Edit/Add Address
                                </Link>
                            </span>
                            <UserAddressComponent handleAddressId={handleAddressId} />
                        </Col>
                        <Col xs={6}>
                            <h3>
                                Payments Section
                            </h3>
                            {success ?
                                <ChargeCardComponent
                                    selectedAddressId={selectedAddressId}
                                    addressSelected={addressSelected}
                                    product={product}
                                />
                                :
                                <CreateCardComponent
                                    addressSelected={addressSelected}
                                    stripeCards={stripeCards} />}
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    )
}

export default CheckoutPage