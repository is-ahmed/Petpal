export async function ajax1(url, settings) {
    const domain = "http://localhost:8000";
    return await fetch(domain + url, settings);
}

export async function ajax_or_login1(url, settings, navigate) {
    const token = "Bearer " + localStorage.getItem('access_token');

    if ('headers' in settings) {
        settings.headers['Authorization'] = token;
    }
    else {
        settings['headers'] = {
            Authorization : token,
        }
    }

    const response = await ajax1(url, settings);
    switch (response.status) {
    case 401:
     navigate('/')
    case 403:
      navigate('/pets');
        break;
    case 404:
        navigate('/404error'); // can replace this with 404 page
    default:
        break;
    }
    
    return response;
}
