const title = document.getElementById("input_title");
const content = document.getElementById("input_content");
const contentLength = document.querySelector(".content-length");
const memoList = document.querySelector(".memo-list");
const emptyList = document.querySelector(".empty-list");

const regiBtn = document.getElementById("regi_button");
const resetBtn = document.getElementById("reset_button");

const maxLength = 200;
const initContent = `0/${maxLength}`;

/* reset */
const reset = {
    // 제목 초기화
    title: () => {
        title.value = "";
    },

    // 내용 초기화
    content: () => {
        content.value = "";
    },

    // 내용 길이 초기화
    contentLength: () => {
        contentLength.textContent = initContent;
    },
};

function resetAll() {
    reset.title();
    reset.content();
    reset.contentLength();
}

/* check */
const check = {
    // 리스트 비어있는지 확인
    emptyList: () => {
        if (memoList.childElementCount === 0) {
            emptyList.classList.remove("hidden");
        } else {
            emptyList.classList.add("hidden");
        }
    },

    // 제목 입력 확인
    title: () => {
        if (title.value === "") {
            alert("제목을 입력해주세요.");
            return false;
        }
        return true;
    },

    // 내용 입력 확인
    content: () => {
        if (content.value === "") {
            alert("내용을 입력해주세요.");
            return false;
        }
        return true;
    },

    // 내용 길이 확인
    contentLength: (length) => {
        if (length > maxLength) {
            alert("글자 수가 최대입니다.");
            return false;
        }
        return true;
    },
};

let allMemo = JSON.parse(localStorage.getItem("allMemo"));
allMemo = allMemo ?? [];
loadMemo();

function getTitle() {
    return title.value;
}

function setContent(value) {
    content.value = value;
}

function getContent() {
    return content.value;
}

/* button event */
function regiBtnEvent() {
    regiBtn.addEventListener("click", () => {
        if (check.title() && check.content()) {
            addItem("add");
        }
    });
}
regiBtnEvent();

function resetBtnEvent() {
    resetBtn.addEventListener("click", () => {
        resetAll();
    });
}
resetBtnEvent();

function contentLengthEvent() {
    content.addEventListener("keyup", () => {
        let length = content.value.length;
        if (!check.contentLength(length)) {
            setContent(getContent().slice(0, 200));
            length -= 1;
        }
        contentLength.innerText = `${length}/${maxLength}`;
    });
}
contentLengthEvent();

/* load memo */
function loadMemo() {
    for (let i = 0; i < allMemo.length; i++) {
        addItem("load", allMemo[i], allMemo[i].code);
    }
}

/* add memo */
function addItem(type, memo, code) {
    const item = document.createElement("li");
    const memoTitle = document.createElement("h3");
    const memoDeleteBtn = document.createElement("button");
    const memoContent = document.createElement("pre");
    let memoCode;

    if (type === "load") {
        memoCode = code;
        memoTitle.textContent = memo.titleValue;
        memoContent.textContent = memo.titleContent;
    } else if (type === "add") {
        const titleValue = title.value;
        const titleContent = content.value;

        memoCode = memoList.childElementCount;
        allMemo.push({ titleValue, titleContent, code: memoCode });
        localStorage.setItem("allMemo", JSON.stringify(allMemo));
        memoTitle.textContent = getTitle();
        memoContent.textContent = getContent();
    }
    console.log(memoCode);
    memoDeleteBtn.classList.add("close-button");

    resetAll();

    item.appendChild(memoTitle);
    item.appendChild(memoDeleteBtn);
    item.appendChild(memoContent);
    memoList.appendChild(item);
    check.emptyList();

    memoDeleteBtn.addEventListener("click", () => {
        allMemo.splice(
            allMemo.findIndex((item) => item.code === memoCode),
            1
        );
        localStorage.setItem("allMemo", JSON.stringify(allMemo));
        item.remove();
        check.emptyList();
        console.log(localStorage);
    });
    console.log(localStorage);
}
