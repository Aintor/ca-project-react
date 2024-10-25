"use client";
import React, { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductGrid from '@/app/components/ProductGrid';
import Navbar from "@/app/components/Navbar";
import ErrorComponent from "@/app/components/ErrorComponent";
import LoadingComponent from "@/app/components/LoadingComponent";
import RequestManager from "@/app/components/RequestManager";

const App = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname(); // 使用 usePathname 获取当前路径

    // 从 searchParams 获取参数
    const categoryId = searchParams.get('categoryId');
    const keyword = searchParams.get('search');

    const [endpoint, setEndpoint] = React.useState('');
    const [method, setMethod] = React.useState('GET');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [products, setProducts] = React.useState([]);

    // 提取 searchParams.toString() 到一个变量中
    const searchParamsString = searchParams.toString();

    // 清除之前的状态变量
    useEffect(() => {
        // 每次路径变化时清除之前的状态
        setProducts([]);
        setError('');
        setLoading(true);
    }, [pathname, searchParamsString]);  // 依赖 pathname，每次路径变化时触发

    // 使用 searchParamsString 作为依赖
    useEffect(() => {
        // 检查是否同时存在 categoryId 和 keyword
        if (categoryId && keyword) {
            setTimeout(() => {
                router.push('/');
            }, 5000);
            return;
        }

        // 根据参数设置 endpoint 和 method
        if (keyword) {
            setEndpoint('/products/name/' + keyword);
            setMethod('GET');
        } else if (categoryId===null) {
            setEndpoint('/products');
            setMethod('POST');
        } else if (Number.isInteger(Number(categoryId)) && Number(categoryId) >= 1 && Number(categoryId) <= 5) {
            setEndpoint(`/products/category/${categoryId}`);
            setMethod('GET');
        }
        else {
            router.push('/not-found');
        }
    }, [categoryId, keyword, router, searchParamsString]);

    const getTitle = useCallback(() => {
        if (!keyword) {
            switch (categoryId) {
                case '1':
                    return "Food & Beverages";
                case '2':
                    return "Electronics Collection";
                case '3':
                    return "Home & Living Collection";
                case '4':
                    return "Clothing & Accessories Collection";
                case '5':
                    return "Beauty & Health Collection";
                default:
                    return "All Products";
            }
        } else {
            return `Search Results for "${keyword}"`;
        }
    }, [categoryId, keyword]);

    const getTagline = useCallback(() => {
        switch (categoryId) {
            case '1':
                return "Savor the finest flavors and elevate your dining experience.";
            case '2':
                return "Discover cutting-edge technology to enhance your lifestyle.";
            case '3':
                return "Create a cozy, stylish, and functional living space.";
            case '4':
                return "Stay fashionable with the latest trends and timeless pieces.";
            case '5':
                return "Nurture your mind, body, and soul with our wellness picks.";
            default:
                return "Find everything you need, all in one place.";
        }
    }, [categoryId]);

    return (
        <div key={searchParamsString}> {/* 使用 searchParamsString 作为 key */}
            <Navbar />
            <div style={{ marginTop: '4rem' }}>
                {endpoint && (
                    <RequestManager
                        endpoint={endpoint}
                        method={method}
                        onSuccess={(result) => {
                            setProducts(result);
                            setLoading(false);  // 请求完成后取消 loading 状态
                        }}
                        onError={(errorMessage) => {
                            setError(errorMessage);
                            setLoading(false);  // 请求失败后取消 loading 状态
                        }}
                        onLoading={(isLoading) => {
                            setLoading(isLoading);
                        }}
                    />
                )}

                {!loading && !error && products.length > 0 && (
                    <div>
                        <br />
                        <h1 className="text-3xl font-bold my-4 ml-6 text-left">{getTitle()}</h1>
                        <h2 className="text-lg font-medium text-gray-600 ml-6 text-left mb-8">{getTagline()}</h2>
                        <ProductGrid products={products} />
                    </div>
                )}

                {error && <ErrorComponent message={error} />}
                {loading && <LoadingComponent />}

                {categoryId && keyword && (
                    <div style={{ marginTop: '4rem' }}>
                        <ErrorComponent message="Function not implemented. Redirecting to homepage in 5 seconds..." straight={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;