import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const {
        loginUser,
        isLoginLoading,
        loginError,
        loginInfo,
        updateLoginInfo
    } = useContext(AuthContext);
    return (
    <>
    <Form onSubmit={loginUser}>
        <Row style={{
            height:"100vh",
            justifyContent:"center",
            paddingTop:"12%"
        }}>
            <Col xs={6}>
            <Stack gap={3}>
                <h2>
                    Login
                </h2>
                <Form.Control type="text" placeholder="Email" onChange={(e) => updateLoginInfo({
                    ...loginInfo, email:e.target.value
                })}/>
                <Form.Control type="text" placeholder="Password" onChange={(e) => updateLoginInfo({
                    ...loginInfo, password:e.target.value
                })}/>
                <Button varient="primary" type="submit">
                    { isLoginLoading ? "Getting you in......" : "Login"}
                </Button>
                {
                    loginError && <Alert variant="danger"><p>An Error Occured</p></Alert>
                }
            </Stack>
            </Col>
        </Row>
    </Form>
    </>
    )
}
 
export default Login