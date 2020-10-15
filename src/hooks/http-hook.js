import { useState, useCallback, useEffect, useRef } from 'react';

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const activeHttpRequest = useRef([]); //this is to store the current ongoing request.

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequest.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal //links the above abort cntrl to the request. So now we can abort the requst using this connection.
                });
                const responseData = await response.json();
                activeHttpRequest.current = activeHttpRequest.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortCtrl
                );
                /* this will filter out the current htttp request. because the request has finished its process. 
                if user change the page before completes the request, useEffect will abort the requeset, otherwise this will generate thousands of errors.
                see below useEffect code for more details
            */

                if (!response.ok) {
                    if (responseData.error) {
                        console.log(responseData.error);
                        setError(responseData.error);
                    }
                    throw new Error(responseData.error);
                }
                setIsLoading(false);
                return responseData;
            } catch (err) {
                console.log(err);
                //setError(err.msg);
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const errorPopupCloser = () => {
        setError('');
    };
    /* 
    this will only render when component mount, and inside return method will execute when componenet dismount, its act like a cleaning function.
    so when the componet, which use this http-hook, unmount this cleaning function will trigger. 
    That means when the user change the page when active http request ongoing, useEffect will abort the request.  */
    useEffect(() => {}, []);

    return { isLoading, error, sendRequest, errorPopupCloser };
};