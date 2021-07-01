import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savedCardsList, updateStripeCard } from '../actions/cardActions'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'
import { UPDATE_STRIPE_CARD_RESET } from '../constants'
import { checkTokenValidation, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'   


const CardUpdatePage = () => {

    let history = useHistory()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer


    const dispatch = useDispatch()
    const [cardNumber, setCardNumber] = useState("")
    const [name, setName] = useState("")
    const [expMonth, setExpMonth] = useState("")
    const [expYear, setExpYear] = useState("")
    const [addressCity, setAddressCity] = useState("")
    const [addressCountry, setAddressCountry] = useState("")
    const [addressState, setAddressState] = useState("")
    const [addressZip, setAddressZip] = useState("")
    const [customerId, setCustomerId] = useState("")
    const [cardId, setCardId] = useState("")


    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // saved cards list reducer
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { stripeCards, loading } = savedCardsListReducer

    // update card reducer
    const updateStripeCardtReducer = useSelector(state => state.updateStripeCardtReducer)
    const { success } = updateStripeCardtReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(savedCardsList())
        }
    }, [dispatch, history, userInfo, success])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }


    const onSubmit = (e) => {
        e.preventDefault()
        if (customerId && cardId) {
            const all_card_data = {
                card_number: cardNumber,
                customer_id: customerId,
                card_id: cardId,
                exp_month: expMonth,
                exp_year: expYear,
                name_on_card: name,
                address_city: addressCity,
                address_country: addressCountry,
                address_state: addressState,
                address_zip: addressZip
            }
            // action
            dispatch(updateStripeCard(all_card_data))
        }
    }

    const setCustomerAndCardIds = (cus_Id, card_Id, c_num) => {
        setCustomerId(cus_Id)
        setCardId(card_Id)
        setCardNumber(c_num)
    }

    if (success) {
        alert("Card Successfully Updated")
        history.push("/stripe-card-details")
        dispatch({
            type: UPDATE_STRIPE_CARD_RESET
        })
    }

    return (
        <div>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <span
                        className="d-flex justify-content-center"
                        style={{ display: "flex", marginBottom: "15px", color: "#008080" }}>
                        <em>Update Card Details</em>
                    </span>
                    {loading && <Spinner animation="border" />}
                    {stripeCards.map((each, idx) => (
                        <div key={idx}>
                            <Card
                                className="p-4 mb-4"
                                style={{ border: "1px solid", borderColor: "#C6ACE7" }}
                            >
                                <Form onSubmit={onSubmit}>

                                    <Form.Group controlId='name'>
                                        <Form.Label>
                                            Name on Card
                                        </Form.Label>
                                        <Form.Control
                                            autoFocus={true}
                                            type="text"
                                            defaultValue={each.name_on_card}
                                            placeholder="full name"
                                            onChange={(e) => setName(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='month'>
                                        <Form.Label>
                                            Exp Month
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            pattern="[0-9]+"
                                            maxLength="2"
                                            defaultValue={each.exp_month}
                                            placeholder="exp month"
                                            onChange={(e) => setExpMonth(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='year'>
                                        <Form.Label>
                                            Exp Year
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            pattern="[0-9]+"
                                            defaultValue={each.exp_year}
                                            placeholder="exp year"
                                            maxLength="4"
                                            onChange={(e) => setExpYear(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='city'>
                                        <Form.Label>
                                            Address City
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={each.address_city}
                                            placeholder="address city"
                                            onChange={(e) => setAddressCity(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='country'>
                                        <Form.Label>
                                            Address Country
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={each.address_country}
                                            placeholder="address country"
                                            onChange={(e) => setAddressCountry(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='state'>
                                        <Form.Label>
                                            Address State
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={each.address_state}
                                            placeholder="address state"
                                            onChange={(e) => setAddressState(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='zip'>
                                        <Form.Label>
                                            Address Zip
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={each.address_zip}
                                            placeholder="address zip"
                                            pattern="[0-9]+"
                                            maxLength="6"
                                            onChange={(e) => setAddressZip(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        variant='success'
                                        onClick={() => setCustomerAndCardIds(each.customer_id, each.card_id, each.card_number)}
                                        style={{ width: "100%" }}
                                        className="btn-sm button-focus-css">
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant='primary'
                                        onClick={() => history.push("/stripe-card-details/")}
                                        style={{ width: "100%" }}
                                        className="btn-sm mt-2 button-focus-css">
                                        Cancel
                                    </Button>
                                </Form>
                            </Card>
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    )
}

export default CardUpdatePage
