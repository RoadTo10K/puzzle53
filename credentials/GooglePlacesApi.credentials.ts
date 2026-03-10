import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class GooglePlacesApi implements ICredentialType {
    name = 'googlePlacesApi';
    displayName = 'Google Places API';
    documentationUrl = 'https://developers.google.com/maps/documentation/places';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Your Google Places API key',
        },
    ];
}