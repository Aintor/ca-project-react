import { Component } from 'react';
import axios from 'axios';

class RequestManager extends Component {
    static currentInstance = null;  // Static property to track the current instance

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            data: null
        };
    }

    componentDidMount() {
        if (RequestManager.currentInstance && RequestManager.currentInstance !== this) {
            console.log('Cancelling previous RequestManager instance');
            RequestManager.currentInstance.cancelRequest();
        }

        // Set the current instance to the latest RequestManager
        RequestManager.currentInstance = this;

        // Perform data request
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.endpoint !== this.props.endpoint ||
            prevProps.method !== this.props.method ||
            JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)
        ) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        // When the component unmounts, set currentInstance to null if it is this instance
        if (RequestManager.currentInstance === this) {
            console.log('Cancelling previous RequestManager instance');
            RequestManager.currentInstance = null;
        }
    }

    cancelRequest() {
        // Logic for canceling the request: You can implement the cancellation using axios cancel token
        console.log('Request cancelled for', this.props.endpoint);
        // Cancel the request using axios cancel token here if needed
        this.setState({ loading: false, error: 'Request cancelled' });
    }

    // Function to recursively process the data to find and update 'image' keys
    addApiBaseUrlToImages(data, apiBaseUrl) {
        if (Array.isArray(data)) {
            // If the data is an array, recursively process each element
            return data.map(item => this.addApiBaseUrlToImages(item, apiBaseUrl));
        } else if (typeof data === 'object' && data !== null) {
            // If the data is an object, process each key
            const result = { ...data };  // Create a copy of the object to avoid mutating the original
            Object.keys(result).forEach(key => {
                if (key === 'image') {
                    result[key] = result[key].map(img => apiBaseUrl + "/image/" + img);
                } else {
                    // Recursively process nested objects or arrays
                    result[key] = this.addApiBaseUrlToImages(result[key], apiBaseUrl);
                }
            });
            return result;
        }
        return data;
    }

    async fetchData() {
        const { endpoint, method = 'GET', options = {} } = this.props;
        const { onSuccess, onError, onLoading } = this.props;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (onLoading) {
            onLoading(true);
        }

        try {
            let response;
            switch (method) {
                case 'GET':
                    response = await axios.get(apiBaseUrl + endpoint, { timeout: 10000, withCredentials: true, ...options });
                    break;
                case 'POST':
                    response = await axios.post(apiBaseUrl + endpoint, options.data, { timeout: 10000, withCredentials: true, ...options });
                    break;
                case 'PATCH':
                    response = await axios.patch(apiBaseUrl + endpoint, { timeout: 10000, withCredentials: true, ...options });
                    break;
                case 'DELETE':
                    response = await axios.delete(apiBaseUrl + endpoint, options.data, { timeout: 10000, withCredentials: true, ...options });
                    break;
                default:
                    throw new Error(`Unsupported request method: ${method}`);
            }

            let result = response.data;
            if (!((result && typeof result.success === 'undefined') || (result && result.success))) {
                throw new Error('Failed to fetch data from the server.');
            }

            // Process the data to add base URL to image fields
            result = this.addApiBaseUrlToImages(result, apiBaseUrl);
            console.log(result);

            this.setState({ data: result, loading: false, error: null });

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (error) {
            let errorMessage = 'An unexpected error occurred.';
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'The request timed out.';
            } else if (error.response) {
                errorMessage = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                errorMessage = 'Network error: Unable to reach the server. Please check your connection.';
            }

            this.setState({ error: errorMessage, loading: false });
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            if (onLoading) {
                onLoading(false);
            }
        }
    }

    render() {
        return null;
    }
}

export default RequestManager;