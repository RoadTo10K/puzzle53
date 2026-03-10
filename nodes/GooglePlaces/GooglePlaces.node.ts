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
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjZjc5MzFhIiBkPSJNMjMuNjM4IDE0LjkwNGMtMS42MDIgNi40My04LjExMyAxMC4zNC0xNC41NDIgOC43MzZDLjI2NyAyMi4wNS0xLjI0NCAxNS41MjUuMzYyIDkuMTA1IDEuOTYyIDIuNjcgOC40NzUtMS4yNDMgMTQuOS4zNThjNi40MyAxLjYwNSAxMC4zNDIgOC4xMTUgOC43MzggMTQuNTQ4di0uMDAyem0tNi4zNS00LjYxM2MuMjQtMS41OS0uOTc0LTIuNDUtMi42NC0zLjAzbC41NC0yLjE1My0xLjMxNS0uMzMtLjUyNSAyLjEwN2MtLjM0NS0uMDg3LS43MDUtLjE2Ny0xLjA2NC0uMjVsLjUyNi0yLjEyNy0xLjMyLS4zMy0uNTQgMi4xNjVjLS4yODUtLjA2Ny0uNTY1LS4xMzItLjg0LS4ybC0xLjgxNS0uNDUtLjM1IDEuNDA3cy45NzUuMjI1Ljk1NS4yMzZjLjUzNS4xMzYuNjMuNDg2LjYxNS43NjZsLTEuNDc3IDUuOTJjLS4wNzUuMTY2LS4yNC40MDYtLjYxNC4zMTQuMDE1LjAyLS45Ni0uMjQtLjk2LS4yNGwtLjY2IDEuNTEgMS43MS40MjYuOTMuMjQyLS41NCAyLjE5IDEuMzIuMzI3LjU0LTIuMTdjLjM2LjEuNzA1LjE5IDEuMDUuMjczbC0uNTEgMi4xNTQgMS4zMi4zMy41NDUtMi4xOWMyLjI0LjQyNyAzLjkzLjI1NyA0LjY0LTEuNzc0LjU3LTEuNjM3LS4wMy0yLjU4LTEuMjE3LTMuMTk2Ljg1NC0uMTkzIDEuNS0uNzYgMS42OC0xLjkzaC4wMXptLTMuMDEgNC4yMmMtLjQwNCAxLjY0LTMuMTU3Ljc1LTQuMDUuNTNsLjcyLTIuOWMuODk2LjIzIDMuNzU3LjY3IDMuMzMgMi4zN3ptLjQxLTQuMjRjLS4zNyAxLjQ5LTIuNjYyLjczNS0zLjQwNS41NWwuNjU0LTIuNjRjLjc0NC4xOCAzLjEzNy41MjQgMi43NSAyLjA4NHYuMDA2eiIvPjwvc3ZnPg==' as any,
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