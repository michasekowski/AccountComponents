public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String name) {
        return [
            SELECT Id, Name, BillingCountry
            FROM Account
            WHERE Name = :name
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }

    @AuraEnabled
    public static string updateAccounts(Object data) {
        System.debug(data);
        List<Account> accountsForUpdate = (List<Account>) JSON.deserialize(
            JSON.serialize(data),
            List<Account>.class
        );
        System.debug(accountsForUpdate);
        try {
            update accountsForUpdate;
            return 'Success: accounts updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }
}