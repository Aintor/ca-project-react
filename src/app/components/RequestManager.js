import { Component } from 'react';
import axios from 'axios';

class RequestManager extends Component {
    static currentInstance = null;  // 静态属性，用于跟踪当前的实例

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            data: null
        };
    }

    componentDidMount() {
        // 如果已经有一个实例在运行，取消它
        if (RequestManager.currentInstance && RequestManager.currentInstance !== this) {
            console.log('Cancelling previous RequestManager instance');
            RequestManager.currentInstance.cancelRequest();
        }

        // 设置当前实例为最新的 RequestManager
        RequestManager.currentInstance = this;

        // 执行数据请求
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
        // 当组件卸载时，如果它是当前实例，将 currentInstance 设置为 null
        if (RequestManager.currentInstance === this) {
            console.log('Cancelling previous RequestManager instance');
            RequestManager.currentInstance = null;
        }
    }

    cancelRequest() {
        // 取消请求的逻辑：你可以在这里实现请求的取消，比如使用 axios 的 cancel token
        console.log('Request cancelled for', this.props.endpoint);
        // 可以使用 axios cancelToken 来实际取消请求
        this.setState({ loading: false, error: 'Request cancelled' });
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
                // Handle other methods...
                default:
                    throw new Error(`Unsupported request method: ${method}`);
            }

            let result = response.data;
            if (!((result && typeof result.success === 'undefined') || (result && result.success))) {
                throw new Error('Failed to fetch data from the server.');
            }

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