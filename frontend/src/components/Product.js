import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import React from 'react'

function Product({ product }) {
    return (
        <div>
            <Card className="mb-4 rounded">

                <Card.Body>
                <Link to={`/product/${product.id}`}>
                    <Card.Img variant="top" src={product.image} height="162" />
                </Link>
                    <Link to={`/product/${product.id}`}>
                        <Card.Title as="div">
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>

                    <Card.Text as="h3">
                        ₹ {product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product
