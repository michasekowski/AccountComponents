public class Utils {
    @future(callout=true)
    public static void addCreditCardToAccs(List<Id> accIds)
    {   
        List<Account> accounts = [SELECT Credit_Card__c FROM Account WHERE Id IN :accIds];
        for (Account acc : accounts) {
            try {
                HttpRequest req = new HttpRequest();
                req.setEndpoint('https://random-data-api.com/api/v2/credit_cards');
                req.setMethod('GET');
                Http http = new Http();
                HTTPResponse res = http.send(req);

                Map<String, Object> m = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                acc.Credit_Card__c = (String)m.get('credit_card_number');
            }
            catch (Exception e) {
				System.debug(String.valueOf(e) + '\n\n' + e.getStackTraceString());
			}            
        }
        update accounts;
    }
}