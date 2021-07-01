import React from 'react'
import { Button } from 'react-bootstrap'
import { deleteSavedCard } from '../actions/cardActions'
import { useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'


function DeleteCardComponent({ userId, deleteCardNumber, runCardDeleteHandler, toggleRunCardDeleteHandler }) {

    const dispatch = useDispatch()

    // card delete confirmation
    const confirmDelete = (c_number) => {
        dispatch(deleteSavedCard(c_number))
        toggleRunCardDeleteHandler()
    }

    return (
        <div>
            {/* Modal Start*/}
            <div>
                <Modal show={runCardDeleteHandler} onHide={toggleRunCardDeleteHandler}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                            {" "}
                            Delete Confirmation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <b>
                                Warning!
                            </b>
                            {" "}deleting your card will delete your stripe account and all its data.
                        </p>
                        Are you sure you want to delete the card "{deleteCardNumber}"?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete(deleteCardNumber)}>
                            Confirm Delete
                        </Button>
                        <Button variant="primary" onClick={toggleRunCardDeleteHandler}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}
        </div>
    )
}

export default DeleteCardComponent
