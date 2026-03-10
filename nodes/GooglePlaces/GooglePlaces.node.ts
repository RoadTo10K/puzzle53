import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
} from 'n8n-workflow';

export class GooglePlaces implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Google Places',
        name: 'googlePlaces',
        icon: 'fa:map-marker-alt',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Search places using Google Places API',
        defaults: {
            name: 'Google Places',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'googlePlacesApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Text Search',
                        value: 'textSearch',
                        description: 'Search for places using text',
                    },
                ],
                default: 'textSearch',
            },
            {
                displayName: 'Search Query',
                name: 'searchText',
                type: 'string',
                default: '',
                required: true,
                description: 'Text to search for',
                displayOptions: {
                    show: {
                        operation: ['textSearch'],
                    },
                },
            },
            {
                displayName: 'Field Mask',
                name: 'fieldMask',
                type: 'string',
                default: 'places.displayName,places.formattedAddress,places.location,places.rating',
                description: 'Fields to return (comma-separated)',
                displayOptions: {
                    show: {
                        operation: ['textSearch'],
                    },
                },
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        operation: ['textSearch'],
                    },
                },
                options: [
                    {
                        displayName: 'Language Code',
                        name: 'languageCode',
                        type: 'string',
                        default: 'en',
                        description: 'Language for results',
                    },
                    {
                        displayName: 'Max Results',
                        name: 'maxResultCount',
                        type: 'number',
                        default: 20,
                        description: 'Maximum number of results',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        
        const credentials = await this.getCredentials('googlePlacesApi');
        const apiKey = credentials.apiKey as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;

                if (operation === 'textSearch') {
                    const searchText = this.getNodeParameter('searchText', i) as string;
                    const fieldMask = this.getNodeParameter('fieldMask', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        textQuery: searchText,
                    };

                    if (additionalFields.languageCode) {
                        body.languageCode = additionalFields.languageCode;
                    }
                    if (additionalFields.maxResultCount) {
                        body.maxResultCount = additionalFields.maxResultCount;
                    }

                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: 'https://places.googleapis.com/v1/places:searchText',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': apiKey,
                            'X-Goog-FieldMask': fieldMask,
                        },
                        body,
                    });

                    if (response.places && Array.isArray(response.places)) {
                        returnData.push(...response.places);
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}