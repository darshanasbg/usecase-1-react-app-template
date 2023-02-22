import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form }  from 'react-bootstrap';
import { useAuthContext } from "@asgardeo/auth-react";

export default function Admin() {
    useEffect(() => {
        document.title = "Admin | PetStore"
    }, []);

    const [jsonData, setJsonData] = useState([]);
    const { httpRequest } = useAuthContext();

    const requestConfig = {
        headers: {
        },
        method: "GET",
        url: "https://a4bcf7b0-79b1-4ffb-99cc-dbbaee233af5-prod.e1-us-east-azure.choreoapis.dev/bilp/catelog-admin/1.0.0/items"
    };

    const fetchData = () => {
        httpRequest(requestConfig)
            .then((response) => {
                if (response && response.data) {
                    setJsonData(response.data);
                } else {
                    console.error("Error fetching data:", response);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        fetchData();
    }, [httpRequest]);

    const handleDelete = (itemId) => {
        const url = `https://a4bcf7b0-79b1-4ffb-99cc-dbbaee233af5-prod.e1-us-east-azure.choreoapis.dev/bilp/catelog-admin/1.0.0/item/${itemId}`;

        httpRequest({
            url,
            method: "DELETE"
        })
            .then((response) => {
                console.log("Item delete call successful:", response);
                fetchData();
            })
            .catch((error) => console.error("API call failed:", error));
    };


    const handleEdit = (itemId) => {
        const url = `https://a4bcf7b0-79b1-4ffb-99cc-dbbaee233af5-prod.e1-us-east-azure.choreoapis.dev/bilp/catelog-admin/1.0.0/item/${itemId}`;

        httpRequest({
            url,
            method: "PUT"
        })
            .then((response) => {
                console.log("Item edit call successful:", response);
                fetchData();
            })
            .catch((error) => console.error("API call failed:", error));
    };


  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", price: 0});
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const handleAddProduct = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormValues({ name: "", price: 0 });
  };

  const handleSubmit = (event, title, price) => {
    event.preventDefault();
    console.log(`Adding product with name title ${title}, and price ${price}`);
  

    const url = "https://a4bcf7b0-79b1-4ffb-99cc-dbbaee233af5-prod.e1-us-east-azure.choreoapis.dev/bilp/catelog-admin/1.0.0/items";
    const payload = `{ "name": "${title}", "price": ${price} }`;

    httpRequest({
      url,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: payload,
    })
      .then((response) => {
        console.log("API call successful:", response);
        handleCloseModal(); // Close the modal after the API call
        fetchData(); // Refresh the data after the API call
      })
      .catch((error) => console.error("API call failed:", error));
  };
    return (
        <>
        <Container className="mt-5">
            <Table bordered hover>
                <thead>
                    <tr>
                        <th scope="col" width="150px">Title</th>
                        <th scope="col" width="400px">Description</th>
                        <th scope="col">Includes</th>
                        <th scope="col">Intended For</th>
                        <th scope="col" width="50px">Color</th>
                        <th scope="col">Material</th>
                        <th scope="col">Price</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    <tr className="align-middle">
                        <td>Top Paw® Valentine's Day Single Dog Sweater</td>
                        <td>Top Paw® Valentine's Day Single Dog Sweater is a cute and cozy way to show your dog some love this Valentine's Day. This sweater features a red heart on the back and a red bow on the front. It's made of soft, comfortable cotton and polyester blend fabric. It's machine washable for easy care. This sweater is available in sizes XS, S, M, L, XL and XXL... </td>
                        <td>1 Sweater</td>
                        <td>Dogs</td>
                        <td>Red, White, Black</td>
                        <td>100% Acrylic</td>
                        <td>$14.99</td>
                        <td><Button variant="primary" size="sm">Edit</Button>&nbsp;<Button variant="danger" size="sm">Delete</Button></td>
                    </tr>
                    {jsonData.map((item) => (
                        <tr className="align-middle">
                            <td>{item.name}</td>
                            <td>No Description</td>
                            <td>1 Sweater</td>
                            <td>Dogs</td>
                            <td>Red, White, Black</td>
                            <td>100% Acrylic</td>
                            <td>{"$"+item.price}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleEdit(item.id)}
                                >
                                    Edit
                                </Button>
                                &nbsp;
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr className="text-end">
                        <td colSpan="8">
                            <Button
                                    variant="primary"
                                    className="float-right"
                                    onClick={() => handleAddProduct()}
                                >
                                    Add New Product
                                </Button>
                        </td>
                    </tr>
                </thead>
            </Table>

                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => handleSubmit(e, title, price)}>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            {/* <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="email" placeholder="Enter description" />
                            </Form.Group> */}
                            <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" placeholder="Enter price" onChange={(e) => setPrice(e.target.value)} />
                            </Form.Group>
                            {/* <Button variant="primary" type="submit" onClick={() => handleAddProduct()}>
                                Submit
                            </Button> */}
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
}