import { LightningElement, wire} from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import BUTTON_ACTION_CHANNEL from '@salesforce/messageChannel/Button_Action__c';
export default class Refresh extends LightningElement {
    @wire(MessageContext)
    messageContext;

    handleClick(event) {
        const payload = { 
            action: 'refresh'
        };
        publish(this.messageContext, BUTTON_ACTION_CHANNEL, payload);        
    }
}