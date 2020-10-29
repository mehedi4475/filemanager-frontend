import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import { useLocation, useHistory } from "react-router-dom";

import ApiService from './ApiService';

const Header = (props) => {
    const [show, setShow] = useState(false);
    const [folderName, setFolderName] = useState('');
    
    const Api = new ApiService();
    const location = useLocation();
    const history = useHistory();

    const handleClose = () => {
        setShow(false);
        setFolderName('');
    };
    const handleShow = () => setShow(true);


    const handleFormSubmit = (e) => {
        e.preventDefault();

        if(folderName){
            Api.createFolder(folderName, location.pathname.substring(1))
                .then(res => {
                    handleClose();
                    props.callUpdateHome();
                })
                .catch(err => {
                    handleClose();
                    console.log(err)
                });
        } else {
            alert('Please write folder name')
        }
    }

    const handleCopy = () => {
        localStorage.setItem('selected_item', props.selectedItem);
        localStorage.setItem('pasteForm', 'copy');
    }

    const handleMove = () => {
        localStorage.setItem('selected_item', props.selectedItem);
        localStorage.setItem('pasteForm', 'move');
    }

    const handlePaste = () => {
        if(localStorage.getItem('selected_item')){
            if(localStorage.getItem('pasteForm') === 'copy') {
                const copyFrom = localStorage.getItem('selected_item');
                const copyTo = location.pathname.substr(1);

                Api.copyFileFolder(copyFrom, copyTo)
                    .then(res => {
                        localStorage.removeItem('selected_item');
                        props.callUpdateHome();
                        console.log(res);
                    })
                    .catch(err => console.log(err));
            } else if(localStorage.getItem('pasteForm') === 'move') {
                const moveFrom = localStorage.getItem('selected_item');
                const moveTo = location.pathname.substr(1);

                Api.moveFileFolder(moveFrom, moveTo)
                    .then(res => {
                        localStorage.removeItem('selected_item');
                        props.callUpdateHome();
                        console.log(res);
                    })
                    .catch(err => console.log(err));
            }
            
        } else {
            alert('Please copy first!')
        }
    }

    const handleLogout = () => {
        Api.logout()
        history.push('/login');
    }

    return(
        <>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">File Manager</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav><Button variant="outline-secondary" onClick={handleCopy}>Copy</Button></Nav>
                <Nav className="ml-2"><Button variant="outline-secondary" onClick={handleMove}>Move</Button></Nav>
                <Nav className="ml-2"><Button variant="outline-secondary" onClick={handlePaste}>Paste</Button></Nav>
                <Nav className="ml-2"><Button variant="outline-secondary">Create File</Button></Nav>
                <Nav className="ml-2"><Button variant="outline-secondary" onClick={handleShow}>Create Folder</Button></Nav>
                <Nav className="ml-2"><Button variant="secondary" onClick={handleLogout}>Logout</Button></Nav>
            </Navbar.Collapse>
        </Navbar>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group>
                        <Form.Label>Folder Name</Form.Label>
                        <Form.Control size="md" type="text" value={folderName} onChange={(e) => {setFolderName(e.target.value)}} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleFormSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>

        </>
    )
}
export default Header;