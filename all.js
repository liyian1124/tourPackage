let data = [
  {
    id: 0,
    name: "肥宅心碎賞櫻3日",
    imgUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
    area: "高雄",
    description: "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
    group: 87,
    price: 1400,
    rate: 10,
  },
  {
    id: 1,
    name: "貓空纜車雙程票",
    imgUrl:
      "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    area: "台北",
    description:
      "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
    group: 99,
    price: 240,
    rate: 2,
  },
  {
    id: 2,
    name: "台中谷關溫泉會1日",
    imgUrl:
      "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    area: "台中",
    description:
      "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
    group: 20,
    price: 1765,
    rate: 7,
  },
];

const ticketCards = document.querySelector(".ticketCard-area");
const regionSearch = document.querySelector(".regionSearch");
const searchResult = document.querySelector("#searchResult-text");

// 用函式產生單一卡片 HTML
function createTicketCard({imgUrl, area, rate, name, description, group, price}) {
  return `
    <li class="ticketCard">
      <div class="ticketCard-img">
        <a href="#">
          <img src="${imgUrl}" alt="">
        </a>
        <div class="ticketCard-region">${area}</div>
        <div class="ticketCard-rank">${rate}</div>
      </div>
      <div class="ticketCard-content">
        <div>
          <h3>
            <a href="#" class="ticketCard-name">${name}</a>
          </h3>
          <p class="ticketCard-description">${description}</p>
        </div>
        <div class="ticketCard-info">
          <p class="ticketCard-num">
            <span><i class="fas fa-exclamation-circle"></i></span>
            剩下最後 <span id="ticketCard-num">${group}</span> 組
          </p>
          <p class="ticketCard-price">
            TWD <span id="ticketCard-price">${price}</span>
          </p>
        </div>
      </div>
    </li>
  `;
}

// 渲染畫面函式，可依地區篩選
function renderCards(filterArea = "") {
  const filteredData = filterArea ? data.filter(item => item.area === filterArea) : data;
  ticketCards.innerHTML = filteredData.map(createTicketCard).join("");

  regionSearch.value = filterArea;
  searchResult.textContent = `本次搜尋共 ${filteredData.length} 筆資料`;
}

// 初始化畫面
function init() {
  renderCards();
}

// 下拉選單監聽事件
regionSearch.addEventListener("change", e => {
  renderCards(e.target.value);
});

// 啟動
init();

//將輸入表單資料加入data
const form = document.querySelector(".addTicket-form"); 

//逐一檢核輸入欄位(未做完)
// form.addEventListener("focusout", e => {
//   if (e.target.matches("input, select, textarea")) {
//     validateField(e.target)
//   }
// });

//submit後轉換key值加入data並重新渲染
form.addEventListener("submit", e => {
  e.preventDefault();

  //檢核所有輸入欄位(未做完)
  const allFields = form.querySelectorAll("input, select, textarea");
  // let isValid = true;
  // allFields.forEach(field => {
  //   if(!validateField(field)){
  //     isValid = false;
  //   }
  // })

  
  const formData = new FormData(form);

  //key配對表
  const keyMap = {
  "圖片網址": "imgUrl",
  "景點地區": "area",
  "套票金額": "price",
  "套票名稱": "name",
  "套票描述": "description",
  "套票星級": "rate",
  "套票組數": "group"
  };
  

  //建立新增加的一筆套票物件
  //方法一
  const addData = Object.fromEntries(formData.entries().map(
    ([key, value]) => [keyMap[key] || key, Number(value) ? Number(value) : value.trim()]
  ));
  
  //方法二
  // const addData = formData.entries().reduce((acc, [key, value]) => {
  //   const newkey = keyMap[key] || key;
  //   acc[newkey] = Number(value) ? Number(value) : value.trim();
  //   return acc
  // }, {});

  //將新增的資料套件加入data
  data.push({id: data.length, ...addData});

  //重新渲染
  renderCards();

  //清空輸入資料
  allFields.forEach((el) => {
    if(el.type !== "submit"){
      el.value = "";
    }
  });
});

//檢核輸入資料(未做完)
// function validateField(field){
// }

// 綠島自由行套裝行程
// https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_1.png?raw=true
// 嚴選超高CP值綠島自由行套裝行程，多種綠島套裝組合。
// 1400