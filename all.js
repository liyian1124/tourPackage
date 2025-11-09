let data = [];
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then(function (res) {
    data = res.data.data;
    console.log(data);
    //啟動
    init();
  })
  .catch(function (err) {
    console.log(err);
  });

// 用函式產生單一卡片 HTML
function createTicketCard({
  imgUrl,
  area,
  rate,
  name,
  description,
  group,
  price,
}) {
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
const ticketCards = document.querySelector(".ticketCard-area");
const regionSearch = document.querySelector(".regionSearch");
const searchResult = document.querySelector("#searchResult-text");

//渲染函式
function renderCards(filterArea = "") {
  const filteredData = filterArea
    ? data.filter((item) => item.area === filterArea)
    : data;
  ticketCards.innerHTML = filteredData.map(createTicketCard).join("");

  regionSearch.value = filterArea;
  //顯示搜尋筆數
  searchResult.textContent = `本次搜尋共 ${filteredData.length} 筆資料`;
  //顯示圓餅圖
  showchart(filteredData);
}
// 下拉選單監聽事件
regionSearch.addEventListener("change", (e) => {
  renderCards(e.target.value);
});

// 初始化畫面
function init() {
  renderCards();
}

//將輸入表單資料檢核並加入data
const form = document.querySelector(".addTicket-form");
//檢核條件
const constraints = {
  imgUrl: {
    url: {
      schemes: ["http", "https"],
      message: "網址格式錯誤",
    },
  },
  area: {
    presence: { allowEmpty: false, message: "必填" },
  },
  price: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: "必須是正整數",
    },
  },
  name: {
    presence: { allowEmpty: false, message: "必填" },
  },
  description: {
    presence: { allowEmpty: false, message: "必填" },
  },
  rate: {
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 10,
      message: "需介於 0 ~ 10",
    },
  },
  group: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: "必須是正整數",
    },
  },
};

// 顯示錯誤訊息
function showErrorMessage(errors) {
  Object.entries(errors).forEach(([key, value]) => {
    const alertMessage = document.querySelector(`[data-message="${key}"]`);
    alertMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${value.join("")}</span>`;
  });
}

// 清除錯誤顯示
function clearErrorMessage() {
  const arr = [
    "imgUrl",
    "area",
    "price",
    "name",
    "description",
    "rate",
    "group",
  ];
  arr.forEach((item) => {
    const alertMessage = document.querySelector(`[data-message="${item}"]`);
    alertMessage.innerHTML = "";
  });
}

//submit後value文字轉數字，經檢核後加入data並重新渲染
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const allFields = form.querySelectorAll("input, select, textarea");
  //將輸入的所有值，經文字轉數字整理成待放入data的物件
  const formData = new FormData(form);
  const ticket = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value != "" && !isNaN(value) ? Number(value) : value.trim(),
      ])
  );
  //檢核所有輸入的值
  const errors = validate(ticket, constraints, { fullMessages: false });
  // 清除之前的錯誤訊息
  clearErrorMessage();

  if (errors) {
    // 顯示錯誤訊息
    showErrorMessage(errors);
  } else {
    //放入data
    data.push({ id: data.length, ...ticket });
    //重新渲染
    renderCards();
    // 清空輸入框
    allFields.forEach((el) =>
      el.type !== "submit" ? (el.value = "") : (el.value = value)
    );
  }
});

//顯示圓餅圖的函式
function showchart(filteredData) {
  // 篩選地區，並累加數字上去
  // totalObj 會變成 {高雄: 2, 台北: 1, 台中: 2}
  let totalObj = {};
  filteredData.forEach(function (item, index) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  });

  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
  let newData = [];
  let area = Object.keys(totalObj);
  // area output ["高雄","台北","台中"]
  area.forEach(function (item, index) {
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
  });

  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: "donut",
      colors: {
        高雄: "#E68618",
        台中: "#5151D3",
        台北: "#26C0C7",
      },
    },
    donut: {
      title: "套票地區比重",
      width: 10,
      label: {
        show: false,
      },
    },
  });
}
