let API = "http://localhost:8000/posts"


let inpUsername = $(".inpUsername")
let inpFile = $(".inpFile")
let inpArea = $(".inpArea")

// fetch(API)
//     .then(promise => promise.json())
//     .then(data => {
//         render(data)
//     })


// function render(data) {

//     $(".post_list").html("")

//     $(".post_list").append(`<div id="${i.id} class="col-4">${i.name}</div>`)
    
// }


function POSTpost() {

    let obj = {
        username: inpUsername.val(),
        imgFile: inpFile.val(),
        textArea: inpArea.val()
    }

    fetch(API, {
        method: "POST",
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    })

    inpName.val("")
    inpSurname.val("")
    inpPhoneNumber.val("")
}

$("btn-add").on("click", function(){

	$(".post_list").append(`
							<div class="col-4">
								<div class="instagram-card">
									<div class="instagram-card-header">
										<img class="instagram-card-user-image" src="${inpFile.val()}"/>
										<a class="instagram-card-user-name" href="#">${inpUsername.val()}</a>
										<div class="instagram-card-time">==========</div>
									</div>
								</div>
							</div>
							<div class="intagram-card-image">
								<img src="https://cs4.pikabu.ru/post_img/2016/06/25/7/1466849861168796736.png" height="600px" />
							</div>
							`)

	POSTpost()
})