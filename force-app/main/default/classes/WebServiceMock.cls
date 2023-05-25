@IsTest
global class WebServiceMock implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest request) {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"credit_card_number":"1228-1221-1221-1431"}');
        response.setStatusCode(200);
        return response; 
    }
}