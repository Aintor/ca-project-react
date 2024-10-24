import { Component } from 'react';
import axios from 'axios';

class RequestManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,  // Tracks the loading state
            error: null,    // Tracks any error that occurs
            data: null      // Stores the fetched data
        };
    }

    componentDidMount() {
        this.fetchData();  // Fetch data when the component mounts
    }

    componentDidUpdate(prevProps) {
        // If the endpoint, method, or options have changed, fetch the data again
        if (
            prevProps.endpoint !== this.props.endpoint ||
            prevProps.method !== this.props.method ||
            JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)
        ) {
            this.fetchData();
        }
    }

    async fetchData() {
        const { endpoint, method = 'GET', options = {} } = this.props;
        const { onSuccess, onError, onLoading } = this.props;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Notify parent component that loading has started
        if (onLoading) {
            onLoading(true);
        }

        try {
            let response;

            // Switch case to handle different request methods
            switch (method) {
                case 'GET':
                    response = await axios.get(apiBaseUrl+endpoint, { timeout: 10000, ...options });
                    break;
                case 'POST':
                    response = await axios.post(apiBaseUrl+endpoint, options.data, { timeout: 10000, ...options });
                    break;
                case 'PUT':
                    response = await axios.put(apiBaseUrl+endpoint, options.data, { timeout: 10000, ...options });
                    break;
                case 'DELETE':
                    response = await axios.delete(apiBaseUrl+endpoint, { timeout: 10000, ...options });
                    break;
                default:
                    throw new Error(`Unsupported request method: ${method}`);
            }

            const result = response.data;

            // Check if the server responded with success, else throw an error
            if (!result.success) {
                throw new Error('Failed to fetch data from the server.');
            }

            this.setState({ data: result, loading: false, error: null });

            // If the parent component provided an onSuccess callback, call it
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

            // If the parent component provided an onError callback, call it
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            // Notify parent component that loading has ended
            if (onLoading) {
                onLoading(false);
            }
        }
    }

    render() {
        return null;  // Do not render anything in this component
    }
}

export default RequestManager;