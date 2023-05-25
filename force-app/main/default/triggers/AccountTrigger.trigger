trigger AccountTrigger on Account (after insert, after update) {
    List<Id> accIdList = new List<Id>();

    for (Account acc : Trigger.new)
        accIdList.add(acc.Id);

    if(!System.isFuture() && !System.isBatch())
        Utils.addCreditCardToAccs(accIdList);
}