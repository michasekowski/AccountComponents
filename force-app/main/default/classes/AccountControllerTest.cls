@IsTest
private class AccountControllerTest {
    @TestSetup
    static void setup() {
        Account acc = new Account(Name='existingAccount');
        insert acc;
    }

    @IsTest
    static void shouldHaveCreditCardFilledOnCreation() {
        Account acc = new Account(Name='testAccount');
        Test.setMock(HttpCalloutMock.class, new WebServiceMock());
        Test.startTest();
        insert acc;
        Test.stopTest();
        acc = [SELECT Credit_Card__c FROM Account WHERE Id = :acc.Id];
        System.assert(!String.isBlank(acc.Credit_Card__c));
    }

    @IsTest
    static void shouldHaveCreditCardFilledOnEdit() {
        Account acc = [SELECT Credit_Card__c, BillingCountry FROM Account WHERE Name='existingAccount' LIMIT 1];
        acc.BillingCountry = 'Poland';
        acc.Credit_Card__c = '';
        Test.setMock(HttpCalloutMock.class, new WebServiceMock());
        Test.startTest();
        update acc;
        Test.stopTest();       
        acc = [SELECT Credit_Card__c FROM Account WHERE Name='existingAccount' LIMIT 1]; 
        System.assert(!String.isBlank(acc.Credit_Card__c));
    }

    @IsTest
    static void getAccountsTest() {
        List<Account> accounts = AccountController.getAccounts('existingAccount');
        System.assertEquals(1, accounts.size());
    }

    @IsTest
    static void updateAccountsTest() {
        List<Account> accs = [SELECT Id FROM Account WHERE Name='existingAccount'];
        accs[0].BillingCountry = 'Poland';
        Test.setMock(HttpCalloutMock.class, new WebServiceMock());
        Test.startTest();
        AccountController.updateAccounts(accs);
        Test.stopTest();
        List<Account> accountList = [SELECT Id FROM Account WHERE BillingCountry='Poland'];
        System.assertEquals(1, accountList.size());
    }
}