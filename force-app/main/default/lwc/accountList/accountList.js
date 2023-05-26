import { LightningElement, api, wire, track } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import BILLING_COUNTRY_FIELD from '@salesforce/schema/Account.BillingCountry';
import ID_FIELD from '@salesforce/schema/Account.Id';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import { refreshApex } from '@salesforce/apex';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const COLUMNS = [
    { label: 'Account ID', fieldName: ID_FIELD.fieldApiName, type: 'text'},
    { label: 'Account Name', fieldName: NAME_FIELD.fieldApiName, type: 'text'},
    { label: 'Billing Country', fieldName: BILLING_COUNTRY_FIELD.fieldApiName, type: 'text'}
];

export default class AccountList extends LightningElement {
    @track
    columns = COLUMNS;
    @api
    accountToSearch
    @wire(getAccounts, { name: '$accountToSearch' })
    accounts; 
    
    @api
    mode = 'View';
    handleClick(event) {   
        this.mode = event.target.label;  
        const clickEvent = new CustomEvent("modechange", {
            detail: this.mode
        });      
        this.dispatchEvent(clickEvent);        

        
        console.log(this.mode);
        if (this.mode == 'View'){
            console.log('view');
            this.columns[1].editable = false;
            this.columns[2].editable = false;
            this.columns = [...this.columns];
        }            
        else if (this.mode == 'Edit') {
            console.log('edit');
            this.columns[1].editable = true;
            this.columns[2].editable = true;
            this.columns = [...this.columns];
        }        
    }

    columnEditable(colNum, isEditable) {
        this.columns[colNum].editable = isEditable;
        this.columns = [...this.columns];
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
