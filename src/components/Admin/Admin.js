import React, { useState, useEffect } from "react";
import { Container, Button, Table }  from 'react-bootstrap';
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
                        <td colSpan="8"><Button variant="primary" className="float-right">Add New Product</Button></td>
                    </tr>
                </thead>
            </Table>
        </Container>
        </>
    );
}