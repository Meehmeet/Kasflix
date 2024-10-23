var apiKey = "d1d69919";
async function checkAjax(search) {
    try {
        const response = await fetch("https://www.omdbapi.com/?s=" + search + "&r=json&apikey=" + apiKey);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }
        const data = await response.json();
        if (check_array(data.Search)) {
            data.Search.forEach((element, index) => {
                var div = document.getElementById('result');
                div.innerHTML += element.Title + " " + element.Year;
                console.log(element.title)
            });
        }
        // process your data further
    } catch (error) {
        console.error("Error:", error);
    }
}

function check_array(myArrray) {
    if (typeof myArrray === 'object' && myArrray instanceof Array) {
        return true;
    } else {
        return false;
    }
}