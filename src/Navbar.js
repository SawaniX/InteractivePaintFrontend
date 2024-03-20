import './Navbar.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import line_width from './icons/line_width.svg';
import color from './icons/color.svg';
import shape from './icons/shape.svg';
import line_slim from './icons/line_slim.svg'
import line_medium from './icons/line_medium.svg'
import line_thick from './icons/line_thick.svg'


function DropdownIcon(src) {
  return (
    <div>
      <img
        src={src}
        width="30"
        height="30"
        alt="Line width icon"
      />
    </div>
  )
}

function LineIcon(src) {
  return (
    <div>
      <img
        src={src}
        width="90"
        alt="Line icon"
      />
    </div>
  )
}
  
export default function NavBar( {inpaintSketch} ) {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand className="" href="#home">Interactive Paint</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            <NavDropdown title="File" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Tools" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title={DropdownIcon(line_width)} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">{LineIcon(line_slim)}</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">{LineIcon(line_medium)}</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">{LineIcon(line_thick)}</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={DropdownIcon(color)} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1" style={{ backgroundColor: '#000000', height: '30px' }}></NavDropdown.Item>  
              <NavDropdown.Item href="#action/3.1" style={{ backgroundColor: '#001FFF', height: '30px' }}></NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1" style={{ backgroundColor: '#FF0000', height: '30px' }}></NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={DropdownIcon(shape)} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Button onClick={inpaintSketch} className="justify-content-end" type="submit">Inpaint sketch</Button>
      </Container>
    </Navbar>
  )
}