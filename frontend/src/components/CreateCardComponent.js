import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { createCard } from '../actions/cardActions'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from './Message';
import DeleteCardComponent from './DeleteCardComponent';

// to manage our exp month and exp year
let todays_date = new Date()
let current_year = todays_date.getFullYear()


const CreateCardComponent = ({ stripeCards, addressSelected }) => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [userId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [differentCard, setDifferentCard] = useState(false)
    const [cardDetails, setCardDetails] = useState(false)
    const [cardDetailsId, setCardDetailsId] = useState(0)
    const [showStripeCard, setShowStripeCard] = useState(false)
    const [deleteCardNumber] = useState("")
    const [email, setEmail] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expMonth, setExpMonth] = useState("")
    const [expYear, setExpYear] = useState("")
    const [cvc, setCvc] = useState("")
    const [saveCard, setSaveCard] = useState(false)

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // card delete reducer
    const deleteSavedCardReducer = useSelector(state => state.deleteSavedCardReducer)
    const { loading, success, error } = deleteSavedCardReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
    }, [history, userInfo, success])

    // stripe card form submission handler
    const handleCardSubmittion = (e) => {
        e.preventDefault()
        if (addressSelected) {
            const data = {
                "email": email === "" ? userInfo.email : email,
                "cardNumber": cardNumber,
                "expMonth": expMonth ? Number(expMonth) : "",
                "expYear": expYear ? Number(expYear) : "",
                "cvc": cvc ? Number(cvc) : "",
                "saveCard": saveCard
            }
            dispatch(createCard(data))
        } else {
            alert("Please select or add your Address to continue")
        }
    }

    // pay with already existing (saved) stripe card handler
    const payWithSavedCard = (cardData) => {
        if (addressSelected) {
            const data = {
                "email": cardData.email,
                "cardNumber": cardData.card_number,
                "expMonth": Number(cardData.exp_month),
                "expYear": Number(cardData.exp_year),
                "cvc": Number(cardData.cvc),
                "saveCard": false
            }
            dispatch(createCard(data))
        } else {
            alert("Please select or add your Address to continue")
        }
    }

    // show card details
    const showCardDetails = (cardData) => {
        if (cardDetails) {
            if (cardData.id === cardDetailsId) {
                return (
                    <div>
                        <button
                            onClick={() => setCardDetails(false)}
                            className="btn btn-outline-danger btn-sm button-focus-css"
                            style={{ float: "right", position: "relative", "top": "-40px" }}>
                            close
                        </button>
                        <p><b>Exp Month:</b> {cardData.exp_month}</p>
                        <p><b>Exp Year:</b> {cardData.exp_year}</p>                       
                    </div>
                )
            }
        }
    }

    const toggleRunCardDeleteHandler = () => {
        setRunCardDeleteHandler(!runCardDeleteHandler)
    }

    // reload the webpage after new card deletion
    if (success) {
        alert("Card successfully deleted.")
        window.location.reload()

    }

    return (
        <div>

            {/* Working on Modal Start*/}
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

            {/* Working on Modal End */}

            {loading
                &&
                <span style={{ display: "flex" }}>
                    <h5>Deleting card</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span>}
            {error && <Message variant='danger'>{error}</Message>}
            <div className="card px-4 py-4">
                <button className={showStripeCard
                    ? "btn btn-sm btn-danger mb-3 button-focus-css"
                    : "btn btn-sm btn-primary mb-3 button-focus-css"}
                    onClick={() =>
                        setShowStripeCard(!showStripeCard)
                    }>
                    {showStripeCard
                        ? "close"
                        : "Enter stripe card"}
                </button>

                {showStripeCard ?
                    <Form onSubmit={handleCardSubmittion}>

                        {differentCard ?
                            <Form.Group>
                                <Form.Label><b>Card Holder Email Address</b></Form.Label>
                                <Form.Control
                                    autoFocus={true}
                                    type="email"
                                    pattern=".+@gmail\.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address linked with the Card" />
                            </Form.Group>
                            :
                            <span><b>Default Customer Email: </b>{userInfo.email}</span>
                        }
                        <p>
                            <Link to="#" onClick={() => {
                                setDifferentCard(!differentCard)
                                setEmail("")
                            }}>
                                {differentCard ? "Use Your default Email" : "Use a different Card"}
                            </Link>
                        </p>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Card Number</b></Form.Label>
                            <Form.Control
                                type="text"
                                pattern="[0-9]+"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="Enter Your Card Number" maxLength="16"
                                required
                            />
                        </Form.Group>

                        <Row>

                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Exp Month</b></Form.Label>
                                    <select
                                        className="form-control"
                                        defaultValue={expMonth}
                                        onChange={e => setExpMonth(e.target.value)}
                                        required
                                    >
                                        <option>-- --</option>
                                        {Array.from({ length: 12 }, (x, i) => <option
                                            key={i}
                                        >
                                            {i + 1}
                                        </option>
                                        )}
                                    </select>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Exp Year</b></Form.Label>
                                    <select className="form-control"
                                        defaultValue={expYear}
                                        onChange={e => setExpYear(e.target.value)}
                                        required
                                    >
                                        <option>-- --</option>
                                        {Array.from({ length: 21 }, (x, i) => <option
                                            key={i}
                                        >{current_year + i}</option>)}
                                    </select>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>CVC Number</b></Form.Label>
                                    <Form.Control
                                        type="numbers"
                                        onChange={(e) => setCvc(e.target.value)}
                                        placeholder="123" 
                                        maxLength="3"
                                        pattern="[0-9]+"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Form.Text className="text-muted pb-2">
                            <span style={{ display: "flex" }}>
                                <input
                                    hidden={differentCard}
                                    type="checkbox"
                                    className="mt-1"
                                    value={differentCard ? false : saveCard}
                                    onChange={() => setSaveCard(!saveCard)}
                                />
                                <span hidden={differentCard} className="ml-1">Save my card for future payments</span>
                            </span>
                        </Form.Text>

                        <Button className="btn-sm button-focus-css" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    : ""}

            </div>

            <div className="my-4 card px-4 py-4">
                <h5>Saved card</h5>
                {stripeCards.length > 0 ?
                    stripeCards.map(cardData => (
                        <div key={cardData.id}>
                            <Card
                                style={{ border: "1px solid", borderColor: "#C6ACE7" }}
                                className="p-2">
                                <p><b>Card Number:</b> XXXX XXXX XXXX {cardData.card_number.slice(12,18)}</p>
                                <div>
                                    {showCardDetails(cardData)}
                                    <button onClick={() => {
                                        setCardDetails(true)
                                        setCardDetailsId(cardData.id)
                                    }} className="btn btn-sm btn-outline-primary button-focus-css"
                                    >
                                        Show Card Details
                                    </button>
                                    <button onClick={() => payWithSavedCard(cardData)}
                                        className="ml-2 btn btn-sm btn-outline-primary button-focus-css">
                                        Pay with this Card
                                    </button>
                                </div>
                            </Card>

                            {/* Edit Card Buttton */}

                            <span
                                onClick={() => history.push("/stripe-card-details/")}>
                                <i
                                    title="edit card"
                                    className="fas fa-edit fa-lg edit-button-css mr-2"
                                ></i>
                            </span>
                        </div>
                    )) : "No saved card."}
            </div>
        </div>
    )
}

export default CreateCardComponent
