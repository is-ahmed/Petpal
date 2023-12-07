/*
 * ajax.js
 */

export async function ajax(url, settings) {
    const domain = "http://localhost:8000";
    return await fetch(domain + url, settings);
}

export async function ajax_or_login(url, settings, navigate) {
    const token = "Bearer " + localStorage.getItem('access');
    //const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyMDE5NjgxLCJpYXQiOjE3MDE5MzMyODEsImp0aSI6IjFiZjg2Y2ZiOWQ4OTQzNDg5N2VlNTI3NWFmNjM1NTA0IiwidXNlcl9pZCI6MX0.N-3mgtNa55L4lpPcXRNtgOeq_niZ3KfVsIHacT_OvP4";

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
    case 403:
        //navigate('/login/');
        console.log("Not logged in");
        break;
    default:
        break;
    }
    
    return response;
}