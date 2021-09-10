"use strict"

const $body = document.querySelector('body');
const $fixbar_date = document.querySelector('.fixbar-date');
const $list = document.querySelector('.list');
const $addBtn = document.querySelector('.addBtn');
const $input = document.querySelector('input');
const $list_items = document.querySelector('.list-items');
const $saveBtn = document.querySelector('.saveBtn');
const $removeBtn = document.querySelector('.removeBtn');
const $submit = document.querySelector('#submit');
const $savedlistItem = document.querySelector('.savedlistItem');
const $spots_select = document.querySelector('#spots-select');
let day = 0;


// 어플리케이션 실행
function onApp(){
  setDate(); // 오늘 날짜 추가
  $input.focus(); // input 기본 포커스 주기
  addList(); // 리스트 추가
  saveList(); // 리스트 저장
  removeList(); // // 리스트 삭제
  if (localStorage.length > 0){ // 기존 저장된 리스트가 있다면
    $body.style.display = 'flex';
    showPrevList(); // 보여주기
  }
}
onApp();


//날짜 추가하기
function setDate(){
  var week_array = new Array('일', '월', '화', '수', '목', '금', '토');
  const today = new Date();
  const year = today.getFullYear(); //getYear이랑 다른 결과값
  const month = today.getMonth();
  const day = today.getDay();
  const date = today.getDate();

  $fixbar_date.textContent = `${year}. ${month+1}. ${date}. ${week_array[day]}요일`;
}

// 리스트 추가
function addList(){
  $addBtn.addEventListener('click', () => {
    if($input.value.length !== 0){
      createItem($input.value);
      $input.value = '';
      $input.focus();
      if($list_items.childNodes.length > 5){
        $list_items.children[$list_items.length-1].scrollIntoView({behavior:"smooth"});
      }
    } else { // value가 비었을때 추가하지 X
      return;
    }
  });
  document.addEventListener('keydown', e => {
    if($input.value.length !== 0){
      if(e.keyCode == 13){ //엔터
        createItem($input.value);
        $input.value = '';
        $input.focus();
        if($list_items.childNodes.length > 5){
          $list_items.childNodes[$list_items.childNodes.length-1].scrollIntoView({behavior:"smooth"});
        }
        console.log($list_items.childNodes.length);
      }
    } else {
      return;
    }
  });
}

//리스트 아이템 생성
function createItem(product){
  const item = document.createElement('li');
  item.classList.add('item');
  item.textContent = product;
  const close = document.createElement('div');
  close.textContent = 'x';
  close.classList.add('close-list');
  item.appendChild(close);
  $list_items.append(item);

  const $closes = document.querySelectorAll('.close-list');
  $closes.forEach((v,i) => {
    $closes[i].addEventListener('click', (e) => {
      e.target.parentNode.remove();
    })
  })
  
}


//장소 저장
let spot = '';
$spots_select.addEventListener('click', (e) => {
  spot = e.target.value;
})

//리스트 저장
function saveList(){
  if(localStorage.length > 0){ // 이전리스트 있으면
    day = (localStorage.length / 3); // 저장 순서를 그 이후부터 지정
  }
  $submit.addEventListener('click', () => {
    if ( $list_items.childNodes.length === 0 ){ //리스트 항목을 추가하지 않으면 리스트 저장 불가
      return;
    }
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    $savedlistItem.style.display = 'block';
    const list = [];
    day++;
  
    Array.from($list_items.childNodes).forEach((v,i) => {
      v.textContent = v.textContent.replace('x', '');
      list.push(v.textContent);
      localStorage.setItem(`list${day}`, list); //list1: 달걀 형태로
      localStorage.setItem(`day${day}`, $fixbar_date.textContent); //day1: 2021.9.10 형태로
      localStorage.setItem(`spot${day}`, spot); //spot1: Homeplus 형태로
    })
    h3.textContent = `날짜: ${$fixbar_date.textContent}, 장소: ${spot}`;
    p.textContent = list;
    div.classList.add(`day`);
    div.append(h3, p);
    $savedlistItem.appendChild(div);
    $list_items.innerHTML = '';
    $spots_select.value = '';
  })
}

// 이전 리스트 내역 보여주기
function showPrevList(){
  $savedlistItem.style.display = 'block';
  for (let i=1; i<(localStorage.length / 2); i++){
    if ( localStorage.getItem(`day${i}`) === null){ // null로 생기는 항목 디버깅
      return;
    }
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    h3.textContent = `날짜: ${localStorage.getItem(`day${i}`)}, 장소: ${localStorage.getItem(`spot${i}`)}`;
    p.textContent = localStorage.getItem(`list${i}`);
    div.classList.add('day');
    div.append(h3, p);
    $savedlistItem.appendChild(div);
  }   
}

//리스트 전체 삭제
function removeList(){
  $removeBtn.addEventListener('click', () => {
    localStorage.clear();
    Array.from($savedlistItem.children).forEach((v,i) => {
      v.remove();
    })
    $savedlistItem.style.display = 'none';
  })
  day = 0; // 리스트 전체 삭제 시, 로컬 스토리지에 저장할 순서 초기화
}





	
