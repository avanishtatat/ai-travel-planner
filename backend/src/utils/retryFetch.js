const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryFetch = async (url, options = {}, retries = 3, delay = 1000) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const shouldRetry = [429, 500, 502, 503, 504].includes(response.status);
            if (shouldRetry && retries > 0) {
                await sleep(delay);
                return retryFetch(url, options, retries - 1, delay * 2);
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }
        return response.json();
    } catch (error) {
        if (retries > 0) {
            await sleep(delay);
            return retryFetch(url, options, retries - 1, delay * 2);
        } else {
            throw error;
        }
    }
}

module.exports = retryFetch;