function exRate(curr) {
    return fetch(`https://free.currconv.com/api/v7/convert?q=USD_${curr}&compact=ultra&apiKey=4dba6789dd25aac247c0`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
    .then(response => response.json())
    .then(res => {
        let rate = `USD_${curr}`;
        return res[rate];
    });
};

