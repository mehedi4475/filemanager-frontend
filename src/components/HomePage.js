import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

import ApiService from './ApiService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Homepage = (props) => {
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(null);

    const Api = new ApiService();
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        Api.getFolder(location.pathname.substring(1))
            .then(res => {
                setData(res);
            })
            .catch(err => console.log(err));
    }, [location.pathname, props.page]);

    const goBack = () => {
        const locationArray = location.pathname.substr(1).split('/');
        locationArray.pop();
        history.push(`/${locationArray.join('/')}`);
    }

    let clicks = [];
    let timeout;

    function singleClick(index, directory) {
        console.log(directory);
        setSelected(index);
        props.callSelectedItem((location.pathname+'/'+directory).substr(1));
    }

    function doubleClick(directory) {
        if(location.pathname !== '/'){
            history.push(location.pathname + '/' + directory);            
        } else {
            history.push(directory);
        }
    }

    function clickHandler(index, directory, e) {
        clicks.push(new Date().getTime());
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250) {
                doubleClick(directory);
            } else {
                singleClick(index, directory);
            }
        }, 250);
    }
    
    return(
        <Container>
            {(location.pathname !== '/') && <Button onClick={goBack} className="mt-5" variant="secondary"><FontAwesomeIcon icon={faArrowLeft} /> Back</Button>}
            <ul className="folder-list mt-4">
                {
                    data?.directories.map((directory, index) =>
                        <li key={index} className={selected === 'directory'+index ? 'active' : ''}>
                            <a onClick={clickHandler.bind(this, 'directory'+index, directory)}><FontAwesomeIcon icon={faFolder} /> {directory}</a>
                        </li>
                    )
                }
                {
                    data?.files.map((file, index) =>
                        <li key={index} className={selected === 'file'+index ? 'active' : ''}>
                            <a onClick={clickHandler.bind(this, 'file'+index, file)}><FontAwesomeIcon icon={faFile} /> {file}</a>
                        </li>
                    )
                }
            </ul>
        </Container>
    )
    
}
export default Homepage;