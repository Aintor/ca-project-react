{/*
Author: Wang Jiaxuan
*/}
import React from "react";

function LoadingComponent() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div
                className="w-12 h-12 border-4 border-t-gray-500 border-gray-300 rounded-full animate-spin"
            ></div>
        </div>
    );
}

export default LoadingComponent;