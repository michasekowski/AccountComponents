import { LightningElement, api, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import BILLING_COUNTRY_FIELD from '@salesforce/schema/Account.BillingCountry';
import ID_FIELD from '@salesforce/schema/Account.Id';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import { refreshApex } from '@salesforce/apex';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountList extends LightningElement {
    columns = [
        { label: 'Account ID', fieldName: ID_FIELD.fieldApiName, type: 'text'},
        { label: 'Account Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', editable: true},
        { label: 'Billing Country', fieldName: BILLING_COUNTRY_FIELD.fieldApiName, type: 'text', editable: true}
    ];
    @api
    accountToSearch
    @wire(getAccounts, { name: '$accountToSearch' })
    accounts; 
    
    @api
    mode = 'View mode';
    handleClick(event) {   
        this.mode = event.target.label;  
        const clickEvent = new CustomEvent("modechange", {
            detail: this.mode
        });      
        this.dispatchEvent(clickEvent);        
    }

    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
        try {
            const result = await updateAccounts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );

            notifyRecordUpdateAvailable(notifyChangeIds);

            await refreshApex(this.accounts);
            this.draftValues = [];
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}