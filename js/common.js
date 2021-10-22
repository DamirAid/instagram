
$(document).ready(function () {
	let $btn = document.querySelector('.btn_add')
	let $inputs = document.querySelectorAll('.form_block .form-control')
	let $postList = document.querySelector('.post_list')
	let page = 1
	let pageCount = 1	
	let API = `http://localhost:8000/posts`

	render()
	getPagination('http://localhost:8000/posts')

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
			// СОЗДАТЬ ОБЪЕКТ, ЕСЛИ ВСЕ ПОЛЯ ЗАПОЛНЕННЫ
			let obj = {
				postname: $inputs[0].value,
				file: $inputs[1].value,
				text: $inputs[2].value
			}
			console.log(obj)
			postData(obj)



			//ОЧИЩАЕМ ИНПУТЫ
			$inputs.forEach(el => {
				el.value = ''
			})
		}
	})
	//УДАЛИТЬ АЛЕРТ ПОД ИНПУТОМ
	$inputs.forEach(el => {
		el.addEventListener('input', () => {
			el.nextElementSibling.remove() //ошибка в консоли из-за множественного ввода в инпут, на каждом вводе пытается применить remove()
		})
	})


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
	
		})
	}

	//РЕНДЕР

	async function render() {
		let res = await fetch(API)
		let data = await res.json()

		$postList.innerHTML = ''
		data.forEach(el => {
			$postList.insertAdjacentHTML('afterbegin', `
			<div class="col-4" id="${el.id}">
			<div class="instagram-card">
				<div class="instagram-card-header">
					<img src="https://cs4.pikabu.ru/post_img/2016/06/25/7/1466849861168796736.png"
						class="instagram-card-user-image" />
					<a class="instagram-card-user-name" href="#"></a>
					<div class="instagram-card-time">58 min</div>
				</div>

				<div class="intagram-card-image">
					<img src="https://cs4.pikabu.ru/post_img/2016/06/25/7/1466849861168796736.png" height="600px" />
				</div>
				<div class="instagram-card-content">
				<div class="icon_block">
					<button class="btn_like"><i class="fa fa-heart-o"></i></button>
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


	//УДАЛЕНИЕ КОНТАКТА
	let $modalDel = document.querySelector('#modal_delete')
	let $btnYes = document.querySelector('.btn_yes')

	$postList.addEventListener('click', (e) => {

	
		if (e.target.classList.contains('fa-trash-o')) {
			console.log(e.target.parentNode.parentNode.parentNode.parentNode)
			$modalDel.style.display = 'block'
			let index = e.target.parentNode.parentNode.id
			
			$btnYes.setAttribute('id', index)
		} else if(e.target.classList.contains('fa-trash-o')){
			$modalDel.style.display = 'block'
			let index = e.target.parentNode.parentNode.parentNode.id
			$btnYes.setAttribute('id', index)			
		}
	})

	function deleteData(id) {
		console.log(id);
		fetch(`${API}/${id}`, {
			method: 'DELETE',
		}).then(() => {
			
			render(`${API}?_limit=3&_page=${page - 1}`)
			getPagination('http://localhost:8000/contacts')
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
	$contactList.addEventListener('click', (e) => {
		if (e.target.classList.contains('btn_edit')) {
			let $modal = document.querySelector('#modal_edit')
			$modal.style.display = 'block'
			let index = e.target.parentNode.parentNode.id
			console.log(index)
			let $inputsEdit = document.querySelectorAll('#modal_edit input.form-control')
			$inputsEdit.forEach(el => {
				el.setAttribute('id', index)
			})
			fetch(API).then(res => res.json())
				.then(data => {
					$inputsEdit[0].value = data[index - 1].name
					$inputsEdit[1].value = data[index - 1].phone
					$inputsEdit[2].value = data[index - 1].email
				})

		}
	})


	function editData(id, contactItem) {
		fetch(`${API}/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(contactItem),
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			}
		}).then(() => render(`${API}?_limit=3&_page=${page}`))
	}
	let $btnSave = document.querySelector('.btn_save')
	let $inputsEdit = document.querySelectorAll('#modal_edit input.form-control')
	$btnSave.addEventListener('click', () => {
		$inputsEdit.forEach(el => {
			if (el.getAttribute('name') === 'Имя' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `			
					<div class="alert alert-danger" role="alert">
						Введите имя					
					</div>					
					`)
			} else if (el.getAttribute('name') === 'Телефон' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `	
				<div class="alert alert-danger" role="alert">
					Введите телефон			
				</div>					
				`)
			} else if (el.getAttribute('name') === 'E-mail' && !el.value.trim() && !el.nextElementSibling) {
				el.insertAdjacentHTML('afterend', `		
				<div class="alert alert-danger" role="alert">
					Введите e-mail			
				</div>					
				`)
			}
		})
		if ($inputsEdit[0].value && $inputsEdit[1].value && $inputsEdit[2].value) {
			let index = $inputsEdit[0].id
			let newContact = {
				name: $inputsEdit[0].value,
				phone: $inputsEdit[1].value,
				email: $inputsEdit[2].value
			}
			let $modal = document.querySelector('#modal_edit')
			editData(index, newContact)
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

	let $searchInp = document.querySelector('.search_block input')
	$searchInp.addEventListener('input', (e) => {
		let inpValue = e.target.value.trim()	
		getPagination(`${API}?q=${inpValue}`)
		if(!$searchInp.value.trim()){
			render(`${API}?_limit=3&_page=1`)
		} else {
			page = 1
			render(`${API}/?_limit=3&_page=1&q=${inpValue}`)
		}		

	})

	const prevPagiBtn = document.querySelector('.previous-btn')
	const nextPagiBtn = document.querySelector('.next-btn')

	function getPagination(url) {
		fetch(url)
		.then(res => res.json())
		.then(data => {
			console.log(data)
			pageCount = Math.ceil(data.length / 3)
			$('.pagination-page').remove()
			for(let i = pageCount; i >= 1; i--) {
				prevPagiBtn.insertAdjacentHTML('afterend',`
					<span class="pagination-page">
						<button class="btn btn-outline-success">${i}</button>
					</span>
				`)
			}
			prevPagiBtn.nextElementSibling.childNodes[1].classList.add('btn-success')
		})	
	}


	
	nextPagiBtn.addEventListener('click', () => {
		if(page >= pageCount) return
		page++
		if(!$searchInp.value.trim()){
			render(`${API}?_limit=3&_page=${page}`)
		} else {
			render(`${API}?_limit=3&_page=${page}&q=${$searchInp.value}`)
		}
	
		document.querySelectorAll('.pagination-page').forEach(el => {
			el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-success') : el.childNodes[1].classList.remove('btn-success')
		})	
	})

	prevPagiBtn.addEventListener('click', () => {
		if(page <= 1) return
		page--
		if(!$searchInp.value.trim()){
			render(`${API}?_limit=3&_page=${page}`)
		} else {
			render(`${API}?_limit=3&_page=${page}&q=${$searchInp.value}`)
		}		
		
		document.querySelectorAll('.pagination-page').forEach(el => {
			el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-success') : el.childNodes[1].classList.remove('btn-success')
		})	
	})

	document.body.addEventListener('click', (e) => {
		if(e.target.parentNode.classList.contains('pagination-page')){
			page = e.target.innerText
			if(!$searchInp.value.trim()){
				render(`${API}?_limit=3&_page=${page}`)
			} else {
				render(`${API}?_limit=3&_page=${page}&q=${$searchInp.value}`)
			}				
			document.querySelectorAll('.pagination-page').forEach(el => {
				el.childNodes[1].innerText == page ? el.childNodes[1].classList.add('btn-success') : el.childNodes[1].classList.remove('btn-success')
			})			
		}
	})

	$contactList.addEventListener('change', (e) => {
		let index = e.target.parentNode.parentNode.parentNode.id
		console.log(index)
		let newLike = {}
		if(e.target.checked){
			 newLike = {
				like: true
			}
		} else {
			newLike = {
				like: false
			}		
		}
		editData(index, newLike)
	})

	let $btnFilter = document.querySelector('.btn_sort_like')
	$btnFilter.addEventListener('click', () => {
		render(`${API}?_limit=3&_page=${page}&like=true`)
	})


})

