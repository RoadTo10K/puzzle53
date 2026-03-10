"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlacesApi = void 0;
class GooglePlacesApi {
    constructor() {
        this.name = 'googlePlacesApi';
        this.displayName = 'Google Places API';
        this.documentationUrl = 'https://developers.google.com/maps/documentation/places';
        this.properties = [
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
}
exports.GooglePlacesApi = GooglePlacesApi;
