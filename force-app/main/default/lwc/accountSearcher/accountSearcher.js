import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import BUTTON_ACTION_CHANNEL from '@salesforce/messageChannel/Button_Action__c';

export default class AccountSearcher extends LightningElement {
    accountName
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
            this.template.querySelector('lightning-input[data-id=accName]').value = null;
        }
    }    

    handleClick(event) {        
        this.accountName = this.template.querySelector('lightning-input[data-id=accName]').value;
    }
    
    handleModeChange(event) {
        if(event.detail == 'View') {
            this.template.querySelector('lightning-input[data-id=accName]').disabled = false;
            this.template.querySelector('lightning-button[data-id=btnSearch]').disabled = false;
        }
        else if (event.detail == 'Edit') {
            this.template.querySelector('lightning-input[data-id=accName]').disabled = true;
            this.template.querySelector('lightning-button[data-id=btnSearch]').disabled = true;
        }
    }
}