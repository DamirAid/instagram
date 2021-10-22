let API = "http://localhost:8000/posts"

$(document).ready(function () {
	let $btn = document.querySelector('.btn_add')
	let $inputs = document.querySelectorAll('.form_block .form-control')
	let $postList = document.querySelector('.post_list')
	let page = 1
	let pageCount = 1
	let API = `http://localhost:8000/posts`

	getPagination()
	render()

	let fileVal = null
	$inputs[1].addEventListener('change', () => {
		let fReader = new FileReader()
		fReader.readAsDataURL($inputs[1].files[0])

		fReader.onloadend = function (event) {

			fileVal = event.target.result
			console.log(fileVal)
		}
	})

	let hour = null
	let minute = null
	let now = new Date();
	let clickHours = now.getHours()
	let clickMinute = now.getMinutes()	
	$btn.addEventListener('click', () => {
		// ВАЛИДАЦИЯ
		$inputs.forEach(el => {
			if (el.getAttribute('name') === 'username' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `			
					<div class="alert alert-danger" role="alert">
						Введите название					
					</div>					
					`)
			} else if (el.getAttribute('name') === 'image' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `	
				<div class="alert alert-danger" role="alert">
					Загрузите изображение			
				</div>					
				`)
			} else if (el.getAttribute('name') === 'textarea' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `		
				<div class="alert alert-danger" role="alert">
					Введите текст		
				</div>					
				`)
			}
		})

		if ($inputs[0].value && $inputs[1].value && $inputs[2].value) {





			let obj = {
				postname: $inputs[0].value,
				file: fileVal,
				text: $inputs[2].value
			}
			console.log(obj)
			postData(obj)

			// СОЗДАТЬ ОБЪЕКТ, ЕСЛИ ВСЕ ПОЛЯ ЗАПОЛНЕННЫ




//     $(".post_list").html("")

//     $(".post_list").append(`<div id="${i.id} class="col-4">${i.name}</div>`)
    
// }


	//ПОСТ ЗАПРОС
	function postData(postItem) {

		fetch(API, {
			method: 'POST',
			body: JSON.stringify(postItem),
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		}).then(() => {
			render()
			getPagination()
		})
	}

    fetch(API, {
        method: "POST",
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    })



	async function render() {
		let res = await fetch(`${API}?_limit=3&_page=${page}`)
		let data = await res.json()

		$postList.innerHTML = ''
		data.forEach(el => {
			$postList.insertAdjacentHTML('afterbegin', `
			<div class="col-md-4 col-sm-6  col-xs-12" >
			<div class="instagram-card" id="${el.id}">
				<div class="instagram-card-header">
					<img src="${el.file}"
						class="instagram-card-user-image" />
						<div class="instagram-card-time"></div>
				</div>

				<div class="intagram-card-image">
					<img src="${el.file}" alt="alt" />
				</div>
				<div class="instagram-card-content">
				<div class="icon_block">
					<button class="btn_like"><i class="fa fa-heart-o"></i>
			
		
	
					</button>
				
					<button class="btn_edit"><i class="fa fa-pencil"></i></button>
					<button class="btn_delete"><i class="fa fa-trash-o"></i></button>
					</div>
					<h3>${el.postname}</h3>
					<p>${el.text}</p>
				</div>
			</div>
		</div>	
	`)
	
		});


	}

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



	//УДАЛЕНИЕ КОНТАКТА
	let $modalDel = document.querySelector('#modal_delete')
	let $btnYes = document.querySelector('.btn_yes')

	$postList.addEventListener('click', (e) => {


		if (e.target.classList.contains('fa-trash-o')) {

			$modalDel.style.display = 'block'
			let index = e.target.parentNode.parentNode.parentNode.parentNode.id

			$btnYes.setAttribute('id', index)
		}
	})

	function deleteData(id) {
		fetch(`${API}/${id}`, {
			method: 'DELETE',
		}).then(() => {
			render()
			page = page-1
			getPagination()
		})
	}

	$btnYes.addEventListener('click', (e) => {
		let index = e.target.id
		deleteData(index)

		$modalDel.style.display = 'none'
	})
	let $btnNo = document.querySelector('.btn_no')
	$btnNo.addEventListener('click', () => {
		$modalDel.style.display = 'none'
	})
	let $modalCloseDel = document.querySelector('#modal_delete .close')
	$modalCloseDel.addEventListener('click', () => {
		$modalDel.style.display = 'none'
	})




	//РЕДАКТИРОВАНИЕ
	$postList.addEventListener('click', (e) => {
		if (e.target.classList.contains('fa-pencil')) {
			let $modal = document.querySelector('#modal_edit')
			$modal.style.display = 'block'
			let index = e.target.parentNode.parentNode.parentNode.parentNode.id
			console.log(index)
			let $inputsEdit = document.querySelectorAll('#modal_edit .form-control')
			console.log($inputsEdit[2].value)
			$inputsEdit.forEach(el => {
				el.setAttribute('id', index)
			})
			fetch(API).then(res => res.json())
				.then(data => {

					$inputsEdit[0].value = data[index - 1].postname
					$inputsEdit[1].value = data[index - 1].image
					$inputsEdit[2].value = data[index - 1].text
				})

		}
	})


	function editData(id, postItem) {
		fetch(`${API}/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(postItem),
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			}
		}).then(() => render())
	}
	let $btnSave = document.querySelector('.btn_save')
	let $inputsEdit = document.querySelectorAll('#modal_edit input.form-control')
	let fileEditVal = null
	$inputsEdit[1].addEventListener('change', () => {
		let fReader = new FileReader()
		fReader.readAsDataURL($inputsEdit[1].files[0])

		fReader.onloadend = function (event) {

			fileEditVal = event.target.result
			console.log(fileEditVal)
		}
	})
	$btnSave.addEventListener('click', () => {
		$inputsEdit.forEach(el => {
			if (el.getAttribute('name') === 'username' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `			
					<div class="alert alert-danger" role="alert">
						Введите название					
					</div>					
					`)
			} else if (el.getAttribute('name') === 'image' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `	
				<div class="alert alert-danger" role="alert">
					Загрузите изображение			
				</div>					
				`)
			} else if (el.getAttribute('name') === 'textarea' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `		
				<div class="alert alert-danger" role="alert">
					Введите текст		
				</div>					
				`)
			}
		})
		if ($inputsEdit[0].value && $inputsEdit[1].value && $inputsEdit[2].value) {
			let index = $inputsEdit[0].id
			let newPost = {
				postname: $inputsEdit[0].value,
				file: fileEditVal,
				text: $inputsEdit[2].value
			}
			let $modal = document.querySelector('#modal_edit')
			editData(index, newPost)
			$modal.style.display = 'none'
		}

	})
	$inputsEdit.forEach(el => {
		el.addEventListener('input', () => {
			el.nextElementSibling.remove() //ошибка в консоли из-за множественного ввода в инпут, на каждом вводе пытается применить remove()
		})
	})
	let $modalClose = document.querySelector('#modal_edit .close')
	$modalClose.addEventListener('click', () => {
		let $modal = document.querySelector('#modal_edit')
		$modal.style.display = 'none'
	})

	const prevPagiBtn = document.querySelector('.previous-btn')
	const nextPagiBtn = document.querySelector('.next-btn')

	function getPagination() {
		fetch(API)
			.then(res => res.json())
			.then(data => {
				console.log(data)
				pageCount = Math.ceil(data.length / 3)
				$('.pagination-page').remove()
				for (let i = pageCount; i >= 1; i--) {
					prevPagiBtn.insertAdjacentHTML('afterend', `
					<span class="pagination-page">
						<button class="btn btn-outline-primary">${i}</button>
					</span>
				`)
				}
				prevPagiBtn.nextElementSibling.childNodes[1].classList.add('btn-primary')
			})
	}



	nextPagiBtn.addEventListener('click', () => {

		if (page >= pageCount) return
		page++

		render()
		document.querySelectorAll('.pagination-page').forEach(el => {
			el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-primary') : el.childNodes[1].classList.remove('btn-primary')
		})

	})

	prevPagiBtn.addEventListener('click', () => {
		if (page <= 1) return
		page--

		render()
		document.querySelectorAll('.pagination-page').forEach(el => {
			el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-primary') : el.childNodes[1].classList.remove('btn-primary')
		})

	})

	document.body.addEventListener('click', (e) => {
		if (e.target.parentNode.classList.contains('pagination-page')) {
			page = e.target.innerText
			render()
			document.querySelectorAll('.pagination-page').forEach(el => {
				el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-primary') : el.childNodes[1].classList.remove('btn-primary')
			})
		}
	})

	let $searchInp = document.querySelector('.search_block input')
	$searchInp.addEventListener('input', (e) => {
		
		let inpValue = e.target.value.trim()
		if(!e.target.value.trim()) {
			$('.btn_wrap button,.btn_wrap span').show()
			render()
		} else {
			$('.btn_wrap button,.btn_wrap span').hide()
			fetch(`${API}?q=${inpValue}`)
			.then((res) => res.json())
			.then((data) => {

				$postList.innerHTML = ''
				data.forEach(el => {
					$postList.insertAdjacentHTML('afterbegin', `
				<div class="col-4" >
				<div class="instagram-card" id="${el.id}">
					<div class="instagram-card-header">
						<img src="https://cs4.pikabu.ru/post_img/2016/06/25/7/1466849861168796736.png"
							class="instagram-card-user-image" />
					</div>
					<div class="intagram-card-image">
						<img src="${el.file}" alt="alt" />
					</div>
					<div class="instagram-card-content">
					<div class="icon_block">
						<button class="btn_like"><i class="fa fa-heart-o"></i>	
						</button>		
						<button class="btn_edit"><i class="fa fa-pencil"></i></button>
						<button class="btn_delete"><i class="fa fa-trash-o"></i></button>
						</div>
						<h3>${el.postname}</h3>
						<p>${el.text}</p>
					</div>
				</div>
			</div>	
		`)
				});

			})
		}

	})




})

