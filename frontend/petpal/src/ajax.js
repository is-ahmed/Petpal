export async function ajax(url, settings) {
    const domain = "http://localhost:8000";
    return await fetch(domain + url, settings);
}

export async function ajax_or_login(url, settings, navigate) {
    const token = "Bearer " + localStorage.getItem('access_token');

    if ('headers' in settings) {
        settings.headers['Authorization'] = token;
    }
    else {
        settings['headers'] = {
            Authorization : token,
        }
    }

    const response = await ajax(url, settings);
    switch (response.status) {
    case 401:
    // navigate('/')
    case 403:
    //  navigate('/');
        break;
    case 404:
   //     navigate('/404error'); // can replace this with 404 page
    default:
        break;
    }
    
    return response;
}
