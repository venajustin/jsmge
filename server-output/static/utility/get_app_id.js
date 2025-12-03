export function get_app_id() {

    const addr = window.location.href;
    
    //const re = /^(?:\/app|\/editor)\/(\d+)/;
    const re = /app|editor\/(\d+)/;


    console.log(addr);
    const match = addr.match(re);
    console.log(addr, "->", match?.[1]);

    return match[1];


}

export function get_app_socket_route() {
    const addr = window.location.href;
    const re = /app|editor\/(\d+)/;

    console.log(addr);
    const match = addr.match(re);
    console.log(addr, "->", match?.[1]);

    return match[1];

}
