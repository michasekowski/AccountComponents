import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import BUTTON_ACTION_CHANNEL from '@salesforce/messageChannel/Button_Action__c';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
export default class AccountCreator extends LightningElement {    
    accountName;
    @wire(MessageContext)
    messageContext;
    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            BUTTON_ACTION_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        if(message.action == 'refresh') {
            this.template.querySelectorAll('lightning-input').forEach(element => {
                element.value = null;                  
            });
        }
    }

    handleNameChange(event){
        this.accountName = event.target.value;
    }

    handleClick() {
        const recordInput = {
            apiName: ACCOUNT_OBJECT.objectApiName,
            fields: {
                [NAME_FIELD.fieldApiName] : this.accountName
            }
        };        
        createRecord(recordInput)
            .then(account => {
                alert("Account created, Record ID:"+account.id);                
            })
            .catch(error => {
                console.log('## error in creating records: ' + JSON.stringify(error));                
                alert(JSON.stringify(error.body.message));
            });
    }    
}