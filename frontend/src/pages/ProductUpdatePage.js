import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { getProductDetails, updateProduct } from '../actions/productActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { UPDATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message'


const ProductUpdatePage = ({ match }) => {

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading: loadingPageDetails, product } = productDetailsReducer

    // as our errors will be displayed at the top of the webpage
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(product.stock)
    const [image, setImage] = useState("")

    let history = useHistory()
    const dispatch = useDispatch()

    const [newImage, setNewImage] = useState(false)

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const updateProductReducer = useSelector(state => state.updateProductReducer)
    const {
        success: productUpdationSuccess,
        loading: loadingProductUpdations,
        error: productUpdationError
    } = updateProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer
    
    // get product details
    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, userInfo, history, match])

    const onSubmit = (e) => {
        e.preventDefault()
        const productId = product.id
        let form_data = new FormData()
        form_data.append('name', name)
        form_data.append('description', description)
        form_data.append('price', price)
        form_data.append('stock', stock)
        form_data.append('image', image)

        dispatch(updateProduct(productId, form_data))
    }

    if (productUpdationSuccess) {
        alert("Product successfully updated.")
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        history.push(`/product/${product.id}`)
    }


    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            <span
                className="d-flex justify-content-center text-info"
            >
                <em>Edit Product</em>
            </span>
            {productUpdationError ? (
                <div>
                    {scrollToTop()}
                    <Message variant='danger'>{productUpdationError.image[0]}</Message>
                </div>
            ) : ""}
            {loadingPageDetails && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {loadingProductUpdations ? <span style={{ display: "flex" }}>
                <h5>Updating Product</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span> : ""}
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='image'>
                    <Form.Label>
                        <b>
                            Product Image
                        </b>
                    </Form.Label>
                    <p>
                        <img src={product.image} alt={product.name} height="200" />
                    </p>

                    {newImage ?
                        <div>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            >
                            </Form.Control>

                            <span
                                onClick={() => {
                                    setNewImage(!newImage)
                                    setImage("")
                                    dispatch({
                                        type: UPDATE_PRODUCT_RESET
                                    })
                                }}
                                className="btn btn-primary btn-sm mt-2"
                            >
                                Cancel
                            </span>
                        </div>
                        :
                        <p>
                            <span
                                onClick={() => setNewImage(!newImage)}
                                className="btn btn-success btn-sm"
                            >
                                choose different image
                            </span>
                        </p>
                    }
                </Form.Group>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>
                            Product Name
                        </b>
                    </Form.Label>
                    <Form.Control
                        autoFocus={true}
                        type="text"
                        defaultValue={product.name}
                        placeholder="product name"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>
                        <b>
                            Product Description
                        </b>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={product.description}
                        placeholder="product description"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>
                        <b>
                            Price
                        </b>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        defaultValue={product.price}
                        placeholder="199.99"
                        step="0.01"
                        maxLength="8"
                        onChange={(e) => setPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <span style={{ display: "flex" }}>
                    <label>In Stock</label>
                    <input
                        type="checkbox"
                        defaultChecked={product.stock}
                        className="ml-2 mt-2"
                        onChange={() => setStock(!stock)}
                    />
                </span>

                <Button
                    type="submit"
                    variant='success'
                    className="btn-sm button-focus-css mb-4"
                >
                    Save Changes
                </Button>
                <Button
                    onClick={() => history.push(`/product/${product.id}`)}
                    variant='primary'
                    className="btn-sm ml-2 button-focus-css mb-4"
                >
                    Cancel
                </Button>
            </Form>
        </div>
    )
}

export default ProductUpdatePage
